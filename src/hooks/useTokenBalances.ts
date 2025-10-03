import { useState, useEffect } from 'react';
import { useAccount, useBalance, useReadContract, useChainId } from 'wagmi';
import { mainnet, polygon } from 'wagmi/chains';

// 代币合约地址配置
const TOKEN_ADDRESSES = {
  [mainnet.id]: {
    USDC: "0xA0b86a33E6441c8C06DDD4e4B4a4C0e3B4F4B4B4",
    USDT: "0xdAC17F958D2ee523a2206206994597C13D831ec7",
    DAI: "0x6B175474E89094C44Da98b954EedeAC495271d0F",
    AAVE: "0x7Fc66500c84A76Ad7e9c93437bFc5Ac33E2DDaE9",
    LINK: "0x514910771AF9Ca656af840dff83E8264EcF986CA",
    UNI: "0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984",
    WBTC: "0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599",
  },
  [polygon.id]: {
    USDC: "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174",
    USDT: "0xc2132D05D31c914a87C6611C10748AEb04B58e8F",
    DAI: "0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063",
    AAVE: "0xD6DF932A45C0f255f85145f286eA0b292B21C90B",
    LINK: "0x53E0bca35eC356BD5ddDFebbD1Fc0fD03FaBad39",
    UNI: "0xb33EaAd8d922B1083446DC23f610c2567fB5180f",
    WBTC: "0x1BFD67037B42Cf73acF2047067bd4F2C47D9BfD6",
  },
};

// ERC20 ABI (简化版，只包含balanceOf)
const ERC20_ABI = [
  {
    constant: true,
    inputs: [{ name: "_owner", type: "address" }],
    name: "balanceOf",
    outputs: [{ name: "balance", type: "uint256" }],
    type: "function",
  },
  {
    constant: true,
    inputs: [],
    name: "decimals",
    outputs: [{ name: "", type: "uint8" }],
    type: "function",
  },
  {
    constant: true,
    inputs: [],
    name: "symbol",
    outputs: [{ name: "", type: "string" }],
    type: "function",
  },
] as const;

interface TokenBalances {
  [key: string]: string;
}

export const useTokenBalances = () => {
  const account = useAccount();
  const chainId = useChainId();
  const [tokenBalances, setTokenBalances] = useState<TokenBalances>({});

  // 获取ETH余额
  const { data: ethBalance } = useBalance({
    address: account.address,
    chainId: chainId,
  });

  // 为每个代币创建独立的hook调用
  const usdcBalance = useReadContract({
    address: TOKEN_ADDRESSES[chainId as keyof typeof TOKEN_ADDRESSES]
      ?.USDC as `0x${string}`,
    abi: ERC20_ABI,
    functionName: "balanceOf",
    args: account.address ? [account.address] : undefined,
    chainId: chainId,
    query: {
      enabled:
        !!account.address &&
        !!TOKEN_ADDRESSES[chainId as keyof typeof TOKEN_ADDRESSES]?.USDC,
      refetchInterval: 10000,
    },
  });

  const usdtBalance = useReadContract({
    address: TOKEN_ADDRESSES[chainId as keyof typeof TOKEN_ADDRESSES]
      ?.USDT as `0x${string}`,
    abi: ERC20_ABI,
    functionName: "balanceOf",
    args: account.address ? [account.address] : undefined,
    chainId: chainId,
    query: {
      enabled:
        !!account.address &&
        !!TOKEN_ADDRESSES[chainId as keyof typeof TOKEN_ADDRESSES]?.USDT,
      refetchInterval: 10000,
    },
  });

  const daiBalance = useReadContract({
    address: TOKEN_ADDRESSES[chainId as keyof typeof TOKEN_ADDRESSES]
      ?.DAI as `0x${string}`,
    abi: ERC20_ABI,
    functionName: "balanceOf",
    args: account.address ? [account.address] : undefined,
    chainId: chainId,
    query: {
      enabled:
        !!account.address &&
        !!TOKEN_ADDRESSES[chainId as keyof typeof TOKEN_ADDRESSES]?.DAI,
      refetchInterval: 10000,
    },
  });

  // 更新代币余额状态
  useEffect(() => {
    if (account.isConnected && ethBalance) {
      const balances: TokenBalances = {};

      // ETH余额
      balances.ETH = (Number(ethBalance.value) / Math.pow(10, 18)).toFixed(6);

      // 代币余额
      if (usdcBalance.data) {
        const balance = Number(usdcBalance.data) / Math.pow(10, 6); // USDC是6位小数
        balances.USDC = balance.toFixed(4);
      } else {
        balances.USDC = "0.0000";
      }

      if (usdtBalance.data) {
        const balance = Number(usdtBalance.data) / Math.pow(10, 6); // USDT是6位小数
        balances.USDT = balance.toFixed(4);
      } else {
        balances.USDT = "0.0000";
      }

      if (daiBalance.data) {
        const balance = Number(daiBalance.data) / Math.pow(10, 18); // DAI是18位小数
        balances.DAI = balance.toFixed(4);
      } else {
        balances.DAI = "0.0000";
      }

      setTokenBalances(balances);
    } else {
      setTokenBalances({});
    }
  }, [
    account.isConnected,
    ethBalance,
    usdcBalance.data,
    usdtBalance.data,
    daiBalance.data,
  ]);

  return {
    tokenBalances,
    isConnected: account.isConnected,
    chainId
  };
};
