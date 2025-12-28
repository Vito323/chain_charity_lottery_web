"use client";

import { ethers } from "ethers";
import { useState, useCallback, useMemo } from "react";
// 导入 ABI 文件，确保路径正确
import MasterContractArtifact from "../artifacts/master_contract.sol/MasterContract.json";

// 从 ABI 文件中获取合约地址和 ABI
const contractABI = MasterContractArtifact.abi;

export const useMasterContract = () => {
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
      const contractAddress = process.env.NEXT_PUBLIC_MASTER_CONTRACT_ADDRESS!;

      console.log(`使用合约地址: ${contractAddress} (链ID: ${chainId})`);

      // 创建只读合约实例
      return new ethers.Contract(contractAddress, contractABI, provider);
    } catch (e) {
      console.error("初始化合约失败:", e);
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

  const getEcosystemToken = useCallback(async (): Promise<string> => {
    if (!contractInstance) return "";
    try {
      const result = await contractInstance.ecosystemToken();
      return result;
    } catch (e: any) {
      handleError(e, "获取生态系统代币失败");
      return "";
    }
  }, [contractInstance, handleError]);

  const getDonationToken = useCallback(async (): Promise<string> => {
    if (!contractInstance) return "";
    try {
      const result = await contractInstance.donationToken();
      return result;
    } catch (e: any) {
      handleError(e, "获取捐赠代币失败");
      return "";
    }
  }, [contractInstance, handleError]);

  const getDonationTokenDecimals = useCallback(async (): Promise<number> => {
    if (!contractInstance) return 0;
    try {
      const result = await contractInstance.donationTokenDecimals();
      return Number(result);
    } catch (e: any) {
      handleError(e, "获取捐赠代币小数位失败");
      return 0;
    }
  }, [contractInstance, handleError]);

  const getEcosystemTokenDecimals = useCallback(async (): Promise<number> => {
    console.log("getEcosystemTokenDecimals11122", contractInstance);
    console.log(!contractInstance);
    if (!contractInstance) return 0;
    try {
      const result = await contractInstance.ecosystemTokenDecimals();
      console.log("getEcosystemTokenDecimals11122", result);
      return Number(result);
    } catch (e: any) {
      console.log("getEcosystemTokenDecimals11122", e);
      handleError(e, "获取生态系统代币小数位失败");
      return 0;
    }
  }, [contractInstance, handleError]);

  // 代币捐赠
  const calculateExchangeAmount = useCallback(
    async (
      amount: string,
      tokenDecimals: number
    ): Promise<string> => {
      setIsLoading(true);
      setError(null);
      try {
        if (!contractInstance) throw new Error("合约未初始化");
        const result = await contractInstance.calculateExchangeAmount(
          ethers.parseUnits(amount, tokenDecimals)
        );
        return result;
      } catch (e: unknown) {
        handleError(e, "代币捐赠失败");
        throw e;
      }
    },
    [contractInstance, handleError]
  );

  return {
    // 状态
    isLoading,
    error,
    contractAddress: contractInstance?.target,

    // 只读函数 - 基础信息
    getVersion,
    getEcosystemToken,
    getDonationToken,
    getEcosystemTokenDecimals,
    getDonationTokenDecimals,

    // 写入函数 - 捐赠
    calculateExchangeAmount,
  };
};
