"use client";
import React, { useState, useEffect, useCallback } from "react";
import { useAccount } from "wagmi";
import { useFundPoolManager } from "@/hooks/useFundPoolManager";
import { useWalletNFTs } from "@/hooks/useWalletNFTs";
import NFTCard from "@/components/nft-card";

interface CountdownTime {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

interface LotteryConfig {
  drawTime: string; // ISO string format
  prizePool: number; // ETH amount
  isActive: boolean;
}

const LotteryPage: React.FC = () => {
  const { address, isConnected } = useAccount();
  const {
    getTotalLotteryFunds,
    isLoading: contractLoading,
    error: contractError,
  } = useFundPoolManager();

  const {
    nfts,
    loading: nftsLoading,
    error: nftsError,
    refresh: refreshNFTs,
  } = useWalletNFTs({ pageSize: 20 });

  // 彩票配置状态
  const [lotteryConfig, setLotteryConfig] = useState<LotteryConfig>({
    drawTime: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 默认7天后开奖
    prizePool: 0,
    isActive: true,
  });

  // 倒计时状态
  const [countdown, setCountdown] = useState<CountdownTime>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  // 是否已开奖
  const [isDrawComplete, setIsDrawComplete] = useState(false);

  // 计算倒计时
  const calculateCountdown = useCallback(() => {
    const now = new Date().getTime();
    const drawTime = new Date(lotteryConfig.drawTime).getTime();
    const difference = drawTime - now;

    if (difference <= 0) {
      setIsDrawComplete(true);
      return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    }

    const days = Math.floor(difference / (1000 * 60 * 60 * 24));
    const hours = Math.floor(
      (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    );
    const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((difference % (1000 * 60)) / 1000);

    return { days, hours, minutes, seconds };
  }, [lotteryConfig.drawTime]);

  // 更新倒计时
  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown(calculateCountdown());
    }, 1000);

