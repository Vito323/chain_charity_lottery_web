"use client";
import React, { useState, useEffect, useCallback } from "react";
import { useAccount } from "wagmi";
import { useFundPoolManager } from "@/hooks/useFundPoolManager";
import { useWalletNFTs } from "@/hooks/useWalletNFTs";
import "./style.css";

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

const LotteryContent: React.FC = () => {
  const { isConnected } = useAccount();
  const {
    getTotalLotteryFunds,
  } = useFundPoolManager();

  const {
    nfts,
    loading: nftsLoading,
    error: nftsError,
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
  const [, setIsDrawComplete] = useState(false);

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

  // 配置开奖时间（暂时未使用）
  // const handleDrawTimeChange = (newTime: string) => {
  //   setLotteryConfig((prev) => ({
  //     ...prev,
  //     drawTime: newTime,
  //   }));
  // };

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
    <div className="lottery-page">
      <div className="container lottery-container">
        <div className="countdown-section">
          <h2 className="countdown-title">Next Draw In</h2>
          <div className="countdown-grid">
            <div className="countdown-item">
              <div className="countdown-number">
                <span>{formatTime(countdown.days)}</span>
              </div>
              <p className="countdown-label">Days</p>
            </div>
            <div className="countdown-item">
              <div className="countdown-number">
                <span>{formatTime(countdown.hours)}</span>
              </div>
              <p className="countdown-label">Hours</p>
            </div>
            <div className="countdown-item">
              <div className="countdown-number">
                <span>{formatTime(countdown.minutes)}</span>
              </div>
              <p className="countdown-label">Minutes</p>
            </div>
            <div className="countdown-item">
              <div className="countdown-number">
                <span>{formatTime(countdown.seconds)}</span>
              </div>
              <p className="countdown-label">Seconds</p>
            </div>
          </div>
          <div className="jackpot-section">
            <h1 className="jackpot-title">Current Jackpot</h1>
            <p className="jackpot-amount">
              {isConnected ? `${formatETH(lotteryConfig.prizePool)} ETH` : "Connect Wallet"}
            </p>
          </div>
        </div>

        <div className="nft-tickets-section">
          <h2 className="nft-tickets-title">Your NFT Tickets</h2>
          
          {!isConnected ? (
            <div className="empty-state">
              <p className="empty-text">Please connect your wallet to view your lottery tickets</p>
              <p className="empty-subtitle">Connect your wallet to participate in the lottery</p>
            </div>
          ) : nftsLoading ? (
            <div className="loading-state">
              <p className="loading-text">Loading your tickets...</p>
              <div className="loading-spinner"></div>
            </div>
          ) : nftsError ? (
            <div className="error-state">
              <p className="error-text">Error loading tickets: {nftsError}</p>
            </div>
          ) : lotteryNFTs.length === 0 ? (
            <div className="empty-state">
              <p className="empty-text">You don&apos;t have any lottery tickets yet</p>
              <p className="empty-subtitle">Purchase tickets to participate in the lottery</p>
            </div>
          ) : (
            <div className="nft-grid">
              {lotteryNFTs.map((nft) => (
                <div key={`${nft.contractAddress}-${nft.tokenId}`} className="nft-card">
                  <div
                    className="nft-image"
                    style={{
                      backgroundImage: nft.image 
                        ? `url("${nft.image}")` 
                        : 'url("/images/placeholder-all.png")',
                    }}
                  />
                  <div className="nft-content">
                    <p className="nft-title">
                      {nft.name || `Ticket #${nft.tokenId}`}
                    </p>
                    <p className="nft-subtitle">
                      {nft.collectionName || 'Lottery Ticket'}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LotteryContent;
