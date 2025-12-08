'use client';

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';

export type WinningType = 'lottery' | 'follow';

interface WinningDetailData {
  id: string;
  type: WinningType;
  ticketImage: string;
  series: string;
  level: string;
  rarityLabel: string;
  winningAmount: number;
  currency: string;
  drawTime: string;
  digitalMatrix: string;
  colorGenes: string[];
  imageSymbols: string[];
  timestamp: string;
  blockNumber?: string;
  // For follow-bet type
  followBetAmount?: number;
}

interface WinningDetailProps {
  winningId: string;
  type: WinningType;
}

// Mock data - in production, this would come from an API
const mockLotteryWinningData: WinningDetailData = {
  id: '1',
  type: 'lottery',
  ticketImage: '/images/placeholder-all.png',
  series: 'BRUNO MARS SIGNATURE SERIES',
  level: 'RARE LEVEL',
  rarityLabel: 'Rare',
  winningAmount: 3657890,
  currency: 'USDT',
  drawTime: '2025-08-08 9:00',
  digitalMatrix: '234567-8901-34',
  colorGenes: ['#FF6B35', '#4ECDC4', '#9B59B6', '#E0E0E0'],
  imageSymbols: ['heart', 'knight', 'star'],
  timestamp: '2025-01-15 14:30:25 #18,250,000',
};

const mockFollowWinningData: WinningDetailData = {
  id: '2',
  type: 'follow',
  ticketImage: '/images/placeholder-all.png',
  series: 'BRUNO MARS SIGNATURE SERIES',
  level: 'BASIC LEVEL',
  rarityLabel: 'Common',
  winningAmount: 3657890,
  currency: 'USDT',
  drawTime: '2025-08-08 9:00',
  digitalMatrix: '234567-8901-23',
  colorGenes: ['#FF6B35', '#4ECDC4', '#9B59B6', '#E0E0E0'],
  imageSymbols: ['heart', 'knight', 'star'],
  timestamp: '2025-01-15 14:30:25 #18,250,000',
  followBetAmount: 7890,
};

