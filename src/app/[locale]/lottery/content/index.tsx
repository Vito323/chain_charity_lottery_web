"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { useAccount } from "wagmi";
import { LotteryConfig } from "@/service/lottery";
import { useTranslations } from 'next-intl';
import WithdrawAmountSection from "./lottery-withdraw-amount-section";

interface CountdownTime {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

interface LotteryContentProps {
  lotteryConfig: LotteryConfig;
  loading: boolean;
  onRefresh: () => void;
  onDrawComplete: () => void;
}

const LotteryContent: React.FC<LotteryContentProps> = ({
  lotteryConfig,
  loading,
  onRefresh,
  onDrawComplete,
}) => {
  const { isConnected } = useAccount();
  const t = useTranslations('lottery');
  const tTime = useTranslations('common.time');



  // 倒计时状态
  const [countdown, setCountdown] = useState<CountdownTime>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  // 是否已开奖
  const [isDrawComplete, setIsDrawComplete] = useState(false);
  
  const refreshTimerRef = React.useRef<NodeJS.Timeout | null>(null);
  const hasTriggeredRefreshRef = React.useRef(false);
  const shouldCallDrawCompleteRef = React.useRef(false);
  const drawCompleteTimerStartTimeRef = React.useRef<number | null>(null);
  const nextDrawTimeRef = React.useRef(lotteryConfig.nextDrawTime);
  const onRefreshRef = React.useRef(onRefresh);
  const onDrawCompleteRef = React.useRef(onDrawComplete);
  
  // 更新 ref 中的值
  useEffect(() => {
    nextDrawTimeRef.current = lotteryConfig.nextDrawTime;
  }, [lotteryConfig.nextDrawTime]);
  
  // 更新回调函数的 ref
  useEffect(() => {
    onRefreshRef.current = onRefresh;
  }, [onRefresh]);
  
  useEffect(() => {
    onDrawCompleteRef.current = onDrawComplete;
  }, [onDrawComplete]);

  // 计算倒计时
  const calculateCountdown = useCallback(() => {
    const now = new Date().getTime();
    const drawTime = nextDrawTimeRef.current * 1000;
    const difference = drawTime - now;
    if (difference <= 0) {
      if (!isDrawComplete) {
        setIsDrawComplete(true);
        console.log('倒计时结束，触发开奖完成事件');
        // 调用父组件传入的刷新函数（使用 ref 确保是最新引用）
        if (onRefreshRef.current) {
          console.log('调用 onRefresh 刷新配置');
          onRefreshRef.current();
        }
        if (!hasTriggeredRefreshRef.current) {
          hasTriggeredRefreshRef.current = true;
          shouldCallDrawCompleteRef.current = true;
          drawCompleteTimerStartTimeRef.current = Date.now();
          // 清理之前的定时器（如果存在）
          if (refreshTimerRef.current) {
            clearTimeout(refreshTimerRef.current);
          }
          // 保存定时器 ID，确保即使 ref 被清理也能执行回调
          const timerId = setTimeout(() => {
            // 检查是否应该执行回调（防止被意外清理）
            if (shouldCallDrawCompleteRef.current) {
              shouldCallDrawCompleteRef.current = false;
              drawCompleteTimerStartTimeRef.current = null;
              refreshTimerRef.current = null;
              // 使用 ref 确保调用的是最新的 onDrawComplete
              console.log('倒计时结束 2 秒后，调用 onDrawComplete 刷新历史记录');
              if (onDrawCompleteRef.current) {
                console.log('执行 onDrawComplete 回调');
                onDrawCompleteRef.current();
              } else {
                console.warn('onDrawCompleteRef.current 为空，无法刷新历史记录');
              }
            } else {
              console.log('shouldCallDrawCompleteRef 为 false，跳过回调');
            }
          }, 2000);
          refreshTimerRef.current = timerId;
          console.log('已设置 2 秒后执行 onDrawComplete 的定时器');
        } else {
          console.log('已经触发过刷新，跳过');
        }
      }
      return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    }

    // 如果之前已开奖，但现在有新的倒计时，重置状态
    if (isDrawComplete && difference > 0) {
      setIsDrawComplete(false);
      hasTriggeredRefreshRef.current = false;
      if (refreshTimerRef.current) {
        const timeSinceTimerStart = drawCompleteTimerStartTimeRef.current 
          ? Date.now() - drawCompleteTimerStartTimeRef.current 
          : Infinity;
        if (timeSinceTimerStart >= 2000 || difference > 5000) {
          console.log('检测到新的倒计时，清理之前的定时器', { timeSinceTimerStart, difference });
          clearTimeout(refreshTimerRef.current);
          refreshTimerRef.current = null;
          shouldCallDrawCompleteRef.current = false;
          drawCompleteTimerStartTimeRef.current = null;
        } else {
          console.log('定时器正在等待执行，不清理', { timeSinceTimerStart, difference });
        }
      }
    }

    const days = Math.floor(difference / (1000 * 60 * 60 * 24));
    const hours = Math.floor(
      (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    );
    const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((difference % (1000 * 60)) / 1000);

    return { days, hours, minutes, seconds };
  }, [isDrawComplete]);

  // 更新倒计时 - 只在 nextDrawTime 有值且大于 0 时启动定时器
  useEffect(() => {
    // 如果 nextDrawTime 为 0 或未加载完成，不启动定时器
    if (loading || lotteryConfig.nextDrawTime === 0) {
      setCountdown({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      return;
    }

    // 立即计算一次倒计时
    setCountdown(calculateCountdown());

    // 启动定时器，每秒更新一次
    const timer = setInterval(() => {
      setCountdown(calculateCountdown());
    }, 1000);

    return () => clearInterval(timer);
  }, [loading, lotteryConfig.nextDrawTime, calculateCountdown]);


  // 格式化时间显示
  const formatTime = (value: number): string => {
    return value.toString().padStart(2, "0");
  };

  // 组件卸载时清理定时器
  useEffect(() => {
    return () => {
      if (refreshTimerRef.current) {
        clearTimeout(refreshTimerRef.current);
        refreshTimerRef.current = null;
      }
    };
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: 'easeOut' as const,
      },
    },
  };

  return (
    <section className="relative py-20 pb-0">
      {/* Background Elements */}
      <div className="absolute inset-0 z-0">
        {/* Animated Background Shapes */}
        <motion.div
          className="absolute top-20 left-10 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
        <motion.div
          className="absolute bottom-20 right-10 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.4, 0.7, 0.4],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      </div>

      <motion.div
        className="relative z-10 max-w-7xl mx-auto px-6 md:px-8"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Hero Section */}
        <motion.div variants={itemVariants} className="text-center mb-16">
          <motion.div
            className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full border border-white/15 bg-white/5 backdrop-blur-sm text-white/90 mb-6"
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.6 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-sm">{t('badge')}</span>
          </motion.div>

          <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold text-white mb-6 leading-tight">
            <span>{t('title')} </span>
            <span className="bg-linear-to-r from-purple-300 via-pink-300 to-fuchsia-300 bg-clip-text text-transparent">
              {t('titleHighlight')}
            </span>
          </h1>

          <p className="text-lg md:text-xl text-white/80 max-w-3xl mx-auto leading-relaxed">
            {t('subtitle')}
          </p>
        </motion.div>

        {/* Countdown Section */}
        <motion.div
          variants={itemVariants}
          className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 md:p-12 mb-16"
        >
          <h2 className="text-2xl md:text-3xl font-bold text-white text-center mb-8">
            {t('countdown.title')}
          </h2>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
            {[
              { value: countdown.days, label: tTime('days') },
              { value: countdown.hours, label: tTime('hours') },
              { value: countdown.minutes, label: tTime('minutes') },
              { value: countdown.seconds, label: tTime('seconds') },
            ].map((item, index) => {
              // 当加载中、无数据或倒计时结束时，显示 --：--：-- 格式
              const shouldShowPlaceholder = loading || lotteryConfig.nextDrawTime === 0 || isDrawComplete;
              const displayValue = shouldShowPlaceholder ? '--' : formatTime(item.value);
              
              return (
                <motion.div
                  key={item.label}
                  className="text-center"
                  whileHover={{ scale: 1.05 }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className="w-20 h-20 md:w-24 md:h-24 bg-linear-to-br from-purple-500/20 to-pink-500/20 rounded-2xl flex items-center justify-center mb-3 mx-auto border border-white/10">
                    <span className="text-2xl md:text-3xl font-bold text-white">
                      {displayValue}
                    </span>
                  </div>
                  <p className="text-white/70 text-sm font-medium uppercase tracking-wider">
                    {item.label}
                  </p>
                </motion.div>
              );
            })}
          </div>

          {/* Jackpot Section */}
          {/* <div className="text-center">
            <h3 className="text-xl md:text-2xl font-semibold text-white/80 mb-4">
              {t('jackpot.title')}
            </h3>
            <div className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-2">
              {isConnected ? (
                <span>
                  {formatCurrency(lotteryConfig.nextDrawLotteryTotal, '', 6)} USDT
                </span>
              ) : (
                t('jackpot.connectWallet')
              )}
            </div>
          </div> */}
        </motion.div>

        {/* Withdraw Amount Section */}
        <motion.div variants={itemVariants} className="mb-16">
          <WithdrawAmountSection isDrawComplete={isDrawComplete} />
        </motion.div>

        {/* NFT Tickets Section */}
        {/* <motion.div variants={itemVariants} className="mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-12">
            Your NFT Tickets
          </h2>
          
          {!isConnected ? (
            <motion.div
              className="text-center py-16 bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
            >
              <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">
                {tCommon('actions.connectYourWallet')}
              </h3>
              <p className="text-white/60 mb-6">
                {tCommon('actions.connectYourWalletDescription')}
              </p>
              <motion.button
                className="px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-full hover:from-purple-700 hover:to-pink-700 transition-all duration-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {tCommon('actions.connectWallet')}
              </motion.button>
            </motion.div>
          ) : nftsLoading ? (
            <motion.div
              className="text-center py-16 bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
            >
              <div className="w-8 h-8 border-2 border-white/30 border-t-white rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-white/80">Loading your tickets...</p>
            </motion.div>
          ) : nftsError ? (
            <motion.div
              className="text-center py-16 bg-red-500/10 backdrop-blur-xl border border-red-500/20 rounded-3xl"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
            >
              <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">
                Error Loading Tickets
              </h3>
              <p className="text-white/60">{nftsError}</p>
            </motion.div>
          ) : lotteryNFTs.length === 0 ? (
            <motion.div
              className="text-center py-16 bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
            >
              <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">
                No Lottery Tickets Yet
              </h3>
              <p className="text-white/60 mb-6">
                Purchase tickets to participate in the lottery
              </p>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {lotteryNFTs.map((nft, index) => (
                <motion.div
                  key={`${nft.contractAddress}-${nft.tokenId}`}
                  className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden hover:bg-white/10 transition-all duration-300"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.02, y: -5 }}
                >
                  <div
                    className="w-full h-48 bg-cover bg-center"
                    style={{
                      backgroundImage: nft.image 
                        ? `url("${nft.image}")` 
                        : 'url("/images/placeholder-all.png")',
                    }}
                  />
                  <div className="p-6">
                    <h3 className="text-lg font-semibold text-white mb-2">
                      {nft.name || `Ticket #${nft.tokenId}`}
                    </h3>
                    <p className="text-white/60 text-sm mb-4">
                      {nft.collectionName || 'Lottery Ticket'}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-white/50 uppercase tracking-wider">
                        Ticket ID: {nft.tokenId}
                      </span>
                      <motion.button
                        className="px-4 py-2 bg-white/10 text-white text-sm rounded-lg hover:bg-white/20 transition-all duration-200"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        View Details
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div> */}
      </motion.div>
    </section>
  );
};

export default LotteryContent;
