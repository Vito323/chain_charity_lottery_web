'use client';
import { useState, useEffect, useCallback } from 'react';

interface TokenIcons {
  [key: string]: string;
}

export const useTokenIcons = () => {
  const [tokenIcons, setTokenIcons] = useState<TokenIcons>({});
  const [loading, setLoading] = useState(false);

  // 获取代币图标的函数
  const getTokenIcon = useCallback(async (symbol: string): Promise<string> => {
    try {
      // 使用CoinGecko API获取代币图标
      const response = await fetch(
        `https://api.coingecko.com/api/v3/coins/${symbol.toLowerCase()}`
      );
      if (response.ok) {
        const data = await response.json();
        return data.image?.small || data.image?.thumb || '';
      }
    } catch (error) {
      console.log(`Failed to fetch icon for ${symbol}:`, error);
    }
    
    // 如果API失败，使用备用图标URL
    const fallbackIcons: TokenIcons = {
      ETH: "https://cryptologos.cc/logos/ethereum-eth-logo.png",
      USDC: "https://cryptologos.cc/logos/usd-coin-usdc-logo.png",
      USDT: "https://cryptologos.cc/logos/tether-usdt-logo.png",
      DAI: "https://cryptologos.cc/logos/multi-collateral-dai-dai-logo.png",
      AAVE: "https://cryptologos.cc/logos/aave-aave-logo.png",
      LINK: "https://cryptologos.cc/logos/chainlink-link-logo.png",
      UNI: "https://cryptologos.cc/logos/uniswap-uni-logo.png",
      WBTC: "https://cryptologos.cc/logos/wrapped-bitcoin-wbtc-logo.png",
    };
    
    return fallbackIcons[symbol] || `https://cryptologos.cc/logos/${symbol.toLowerCase()}-${symbol.toLowerCase()}-logo.png`;
  }, []);

  // 批量获取代币图标
  const fetchTokenIcons = useCallback(async () => {
    setLoading(true);
    const symbols = ["ETH", "USDC", "USDT", "DAI", "AAVE", "LINK", "UNI", "WBTC"];
    const iconPromises = symbols.map(async (symbol) => {
      const iconUrl = await getTokenIcon(symbol);
      return { symbol, iconUrl };
    });
    
    const results = await Promise.all(iconPromises);
    const icons: TokenIcons = {};
    results.forEach(({ symbol, iconUrl }) => {
      if (iconUrl) {
        icons[symbol] = iconUrl;
      }
    });
    
    setTokenIcons(icons);
    setLoading(false);
  }, [getTokenIcon]);

  // 组件加载时获取图标
  useEffect(() => {
    fetchTokenIcons();
  }, [fetchTokenIcons]);

  return {
    tokenIcons,
    loading,
    refetch: fetchTokenIcons
  };
};
