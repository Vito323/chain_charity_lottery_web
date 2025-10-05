'use client';
import { useState, useEffect, useCallback } from 'react';
import { useAccount, useChainId } from 'wagmi';
import { mainnet, polygon, polygonAmoy } from 'wagmi/chains';

// 代币信息接口
interface TokenInfo {
  address: string;
  symbol: string;
  name: string;
  decimals: number;
  balance: string;
  icon: string;
  isNative: boolean; // 是否为原生代币（ETH/MATIC等）
}

// 各链的主货币配置
const NATIVE_TOKENS = {
  [mainnet.id]: {
    symbol: "ETH",
    name: "Ethereum",
    icon: "fa-ethereum",
    address: "0x0000000000000000000000000000000000000000", // ETH使用零地址表示
  },
  [polygon.id]: {
    symbol: "POL",
    name: "Polygon",
    icon: "fa-polygon",
    address: "0x0000000000000000000000000000000000000000", // MATIC使用零地址表示
  },
};

// 代币图标映射
const TOKEN_ICONS: Record<string, string> = {
  USDC: "fa-circle",
  USDT: "fa-circle",
  DAI: "fa-circle",
  AAVE: "fa-circle",
  LINK: "fa-circle",
  UNI: "fa-circle",
  WBTC: "fa-circle",
  MATIC: "fa-polygon",
  ETH: "fa-ethereum",
};

export const useTokenList = (
  whiteTokenList: string[],
  allowedTokens: string[],
  tokenBalances: Record<string, string>
) => {
  const account = useAccount();
  const chainId = useChainId();
  const [tokenList, setTokenList] = useState<TokenInfo[]>([]);
  const [loading, setLoading] = useState(false);

  // 构建代币列表
  const buildTokenList = useCallback(() => {
    if (!account.isConnected || !chainId) {
      setTokenList([]);
      return;
    }

    setLoading(true);
    try {
      const tokens: TokenInfo[] = [];
      
      // 1. 添加原生代币（始终在第一位）
      const nativeToken = NATIVE_TOKENS[chainId as keyof typeof NATIVE_TOKENS];
      if (nativeToken) {
        const nativeBalanceValue = tokenBalances[nativeToken.symbol] || "0.0000";
        tokens.push({
          address: nativeToken.address,
          symbol: nativeToken.symbol,
          name: nativeToken.name,
          decimals: 18,
          balance: nativeBalanceValue,
          icon: nativeToken.icon,
          isNative: true,
        });
      }

      // 2. 处理ERC20代币 - 使用现有的tokenBalances数据
      // 基于现有的tokenBalances构建代币列表
      const commonTokens = ['USDC', 'USDT', 'DAI', 'AAVE', 'LINK', 'UNI', 'WBTC'];
      
      commonTokens.forEach(symbol => {
        const balance = tokenBalances[symbol];
        if (balance !== undefined) {
          // 这里我们使用一个简化的方法，假设这些代币在允许列表中
          // 在实际应用中，你可能需要更复杂的地址匹配逻辑
          tokens.push({
            address: `0x${symbol}`, // 简化地址，实际应该从合约获取
            symbol,
            name: getTokenName(symbol),
            decimals: getTokenDecimals(symbol),
            balance,
            icon: TOKEN_ICONS[symbol] || "fa-circle",
            isNative: false,
          });
        }
      });

      setTokenList(tokens);
    } catch (error) {
      console.error("构建代币列表失败:", error);
    } finally {
      setLoading(false);
    }
  }, [account.isConnected, chainId, tokenBalances]);

  // 当依赖项变化时重新构建列表
  useEffect(() => {
    buildTokenList();
  }, [buildTokenList]);

  return {
    tokenList,
    loading,
    refetch: buildTokenList,
  };
};

// 辅助函数
const getTokenName = (symbol: string): string => {
  const names: Record<string, string> = {
    USDC: "USD Coin",
    USDT: "Tether",
    DAI: "Dai Stablecoin",
    AAVE: "Aave",
    LINK: "ChainLink Token",
    UNI: "Uniswap",
    WBTC: "Wrapped Bitcoin",
  };
  return names[symbol] || symbol;
};

const getTokenDecimals = (symbol: string): number => {
  const decimals: Record<string, number> = {
    USDC: 6,
    USDT: 6,
    DAI: 18,
    AAVE: 18,
    LINK: 18,
    UNI: 18,
    WBTC: 8,
  };
  return decimals[symbol] || 18;
};
