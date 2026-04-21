"use client";

import { ethers } from "ethers";
import { useState, useCallback, useMemo } from "react";
import { useAccount } from "wagmi";
import { bsc } from "wagmi/chains";
import StakeContractArtifact from "@/artifacts/node_contract.sol/CCStakeContract.json";
import { USDT_ADDRESSES } from "@/hooks/useDonationTokenBalance";
import { mapEthersWriteErrorToCommonKey } from "@/lib/contractErrorKeys";

const contractABI = StakeContractArtifact.abi;

const ERC20_ABI = [
  "function allowance(address owner, address spender) external view returns (uint256)",
  "function approve(address spender, uint256 amount) external returns (bool)",
] as const;

/** 与 Flutter `NodeStakeInfo` / 合约 `nodeStake` 一致 */
export interface NodeStakeInfo {
  owner: string;
  stake: string;
  releasable: string;
  firstStakeAt: string;
  usdtRewards: string;
}

/** 与 Flutter `Eip712DomainInfo` / 合约 `eip712Domain` 一致 */
export interface Eip712DomainInfo {
  fields: string;
  name: string;
  version: string;
  chainId: string;
  verifyingContract: string;
  salt: string;
  extensions: string[];
}

function normalizeAddress(addr: string): string {
  const s = addr.trim();
  return s.startsWith("0x") ? s : `0x${s}`;
}

function parseAmountWeiString(s: string): bigint {
  return BigInt(s.trim());
}

function digestHexToBytes32(digestHex: string): Uint8Array {
  let s = digestHex.trim();
  if (s.startsWith("0x")) s = s.slice(2);
  if (s.length !== 64) {
    throw new Error("errors.invalidDigestHex");
  }
  return ethers.getBytes(`0x${s}`);
}

function usdtAddressForConfiguredChain(): string {
  const chainId = Number(process.env.NEXT_PUBLIC_DEFAULT_CHAIN_ID);
  const fromMap = USDT_ADDRESSES[chainId as keyof typeof USDT_ADDRESSES];
  if (fromMap) return fromMap;
  return USDT_ADDRESSES[bsc.id];
}

