import { useState, useEffect, useCallback } from 'react';

interface TokenPrices {
  [key: string]: number;
}

export const useTokenPrices = () => {
  const [tokenPrices, setTokenPrices] = useState<TokenPrices>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTokenPrices = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const symbols = [
        "ethereum",
        "usd-coin",
        "tether",
        "dai",
        "aave",
        "chainlink",
        "uniswap",
        "wrapped-bitcoin",
      ];
      
      const response = await fetch(
        `https://api.coingecko.com/api/v3/simple/price?ids=${symbols.join(
          ","
        )}&vs_currencies=usd`
      );

      if (response.ok) {
        const data = await response.json();
        const prices: TokenPrices = {};

        const idToSymbol: Record<string, string> = {
          ethereum: "ETH",
          "usd-coin": "USDC",
          tether: "USDT",
          dai: "DAI",
          aave: "AAVE",
          chainlink: "LINK",
          uniswap: "UNI",
          "wrapped-bitcoin": "WBTC",
        };

        Object.entries(data).forEach(([id, priceData]) => {
          const symbol = idToSymbol[id];
          if (
            symbol &&
            priceData &&
            typeof priceData === "object" &&
            "usd" in priceData
          ) {
            prices[symbol] = (priceData as { usd: number }).usd;
          }
        });

        setTokenPrices(prices);
      } else {
        throw new Error('Failed to fetch token prices');
      }
    } catch (err) {
      console.log("Failed to fetch token prices:", err);
      setError(err instanceof Error ? err.message : 'Unknown error');
      
      // 设置默认价格作为备用
      setTokenPrices({
        ETH: 2000,
        USDC: 1,
        USDT: 1,
        DAI: 1,
        AAVE: 100,
        LINK: 10,
        UNI: 5,
        WBTC: 30000,
      });
    } finally {
      setLoading(false);
    }
  }, []);

  // 组件加载时获取价格
  useEffect(() => {
    fetchTokenPrices();
  }, [fetchTokenPrices]);

  // 定期更新价格（每1分钟）
  useEffect(() => {
    const interval = setInterval(() => {
      fetchTokenPrices();
    }, 1 * 60 * 1000);

    return () => clearInterval(interval);
  }, [fetchTokenPrices]);

  const calculateUSDValue = useCallback((amount: string, tokenSymbol: string): string => {
    if (!amount || !tokenSymbol) return "0.00";

    const tokenAmount = parseFloat(amount);
    if (isNaN(tokenAmount) || tokenAmount <= 0) return "0.00";

    const tokenPrice = tokenPrices[tokenSymbol];
    if (!tokenPrice) return "0.00";

    const usdValue = tokenAmount * tokenPrice;
    return usdValue.toFixed(2);
  }, [tokenPrices]);

  return {
    tokenPrices,
    loading,
    error,
    calculateUSDValue,
    refetch: fetchTokenPrices
  };
};
