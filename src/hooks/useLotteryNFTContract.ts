"use client";

import { ethers } from "ethers";
import { useState, useCallback, useMemo } from "react";
// 导入 ABI 文件
import LotteryNFTArtifact from "../artifacts/lottery_nft.sol/LotteryNFT.json";

// 从 ABI 文件中获取合约地址和 ABI
const contractABI = LotteryNFTArtifact.abi;

export const useLotteryNFTContract = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 初始化合约实例的辅助函数 (使用 useMemo 避免重复创建)
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
      const contractAddress = process.env.NEXT_PUBLIC_LOTTERY_NFT_CONTRACT_ADDRESS!;

      console.log(`使用 LotteryNFT 合约地址: ${contractAddress} (链ID: ${chainId})`);

      // 创建只读合约实例
      return new ethers.Contract(contractAddress, contractABI, provider);
    } catch (e) {
      console.error("初始化 LotteryNFT 合约失败:", e);
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

  // ==================== 写入函数 (Write Functions) ====================

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

      const provider = new ethers.BrowserProvider(window.ethereum);
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
    []
  );

  // Mint NFT
  // 根据 ABI 定义: mint(bytes32 _dnaHash, string metadataURI, bytes signature, uint256 amount, uint256 nonce, uint256 deadline)
  const mint = useCallback(
    async (
      dnaHash: string,
      metadataURI: string,
      signature: string,
      amount: string,
      nonce: number,
      deadline: number,
      tokenDecimals: number = 18
    ): Promise<string> => {
      setIsLoading(true);
      setError(null);
      try {
        const contractWithSigner = await getSigner();
        const contractAddress = contractInstance?.target;
        
        if (!contractAddress) {
          throw new Error("合约地址未找到");
        }

        // 获取支付代币地址
        const paymentTokenAddress = await contractInstance.paymentToken();
        if (!paymentTokenAddress || paymentTokenAddress === ethers.ZeroAddress) {
          throw new Error("支付代币未设置");
        }

        // 将 amount 转换为 BigNumber
        const amountBN = ethers.parseUnits(amount, tokenDecimals);
        
        // 检查并处理代币授权（在 mint 之前）
        await checkAndApproveToken(
          paymentTokenAddress,
          contractAddress as string,
          amountBN,
          tokenDecimals
        );
        
        // 将 dnaHash 字符串转换为 bytes32
        // 如果传入的是 hex 字符串，直接使用；如果是普通字符串，需要先 keccak256
        let dnaHashBytes32: string;
        if (dnaHash.startsWith("0x") && dnaHash.length === 66) {
          // 已经是 32 字节的 hex 字符串
          dnaHashBytes32 = dnaHash;
        } else {
          // 将字符串转换为 bytes32 (使用 keccak256 hash)
          dnaHashBytes32 = ethers.keccak256(ethers.toUtf8Bytes(dnaHash));
        }
        
        // 将 signature 字符串转换为 bytes
        const signatureBytes = ethers.getBytes(signature);
        
        // 将 nonce 和 deadline 转换为 BigNumber
        const nonceBN = BigInt(nonce);
        const deadlineBN = BigInt(deadline);
        
        // 调用 mint 函数
        const tx = await (contractWithSigner as any).mint(
          dnaHashBytes32,
          metadataURI,
          signatureBytes,
          amountBN,
          nonceBN,
          deadlineBN
        );
        await tx.wait();
        setIsLoading(false);
        return tx.hash;
      } catch (e: unknown) {
        handleError(e, "Mint NFT 失败");
        throw e;
      }
    },
    [getSigner, handleError, contractInstance, checkAndApproveToken]
  );

  return {
    // 状态
    isLoading,
    error,
    contractAddress: contractInstance?.target,

    // 写入函数 - Mint
    mint,
  };
};

