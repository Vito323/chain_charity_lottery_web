"use client";

import { ethers } from "ethers";
import { useState, useCallback, useMemo } from "react";
// 导入 ABI 文件
import NodeContractArtifact from "../artifacts/node_contract.sol/CCNodeContract.json";

// 从 ABI 文件中获取合约地址和 ABI
const contractABI = NodeContractArtifact.abi;

// 节点类型枚举
export enum NodeType {
  Genesis = 0,
  Super = 1,
  Standard = 2,
}

// 节点信息接口
export interface NodeInfo {
  nodeOwner: string;
  nodeTypeValue: number;
  lockedAmount: string;
  unlockedAmount: string;
  purchaseTime: number;
}

// 节点详情接口
export interface NodeDetail {
  maxSupply: string;
  currentSupply: string;
  price: string;
  reward: string;
}

// 节点供应信息接口
export interface NodeSupplyInfo {
  maxSupply: string;
  currentSupply: string;
  remainingSupply: string;
}

// 质押锁定信息接口
export interface StakeLockInfo {
  totalAmount: string;
  firstPhaseAmount: string;
  secondPhaseAmount: string;
  firstPhaseUnlockTime: number;
  secondPhaseUnlockTime: number;
  firstPhaseUnlocked: string;
  secondPhaseUnlocked: string;
  firstPhaseUnlockable: string;
  secondPhaseUnlockable: string;
  firstPhaseForceUnlocked: boolean;
  secondPhaseForceUnlocked: boolean;
}

// 用户质押锁定信息接口
export interface UserStakeLockInfo {
  nodeIds: string[];
  totalAmounts: string[];
  firstPhaseUnlockable: string[];
  secondPhaseUnlockable: string[];
}