export const useNodeContract = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const contractAddress = process.env.NEXT_PUBLIC_NODE_CONTRACT_ADDRESS!;
  const { connector, isConnected } = useAccount();

  // 1) 初始化只读合约实例（与 useDonationContract 风格一致）
  const contractInstance = useMemo(() => {
    if (typeof window === "undefined") return null;
    if (typeof window.ethereum === "undefined") {
      console.warn("MetaMask 未安装或未检测到");
      return null;
    }
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      return new ethers.Contract(contractAddress, contractABI, provider);
    } catch (e) {
      console.error("初始化质押合约失败:", e);
      return null;
    }
  }, [contractAddress]);

  // 2) 通用错误处理（仅用于写入交易）
  const handleWriteError = useCallback(
    (e: unknown, fallbackKey: string): never => {
      console.error("StakeContract write error:", e);
      const key = mapEthersWriteErrorToCommonKey(e) ?? fallbackKey;
      setError(key);
      setIsLoading(false);
      throw new Error(key);
    },
    []
  );

  // 3) Provider / Signer 获取辅助函数
  const getBrowserProvider = useCallback(async (): Promise<ethers.BrowserProvider> => {
    if (typeof window === "undefined") {
      throw new Error("errors.contractUnavailable");
    }

    if (!isConnected) {
      throw new Error("errors.walletNotConnected");
    }

    // 优先使用 wagmi 当前连接器 provider，确保钱包切换后调用目标一致
    const injectedProvider = connector
      ? ((await connector.getProvider()) as ethers.Eip1193Provider | undefined)
      : undefined;
    const provider = injectedProvider ?? window.ethereum;
    if (!provider) throw new Error("errors.walletNotConnected");
    return new ethers.BrowserProvider(provider);
  }, [connector, isConnected]);

  const getConnectedSigner = useCallback(async (): Promise<ethers.Signer> => {
    const provider = await getBrowserProvider();
    const signer = await provider.getSigner();
    return signer;
  }, [getBrowserProvider]);

  const getSignerContract = useCallback(async () => {
    if (!contractAddress) throw new Error("errors.contractUnavailable");
    const signer = await getConnectedSigner();
    return new ethers.Contract(contractAddress, contractABI, signer) as ethers.Contract;
  }, [contractAddress, getConnectedSigner]);

  const getCurrentUserAddress = useCallback(async (): Promise<string> => {
    const signer = await getConnectedSigner();
    return signer.getAddress();
  }, [getConnectedSigner]);

  /** 购买流程校验余额用：与 Flutter `purchase` 的 USDT 支付侧一致 */
  const getPaymentToken = useCallback(async (): Promise<string> => {
    return usdtAddressForConfiguredChain();
  }, []);

  const getPaymentTokenDecimals = useCallback(async (): Promise<number> => {
    return 18;
  }, []);

  // 检查并处理 ERC20 代币授权
  const checkAndApproveToken = useCallback(
    async (
      tokenAddress: string,
      spenderAddress: string,
      amount: bigint,
      tokenDecimals: number = 18
    ): Promise<void> => {
      if (typeof window === "undefined") {
        throw new Error("服务端环境无法处理授权");
      }

      const provider = await getBrowserProvider();
      const signer = await provider.getSigner();
      const userAddress = await signer.getAddress();

      // ERC20 标准 ABI (仅包含 allowance 和 approve 函数)
      const erc20ABI = [
        "function allowance(address owner, address spender) external view returns (uint256)",
        "function approve(address spender, uint256 amount) external returns (bool)",
      ];

      const tokenContract = new ethers.Contract(
        tokenAddress,
        erc20ABI,
        signer
      );

      // 检查当前授权额度
      const currentAllowance = await tokenContract.allowance(
        userAddress,
        spenderAddress
      );

      // 如果授权不足，请求授权
      if (currentAllowance < amount) {
        // 使用确定的金额值进行授权
        const approveAmount = amount > ethers.MaxUint256 
          ? ethers.MaxUint256 
          : amount;
        
        console.log(
          `授权不足，当前授权: ${ethers.formatUnits(currentAllowance, tokenDecimals)}, 需要: ${ethers.formatUnits(amount, tokenDecimals)}, 将授权: ${ethers.formatUnits(approveAmount, tokenDecimals)}`
        );

        const approveTx = await tokenContract.approve(
          spenderAddress,
          approveAmount
        );
        await approveTx.wait();
        console.log("代币授权成功");
      } else {
        console.log("授权额度充足，无需重新授权");
      }
    },
    [getBrowserProvider]
  );

  // ==================== 写入通用执行器（先授权，再写链） ====================
  const getStakeTokenAddress = useCallback(async (): Promise<string> => {
    if (!contractInstance) return "";
    try {
      const addr = (await contractInstance.stakeToken()) as string;
      return addr && addr !== ethers.ZeroAddress ? normalizeAddress(addr) : "";
    } catch {
      return "";
    }
  }, [contractInstance]);

  const ensureErc20ApprovalsForWrite = useCallback(
    async (functionName: string, parameters: unknown[]) => {
      if (!contractInstance) throw new Error("errors.contractUnavailable");
      const spender = contractAddress;

      if (functionName === "stakeFor") {
        if (parameters.length < 3) return;
        const amt = BigInt(String(parameters[2]));
        if (amt <= BigInt(0)) return;
        const stake = await getStakeTokenAddress();
        if (!stake) throw new Error("errors.stakeTokenUnavailable");
        await checkAndApproveToken(stake, spender, amt);
        return;
      }

      if (functionName === "purchase") {
        if (parameters.length < 6) return;
        const payAmt = BigInt(String(parameters[4]));
        if (payAmt <= BigInt(0)) return;
        await checkAndApproveToken(usdtAddressForConfiguredChain(), spender, payAmt);
        return;
      }

      if (functionName === "depositRewardUsdt") {
        if (parameters.length < 1) return;
        const amt = BigInt(String(parameters[0]));
        if (amt <= BigInt(0)) return;
        await checkAndApproveToken(usdtAddressForConfiguredChain(), spender, amt);
      }
    },
    [checkAndApproveToken, contractAddress, contractInstance, getStakeTokenAddress]
  );

  const runWrite = useCallback(
    async (
      functionName: string,
      parameters: unknown[],
      fallbackKey: string
    ): Promise<string> => {
      setIsLoading(true);
      setError(null);
      try {
        await ensureErc20ApprovalsForWrite(functionName, parameters);
        const c = await getSignerContract();
        const tx = await c.getFunction(functionName)(...parameters);
        await tx.wait();
        setIsLoading(false);
        return tx.hash as string;
      } catch (e) {
        return handleWriteError(e, fallbackKey);
      }
    },
    [ensureErc20ApprovalsForWrite, getSignerContract, handleWriteError]
  );

  // ==================== 只读（与 Flutter 一致：失败返回空/零，不打断 UI） ====================

  const getUserNodeIds = useCallback(
    async (userAddress: string): Promise<string[]> => {
      if (!contractInstance) return [];
      try {
        return await contractInstance.getUserNodeIds(normalizeAddress(userAddress));
      } catch (e) {
        console.error("[StakeContract] getUserNodeIds", e);
        return [];
      }
    },
    [contractInstance]
  );

  const getCurrentUserNodeIds = useCallback(async (): Promise<string[]> => {
    try {
      const addr = await getCurrentUserAddress();
      return getUserNodeIds(addr);
    } catch {
      return [];
    }
  }, [getCurrentUserAddress, getUserNodeIds]);

  const getLockedBalance = useCallback(
    async (nodeId: string): Promise<string> => {
      if (!contractInstance) return "0";
      try {
        const v = await contractInstance.lockedBalance(nodeId);
        return (v as bigint).toString();
      } catch (e) {
        console.error("[StakeContract] lockedBalance", e);
        return "0";
      }
    },
    [contractInstance]
  );

  const getMasterContract = useCallback(async (): Promise<string> => {
    if (!contractInstance) return "";
    try {
      const v = await contractInstance.masterContract();
      return normalizeAddress(String(v));
    } catch (e) {
      console.error("[StakeContract] masterContract", e);
      return "";
    }
  }, [contractInstance]);

  const getNodeStake = useCallback(
    async (nodeId: string): Promise<NodeStakeInfo | null> => {
      if (!contractInstance) return null;
      try {
        const r = await contractInstance.nodeStake(nodeId);
        const owner = (r.owner ?? r[0]) as string;
        const stake = (r.stake ?? r[1]) as bigint;
        const releasable = (r.releasable ?? r[2]) as bigint;
        const firstStakeAt = (r.firstStakeAt ?? r[3]) as bigint;
        const usdtRewards = (r.usdtRewards ?? r[4]) as bigint;
        return {
          owner: normalizeAddress(String(owner)),
          stake: stake.toString(),
          releasable: releasable.toString(),
          firstStakeAt: firstStakeAt.toString(),
          usdtRewards: usdtRewards.toString(),
        };
      } catch (e) {
        console.error("[StakeContract] nodeStake", e);
        return null;
      }
    },
    [contractInstance]
  );

  const isOperator = useCallback(
    async (account: string): Promise<boolean> => {
      if (!contractInstance) return false;
      try {
        return await contractInstance.operators(normalizeAddress(account));
      } catch (e) {
        console.error("[StakeContract] operators", e);
        return false;
      }
    },
    [contractInstance]
  );

  const getOwner = useCallback(async (): Promise<string> => {
    if (!contractInstance) return "";
    try {
      const v = await contractInstance.owner();
      return normalizeAddress(String(v));
    } catch (e) {
      console.error("[StakeContract] owner", e);
      return "";
    }
  }, [contractInstance]);

  const getRewardToken = useCallback(async (): Promise<string> => {
    if (!contractInstance) return "";
    try {
      const v = await contractInstance.rewardToken();
      return normalizeAddress(String(v));
    } catch (e) {
      console.error("[StakeContract] rewardToken", e);
      return "";
    }
  }, [contractInstance]);

  const getServerSigner = useCallback(async (): Promise<string> => {
    if (!contractInstance) return "";
    try {
      const v = await contractInstance.serverSigner();
      return normalizeAddress(String(v));
    } catch (e) {
      console.error("[StakeContract] serverSigner", e);
      return "";
    }
  }, [contractInstance]);

  const getStakeToken = useCallback(async (): Promise<string> => {
    return getStakeTokenAddress();
  }, [getStakeTokenAddress]);

  const getTotalPendingUsdtRewards = useCallback(async (): Promise<string> => {
    if (!contractInstance) return "0";
    try {
      const v = await contractInstance.totalPendingUsdtRewards();
      return (v as bigint).toString();
    } catch (e) {
      console.error("[StakeContract] totalPendingUsdtRewards", e);
      return "0";
    }
  }, [contractInstance]);

  const getUserNonce = useCallback(
    async (user: string): Promise<string> => {
      if (!contractInstance) return "0";
      try {
        const v = await contractInstance.userNonces(normalizeAddress(user));
        return (v as bigint).toString();
      } catch (e) {
        console.error("[StakeContract] userNonces", e);
        return "0";
      }
    },
    [contractInstance]
  );

  const getCurrentUserNonce = useCallback(async (): Promise<string> => {
    try {
      const addr = await getCurrentUserAddress();
      return getUserNonce(addr);
    } catch {
      return "0";
    }
  }, [getCurrentUserAddress, getUserNonce]);

  const isPurchaseDigestUsed = useCallback(
    async (digestHex: string): Promise<boolean> => {
      if (!contractInstance) return false;
      try {
        const digest = digestHexToBytes32(digestHex);
        return await contractInstance.usedPurchaseDigests(digest);
      } catch (e) {
        console.error("[StakeContract] usedPurchaseDigests", e);
        return false;
      }
    },
    [contractInstance]
  );

  const getEip712Domain = useCallback(async (): Promise<Eip712DomainInfo | null> => {
    if (!contractInstance) return null;
    try {
      const r = await contractInstance.eip712Domain();
      const fieldsRaw = r.fields ?? r[0];
      const name = String(r.name ?? r[1]);
      const version = String(r.version ?? r[2]);
      const chainId = (r.chainId ?? r[3]) as bigint;
      const verifyingContract = String(r.verifyingContract ?? r[4]);
      const saltRaw = r.salt ?? r[5];
      const extRaw = r.extensions ?? r[6];
      const fields =
        typeof fieldsRaw === "string"
          ? fieldsRaw
          : ethers.hexlify(fieldsRaw as Uint8Array);
      const salt =
        typeof saltRaw === "string"
          ? saltRaw
          : ethers.hexlify(saltRaw as Uint8Array);
      const ext = (extRaw as bigint[]) ?? [];
      return {
        fields,
        name,
        version,
        chainId: chainId.toString(),
        verifyingContract: normalizeAddress(verifyingContract),
        salt,
        extensions: ext.map((x) => x.toString()),
      };
    } catch (e) {
      console.error("[StakeContract] eip712Domain", e);
      return null;
    }
  }, [contractInstance]);

  // ==================== 写入（与 Flutter `NodeContractNotifier` 一致） ====================

  const depositRewardUsdt = useCallback(
    async (amount: string) =>
      runWrite("depositRewardUsdt", [parseAmountWeiString(amount)], "errors.nodeContractTxFailed"),
    [runWrite]
  );

  const grantUsdtReward = useCallback(
    async (nodeId: string, amount: string) =>
      runWrite(
        "grantUsdtReward",
        [nodeId, parseAmountWeiString(amount)],
        "errors.nodeContractTxFailed"
      ),
    [runWrite]
  );

  const setFirstStakeAt = useCallback(
    async (nodeId: string, timestamp: string) =>
      runWrite(
        "setFirstStakeAt",
        [nodeId, parseAmountWeiString(timestamp)],
        "errors.nodeContractTxFailed"
      ),
    [runWrite]
  );

  const setMasterContract = useCallback(
    async (masterContract: string) =>
      runWrite(
        "setMasterContract",
        [normalizeAddress(masterContract)],
        "errors.nodeContractTxFailed"
      ),
    [runWrite]
  );

  const setOperator = useCallback(
    async (account: string, active: boolean) =>
      runWrite(
        "setOperator",
        [normalizeAddress(account), active],
        "errors.nodeContractTxFailed"
      ),
    [runWrite]
  );

  const stakeFor = useCallback(
    async (beneficiary: string, nodeId: string, amount: string) =>
      runWrite(
        "stakeFor",
        [normalizeAddress(beneficiary), nodeId, parseAmountWeiString(amount)],
        "errors.nodeContractTxFailed"
      ),
    [runWrite]
  );

  const syncRewardTokenFromMaster = useCallback(
    async () =>
      runWrite("syncRewardTokenFromMaster", [], "errors.nodeContractTxFailed"),
    [runWrite]
  );

  const syncStakeTokenFromMaster = useCallback(
    async () =>
      runWrite("syncStakeTokenFromMaster", [], "errors.nodeContractTxFailed"),
    [runWrite]
  );

  const transferNode = useCallback(
    async (nodeId: string, newOwner: string) =>
      runWrite(
        "transferNode",
        [nodeId, normalizeAddress(newOwner)],
        "errors.nodeContractTxFailed"
      ),
    [runWrite]
  );

  const transferOwnership = useCallback(
    async (newOwner: string) =>
      runWrite(
        "transferOwnership",
        [normalizeAddress(newOwner)],
        "errors.nodeContractTxFailed"
      ),
    [runWrite]
  );

  const setServerSigner = useCallback(
    async (serverSignerAddr: string) =>
      runWrite(
        "setServerSigner",
        [normalizeAddress(serverSignerAddr)],
        "errors.nodeContractTxFailed"
      ),
    [runWrite]
  );

  const unlockBatch = useCallback(
    async (nodeId: string, amount: string) =>
      runWrite(
        "unlockBatch",
        [nodeId, parseAmountWeiString(amount)],
        "errors.nodeContractTxFailed"
      ),
    [runWrite]
  );

  const withdraw = useCallback(
    async (nodeId: string, amount: string) =>
      runWrite("withdraw", [nodeId, parseAmountWeiString(amount)], "errors.nodeContractTxFailed"),
    [runWrite]
  );

  const emergencyWithdrawDefaultToken = useCallback(
    async (recipient: string) =>
      runWrite(
        "emergencyWithdrawDefaultToken",
        [normalizeAddress(recipient)],
        "errors.nodeContractTxFailed"
      ),
    [runWrite]
  );

  const emergencyWithdrawERC20Token = useCallback(
    async (token: string, recipient: string) =>
      runWrite(
        "emergencyWithdrawERC20Token",
        [normalizeAddress(token), normalizeAddress(recipient)],
        "errors.nodeContractTxFailed"
      ),
    [runWrite]
  );

  const purchase = useCallback(
    async (args: {
      nodeId: string;
      received: string;
      nonce: number;
      deadline: number;
      amount: string;
      stakeAmount: string;
      signature: string;
    }) =>
      runWrite(
        "purchase",
        [
          args.nodeId,
          args.received,
          args.nonce,
          args.deadline,
          parseAmountWeiString(args.amount),
          parseAmountWeiString(args.stakeAmount),
          args.signature,
        ],
        "errors.purchaseFailed"
      ),
    [runWrite]
  );

  return {
    isLoading,
    error,
    contractAddress,

    checkAndApproveToken,
    getPaymentToken,
    getPaymentTokenDecimals,

    getUserNodeIds,
    getCurrentUserNodeIds,
    getLockedBalance,
    getMasterContract,
    getNodeStake,
    isOperator,
    getOwner,
    getRewardToken,
    getServerSigner,
    getStakeToken,
    getTotalPendingUsdtRewards,
    getUserNonce,
    getCurrentUserNonce,
    isPurchaseDigestUsed,
    getEip712Domain,
    getCurrentUserAddress,

    depositRewardUsdt,
    grantUsdtReward,
    setFirstStakeAt,
    setMasterContract,
    setOperator,
    stakeFor,
    syncRewardTokenFromMaster,
    syncStakeTokenFromMaster,
    transferNode,
    transferOwnership,
    setServerSigner,
    unlockBatch,
    withdraw,
    emergencyWithdrawDefaultToken,
    emergencyWithdrawERC20Token,
    purchase,
  };
};
