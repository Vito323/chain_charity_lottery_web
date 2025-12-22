"use client";

import React, { useState } from 'react';
import { Link } from '@/i18n/navigation';
import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';

// 历史开奖结果数据类型
interface LotteryHistoryItem {
  id: string;
  drawNumber: number; // 期号
  status: 'upcoming' | 'won' | 'lost'; // 状态
  drawTime: string; // 开奖时间，格式：2025-08-08 12:00
  prizeAmount: number; // 奖金金额（万 USDT）
}

// 缺省数据
const defaultHistoryData: LotteryHistoryItem[] = [
  {
    id: '1',
    drawNumber: 386,
    status: 'upcoming',
    drawTime: '2025-08-08 12:00',
    prizeAmount: 385
  },
  {
    id: '2',
    drawNumber: 385,
    status: 'won',
    drawTime: '2025-08-08 9:00',
    prizeAmount: 365
  },
  {
    id: '3',
    drawNumber: 384,
    status: 'lost',
    drawTime: '2025-08-07 20:00',
    prizeAmount: 355
  },
  {
    id: '4',
    drawNumber: 383,
    status: 'lost',
    drawTime: '2025-08-07 16:00',
    prizeAmount: 345
  },
  {
    id: '5',
    drawNumber: 382,
    status: 'lost',
    drawTime: '2025-08-07 12:00',
    prizeAmount: 325
  },
  {
    id: '6',
    drawNumber: 381,
    status: 'lost',
    drawTime: '2025-08-07 8:00',
    prizeAmount: 322
  }
];

const LotteryHistory = () => {
  const t = useTranslations('lottery.history');
  const tCommon = useTranslations('common');
  const [historyData] = useState<LotteryHistoryItem[]>(defaultHistoryData);
  const [isLoading] = useState(false);
  const [error] = useState<string | null>(null);

  // 获取状态文本
  const getStatusText = (status: 'upcoming' | 'won' | 'lost') => {
    switch (status) {
      case 'upcoming':
        return t('status.upcoming');
      case 'won':
        return t('status.won');
      case 'lost':
        return t('status.lost');
      default:
        return '';
    }
  };

  // 格式化奖金显示
  const formatPrizeAmount = (amount: number) => {
    return `${amount}${t('prizeUnit')}`;
  };

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

  return (
    <section className="relative py-20 md:py-24">
      {/* Background Elements */}
      <div className="absolute inset-0 z-0">
        <motion.div
          className="absolute top-20 right-10 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 6,
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
        {/* Section Header */}
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

          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            {t('title')} <span className="bg-gradient-to-r from-purple-300 via-pink-300 to-fuchsia-300 bg-clip-text text-transparent">{t('titleHighlight')}</span>
          </h2>
          <p className="text-lg md:text-xl text-white/80 max-w-3xl mx-auto leading-relaxed">
            {t('subtitle')}
          </p>
        </motion.div>

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
              {tCommon('errors.failedToLoadHistory')}
            </h3>
            <p className="text-white/60">{error}</p>
          </motion.div>
        )}

        {/* History List */}
        {!isLoading && !error && historyData.length > 0 && (
          <motion.div
            variants={itemVariants}
            className="flex flex-col gap-3 md:gap-4"
          >
            {historyData.map((item, index) => (
              <Link key={item.id} href={`/lottery/winning/${item.id}`}>
                <motion.div
                  className="flex items-center justify-between bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-3 sm:p-4 md:p-5 hover:bg-white/10 transition-all duration-200 cursor-pointer"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.01 }}
                >
                  {/* 左侧内容 */}
                  <div className="flex flex-col flex-1 min-w-0 pr-2 sm:pr-3">
                    {/* 第一行：期号和状态 */}
                    <div className="flex items-center gap-2 sm:gap-3 mb-1.5 sm:mb-2 flex-wrap">
                      <span className="text-sm sm:text-base md:text-lg font-bold text-white">
                        {t('drawNumberFormat', { number: item.drawNumber })}
                      </span>
                      {item.status === 'won' ? (
                        <span className="px-2 sm:px-2.5 md:px-3 py-0.5 sm:py-1 rounded-lg bg-white/20 text-white text-xs sm:text-sm font-medium whitespace-nowrap">
                          {getStatusText(item.status)}
                        </span>
                      ) : (
                        <span className="text-xs sm:text-sm text-white/60 whitespace-nowrap">
                          {getStatusText(item.status)}
                        </span>
                      )}
                    </div>
                    {/* 第二行：开奖时间 */}
                    <div className="text-xs sm:text-sm text-white/60 break-words">
                      {t('drawTime')}: {item.drawTime}
                    </div>
                  </div>

                  {/* 右侧内容：奖金和箭头 */}
                  <div className="flex items-center gap-2 sm:gap-3 md:gap-4 shrink-0">
                    <span className="text-sm sm:text-base md:text-lg font-bold text-white text-right whitespace-nowrap">
                      {formatPrizeAmount(item.prizeAmount)}
                    </span>
                    <svg
                      className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-white/60 shrink-0"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </div>
                </motion.div>
              </Link>
            ))}
          </motion.div>
        )}

        {/* Empty State */}
        {!isLoading && !error && historyData.length === 0 && (
          <motion.div
            className="text-center py-20 bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
          >
            <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="10"/>
                <circle cx="12" cy="12" r="6"/>
                <circle cx="12" cy="12" r="2"/>
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">
              {t('empty.title')}
            </h3>
            <p className="text-white/60">
              {t('empty.description')}
            </p>
          </motion.div>
        )}

        {/* Additional Info */}
        <motion.div
          variants={itemVariants}
          className="mt-16 text-center"
        >
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8">
            <h3 className="text-xl font-semibold text-white mb-4">
              {t('verify.title')}
            </h3>
            <p className="text-white/70 mb-6 max-w-2xl mx-auto">
              {t('verify.description')}
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-sm text-white/60">
              <span className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-400"></div>
                {t('verify.transparent')}
              </span>
              <span className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-blue-400"></div>
                {t('verify.secured')}
              </span>
              <span className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-purple-400"></div>
                {t('verify.fair')}
              </span>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default LotteryHistory;
