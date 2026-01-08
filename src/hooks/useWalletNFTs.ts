'use client';
import { useState, useEffect, useCallback } from 'react';
import { useAccount, useChainId } from 'wagmi';
import { mainnet, polygon, polygonAmoy } from 'wagmi/chains';

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
  pageSize?: number;
  initialPage?: number;
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

// Alchemy API配置
const ALCHEMY_API_KEYS = {
  [mainnet.id]: process.env.NEXT_PUBLIC_ALCHEMY_MAINNET_KEY || 'demo',
  [polygon.id]: process.env.NEXT_PUBLIC_ALCHEMY_POLYGON_KEY || 'demo',
  [polygonAmoy.id]: process.env.NEXT_PUBLIC_ALCHEMY_POLYGON_KEY || 'demo',
  [31337]: '',
};

// 获取Alchemy API URL
const getAlchemyUrl = (chainId: number) => {
  const apiKey = ALCHEMY_API_KEYS[chainId as keyof typeof ALCHEMY_API_KEYS];
  
  switch (chainId) {
    case mainnet.id:
      return `https://eth-mainnet.g.alchemy.com/nft/v3/${apiKey}`;
    case polygon.id:
      return `https://polygon-mainnet.g.alchemy.com/nft/v3/${apiKey}`;
    case polygonAmoy.id:
      return `https://polygon-amoy.g.alchemy.com/nft/v3/${apiKey}`;
    case 31337:
      return null;
    default:
      return `https://eth-mainnet.g.alchemy.com/nft/v3/${apiKey}`;
  }
};

// 获取NFT数据
const fetchWalletNFTs = async (
  address: string,
  chainId: number,
  pageKey?: string,
  pageSize: number = 20
): Promise<{ nfts: WalletNFT[]; pageKey?: string; totalCount: number }> => {
  const baseUrl = getAlchemyUrl(chainId);
  
  // 本地网络不支持Alchemy NFT API
  if (!baseUrl) {
    return { nfts: [], totalCount: 0 };
  }
  
  const url = new URL(`${baseUrl}/getNFTsForOwner`);
  
  url.searchParams.append('owner', address);
  url.searchParams.append('withMetadata', 'true');
  url.searchParams.append('pageSize', pageSize.toString());
  
  if (pageKey) {
    url.searchParams.append('pageKey', pageKey);
  }

  try {
    const response = await fetch(url.toString());
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json() as Record<string, unknown>;
    
    // 转换Alchemy数据格式到我们的NFT格式
    const ownedNfts = data.ownedNfts as Array<Record<string, unknown>> || [];
    console.log('ownedNfts', ownedNfts);
    const nfts: WalletNFT[] = ownedNfts.map((nft: Record<string, unknown>) => {
      const contract = nft.contract as Record<string, unknown>;
      const image = nft.image as Record<string, unknown>;
      const raw = nft.raw as Record<string, unknown> | undefined;
      
      // 从 raw.metadata 改为直接取 metadata
      // 如果 metadata 存在，直接使用；否则尝试从 raw.metadata 获取
      const metadata = (nft.metadata as Record<string, unknown>) || 
                      (raw?.metadata as Record<string, unknown>) || 
                      ({} as Record<string, unknown>);
      
      return {
        id: `${contract.address}-${nft.tokenId}`,
        name: (nft.name as string) || (contract.name as string) || `NFT #${nft.tokenId}`,
        description: nft.description as string,
        image: (image?.originalUrl as string) || (image?.pngUrl as string) || (image?.cachedUrl as string) || '/images/placeholder-all.png',
        owner: address,
        tokenId: nft.tokenId as string,
        contractAddress: contract.address as string,
        collectionName: contract.name as string,
        collectionSymbol: contract.symbol as string,
        tokenType: nft.tokenType as string,
        metadata: metadata,
      };
    });

    return {
      nfts,
      pageKey: data.pageKey as string | undefined,
      totalCount: (data.totalCount as number) || nfts.length,
    };
  } catch (error) {
    console.error('Error fetching NFTs:', error);
    throw new Error('Failed to fetch NFTs from wallet');
  }
};

export const useWalletNFTs = (options: UseWalletNFTsOptions = {}): UseWalletNFTsReturn => {
  const { pageSize = 20 } = options;
  const { address, isConnected } = useAccount();
  const chainId = useChainId();
  
  const [nfts, setNfts] = useState<WalletNFT[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pageKey, setPageKey] = useState<string | undefined>(undefined);
  const [totalCount, setTotalCount] = useState(0);

  const loadNFTs = useCallback(async (isAppend: boolean = false) => {
    if (!address || !isConnected) {
      setNfts([]);
      setHasMore(false);
      setError(null);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const result = await fetchWalletNFTs(address, chainId, isAppend ? pageKey : undefined, pageSize);
      
      if (isAppend) {
        setNfts(prev => [...prev, ...result.nfts]);
      } else {
        setNfts(result.nfts);
      }
      
      setPageKey(result.pageKey);
      setTotalCount(result.totalCount);
      setHasMore(!!result.pageKey);
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load NFTs');
    } finally {
      setLoading(false);
    }
  }, [address, isConnected, chainId, pageKey, pageSize]);

  const loadMore = useCallback(() => {
    if (!loading && hasMore && address && isConnected) {
      loadNFTs(true);
    }
  }, [loading, hasMore, address, isConnected, loadNFTs]);

  const refresh = useCallback(() => {
    setNfts([]);
    setPageKey(undefined);
    setHasMore(true);
    setError(null);
    setTotalCount(0);
    loadNFTs(false);
  }, [loadNFTs]);

  // 初始加载
  useEffect(() => {
    if (address && isConnected) {
      loadNFTs(false);
    } else {
      setNfts([]);
      setHasMore(false);
      setError(null);
      setTotalCount(0);
    }
  }, [address, isConnected, chainId, loadNFTs]);

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
