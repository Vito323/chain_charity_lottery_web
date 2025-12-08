'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAccount } from 'wagmi';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import WinningRecordCard, { WinningRecord } from '../components/WinningRecordCard';
import StalwartConnectButton from '@/components/custom-connect-button/StalwartConnectButton';

// Mock data based on the image
const defaultWinningRecords: WinningRecord[] = [
  {
    id: '1',
    ticketImage: '/images/placeholder-all.png',
    drawNumber: '386',
    winningType: 'lottery',
    prizeAmount: 818266,
    prizeCurrency: 'CLT',
    winningTime: '2025-08-08 18:18',
  },
  {
    id: '2',
    ticketImage: '/images/placeholder-all.png',
    drawNumber: '385',
    winningType: 'lottery',
    prizeAmount: 25656,
    prizeCurrency: 'CLT',
    winningTime: '2025-08-08 18:18',
  },
  {
    id: '3',
    ticketImage: '/images/placeholder-all.png',
    drawNumber: '366',
    winningType: 'follow',
    prizeAmount: 118266,
    prizeCurrency: 'CLT',
    winningTime: '2025-08-08 18:18',
  },
  {
    id: '4',
    ticketImage: '/images/placeholder-all.png',
    drawNumber: '356',
    winningType: 'follow',
    prizeAmount: 95818266,
    prizeCurrency: 'CLT',
    winningTime: '2025-08-08 18:18',
  },
];

const StalwartWinningRecords: React.FC = () => {
  const t = useTranslations('lottery.winningRecords');
  const tCommon = useTranslations('common');
  const { isConnected } = useAccount();
  const [winningRecords] = useState<WinningRecord[]>(defaultWinningRecords);
  const [isLoading] = useState(false);
  const [error] = useState<string | null>(null);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: 'easeOut' as const,
      },
    },
  };

  // For display, using the value from image: 3,657,890 USDT
  const displayTotalUSDT = 3657890;

  return (
    <section className="relative py-20 md:py-32">
      {/* Background Elements */}

      <motion.div
        className="relative z-10 max-w-7xl mx-auto px-6 md:px-8"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Section Header */}
        <motion.div variants={itemVariants} className="text-center mb-12 md:mb-16">
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

          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            {t('title')} <span className="bg-gradient-to-r from-purple-300 via-pink-300 to-fuchsia-300 bg-clip-text text-transparent">{t('titleHighlight')}</span>
          </h2>
          <p className="text-lg md:text-xl text-white/80 max-w-3xl mx-auto leading-relaxed">
            {t('subtitle')}
          </p>
        </motion.div>

        {/* Connect Wallet Prompt */}
        {!isConnected && (
          <motion.div
            variants={itemVariants}
            className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 md:p-12 text-center mb-12"
          >
            <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">
              {t('connect.title')}
            </h3>
            <p className="text-white/70 mb-6 max-w-md mx-auto">
              {t('connect.description')}
            </p>
            <StalwartConnectButton />
          </motion.div>
        )}

        {/* Cumulative Winnings */}
        {winningRecords.length > 0 && (
          <motion.div
            variants={itemVariants}
            className="mb-12 md:mb-16"
          >
            <div className="bg-gradient-to-r from-emerald-500/20 via-teal-500/20 to-emerald-500/20 backdrop-blur-xl border border-emerald-500/30 rounded-3xl p-6 md:p-8">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="text-white/70 text-sm md:text-base">
                  {t('cumulativeWinnings')}
                </div>
                <div className="flex items-baseline gap-2">
                  <div className="text-3xl md:text-4xl lg:text-5xl font-bold text-white">
                    {displayTotalUSDT.toLocaleString()}
                  </div>
                  <div className="text-white/60 text-sm md:text-base">
                    USDT
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Loading State */}
        {isLoading && (
          <motion.div
            className="text-center py-20 bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
          >
            <div className="w-8 h-8 border-2 border-white/30 border-t-white rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-white/80">{tCommon('status.loading')}</p>
          </motion.div>
        )}

        {/* Error State */}
        {error && (
          <motion.div
            className="text-center py-20 bg-red-500/10 backdrop-blur-xl border border-red-500/20 rounded-3xl"
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
              {tCommon('errors.failedToLoadWinningRecords')}
            </h3>
            <p className="text-white/60">{error}</p>
          </motion.div>
        )}

        {/* Winning Records Grid */}
        {!isLoading && !error && winningRecords.length > 0 && (
          <motion.div
            variants={itemVariants}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6"
          >
            {winningRecords.map((record, index) => (
              <WinningRecordCard
                key={record.id}
                record={record}
                animationDelay={index * 0.1}
              />
            ))}
          </motion.div>
        )}

        {/* Empty State */}
        {!isLoading && !error && winningRecords.length === 0 && (
          <motion.div
            className="text-center py-20 bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
          >
            <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">
              {t('empty.title')}
            </h3>
            <p className="text-white/60 mb-6">
              {t('empty.description')}
            </p>
            <Link
              href="/lottery"
              className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-purple-600 to-pink-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-purple-500/30 hover:from-purple-700 hover:to-pink-700 transition-all duration-300"
            >
              {t('empty.browseLottery')}
            </Link>
          </motion.div>
        )}

        {/* Navigation Buttons */}
        <motion.div
          variants={itemVariants}
          className="mt-12 md:mt-16 flex flex-col sm:flex-row gap-4 md:gap-6 justify-center items-center"
        >
          <Link
            href="/user/token-details"
            className="group relative w-full sm:w-auto min-w-[200px] px-8 py-4 bg-gradient-to-r from-purple-600/20 to-pink-600/20 backdrop-blur-xl border border-purple-500/30 rounded-2xl text-white font-semibold text-base md:text-lg transition-all duration-300 hover:from-purple-600/30 hover:to-pink-600/30 hover:border-purple-500/50 hover:shadow-lg hover:shadow-purple-500/20 hover:scale-105"
          >
            <div className="flex items-center justify-center gap-3">
              <svg className="w-5 h-5 text-purple-300 group-hover:text-purple-200 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{t('navigation.tokenDetails')}</span>
            </div>
          </Link>
          <Link
            href="/user/donation-records"
            className="group relative w-full sm:w-auto min-w-[200px] px-8 py-4 bg-gradient-to-r from-emerald-600/20 to-teal-600/20 backdrop-blur-xl border border-emerald-500/30 rounded-2xl text-white font-semibold text-base md:text-lg transition-all duration-300 hover:from-emerald-600/30 hover:to-teal-600/30 hover:border-emerald-500/50 hover:shadow-lg hover:shadow-emerald-500/20 hover:scale-105"
          >
            <div className="flex items-center justify-center gap-3">
              <svg className="w-5 h-5 text-emerald-300 group-hover:text-emerald-200 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <span>{t('navigation.donationRecords')}</span>
            </div>
          </Link>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default StalwartWinningRecords;

