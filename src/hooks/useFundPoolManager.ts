"use client";

import { ethers } from "ethers";
import { useState, useCallback, useMemo } from "react";
// 导入 ABI 文件，确保路径正确
import fundPoolManagerArtifact from "../artifacts/fund_pool_manager.sol/FundPoolManager.json";
import { useChainId } from "wagmi";
import { getContractAddress, isChainSupported } from "@/lib/chain-contracts";

// 从 ABI 文件中获取合约地址和 ABI
const contractABI = fundPoolManagerArtifact.abi;

// 定义类型接口
interface Project {
  id: string;
  owner: string;
  beneficiary: string;
  isActive: boolean;
  version: number;
  createdAt: number;
  totalDonated: number;
  withdrawableAmount: number;
  withdrawnAmount: number;
}

interface Donation {
  donor: string;
  token: string;
  amount: number;
  timestamp: number;
  projectId: string;
}


export interface ProjectFundStats {
  totalDonated: number;
  withdrawableAmount: number;
  withdrawnAmount: number;
}

interface TokenFundStats {
  totalDonated: number;
  withdrawableAmount: number;
  withdrawnAmount: number;
}

export const useFundPoolManager = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const chainId = useChainId();

  // 1. 初始化合约实例的辅助函数 (使用 useMemo 根据链ID动态创建)
  const contractInstance = useMemo(() => {
    // 检查是否在浏览器环境中
    if (typeof window === "undefined") {
      return null;
    }

    if (typeof window.ethereum === "undefined") {
      console.warn("MetaMask 未安装或未检测到");
      return null;
    }

    // 检查链是否支持
    if (!isChainSupported(chainId)) {
      console.warn(`链ID ${chainId} 不支持或未配置合约地址`);
      return null;
    }

    // 根据当前链ID获取合约地址
    const contractAddress = getContractAddress(chainId);
    if (!contractAddress) {
      console.warn(`链ID ${chainId} 的合约地址未配置`);
      return null;
    }

    try {
      // MetaMask Provider
      const provider = new ethers.BrowserProvider(window.ethereum);

      console.log(`使用合约地址: ${contractAddress} (链ID: ${chainId})`);

      // 创建只读合约实例
      return new ethers.Contract(contractAddress, contractABI, provider);
    } catch (e) {
      console.error("初始化合约失败:", e);
      return null;
    }
  }, [chainId]); // 依赖链ID，当链切换时重新创建合约实例

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

  // ==================== 只读函数 (View Functions) ====================

  // 获取版本号
  const getVersion = useCallback(async (): Promise<number> => {
    if (!contractInstance) return 0;
    try {
      const result = await contractInstance.VERSION();
      return Number(result);
    } catch (e: any) {
      handleError(e, "获取版本号失败");
      return 0;
    }
  }, [contractInstance, handleError]);

  // 获取基础点数除数
  const getBasisPointsDivisor = useCallback(async (): Promise<number> => {
    if (!contractInstance) return 0;
    try {
      const result = await contractInstance.BASIS_POINTS_DIVISOR();
      return Number(result);
    } catch (e: any) {
      handleError(e, "获取基础点数除数失败");
      return 0;
    }
  }, [contractInstance, handleError]);

  // 获取团队费用基础点数
  const getTeamFeeBasisPoints = useCallback(async (): Promise<number> => {
    if (!contractInstance) return 0;
    try {
      const result = await contractInstance.TEAM_FEE_BASIS_POINTS();
      return Number(result);
    } catch (e: any) {
      handleError(e, "获取团队费用基础点数失败");
      return 0;
    }
  }, [contractInstance, handleError]);

  // 获取彩票池基础点数
  const getLotteryPoolBasisPoints = useCallback(async (): Promise<number> => {
    if (!contractInstance) return 0;
    try {
      const result = await contractInstance.LOTTERY_POOL_BASIS_POINTS();
      return Number(result);
    } catch (e: any) {
      handleError(e, "获取彩票池基础点数失败");
      return 0;
    }
  }, [contractInstance, handleError]);

  // 获取项目捐赠基础点数
  const getProjectDonationBasisPoints =
    useCallback(async (): Promise<number> => {
      if (!contractInstance) return 0;
      try {
        const result = await contractInstance.PROJECT_DONATION_BASIS_POINTS();
        return Number(result);
      } catch (e: any) {
        handleError(e, "获取项目捐赠基础点数失败");
        return 0;
      }
    }, [contractInstance, handleError]);

  // 获取合约所有者
  const getOwner = useCallback(async (): Promise<string> => {
    if (!contractInstance) return "";
    try {
      const result = await contractInstance.owner();
      return result;
    } catch (e: any) {
      handleError(e, "获取合约所有者失败");
      return "";
    }
  }, [contractInstance, handleError]);

  // 获取彩票管理员
  const getLotteryManager = useCallback(async (): Promise<string> => {
    if (!contractInstance) return "";
    try {
      const result = await contractInstance.lotteryManager();
      return result;
    } catch (e: any) {
      handleError(e, "获取彩票管理员失败");
      return "";
    }
  }, [contractInstance, handleError]);

  // 获取捐赠总数
  const getDonationCount = useCallback(async (): Promise<number> => {
    if (!contractInstance) return 0;
    try {
      const result = await contractInstance.donationCount();
      return Number(result);
    } catch (e: any) {
      handleError(e, "获取捐赠总数失败");
      return 0;
    }
  }, [contractInstance, handleError]);

  // 获取总团队资金
  const getTotalTeamFunds = useCallback(async (): Promise<number> => {
    if (!contractInstance) return 0;
    try {
      const result = await contractInstance.totalTeamFunds();
      return Number(result);
    } catch (e: any) {
      handleError(e, "获取总团队资金失败");
      return 0;
    }
  }, [contractInstance, handleError]);

  // 获取总彩票资金
  const getTotalLotteryFunds = useCallback(async (): Promise<number> => {
    if (!contractInstance) return 0;
    try {
      const result = await contractInstance.totalLotteryFunds();
      return Number(result);
    } catch (e: any) {
      handleError(e, "获取总彩票资金失败");
      return 0;
    }
  }, [contractInstance, handleError]);

  // 获取总项目资金
  const getTotalProjectFunds = useCallback(async (): Promise<number> => {
    if (!contractInstance) return 0;
    try {
      const result = await contractInstance.totalProjectFunds();
      return Number(result);
    } catch (e: unknown) {
      handleError(e, "获取总项目资金失败");
      return 0;
    }
  }, [contractInstance, handleError]);

  // 获取已提取的团队资金
  const getWithdrawnTeamFunds = useCallback(async (): Promise<number> => {
    if (!contractInstance) return 0;
    try {
      const result = await contractInstance.withdrawnTeamFunds();
      return Number(result);
    } catch (e: unknown) {
      handleError(e, "获取已提取的团队资金失败");
      return 0;
    }
  }, [contractInstance, handleError]);

  // 获取已提取的彩票资金
  const getWithdrawnLotteryFunds = useCallback(async (): Promise<number> => {
    if (!contractInstance) return 0;
    try {
      const result = await contractInstance.withdrawnLotteryFunds();
      return Number(result);
    } catch (e: unknown) {
      handleError(e, "获取已提取的彩票资金失败");
      return 0;
    }
  }, [contractInstance, handleError]);

  // 获取项目信息
  const getProject = useCallback(
    async (projectId: string): Promise<Project | null> => {
      if (!contractInstance) return null;
      try {
        const result = await contractInstance.getProject(projectId);
        return {
          id: result.id,
          owner: result.owner,
          beneficiary: result.beneficiary,
          isActive: result.isActive,
          version: Number(result.version),
          createdAt: Number(result.createdAt),
          totalDonated: Number(result.totalDonated),
          withdrawableAmount: Number(result.withdrawableAmount),
          withdrawnAmount: Number(result.withdrawnAmount),
        };
      } catch (e: unknown) {
        handleError(e, "获取项目信息失败");
        return null;
      }
    },
    [contractInstance, handleError]
  );

  // 获取项目资金统计
  const getProjectFundStats = useCallback(
    async (projectId: string): Promise<ProjectFundStats | null> => {
      if (!contractInstance) return null;
      try {
        const result = await contractInstance.getProjectFundStats(projectId);
        return {
          totalDonated: Number(result.totalDonated),
          withdrawableAmount: Number(result.withdrawableAmount),
          withdrawnAmount: Number(result.withdrawnAmount),
        };
      } catch (e: unknown) {
        handleError(e, "获取项目资金统计失败");
        return null;
      }
    },
    [contractInstance, handleError]
  );

  // 获取捐赠信息
  const getDonation = useCallback(
    async (donationId: number): Promise<Donation | null> => {
      if (!contractInstance) return null;
      try {
        const result = await contractInstance.getDonation(donationId);
        return {
          donor: result.donor,
          token: result.token,
          amount: Number(result.amount),
          timestamp: Number(result.timestamp),
          projectId: result.projectId,
        };
      } catch (e: unknown) {
        handleError(e, "获取捐赠信息失败");
        return null;
      }
    },
    [contractInstance, handleError]
  );

  // 获取所有者项目列表
  const getOwnerProjects = useCallback(
    async (owner: string): Promise<string[]> => {
      if (!contractInstance) return [];
      try {
        const result = await contractInstance.getOwnerProjects(owner);
        return result;
      } catch (e: unknown) {
        handleError(e, "获取所有者项目列表失败");
        return [];
      }
    },
    [contractInstance, handleError]
  );

  // 获取ETH地址常量
  const getDefaultTokenAddress = useCallback(async (): Promise<string> => {
    if (!contractInstance) return "";
    try {
      const result = await contractInstance.DEFAULT_TOKEN_ADDRESS();
      return result;
    } catch (e: unknown) {
      handleError(e, "获取ETH地址失败");
      return "";
    }
  }, [contractInstance, handleError]);

  // 检查代币是否被允许
  const isTokenAllowed = useCallback(
    async (token: string): Promise<boolean> => {
      if (!contractInstance) return false;
      try {
        const result = await contractInstance.isTokenAllowed(token);
        return result;
      } catch (e: unknown) {
        handleError(e, "检查代币是否被允许失败");
        return false;
      }
    },
    [contractInstance, handleError]
  );

  // 获取允许的代币列表
  const getAllowedTokens = useCallback(async (): Promise<string[]> => {
    if (!contractInstance) return [];
    try {
      const result = await contractInstance.getAllowedTokens();
      return result;
    } catch (e: unknown) {
      handleError(e, "获取允许的代币列表失败");
      return [];
    }
  }, [contractInstance, handleError]);

  // 获取项目ETH资金统计
  const getProjectETHFundStats = useCallback(
    async (projectId: string): Promise<ProjectFundStats | null> => {
      if (!contractInstance) return null;
      try {
        const result = await contractInstance.getProjectFundStats(projectId);
        return {
          totalDonated: Number(result.totalDonated),
          withdrawableAmount: Number(result.withdrawableAmount),
          withdrawnAmount: Number(result.withdrawnAmount),
        };
      } catch (e: unknown) {
        handleError(e, "获取项目ETH资金统计失败");
        return null;
      }
    },
    [contractInstance, handleError]
  );

  // 获取项目代币资金统计
  const getProjectTokenFundStats = useCallback(
    async (projectId: string, token: string): Promise<TokenFundStats | null> => {
      if (!contractInstance) return null;
      try {
        const result = await contractInstance.getProjectTokenFundStats(projectId, token);
        return {
          totalDonated: Number(result.totalDonated),
          withdrawableAmount: Number(result.withdrawableAmount),
          withdrawnAmount: Number(result.withdrawnAmount),
        };
      } catch (e: unknown) {
        handleError(e, "获取项目代币资金统计失败");
        return null;
      }
    },
    [contractInstance, handleError]
  );

  // 获取代币池信息
  const getTokenPool = useCallback(
    async (token: string): Promise<TokenFundStats | null> => {
      if (!contractInstance) return null;
      try {
        const result = await contractInstance.tokenPools(token);
        return {
          totalDonated: Number(result.totalDonated),
          withdrawableAmount: Number(result.withdrawableAmount),
          withdrawnAmount: Number(result.withdrawnAmount),
        };
      } catch (e: unknown) {
        handleError(e, "获取代币池信息失败");
        return null;
      }
    },
    [contractInstance, handleError]
  );

  // 获取项目代币资金
  const getProjectTokenFunds = useCallback(
    async (projectId: string, token: string): Promise<TokenFundStats | null> => {
      if (!contractInstance) return null;
      try {
        const result = await contractInstance.projectTokenFunds(projectId, token);
        return {
          totalDonated: Number(result.totalDonated),
          withdrawableAmount: Number(result.withdrawableAmount),
          withdrawnAmount: Number(result.withdrawnAmount),
        };
      } catch (e: unknown) {
        handleError(e, "获取项目代币资金失败");
        return null;
      }
    },
    [contractInstance, handleError]
  );

  // 获取已提取的代币资金
  const getWithdrawnLotteryFundsToken = useCallback(
    async (token: string): Promise<number> => {
      if (!contractInstance) return 0;
      try {
        const result = await contractInstance.withdrawnLotteryFundsToken(token);
        return Number(result);
      } catch (e: unknown) {
        handleError(e, "获取已提取的代币资金失败");
        return 0;
      }
    },
    [contractInstance, handleError]
  );

  // 获取已提取的团队代币资金
  const getWithdrawnTeamFundsToken = useCallback(
    async (token: string): Promise<number> => {
      if (!contractInstance) return 0;
      try {
        const result = await contractInstance.withdrawnTeamFundsToken(token);
        return Number(result);
      } catch (e: unknown) {
        handleError(e, "获取已提取的团队代币资金失败");
        return 0;
      }
    },
    [contractInstance, handleError]
  );

  // ==================== 写入函数 (Write Functions) ====================

  // 创建项目
  const createProject = useCallback(
    async (
      projectId: string,
      projectOwner: string,
      beneficiary: string
    ): Promise<string> => {
      setIsLoading(true);
      setError(null);
      try {
        const contractWithSigner = await getSigner();
        const tx = await (contractWithSigner as any).createProject(
          projectId,
          projectOwner,
          beneficiary
        );
        await tx.wait();
        setIsLoading(false);
        return tx.hash;
      } catch (e: unknown) {
        handleError(e, "创建项目失败");
        throw e;
      }
    },
    [getSigner, handleError]
  );