    return () => clearInterval(timer);
  }, [calculateCountdown]);

  // 获取奖池金额
  useEffect(() => {
    const fetchPrizePool = async () => {
      try {
        const totalLotteryFunds = await getTotalLotteryFunds();
        setLotteryConfig((prev) => ({
          ...prev,
          prizePool: totalLotteryFunds,
        }));
      } catch (error) {
        console.error("获取奖池金额失败:", error);
      }
    };

    if (isConnected) {
      fetchPrizePool();
    }
  }, [getTotalLotteryFunds, isConnected]);

  // 配置开奖时间
  const handleDrawTimeChange = (newTime: string) => {
    setLotteryConfig((prev) => ({
      ...prev,
      drawTime: newTime,
    }));
  };

  // 过滤彩票NFT（这里可以根据实际需求调整过滤条件）
  const lotteryNFTs = nfts.filter(
    (nft) =>
      nft.collectionName?.toLowerCase().includes("lottery") ||
      nft.collectionName?.toLowerCase().includes("ticket") ||
      nft.name?.toLowerCase().includes("lottery") ||
      nft.name?.toLowerCase().includes("ticket")
  );

  // 格式化时间显示
  const formatTime = (value: number): string => {
    return value.toString().padStart(2, "0");
  };

  // 格式化ETH金额
  const formatETH = (amount: number): string => {
    return amount.toFixed(4);
  };

  return (
    <div className="mx-auto flex max-w-3xl flex-col items-center text-center">
      <div className="w-full rounded-xl bg-background-light p-8 shadow-sm dark:bg-background-dark/50">
        <h2 className="text-2xl font-bold uppercase tracking-widest text-gray-500 dark:text-gray-400">
          Next Draw In
        </h2>
        <div className="my-8 grid grid-cols-4 gap-4">
          <div className="flex flex-col items-center">
            <div className="flex h-24 w-24 items-center justify-center rounded-lg bg-primary/10 text-primary dark:bg-primary/20">
              <p className="text-5xl font-bold">2</p>
            </div>
            <p className="mt-2 text-sm font-medium text-gray-600 dark:text-gray-300">
              Days
            </p>
          </div>
          <div className="flex flex-col items-center">
            <div className="flex h-24 w-24 items-center justify-center rounded-lg bg-primary/10 text-primary dark:bg-primary/20">
              <p className="text-5xl font-bold">14</p>
            </div>
            <p className="mt-2 text-sm font-medium text-gray-600 dark:text-gray-300">
              Hours
            </p>
          </div>
          <div className="flex flex-col items-center">
            <div className="flex h-24 w-24 items-center justify-center rounded-lg bg-primary/10 text-primary dark:bg-primary/20">
              <p className="text-5xl font-bold">32</p>
            </div>
            <p className="mt-2 text-sm font-medium text-gray-600 dark:text-gray-300">
              Minutes
            </p>
          </div>
          <div className="flex flex-col items-center">
            <div className="flex h-24 w-24 items-center justify-center rounded-lg bg-primary/10 text-primary dark:bg-primary/20">
              <p className="text-5xl font-bold">17</p>
            </div>
            <p className="mt-2 text-sm font-medium text-gray-600 dark:text-gray-300">
              Seconds
            </p>
          </div>
        </div>
        <div className="mt-12">
          <h1 className="text-2xl font-bold uppercase tracking-widest text-gray-500 dark:text-gray-400">
            Current Jackpot
          </h1>
          <p className="mt-4 text-7xl font-extrabold text-gray-900 dark:text-white">
            $1,234,567
          </p>
        </div>
      </div>
      <div className="mt-16 w-full">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
          Your NFT Tickets
        </h2>
        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <div className="overflow-hidden rounded-xl border border-gray-200/80 bg-background-light shadow-sm transition-shadow hover:shadow-lg dark:border-gray-800/80 dark:bg-background-dark/50">
            <div
              className="aspect-square w-full bg-cover bg-center"
              style={{
                backgroundImage:
                  'url("https://lh3.googleusercontent.com/aida-public/AB6AXuCjB3n9EJu4numZpJlPxp-PZjKTH1M5DnPfK6suWzS9c4QZLyXPRWLuInKlFdhDq0-Rwi4zvvXTgJNeqBMFmdl4JKi-4umA7x1c33esRPI2a6RvTxY_0M3wECJsdpQFyZ4AIEr2rgtXw1Ccocph6Ua9muVKsuSboz1TeKxfi9XXQyqUHzi64xsT60HWdH1bBNYIDapqh5JZZqIY6bAvebCviiVBHLdUtKx_M3fa3bDZVqhKs98Ki2WrOExfQiZnAFMwJv10Y8fZMpQ")',
              }}
            />
            <div className="p-4 text-left">
              <p className="font-bold text-gray-900 dark:text-white">
                Ticket #12345
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Purchased on 2024-01-15
              </p>
            </div>
          </div>
          <div className="overflow-hidden rounded-xl border border-gray-200/80 bg-background-light shadow-sm transition-shadow hover:shadow-lg dark:border-gray-800/80 dark:bg-background-dark/50">
            <div
              className="aspect-square w-full bg-cover bg-center"
              style={{
                backgroundImage:
                  'url("https://lh3.googleusercontent.com/aida-public/AB6AXuDLX8j6IX6R3aXqBo_o4F8StrzbW_1XfQyBdCTjVaODll0L0cOWSFfUMYf16vGgf9-fTRjDhU0IjB_Fy9iZh0DJwsUQcA0C5Fmf__p4TUyaZEcq5cT9EVt393lLLp0xsm7XFXEakhpEilYZUBPtTyPGJXdVw5cCcGYHEBgdPfcBZbRqGU9V5MgGMeQHcvvxNKtw3H9b7cvns7oMOdE2qGZdBBNQ37E3sMjccKqRwps16JRocpPWZmWnk83i8aMLvn8u8j7WOEhY48g")',
              }}
            />
            <div className="p-4 text-left">
              <p className="font-bold text-gray-900 dark:text-white">
                Ticket #67890
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Purchased on 2024-01-20
              </p>
            </div>
          </div>
          <div className="overflow-hidden rounded-xl border border-gray-200/80 bg-background-light shadow-sm transition-shadow hover:shadow-lg dark:border-gray-800/80 dark:bg-background-dark/50">
            <div
              className="aspect-square w-full bg-cover bg-center"
              style={{
                backgroundImage:
                  'url("https://lh3.googleusercontent.com/aida-public/AB6AXuB1Phek6OpzXL8v6ywpxYI_WVna9jfxw7t35OGPaqwW_ivYZ6F5TD2_XiH6AaNYjXPgFYC3XdwEXUN0IwzZYn7Ee9QcAmTVaEVdFXd6-FZZ4d_2Bal4Ku3vxhYyWy2A4T3f3nmTeqXHcFGdyRd1v2-WJVT-ASqpaE-Ute4WC1NxLBsny8fFDV8ddWg_NlTTopCIMasQJwXDf6oLR9fHcZ528gviF9rNe2ivWS8llAbLZ5zrXSSFs_aoP9TlsJI86gDxl1khda1vKBw")',
              }}
            />
            <div className="p-4 text-left">
              <p className="font-bold text-gray-900 dark:text-white">
                Ticket #11223
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Purchased on 2024-01-25
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LotteryPage;
