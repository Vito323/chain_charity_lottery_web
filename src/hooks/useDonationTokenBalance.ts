'use client';
import { useMemo } from 'react';
import { useAccount, useReadContract, useChainId } from 'wagmi';
import { mainnet, polygon, polygonAmoy, bsc } from 'wagmi/chains';
import BigNumber from 'bignumber.js';

// USDT合约地址配置
const USDT_ADDRESSES: Record<number, `0x${string}`> = {
  [mainnet.id]: "0xdAC17F958D2ee523a2206206994597C13D831ec7",
  [polygon.id]: "0xc2132D05D31c914a87C6611C10748AEb04B58e8F",
  [polygonAmoy.id]: "0x2011a15d6FA0b8E4a4c8c9c4f4e4e4e4e4e4e4e4",
  [bsc.id]: "0x55d398326f99059fF775485246999027B3197955",
  [31337]: "0x0000000000000000000000000000000000000000",
};

// ERC20 ABI (仅包含balanceOf)
const ERC20_ABI = [
  {
    constant: true,
    inputs: [{ name: "_owner", type: "address" }],
    name: "balanceOf",
    outputs: [{ name: "balance", type: "uint256" }],
    type: "function",
  },
] as const;

// USDT小数位数
const USDT_DECIMALS = 18;

interface BalanceOptions {
  tokenAddress?: `0x${string}`;
  decimals?: number;
}

export const useDonationTokenBalance = (options?: BalanceOptions) => {
  const account = useAccount();
  const chainId = useChainId();

  // 获取token合约地址：优先使用外部传入的地址，否则使用默认USDT地址
  const tokenAddress = useMemo(() => {
    if (options?.tokenAddress) {
      return options.tokenAddress;
    }
    return USDT_ADDRESSES[chainId] || USDT_ADDRESSES[polygon.id];
  }, [chainId, options?.tokenAddress]);

  // 获取小数位数：优先使用外部传入的decimals，否则使用默认USDT的6位
  const decimals = useMemo(() => {
    return options?.decimals ?? USDT_DECIMALS;
  }, [options?.decimals]);

  // 获取token余额
  const { data: tokenBalanceData, isLoading, isError } = useReadContract({
    address: tokenAddress,
    abi: ERC20_ABI,
    functionName: "balanceOf",
    args: account.address ? [account.address] : undefined,
    chainId: chainId,
    query: {
      enabled: account.isConnected && !!account.address && !!tokenAddress && tokenAddress !== "0x0000000000000000000000000000000000000000",
      refetchInterval: 10000,
    },
  });

  // 使用BigNumber处理余额并格式化
  const formattedBalance = useMemo(() => {
    if (!account.isConnected || !tokenBalanceData) {
      return `0.${'0'.repeat(decimals)}`;
    }

    try {
      // 处理 bigint 类型，转换为字符串
      const balanceStr = typeof tokenBalanceData === 'bigint' 
        ? tokenBalanceData.toString() 
        : String(tokenBalanceData);
      
      const balanceBN = new BigNumber(balanceStr);
      const decimalsBN = new BigNumber(10).pow(decimals);
      const formatted = balanceBN.dividedBy(decimalsBN);
      return formatted.toFixed(decimals);
    } catch (error) {
      console.error('Error formatting token balance:', error);
      return `0.${'0'.repeat(decimals)}`;
    }
  }, [tokenBalanceData, account.isConnected, decimals]);

  return {
    balance: formattedBalance,
    address: tokenAddress,
    isLoading,
    isError,
    isConnected: account.isConnected,
  };
};

