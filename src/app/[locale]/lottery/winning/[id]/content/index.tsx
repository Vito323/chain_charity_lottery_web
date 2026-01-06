'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { useTranslations, useLocale } from 'next-intl';
import { type LotteryHistory } from '@/service/lottery';
import { renderTicketMetadata } from '@/service/asset';
import { COLORS } from '@/utils/lottery';

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

// 默认的图像符号
const DEFAULT_IMAGE_SYMBOLS = ['heart', 'knight', 'star'];
const DEFAULT_COLOR_GENES = ['#FF6B35', '#4ECDC4', '#9B59B6', '#E0E0E0'];

// 根据 colors 字符串解析颜色索引并获取对应的颜色值
const parseColorGenes = (colorsString: string | undefined): string[] => {
  if (!colorsString) {
    // 如果没有 colors 数据，返回默认颜色
    return DEFAULT_COLOR_GENES;
  }

  try {
    // 假设 colors 是逗号分隔的索引字符串，如 "1,2,3,4"
    const colorIndexes = colorsString.split('').map((idx) => parseInt(idx.trim(), 10)).filter((idx) => !isNaN(idx) && idx > 0);
    
    if (colorIndexes.length === 0) {
      return DEFAULT_COLOR_GENES;
    }

    // 根据索引从 COLORS 数组中获取对应的颜色值
    const colorValues = colorIndexes.map((index) => {
      const colorGene = COLORS.find((color) => color.index === index);
      return colorGene ? colorGene.value : '#E0E0E0'; // 如果找不到对应的颜色，使用默认灰色
    });

    return colorValues.length > 0 ? colorValues : DEFAULT_COLOR_GENES;
  } catch (error) {
    console.error('Failed to parse color genes:', error);
    return DEFAULT_COLOR_GENES;
  }
};

const WinningDetail: React.FC<WinningDetailProps> = ({ winningId, type }) => {
  const t = useTranslations('lottery.winningDetail');
  const tCommon = useTranslations('common');
  const locale = useLocale();
  
  // 从 localStorage 读取数据
  const [lotteryHistory, setLotteryHistory] = useState<LotteryHistory | null>(null);
  const [ticketImageUrl, setTicketImageUrl] = useState<string | null>(null);
  const [isLoadingImage, setIsLoadingImage] = useState(true);
  const [imageError, setImageError] = useState(false);

  // 从 localStorage 读取数据
  useEffect(() => {
    try {
      const storedData = localStorage.getItem(`lottery_history_${winningId}`);
      if (storedData) {
        const data = JSON.parse(storedData) as LotteryHistory;
        setLotteryHistory(data);
      }
    } catch (error) {
      console.error('Failed to load lottery history from localStorage:', error);
    }
  }, [winningId]);

  // 根据 dna 获取 Ticket Image
  // useEffect(() => {
  //   if (lotteryHistory?.dna) {
  //     const fetchImage = async () => {
  //       try {
  //         setIsLoadingImage(true);
  //         setImageError(false);
  //         const response = await renderTicketMetadata(lotteryHistory.dna);
  //         if (response.data?.image) {
  //           setTicketImageUrl(response.data.image);
  //         } else {
  //           setImageError(true);
  //         }
  //       } catch (error) {
  //         console.error('Failed to fetch ticket metadata:', error);
  //         setImageError(true);
  //       } finally {
  //         setIsLoadingImage(false);
  //       }
  //     };

  //     fetchImage();
  //   }
  // }, [lotteryHistory?.dna]);

  // 如果没有数据，返回 null 或显示错误
  if (!lotteryHistory) {
    return (
      <section className="relative py-20 md:py-32">
        <div className="relative z-10 max-w-4xl mx-auto px-6 md:px-8">
          <div className="text-center py-20 bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl">
            <p className="text-white/80">{tCommon('errors.failedToLoadHistory')}</p>
          </div>
        </div>
      </section>
    );
  }

  // 格式化当前时间戳（根据语言环境）
  const localeMap: Record<string, string> = {
    'en': 'en-US',
    'zh': 'zh-CN',
  };
  const dateLocale = localeMap[locale] || 'en-US';
  
  const currentTimestamp = new Date().toLocaleString(dateLocale, {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });

  const winningData: WinningDetailData = {
    id: String(lotteryHistory.id),
    type: 'lottery',
    ticketImage: ticketImageUrl || '/images/placeholder-all.png',
    series: lotteryHistory.lotteryDrawTickets?.[0]?.seriesName || t('unknownSeries'),
    level: lotteryHistory.lotteryDrawTickets?.[0]?.title || t('unknownLevel'),
    rarityLabel: lotteryHistory.lotteryDrawTickets?.[0]?.title || 'Common',
    winningAmount: lotteryHistory.total || 0,
    currency: 'USDT',
    drawTime: new Date(lotteryHistory.createdAt).toLocaleString(dateLocale, {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    }),
    digitalMatrix: lotteryHistory.numbers || '',
    colorGenes: parseColorGenes(lotteryHistory.colors), // 从 COLORS 的 index 对应取值
    imageSymbols: DEFAULT_IMAGE_SYMBOLS, // 写死的图像符号
    timestamp: `${currentTimestamp} #${lotteryHistory.id}`, // 使用当前时间
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
        {/* <motion.div
          variants={itemVariants}
          className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 md:p-8 mb-6 md:mb-8"
        >
          <div className="flex flex-col md:flex-row gap-6 md:gap-8">
            <div className="shrink-0 w-full md:w-auto">
              <div 
                className="relative w-full max-w-sm mx-auto md:max-w-none rounded-xl overflow-hidden bg-linear-to-br from-slate-800 to-slate-900"
                style={{ aspectRatio: '16/10' }}
              >
                {isLoadingImage ? (
                  <div className="absolute inset-0 flex items-center justify-center bg-slate-800/50">
                    <div className="w-8 h-8 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  </div>
                ) : ticketImageUrl && !imageError ? (
                  <img
                    src={ticketImageUrl}
                    alt={`${tCommon('images.winningTicket')} ${winningData.id}`}
                    className="w-full h-full object-cover"
                    onError={() => {
                      setImageError(true);
                    }}
                  />
                ) : (
                  <Image
                    src={winningData.ticketImage}
                    alt={`${tCommon('images.winningTicket')} ${winningData.id}`}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 400px"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = '/images/placeholder-all.png';
                    }}
                  />
                )}
                <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent" />
              </div>
            </div>
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
        </motion.div> */}

        {/* Prize Pool Amount */}
        <motion.div
          variants={itemVariants}
          className="bg-linear-to-r from-emerald-500/20 via-teal-500/20 to-emerald-500/20 backdrop-blur-xl border border-emerald-500/30 rounded-3xl p-6 md:p-8 mb-6 md:mb-8"
        >
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="text-white/70 text-base md:text-lg">{t('prizePoolAmount')}</div>
            <div className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white">
              {winningData.winningAmount.toLocaleString('en-US', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })} {winningData.currency}
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
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
            {/* <motion.div
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
            </motion.div> */}
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