// ETH捐赠
const donate = useCallback(
  async (projectId: string, amount: string): Promise<string> => {
    setIsLoading(true);
    setError(null);
    try {
      const contractWithSigner = await getSigner();

      const tx = await (contractWithSigner as any).donateDefaultToken(projectId, {
        value: ethers.parseEther(amount),
      });
      await tx.wait();
      setIsLoading(false);
      return tx.hash;
    } catch (e: unknown) {
      handleError(e, "Donation failed");
      throw e;
    }
  },
  [getSigner, handleError]
);

  // 代币捐赠
  const donateToken = useCallback(
    async (projectId: string, token: string, amount: string): Promise<string> => {
      setIsLoading(true);
      setError(null);
      try {
        const contractWithSigner = await getSigner();
        const tx = await (contractWithSigner as any).donateToken(
          projectId,
          token,
          ethers.parseUnits(amount, 18) // 假设代币有18位小数
        );
        await tx.wait();
        setIsLoading(false);
        return tx.hash;
      } catch (e: unknown) {
        handleError(e, "代币捐赠失败");
        throw e;
      }
    },
    [getSigner, handleError]
  );

  // 更新项目状态
  const updateProject = useCallback(
    async (projectId: string, isActive: boolean): Promise<string> => {
      setIsLoading(true);
      setError(null);
      try {
        const contractWithSigner = await getSigner();
        const tx = await (contractWithSigner as any).updateProject(
          projectId,
          isActive
        );
        await tx.wait();
        setIsLoading(false);
        return tx.hash;
      } catch (e: unknown) {
        handleError(e, "更新项目状态失败");
        throw e;
      }
    },
    [getSigner, handleError]
  );

  // 更新项目受益人
  const updateProjectBeneficiary = useCallback(
    async (projectId: string, newBeneficiary: string): Promise<string> => {
      setIsLoading(true);
      setError(null);
      try {
        const contractWithSigner = await getSigner();
        const tx = await (contractWithSigner as any).updateProjectBeneficiary(
          projectId,
          newBeneficiary
        );
        await tx.wait();
        setIsLoading(false);
        return tx.hash;
      } catch (e: unknown) {
        handleError(e, "更新项目受益人失败");
        throw e;
      }
    },
    [getSigner, handleError]
  );

  // 提取项目资金
  const withdrawProjectFundsDefaultToken = useCallback(
    async (projectId: string, amount: string): Promise<string> => {
      setIsLoading(true);
      setError(null);
      try {
        const contractWithSigner = await getSigner();
        const tx = await (contractWithSigner as any).withdrawProjectFundsDefaultToken(
          projectId,
          ethers.parseEther(amount)
        );
        await tx.wait();
        setIsLoading(false);
        return tx.hash;
      } catch (e: unknown) {
        handleError(e, "提取项目ETH资金失败");
        throw e;
      }
    },
    [getSigner, handleError]
  );

  // 提取项目代币资金
  const withdrawProjectFundsToken = useCallback(
    async (projectId: string, token: string, amount: string): Promise<string> => {
      setIsLoading(true);
      setError(null);
      try {
        const contractWithSigner = await getSigner();
        const tx = await (contractWithSigner as any).withdrawProjectFundsToken(
          projectId,
          token,
          ethers.parseUnits(amount, 18) // 假设代币有18位小数
        );
        await tx.wait();
        setIsLoading(false);
        return tx.hash;
      } catch (e: unknown) {
        handleError(e, "提取项目代币资金失败");
        throw e;
      }
    },
    [getSigner, handleError]
  );

  // 提取彩票ETH资金
  const withdrawLotteryFundsDefaultToken = useCallback(
    async (amount: string): Promise<string> => {
      setIsLoading(true);
      setError(null);
      try {
        const contractWithSigner = await getSigner();
        const tx = await (contractWithSigner as any).withdrawLotteryFundsDefaultToken(
          ethers.parseEther(amount)
        );
        await tx.wait();
        setIsLoading(false);
        return tx.hash;
      } catch (e: unknown) {
        handleError(e, "提取彩票ETH资金失败");
        throw e;
      }
    },
    [getSigner, handleError]
  );

  // 提取彩票代币资金
  const withdrawLotteryFundsToken = useCallback(
    async (token: string, amount: string): Promise<string> => {
      setIsLoading(true);
      setError(null);
      try {
        const contractWithSigner = await getSigner();
        const tx = await (contractWithSigner as any).withdrawLotteryFundsToken(
          token,
          ethers.parseUnits(amount, 18) // 假设代币有18位小数
        );
        await tx.wait();
        setIsLoading(false);
        return tx.hash;
      } catch (e: unknown) {
        handleError(e, "提取彩票代币资金失败");
        throw e;
      }
    },
    [getSigner, handleError]
  );

  // 设置彩票管理员
  const setLotteryManager = useCallback(
    async (lotteryManager: string): Promise<string> => {
      setIsLoading(true);
      setError(null);
      try {
        const contractWithSigner = await getSigner();
        const tx = await (contractWithSigner as any).setLotteryManager(
          lotteryManager
        );
        await tx.wait();
        setIsLoading(false);
        return tx.hash;
      } catch (e: unknown) {
        handleError(e, "设置彩票管理员失败");
        throw e;
      }
    },
    [getSigner, handleError]
  );

  // 添加允许的代币
  const addAllowedToken = useCallback(
    async (token: string): Promise<string> => {
      setIsLoading(true);
      setError(null);
      try {
        const contractWithSigner = await getSigner();
        const tx = await (contractWithSigner as any).addAllowedToken(token);
        await tx.wait();
        setIsLoading(false);
        return tx.hash;
      } catch (e: unknown) {
        handleError(e, "添加允许的代币失败");
        throw e;
      }
    },
    [getSigner, handleError]
  );

  // 移除允许的代币
  const removeAllowedToken = useCallback(
    async (token: string): Promise<string> => {
      setIsLoading(true);
      setError(null);
      try {
        const contractWithSigner = await getSigner();
        const tx = await (contractWithSigner as any).removeAllowedToken(token);
        await tx.wait();
        setIsLoading(false);
        return tx.hash;
      } catch (e: unknown) {
        handleError(e, "移除允许的代币失败");
        throw e;
      }
    },
    [getSigner, handleError]
  );

  // 紧急提取ETH
  const emergencyWithdrawDefaultToken = useCallback(
    async (recipient: string, amount: string): Promise<string> => {
      setIsLoading(true);
      setError(null);
      try {
        const contractWithSigner = await getSigner();
        const tx = await (contractWithSigner as any).emergencyWithdrawDefaultToken(
          recipient,
          ethers.parseEther(amount)
        );
        await tx.wait();
        setIsLoading(false);
        return tx.hash;
      } catch (e: unknown) {
        handleError(e, "紧急提取默认代币失败");
        throw e;
      }
    },
    [getSigner, handleError]
  );

  // 紧急提取代币
  const emergencyWithdrawToken = useCallback(
    async (token: string, recipient: string, amount: string): Promise<string> => {
      setIsLoading(true);
      setError(null);
      try {
        const contractWithSigner = await getSigner();
        const tx = await (contractWithSigner as any).emergencyWithdrawToken(
          token,
          recipient,
          ethers.parseUnits(amount, 18) // 假设代币有18位小数
        );
        await tx.wait();
        setIsLoading(false);
        return tx.hash;
      } catch (e: unknown) {
        handleError(e, "紧急提取代币失败");
        throw e;
      }
    },
    [getSigner, handleError]
  );

  // 转移所有权
  const transferOwnership = useCallback(
    async (newOwner: string): Promise<string> => {
      setIsLoading(true);
      setError(null);
      try {
        const contractWithSigner = await getSigner();
        const tx = await (contractWithSigner as any).transferOwnership(
          newOwner
        );
        await tx.wait();
        setIsLoading(false);
        return tx.hash;
      } catch (e: unknown) {
        handleError(e, "转移所有权失败");
        throw e;
      }
    },
    [getSigner, handleError]
  );

  // 放弃所有权
  const renounceOwnership = useCallback(async (): Promise<string> => {
    setIsLoading(true);
    setError(null);
    try {
      const contractWithSigner = await getSigner();
      const tx = await (contractWithSigner as any).renounceOwnership();
      await tx.wait();
      setIsLoading(false);
      return tx.hash;
    } catch (e: unknown) {
      handleError(e, "放弃所有权失败");
      throw e;
    }
  }, [getSigner, handleError]);

  return {
    // 状态
    isLoading,
    error,
    contractAddress: contractInstance?.target,

    // 只读函数 - 基础信息
    getVersion,
    getBasisPointsDivisor,
    getTeamFeeBasisPoints,
    getLotteryPoolBasisPoints,
    getProjectDonationBasisPoints,
    getOwner,
    getLotteryManager,
    getDonationCount,
    getTotalTeamFunds,
    getTotalLotteryFunds,
    getTotalProjectFunds,
    getWithdrawnTeamFunds,
    getWithdrawnLotteryFunds,

    // 只读函数 - 项目相关
    getProject,
    getProjectFundStats,
    getProjectETHFundStats,
    getProjectTokenFundStats,
    getProjectTokenFunds,
    getDonation,
    getOwnerProjects,

    // 只读函数 - 代币相关
    donateToken,
    getDefaultTokenAddress,
    isTokenAllowed,
    getAllowedTokens,
    getTokenPool,
    getWithdrawnLotteryFundsToken,
    getWithdrawnTeamFundsToken,

    // 写入函数 - 项目管理
    createProject,
    updateProject,
    updateProjectBeneficiary,

    // 写入函数 - 捐赠
    donate,

    // 写入函数 - 资金提取
    withdrawProjectFundsDefaultToken,
    withdrawProjectFundsToken,
    withdrawLotteryFundsDefaultToken,
    withdrawLotteryFundsToken,

    // 写入函数 - 代币管理
    addAllowedToken,
    removeAllowedToken,

    // 写入函数 - 管理功能
    setLotteryManager,
    emergencyWithdrawDefaultToken,
    emergencyWithdrawToken,
    transferOwnership,
    renounceOwnership,
  };
};