const WinningDetail: React.FC<WinningDetailProps> = ({ winningId, type }) => {
  const t = useTranslations('lottery.winningDetail');
  // In production, fetch data by winningId
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const _winningId = winningId; // Reserved for future API integration
  const winningData = type === 'lottery' ? mockLotteryWinningData : mockFollowWinningData;

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

  const getRarityColor = (rarity: string) => {
    const rarityLower = rarity.toLowerCase();
    if (rarityLower.includes('rare')) return 'text-blue-400';
    if (rarityLower.includes('common') || rarityLower.includes('basic')) return 'text-gray-400';
    if (rarityLower.includes('epic')) return 'text-purple-400';
    if (rarityLower.includes('legendary')) return 'text-orange-400';
    if (rarityLower.includes('mythic')) return 'text-yellow-400';
    return 'text-white/60';
  };

  return (
    <section className="relative py-20 md:py-32">
      {/* Background Elements */}

      <motion.div
        className="relative z-10 max-w-4xl mx-auto px-6 md:px-8"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Page Header */}
        <motion.div variants={itemVariants} className="text-center mb-12 md:mb-16">
          <motion.div
            className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full border border-white/15 bg-white/5 backdrop-blur-sm text-white/90 mb-6"
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.6 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-sm">
              {type === 'lottery' ? t('badge.lottery') : t('badge.follow')}
            </span>
          </motion.div>
        </motion.div>

        {/* Ticket Image and Basic Info */}
        <motion.div
          variants={itemVariants}
          className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 md:p-8 mb-6 md:mb-8"
        >
          <div className="flex flex-col md:flex-row gap-6 md:gap-8">
            {/* Ticket Image */}
            <div className="flex-shrink-0 w-full md:w-auto">
              <div className="relative w-full max-w-sm mx-auto md:max-w-none md:w-40 md:h-52 h-[60vh] rounded-xl overflow-hidden bg-gradient-to-br from-slate-800 to-slate-900">
                <Image
                  src={winningData.ticketImage}
                  alt={`Winning Ticket ${winningData.id}`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 160px"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = '/images/placeholder-all.png';
                  }}
                />
              </div>
            </div>

            {/* Basic Info */}
            <div className="flex-1 space-y-3 md:space-y-4">
              <div>
                <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-white mb-1 md:mb-2">
                  {winningData.series}
                </h2>
                <p className={`text-sm md:text-base lg:text-lg font-semibold ${getRarityColor(winningData.rarityLabel)}`}>
                  {winningData.rarityLabel}
                </p>
              </div>

              {type === 'follow' && winningData.followBetAmount && (
                <div className="pt-3 md:pt-4 border-t border-white/10">
                  <div className="text-white/60 text-xs md:text-sm mb-1">{t('followBetAmount')}</div>
                  <div className="text-lg md:text-xl lg:text-2xl font-bold text-white">
                    {winningData.followBetAmount.toLocaleString()} {winningData.currency}
                  </div>
                </div>
              )}
            </div>
          </div>
        </motion.div>

        {/* Winning Amount */}
        <motion.div
          variants={itemVariants}
          className="bg-gradient-to-r from-emerald-500/20 via-teal-500/20 to-emerald-500/20 backdrop-blur-xl border border-emerald-500/30 rounded-3xl p-6 md:p-8 mb-6 md:mb-8"
        >
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="text-white/70 text-base md:text-lg">{t('winningAmount')}</div>
            <div className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white">
              {winningData.winningAmount.toLocaleString()} {winningData.currency}
            </div>
          </div>
        </motion.div>

        {/* Draw Information */}
        <motion.div variants={itemVariants} className="space-y-6 md:space-y-8">
          <h3 className="text-xl md:text-2xl font-bold text-white">{t('drawInformation')}</h3>

          {/* Draw Time */}
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-4 md:p-6">
            <div className="flex items-center justify-between">
              <div className="text-white/60 text-sm md:text-base">{t('drawTime')}</div>
              <div className="text-white font-semibold text-base md:text-lg">
                {winningData.drawTime}
              </div>
            </div>
          </div>

          {/* Draw Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
            {/* Digital Matrix */}
            <motion.div
              variants={itemVariants}
              className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-4 md:p-6"
            >
              <div className="text-white/60 text-xs md:text-sm mb-2 md:mb-3">{t('digitalMatrix')}</div>
              <div className="text-lg md:text-xl font-bold text-white font-mono">
                {winningData.digitalMatrix}
              </div>
            </motion.div>

            {/* Color Genes */}
            <motion.div
              variants={itemVariants}
              className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-4 md:p-6"
            >
              <div className="text-white/60 text-xs md:text-sm mb-2 md:mb-3">{t('colorGenes')}</div>
              <div className="flex gap-1 md:gap-2">
                {winningData.colorGenes.map((color, index) => (
                  <div
                    key={index}
                    className="flex-1 h-8 md:h-10 rounded-lg"
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </motion.div>

            {/* Image Symbols */}
            <motion.div
              variants={itemVariants}
              className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-4 md:p-6"
            >
              <div className="text-white/60 text-xs md:text-sm mb-2 md:mb-3">{t('imageSymbols')}</div>
              <div className="flex gap-2 md:gap-3">
                {winningData.imageSymbols.map((symbol, index) => (
                  <div
                    key={index}
                    className="w-8 h-8 md:w-10 md:h-10 bg-white/10 rounded-lg flex items-center justify-center text-white/60 text-sm md:text-base"
                  >
                    {symbol === 'heart' && '♥'}
                    {symbol === 'knight' && '♞'}
                    {symbol === 'star' && '★'}
                    {!['heart', 'knight', 'star'].includes(symbol) && symbol.charAt(0).toUpperCase()}
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Timestamp */}
          <motion.div
            variants={itemVariants}
            className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-4 md:p-6"
          >
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="text-white/60 text-sm md:text-base">{t('timestamp')}</div>
              <div className="text-white font-semibold text-sm md:text-base font-mono">
                {winningData.timestamp}
              </div>
            </div>
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default WinningDetail;