export const useNodeContract = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 1. 初始化合约实例的辅助函数 (使用 useMemo 避免重复创建)
  const contractInstance = useMemo(() => {
    // 检查是否在浏览器环境中
    if (typeof window === "undefined") {
      return null;
    }

    if (typeof window.ethereum === "undefined") {
      console.warn("MetaMask 未安装或未检测到");
      return null;
    }

    try {
      // MetaMask Provider
      const provider = new ethers.BrowserProvider(window.ethereum);

      const chainId = process.env.NEXT_PUBLIC_DEFAULT_CHAIN_ID!;
      const contractAddress = process.env.NEXT_PUBLIC_NODE_CONTRACT_ADDRESS!;

      console.log(`使用节点合约地址: ${contractAddress} (链ID: ${chainId})`);

      // 创建只读合约实例
      return new ethers.Contract(contractAddress, contractABI, provider);
    } catch (e) {
      console.error("初始化节点合约失败:", e);
      return null;
    }
  }, []); // 依赖项为空数组，只在组件初次渲染时创建

  // 通用错误处理函数
  const handleError = useCallback((e: unknown, defaultMessage: string) => {
    console.error("Contract error:", e);
    const error = e as Error;
    const errorMessage = error.message?.includes("user rejected")
      ? "用户拒绝了交易"
      : error.message?.includes("insufficient funds")
      ? "余额不足"
      : defaultMessage;
    setError(errorMessage);
    setIsLoading(false);
    throw e;
  }, []);

  // 获取Signer的辅助函数
  const getSigner = useCallback(async () => {
    if (typeof window === "undefined") {
      throw new Error("服务端环境无法获取签名者");
    }
    if (!contractInstance) throw new Error("合约未初始化或钱包未连接");
    const provider = contractInstance.runner
      ?.provider as ethers.BrowserProvider;
    if (!provider) throw new Error("未找到Provider");
    const signer = await provider.getSigner();
    if (!signer) throw new Error("未找到签名者");
    return contractInstance.connect(signer);
  }, [contractInstance]);

  // 获取当前用户地址的辅助函数
  const getCurrentUserAddress = useCallback(async (): Promise<string> => {
    if (typeof window === "undefined") {
      throw new Error("服务端环境无法获取用户地址");
    }
    if (!contractInstance) throw new Error("合约未初始化或钱包未连接");
    const provider = contractInstance.runner
      ?.provider as ethers.BrowserProvider;
    if (!provider) throw new Error("未找到Provider");
    const signer = await provider.getSigner();
    if (!signer) throw new Error("未找到签名者");
    return await signer.getAddress();
  }, [contractInstance]);

  // ==================== 只读函数 (View Functions) ====================

  // 获取节点信息
  const getNodeInfo = useCallback(
    async (nodeId: string): Promise<NodeInfo | null> => {
      if (!contractInstance) return null;
      try {
        const result = await contractInstance.getNodeInfo(nodeId);
        return {
          nodeOwner: result.nodeOwner,
          nodeTypeValue: Number(result.nodeTypeValue),
          lockedAmount: result.lockedAmount.toString(),
          unlockedAmount: result.unlockedAmount.toString(),
          purchaseTime: Number(result.purchaseTime),
        };
      } catch (e: any) {
        handleError(e, "获取节点信息失败");
        return null;
      }
    },
    [contractInstance, handleError]
  );

  // 获取节点详情
  const getNodeDetail = useCallback(
    async (nodeType: NodeType): Promise<NodeDetail | null> => {
      if (!contractInstance) return null;
      try {
        const result = await contractInstance.getNodeDetail(nodeType);
        return {
          maxSupply: result.maxSupply.toString(),
          currentSupply: result.currentSupply.toString(),
          price: result.price.toString(),
          reward: result.reward.toString(),
        };
      } catch (e: any) {
        handleError(e, "获取节点详情失败");
        return null;
      }
    },
    [contractInstance, handleError]
  );

  // 获取节点价格
  const getNodePrice = useCallback(
    async (nodeType: NodeType): Promise<string> => {
      if (!contractInstance) return "0";
      try {
        const result = await contractInstance.getNodePrice(nodeType);
        return result.toString();
      } catch (e: any) {
        handleError(e, "获取节点价格失败");
        return "0";
      }
    },
    [contractInstance, handleError]
  );

  // 获取节点奖励
  const getNodeReward = useCallback(
    async (nodeType: NodeType): Promise<string> => {
      if (!contractInstance) return "0";
      try {
        const result = await contractInstance.getNodeReward(nodeType);
        return result.toString();
      } catch (e: any) {
        handleError(e, "获取节点奖励失败");
        return "0";
      }
    },
    [contractInstance, handleError]
  );

  // 获取节点供应信息
  const getNodeSupplyInfo = useCallback(
    async (nodeType: NodeType): Promise<NodeSupplyInfo | null> => {
      if (!contractInstance) return null;
      try {
        const result = await contractInstance.getNodeSupplyInfo(nodeType);
        return {
          maxSupply: result.maxSupply.toString(),
          currentSupply: result.currentSupply.toString(),
          remainingSupply: result.remainingSupply.toString(),
        };
      } catch (e: any) {
        handleError(e, "获取节点供应信息失败");
        return null;
      }
    },
    [contractInstance, handleError]
  );

  // 获取节点所有者
  const getNodeOwner = useCallback(
    async (nodeId: string): Promise<string> => {
      if (!contractInstance) return "";
      try {
        const result = await contractInstance.getNodeOwner(nodeId);
        return result;
      } catch (e: any) {
        handleError(e, "获取节点所有者失败");
        return "";
      }
    },
    [contractInstance, handleError]
  );

  // 获取节点类型
  const getNodeType = useCallback(
    async (nodeId: string): Promise<number> => {
      if (!contractInstance) return -1;
      try {
        const result = await contractInstance.getNodeType(nodeId);
        return Number(result);
      } catch (e: any) {
        handleError(e, "获取节点类型失败");
        return -1;
      }
    },
    [contractInstance, handleError]
  );

  // 检查节点是否激活
  const isNodeActive = useCallback(
    async (nodeId: string): Promise<boolean> => {
      if (!contractInstance) return false;
      try {
        const result = await contractInstance.isNodeActive(nodeId);
        return result;
      } catch (e: any) {
        handleError(e, "检查节点状态失败");
        return false;
      }
    },
    [contractInstance, handleError]
  );

  // 获取用户节点列表
  const getUserNodes = useCallback(
    async (userAddress: string): Promise<string[]> => {
      if (!contractInstance) return [];
      try {
        const result = await contractInstance.getUserNodes(userAddress);
        return result;
      } catch (e: any) {
        handleError(e, "获取用户节点列表失败");
        return [];
      }
    },
    [contractInstance, handleError]
  );

  // 获取当前用户的节点列表
  const getCurrentUserNodes = useCallback(async (): Promise<string[]> => {
    if (!contractInstance) return [];
    try {
      const userAddress = await getCurrentUserAddress();
      const result = await contractInstance.getUserNodes(userAddress);
      return result;
    } catch (e: any) {
      handleError(e, "获取当前用户节点列表失败");
      return [];
    }
  }, [contractInstance, handleError, getCurrentUserAddress]);

  // 获取用户节点数量
  const getUserNodeCount = useCallback(
    async (userAddress: string): Promise<number> => {
      if (!contractInstance) return 0;
      try {
        const result = await contractInstance.getUserNodeCount(userAddress);
        return Number(result);
      } catch (e: any) {
        handleError(e, "获取用户节点数量失败");
        return 0;
      }
    },
    [contractInstance, handleError]
  );

  // 获取当前用户的节点数量
  const getCurrentUserNodeCount = useCallback(async (): Promise<number> => {
    if (!contractInstance) return 0;
    try {
      const userAddress = await getCurrentUserAddress();
      const result = await contractInstance.getUserNodeCount(userAddress);
      return Number(result);
    } catch (e: any) {
      handleError(e, "获取当前用户节点数量失败");
      return 0;
    }
  }, [contractInstance, handleError, getCurrentUserAddress]);

  // 检查用户是否已购买节点
  const hasPurchasedNode = useCallback(
    async (userAddress: string): Promise<boolean> => {
      if (!contractInstance) return false;
      try {
        const result = await contractInstance.hasPurchasedNode(userAddress);
        return result;
      } catch (e: any) {
        handleError(e, "检查用户购买状态失败");
        return false;
      }
    },
    [contractInstance, handleError]
  );

  // 检查当前用户是否已购买节点
  const currentUserHasPurchasedNode = useCallback(async (): Promise<boolean> => {
    if (!contractInstance) return false;
    try {
      const userAddress = await getCurrentUserAddress();
      const result = await contractInstance.hasPurchasedNode(userAddress);
      return result;
    } catch (e: any) {
      handleError(e, "检查当前用户购买状态失败");
      return false;
    }
  }, [contractInstance, handleError, getCurrentUserAddress]);

  // 获取质押锁定信息
  const getStakeLockInfo = useCallback(
    async (nodeId: string): Promise<StakeLockInfo | null> => {
      if (!contractInstance) return null;
      try {
        const result = await contractInstance.getStakeLockInfo(nodeId);
        return {
          totalAmount: result.totalAmount.toString(),
          firstPhaseAmount: result.firstPhaseAmount.toString(),
          secondPhaseAmount: result.secondPhaseAmount.toString(),
          firstPhaseUnlockTime: Number(result.firstPhaseUnlockTime),
          secondPhaseUnlockTime: Number(result.secondPhaseUnlockTime),
          firstPhaseUnlocked: result.firstPhaseUnlocked.toString(),
          secondPhaseUnlocked: result.secondPhaseUnlocked.toString(),
          firstPhaseUnlockable: result.firstPhaseUnlockable.toString(),
          secondPhaseUnlockable: result.secondPhaseUnlockable.toString(),
          firstPhaseForceUnlocked: result.firstPhaseForceUnlocked,
          secondPhaseForceUnlocked: result.secondPhaseForceUnlocked,
        };
      } catch (e: any) {
        handleError(e, "获取质押锁定信息失败");
        return null;
      }
    },
    [contractInstance, handleError]
  );

  // 获取用户质押锁定信息
  const getUserStakeLockInfo = useCallback(
    async (userAddress: string): Promise<UserStakeLockInfo | null> => {
      if (!contractInstance) return null;
      try {
        const result = await contractInstance.getUserStakeLockInfo(userAddress);
        return {
          nodeIds: result.nodeIds,
          totalAmounts: result.totalAmounts.map((v: bigint) => v.toString()),
          firstPhaseUnlockable: result.firstPhaseUnlockable.map((v: bigint) =>
            v.toString()
          ),
          secondPhaseUnlockable: result.secondPhaseUnlockable.map((v: bigint) =>
            v.toString()
          ),
        };
      } catch (e: any) {
        handleError(e, "获取用户质押锁定信息失败");
        return null;
      }
    },
    [contractInstance, handleError]
  );

  // 获取当前用户的质押锁定信息
  const getCurrentUserStakeLockInfo = useCallback(
    async (): Promise<UserStakeLockInfo | null> => {
      if (!contractInstance) return null;
      try {
        const userAddress = await getCurrentUserAddress();
        const result = await contractInstance.getUserStakeLockInfo(userAddress);
        return {
          nodeIds: result.nodeIds,
          totalAmounts: result.totalAmounts.map((v: bigint) => v.toString()),
          firstPhaseUnlockable: result.firstPhaseUnlockable.map((v: bigint) =>
            v.toString()
          ),
          secondPhaseUnlockable: result.secondPhaseUnlockable.map((v: bigint) =>
            v.toString()
          ),
        };
      } catch (e: any) {
        handleError(e, "获取当前用户质押锁定信息失败");
        return null;
      }
    },
    [contractInstance, handleError, getCurrentUserAddress]
  );

  // 获取支付代币地址
  const getPaymentToken = useCallback(async (): Promise<string> => {
    if (!contractInstance) return "";
    try {
      const result = await contractInstance.getPaymentToken();
      return result;
    } catch (e: any) {
      handleError(e, "获取支付代币地址失败");
      return "";
    }
  }, [contractInstance, handleError]);

  // 获取支付代币小数位
  const getPaymentTokenDecimals = useCallback(async (): Promise<number> => {
    if (!contractInstance) return 0;
    try {
      const result = await contractInstance.getPaymentTokenDecimals();
      return Number(result);
    } catch (e: any) {
      handleError(e, "获取支付代币小数位失败");
      return 0;
    }
  }, [contractInstance, handleError]);

  // 获取质押代币地址
  const getStakeToken = useCallback(async (): Promise<string> => {
    if (!contractInstance) return "";
    try {
      const result = await contractInstance.getStakeToken();
      return result;
    } catch (e: any) {
      handleError(e, "获取质押代币地址失败");
      return "";
    }
  }, [contractInstance, handleError]);

  // 获取质押代币小数位
  const getStakeTokenDecimals = useCallback(async (): Promise<number> => {
    if (!contractInstance) return 0;
    try {
      const result = await contractInstance.getStakeTokenDecimals();
      return Number(result);
    } catch (e: any) {
      handleError(e, "获取质押代币小数位失败");
      return 0;
    }
  }, [contractInstance, handleError]);

  // 获取第一阶段锁定时长
  const getFirstPhaseLockDuration = useCallback(async (): Promise<number> => {
    if (!contractInstance) return 0;
    try {
      const result = await contractInstance.FIRST_PHASE_LOCK_DURATION();
      return Number(result);
    } catch (e: any) {
      handleError(e, "获取第一阶段锁定时长失败");
      return 0;
    }
  }, [contractInstance, handleError]);

  // 获取第一阶段百分比
  const getFirstPhasePercentage = useCallback(async (): Promise<number> => {
    if (!contractInstance) return 0;
    try {
      const result = await contractInstance.FIRST_PHASE_PERCENTAGE();
      return Number(result);
    } catch (e: any) {
      handleError(e, "获取第一阶段百分比失败");
      return 0;
    }
  }, [contractInstance, handleError]);

  // 获取第二阶段锁定时长
  const getSecondPhaseLockDuration = useCallback(async (): Promise<number> => {
    if (!contractInstance) return 0;
    try {
      const result = await contractInstance.SECOND_PHASE_LOCK_DURATION();
      return Number(result);
    } catch (e: any) {
      handleError(e, "获取第二阶段锁定时长失败");
      return 0;
    }
  }, [contractInstance, handleError]);

  // ==================== 写入函数 (Write Functions) ====================

  // 购买节点
  const purchaseNode = useCallback(
    async (
      nodeType: NodeType,
      nodeId: string,
      referrer: string,
      nonce: number,
      deadline: number,
      signature: string
    ): Promise<string> => {
      setIsLoading(true);
      setError(null);
      try {
        const contractWithSigner = await getSigner();
        const tx = await (contractWithSigner as any).purchaseNode(
          nodeType,
          nodeId,
          referrer,
          nonce,
          deadline,
          signature
        );
        console.log("购买节点交易已发送，等待确认:", tx.hash);
        await tx.wait();
        console.log("购买节点交易已确认");
        setIsLoading(false);
        return tx.hash;
      } catch (e: unknown) {
        console.error("购买节点失败，详细错误:", e);
        handleError(e, "购买节点失败");
        throw e;
      }
    },
    [getSigner, handleError]
  );

  // 解锁质押
  const unlockStake = useCallback(
    async (nodeId: string, phase: number): Promise<string> => {
      setIsLoading(true);
      setError(null);
      try {
        const contractWithSigner = await getSigner();
        const tx = await (contractWithSigner as any).unlockStake(nodeId, phase);
        console.log("解锁质押交易已发送，等待确认:", tx.hash);
        await tx.wait();
        console.log("解锁质押交易已确认");
        setIsLoading(false);
        return tx.hash;
      } catch (e: unknown) {
        console.error("解锁质押失败，详细错误:", e);
        handleError(e, "解锁质押失败");
        throw e;
      }
    },
    [getSigner, handleError]
  );

  return {
    // 状态
    isLoading,
    error,
    contractAddress: contractInstance?.target,

    // 只读函数 - 节点信息
    getNodeInfo,
    getNodeDetail,
    getNodePrice,
    getNodeReward,
    getNodeSupplyInfo,
    getNodeOwner,
    getNodeType,
    isNodeActive,

    // 只读函数 - 用户节点
    getUserNodes,
    getCurrentUserNodes,
    getUserNodeCount,
    getCurrentUserNodeCount,
    hasPurchasedNode,
    currentUserHasPurchasedNode,

    // 只读函数 - 质押信息
    getStakeLockInfo,
    getUserStakeLockInfo,
    getCurrentUserStakeLockInfo,

    // 只读函数 - 代币信息
    getPaymentToken,
    getPaymentTokenDecimals,
    getStakeToken,
    getStakeTokenDecimals,

    // 只读函数 - 锁定配置
    getFirstPhaseLockDuration,
    getFirstPhasePercentage,
    getSecondPhaseLockDuration,

    // 写入函数 - 节点操作
    purchaseNode,
    unlockStake,
  };
};

