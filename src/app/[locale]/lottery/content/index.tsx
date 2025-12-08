"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { useAccount } from "wagmi";
import { useWalletNFTs } from "@/hooks/useWalletNFTs";
import { getLotteryConfig, LotteryConfig } from "@/service/lottery";
import { useTranslations } from 'next-intl';

interface CountdownTime {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

const LotteryContent: React.FC = () => {
  const { isConnected } = useAccount();
  const t = useTranslations('lottery');
  const tCommon = useTranslations('common');
  const tTime = useTranslations('common.time');

  const {
    nfts,
    loading: nftsLoading,
    error: nftsError,
  } = useWalletNFTs({ pageSize: 20 });

  // 彩票配置状态
  const [lotteryConfig, setLotteryConfig] = useState<LotteryConfig>({
    nextDrawTime: 0,
    total: "0.00",
    nextDrawTimestring: ''
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

  // 直接使用 lotteryConfig.total 的值，不依赖动画
  const jackpotValue = parseFloat(lotteryConfig.total) || 0;

  // 计算倒计时
  const calculateCountdown = useCallback(() => {
    const now = new Date().getTime();
    const drawTime = lotteryConfig.nextDrawTime * 1000;
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
  }, [lotteryConfig.nextDrawTime]);

  // 更新倒计时
  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown(calculateCountdown());
    }, 1000);

    return () => clearInterval(timer);
  }, [calculateCountdown]);

  // 过滤彩票NFT
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

  const queryLotteryConfig = async () => {
    const res = await getLotteryConfig();
    if (res.ok) {
      setLotteryConfig(res.data);
    }
  };

  useEffect(() => {
    queryLotteryConfig();
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
    <section className="relative py-20 md:py-32">
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
            <span className="bg-gradient-to-r from-purple-300 via-pink-300 to-fuchsia-300 bg-clip-text text-transparent">
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
            ].map((item, index) => (
              <motion.div
                key={item.label}
                className="text-center"
                whileHover={{ scale: 1.05 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="w-20 h-20 md:w-24 md:h-24 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-2xl flex items-center justify-center mb-3 mx-auto border border-white/10">
                  <span className="text-2xl md:text-3xl font-bold text-white">
                    {formatTime(item.value)}
                  </span>
                </div>
                <p className="text-white/70 text-sm font-medium uppercase tracking-wider">
                  {item.label}
                </p>
              </motion.div>
            ))}
          </div>

          {/* Jackpot Section */}
          <div className="text-center">
            <h3 className="text-xl md:text-2xl font-semibold text-white/80 mb-4">
              {t('jackpot.title')}
            </h3>
            <div className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-2">
              {isConnected ? (
                <span>
                  ${jackpotValue.toLocaleString()}
                </span>
              ) : (
                t('jackpot.connectWallet')
              )}
            </div>
            <p className="text-white/60 text-sm">
              {t('jackpot.description')}
            </p>
          </div>
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
