'use client';
import { useState, useEffect, useCallback } from 'react';
import { useAccount, useChainId } from 'wagmi';
import { bsc } from 'wagmi/chains';
import { createPublicClient, http, type Address } from 'viem';

/**
 * useWalletNFTs Hook
 * 
 * 通过 ABI 方式获取指定合约的 NFT（仅支持 BSC 链）
 * - 使用事件日志（Transfer 事件）获取用户拥有的 token IDs
 * - 无需 API Key，直接调用链上合约
 * - 数据实时准确，完全去中心化
 * 
 * 使用示例：
 * ```tsx
 * // 获取特定合约的 NFT（使用 ABI 方式）
 * const { nfts, loading, error } = useWalletNFTs({
 *   contractAddress: '0x...'  // 必需：合约地址
 * });
 * ```
 * 
 * 注意事项：
 * - contractAddress 是必需的参数
 * - 合约必须是标准的 ERC721 合约
 * - 仅支持 BSC 链
 * - 通过事件日志获取，如果历史事件不完整可能影响结果
 */

// NFT接口定义
export interface WalletNFT {
  id: string;
  name: string;
  description?: string;
  image: string;
  price?: string;
  owner?: string;
  tokenId?: string;
  contractAddress?: string;
  collectionName?: string;
  collectionSymbol?: string;
  tokenType?: string;
  metadata?: Record<string, unknown>;
}

interface UseWalletNFTsOptions {
  // 合约地址（必需）- 将使用 ABI 方式获取该合约的 NFT
  contractAddress: string;
}

interface UseWalletNFTsReturn {
  nfts: WalletNFT[];
  loading: boolean;
  hasMore: boolean;
  error: string | null;
  loadMore: () => void;
  refresh: () => void;
  totalCount: number;
}

// ERC721 标准 ABI（用于通过合约直接获取 NFT）
const ERC721_ABI = [
  {
    inputs: [{ internalType: 'address', name: 'owner', type: 'address' }],
    name: 'balanceOf',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'uint256', name: 'tokenId', type: 'uint256' }],
    name: 'tokenURI',
    outputs: [{ internalType: 'string', name: '', type: 'string' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'name',
    outputs: [{ internalType: 'string', name: '', type: 'string' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'symbol',
    outputs: [{ internalType: 'string', name: '', type: 'string' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'uint256', name: 'tokenId', type: 'uint256' }],
    name: 'ownerOf',
    outputs: [{ internalType: 'address', name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function',
  },
] as const;

// Transfer 事件 ABI（用于通过事件日志获取 token IDs）
const TRANSFER_EVENT_ABI = [
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: 'address', name: 'from', type: 'address' },
      { indexed: true, internalType: 'address', name: 'to', type: 'address' },
      { indexed: true, internalType: 'uint256', name: 'tokenId', type: 'uint256' },
    ],
    name: 'Transfer',
    type: 'event',
  },
] as const;

// 检查地址是否为合约
const isContract = async (client: ReturnType<typeof createPublicClient>, address: Address): Promise<boolean> => {
  try {
    const code = await client.getBytecode({ address });
    return code !== undefined && code !== '0x';
  } catch {
    return false;
  }
};

// 使用 ABI 方式获取特定合约的 NFT（通过事件日志，仅支持 BSC 链）
const fetchNFTsByABI = async (
  address: string,
  contractAddress: string
): Promise<{ nfts: WalletNFT[]; totalCount: number }> => {
  try {
    // 创建 public client，仅支持 BSC 链
    const client = createPublicClient({
      chain: bsc,
      transport: http(),
    });

    const contractAddr = contractAddress as Address;
    const ownerAddr = address as Address;

    // 0. 检查地址是否为合约
    const isContractAddress = await isContract(client, contractAddr);
    if (!isContractAddress) {
      throw new Error(`地址 ${contractAddress} 不是一个有效的合约地址`);
    }

    // 1. 获取用户在该合约中的 NFT 数量
    let balance: bigint;
    try {
      balance = await client.readContract({
        address: contractAddr,
        abi: ERC721_ABI,
        functionName: 'balanceOf',
        args: [ownerAddr],
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      if (errorMessage.includes('returned no data') || errorMessage.includes('0x')) {
        throw new Error(
          `合约 ${contractAddress} 可能不是标准的 ERC721 合约，或者没有实现 balanceOf 函数。`
        );
      }
      throw error;
    }

    if (balance === BigInt(0)) {
      return { nfts: [], totalCount: 0 };
    }

    // 2. 获取合约名称和符号
    let collectionName = '';
    let collectionSymbol = '';
    try {
      collectionName = await client.readContract({
        address: contractAddr,
        abi: ERC721_ABI,
        functionName: 'name',
      });
      collectionSymbol = await client.readContract({
        address: contractAddr,
        abi: ERC721_ABI,
        functionName: 'symbol',
      });
    } catch (e) {
      console.warn('Failed to get collection name/symbol:', e);
    }

    // 3. 通过事件日志获取用户拥有的所有 token IDs
    // 查询所有 Transfer 事件，找出转给用户的 token
    const tokenIds = new Set<string>();
    
    try {
      // 获取当前区块号
      const currentBlock = await client.getBlockNumber();
      
      // RPC 限制：第三方 RPC（如 thirdweb）限制最多只能查询 1,000 个区块范围
      const MAX_BLOCK_RANGE = BigInt(999); // 使用 999 确保不超过限制
      const MAX_QUERY_ATTEMPTS = 10; // 最多尝试查询 10 次（覆盖最近 10,000 个区块）
      
      // 分批查询：从最近的区块开始，逐步往前查询
      let toBlock = currentBlock;
      let queriesPerformed = 0;
      let totalFromBlock = currentBlock;
      
      while (queriesPerformed < MAX_QUERY_ATTEMPTS) {
        let fromBlock = toBlock > MAX_BLOCK_RANGE ? toBlock - MAX_BLOCK_RANGE : BigInt(0);
        totalFromBlock = fromBlock;
        
        try {
          // 查询所有转给用户的 Transfer 事件
          const transferToEvents = await client.getLogs({
            address: contractAddr,
            event: TRANSFER_EVENT_ABI[0],
            args: {
              to: ownerAddr,
            },
            fromBlock,
            toBlock,
          });

          // 查询所有从用户转出的 Transfer 事件
          const transferFromEvents = await client.getLogs({
            address: contractAddr,
            event: TRANSFER_EVENT_ABI[0],
            args: {
              from: ownerAddr,
            },
            fromBlock,
            toBlock,
          });

          // 处理转给用户的事件（添加 token）
          transferToEvents.forEach((event) => {
            if (event.args.tokenId !== undefined) {
              tokenIds.add(event.args.tokenId.toString());
            }
          });

          // 处理从用户转出的事件（移除 token）
          transferFromEvents.forEach((event) => {
            if (event.args.tokenId !== undefined) {
              tokenIds.delete(event.args.tokenId.toString());
            }
          });
          
          queriesPerformed++;
          
          // 如果已经查询到区块 0，停止查询
          if (fromBlock === BigInt(0)) {
            break;
          }
          
          // 准备查询下一个批次（更早的区块）
          toBlock = fromBlock - BigInt(1);
          
        } catch (queryError) {
          // 如果单个批次查询失败，记录错误但继续尝试
          const errorMsg = queryError instanceof Error ? queryError.message : String(queryError);
          console.warn(`查询区块 ${fromBlock} 到 ${toBlock} 失败:`, errorMsg);
          
          // 如果是因为范围太大导致的错误，停止查询
          if (errorMsg.includes('limit') || errorMsg.includes('exceeded')) {
            console.warn('已达到 RPC 限制，停止查询更早的区块');
            break;
          }
          
          // 继续尝试查询更早的区块
          if (fromBlock > BigInt(0)) {
            toBlock = fromBlock - BigInt(1);
            queriesPerformed++;
          } else {
            break;
          }
        }
      }

      // 验证：检查每个 token 的当前所有者是否真的是用户
      // 这可以处理历史事件不完整的情况
      const verifiedTokenIds: bigint[] = [];
      for (const tokenIdStr of Array.from(tokenIds)) {
        try {
          const tokenId = BigInt(tokenIdStr);
          const owner = await client.readContract({
            address: contractAddr,
            abi: ERC721_ABI,
            functionName: 'ownerOf',
            args: [tokenId],
          });
          
          if (owner.toLowerCase() === ownerAddr.toLowerCase()) {
            verifiedTokenIds.push(tokenId);
          }
        } catch (e) {
          // 如果 ownerOf 失败，跳过这个 token
          console.warn(`Failed to verify owner for token ${tokenIdStr}:`, e);
        }
      }

      // 使用验证后的 token IDs
      const finalTokenIds = verifiedTokenIds;
      
      // 如果通过事件获取的 token 数量少于 balanceOf，说明历史事件可能不完整
      // 这通常发生在合约很老，或者 NFT 是在查询范围之前 mint 的
      // 由于 RPC 限制（每次最多查询 1,000 个区块），我们分批查询了最近的区块
      if (finalTokenIds.length < Number(balance)) {
        console.warn(
          `通过事件获取的 token 数量 (${finalTokenIds.length}) 少于 balanceOf (${balance})。` +
          `已查询范围：区块 ${totalFromBlock} 到 ${currentBlock}（${queriesPerformed} 次查询，每次最多 1,000 个区块）。` +
          `如果您的 NFT 是在更早的区块 mint 的，可能无法通过事件日志获取。`
        );
      }
      
      // 4. 获取每个 token 的 metadata
      const nfts: WalletNFT[] = await Promise.all(
        finalTokenIds.map(async (tokenId) => {
          let tokenURI = '';
          let metadata: Record<string, unknown> = {};

          try {
            // 获取 tokenURI
            tokenURI = await client.readContract({
              address: contractAddr,
              abi: ERC721_ABI,
              functionName: 'tokenURI',
              args: [tokenId],
            });

            // 处理 IPFS URL
            let metadataUrl = tokenURI;
            if (tokenURI.startsWith('ipfs://')) {
              metadataUrl = `https://ipfs.io/ipfs/${tokenURI.replace('ipfs://', '')}`;
            } else if (tokenURI.startsWith('ipfs/')) {
              metadataUrl = `https://ipfs.io/${tokenURI}`;
            }

            // 获取 metadata
            if (metadataUrl && metadataUrl !== '') {
              try {
                const metadataResponse = await fetch(metadataUrl);
                if (metadataResponse.ok) {
                  metadata = await metadataResponse.json();
                }
              } catch (fetchError) {
                console.warn(`Failed to fetch metadata from ${metadataUrl}:`, fetchError);
              }
            }
          } catch (e) {
            console.warn(`Failed to get metadata for token ${tokenId}:`, e);
          }

          // 处理图片 URL
          let imageUrl = '/images/placeholder-all.png';
          if (metadata.image) {
            imageUrl = metadata.image as string;
            if (imageUrl.startsWith('ipfs://')) {
              imageUrl = `https://ipfs.io/ipfs/${imageUrl.replace('ipfs://', '')}`;
            }
          }

          console.log('metadata', metadata);
          console.log('collectionName', collectionName);
          console.log('collectionSymbol', collectionSymbol);
          console.log('tokenType', 'ERC721');
          console.log('tokenId', tokenId.toString());
          console.log('contractAddress', contractAddress);
          console.log('owner', address);
          console.log('tokenURI', tokenURI);
          console.log('imageUrl', imageUrl);
          return {
            id: `${contractAddress}-${tokenId.toString()}`,
            name: (metadata.name as string) || `NFT #${tokenId.toString()}`,
            description: metadata.description as string,
            image: imageUrl,
            owner: address,
            tokenId: tokenId.toString(),
            contractAddress: contractAddress,
            collectionName: collectionName,
            collectionSymbol: collectionSymbol,
            tokenType: 'ERC721',
            metadata: metadata,
          };
        })
      );

      return {
        nfts,
        totalCount: nfts.length,
      };
    } catch (eventError) {
      console.error('Failed to get token IDs from events:', eventError);
      throw new Error(`无法通过事件日志获取 NFT，请检查合约地址和网络连接。`);
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error('Error fetching NFTs by ABI:', errorMessage);
    
    // 提供更详细的错误信息
    if (errorMessage.includes('不是一个有效的合约地址')) {
      throw new Error(`地址 ${contractAddress} 不是合约地址，无法使用 ABI 方式获取 NFT。请使用 API 方式。`);
    }
    if (errorMessage.includes('不是标准的 ERC721 合约')) {
      throw error; // 已经包含详细错误信息
    }
    
    throw new Error(`使用 ABI 方式获取 NFT 失败: ${errorMessage}。建议使用 API 方式或检查合约地址。`);
  }
};

export const useWalletNFTs = (options: UseWalletNFTsOptions): UseWalletNFTsReturn => {
  const { contractAddress } = options;
  const { address, isConnected } = useAccount();
  const chainId = useChainId();
  
  const [nfts, setNfts] = useState<WalletNFT[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(false); // ABI 方式不支持分页
  const [error, setError] = useState<string | null>(null);
  const [totalCount, setTotalCount] = useState(0);

  const loadNFTs = useCallback(async () => {
    if (!address || !isConnected || !contractAddress) {
      setNfts([]);
      setHasMore(false);
      setError(null);
      setTotalCount(0);
      return;
    }

    // 检查链是否支持（仅支持 BSC）
    if (chainId !== bsc.id) {
      setError(`不支持的链 ID: ${chainId}，仅支持 BSC (${bsc.id})`);
      setNfts([]);
      setTotalCount(0);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      // 使用 ABI 方式获取 NFT
      const result = await fetchNFTsByABI(address, contractAddress);
      
      setNfts(result.nfts);
      setTotalCount(result.totalCount);
      setHasMore(false); // ABI 方式不支持分页
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load NFTs';
      setError(errorMessage);
      setNfts([]);
      setTotalCount(0);
    } finally {
      setLoading(false);
    }
  }, [address, isConnected, chainId, contractAddress]);

  const loadMore = useCallback(() => {
    // ABI 方式不支持分页，loadMore 为空操作
    console.warn('ABI 方式不支持分页加载');
  }, []);

  const refresh = useCallback(() => {
    setNfts([]);
    setHasMore(false);
    setError(null);
    setTotalCount(0);
    loadNFTs();
  }, [loadNFTs]);

  // 初始加载
  useEffect(() => {
    loadNFTs();
  }, [loadNFTs]);

  return {
    nfts,
    loading,
    hasMore,
    error,
    loadMore,
    refresh,
    totalCount,
  };
};
