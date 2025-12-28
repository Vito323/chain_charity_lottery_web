'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAccount } from 'wagmi';
import Image from 'next/image';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import ConnectButton from '@/components/custom-connect-button/ConnectButton';
import { RarityType } from '@/app/[locale]/nft-market/types';

// Transaction type
type TransactionType = 'buy' | 'sell' | 'follow';

// Transaction record interface
interface TransactionRecord {
  id: string;
  image: string;
  rarity: RarityType;
  rarityLabel: string;
  transactionType: TransactionType;
  price: number;
  currency: string;
  timestamp: string;
}

// Rarity configuration - will be translated in component
const getRarityConfig = (tCommon: any): Record<RarityType, { color: string; label: string }> => ({
  common: {
    color: 'text-gray-400',
    label: tCommon('rarity.common'),
  },
  rare: {
    color: 'text-blue-400',
    label: tCommon('rarity.rare'),
  },
  epic: {
    color: 'text-purple-400',
    label: tCommon('rarity.epic'),
  },
  legendary: {
    color: 'text-orange-400',
    label: tCommon('rarity.legendary'),
  },
  mythic: {
    color: 'text-yellow-400',
    label: tCommon('rarity.mythic'),
  },
});

// Transaction type configuration - will be translated in component
const getTransactionTypeConfig = (t: any): Record<TransactionType, { label: string; color: string; bgColor: string; borderColor: string }> => ({
  buy: {
    label: t('transactionTypes.buy'),
    color: 'text-emerald-400',
    bgColor: 'bg-emerald-500/10',
    borderColor: 'border-emerald-500/30',
  },
  sell: {
    label: t('transactionTypes.sell'),
    color: 'text-red-400',
    bgColor: 'bg-red-500/10',
    borderColor: 'border-red-500/30',
  },
  follow: {
    label: t('transactionTypes.follow'),
    color: 'text-blue-400',
    bgColor: 'bg-blue-500/10',
    borderColor: 'border-blue-500/30',
  },
});

// Mock data based on the image
const defaultTransactionRecords: TransactionRecord[] = [
  {
    id: '1',
    image: '/images/placeholder-all.png',
    rarity: 'rare',
    rarityLabel: 'Rare',
    transactionType: 'buy',
    price: 818.266,
    currency: 'CCT',
    timestamp: '2025-08-08 18:18',
  },
  {
    id: '2',
    image: '/images/placeholder-all.png',
    rarity: 'common',
    rarityLabel: 'Common',
    transactionType: 'buy',
    price: 256.56,
    currency: 'CCT',
    timestamp: '2025-08-08 18:18',
  },
  {
    id: '3',
    image: '/images/placeholder-all.png',
    rarity: 'common',
    rarityLabel: 'Common',
    transactionType: 'sell',
    price: 118.266,
    currency: 'CCT',
    timestamp: '2025-08-08 18:18',
  },
  {
    id: '4',
    image: '/images/placeholder-all.png',
    rarity: 'mythic',
    rarityLabel: 'Mythic',
    transactionType: 'sell',
    price: 95818.266,
    currency: 'CCT',
    timestamp: '2025-08-08 18:18',
  },
  {
    id: '5',
    image: '/images/placeholder-all.png',
    rarity: 'epic',
    rarityLabel: 'Epic',
    transactionType: 'follow',
    price: 1818.266,
    currency: 'CCT',
    timestamp: '2025-08-08 18:18',
  },
  {
    id: '6',
    image: '/images/placeholder-all.png',
    rarity: 'legendary',
    rarityLabel: 'Legendary',
    transactionType: 'follow',
    price: 8818.266,
    currency: 'CCT',
    timestamp: '2025-08-08 18:18',
  },
];

const TransactionRecords: React.FC = () => {
  const t = useTranslations('user.transactionRecords');
  const tCommon = useTranslations('common');
  const { isConnected } = useAccount();
  const [transactionRecords] = useState<TransactionRecord[]>(defaultTransactionRecords);
  const [isLoading] = useState(false);
  const [error] = useState<string | null>(null);
  
  const rarityConfig = getRarityConfig(tCommon);
  const transactionTypeConfig = getTransactionTypeConfig(t);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.3,
        ease: 'easeOut' as const,
      },
    },
  };

  return (
    <section className="relative py-20 md:py-32">
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
            <span className="w-2 h-2 rounded-full bg-purple-400 animate-pulse" />
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
            <ConnectButton />
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
              {tCommon('errors.failedToLoadTransactionRecords')}
            </h3>
            <p className="text-white/60">{error}</p>
          </motion.div>
        )}

        {/* Transaction Records Grid - Card Layout */}
        {!isLoading && !error && transactionRecords.length > 0 && (
          <motion.div
            variants={itemVariants}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6"
          >
            {transactionRecords.map((record, index) => {
              const rarityStyle = rarityConfig[record.rarity];
              const transactionStyle = transactionTypeConfig[record.transactionType];

              return (
                <motion.div
                  key={record.id}
                  variants={itemVariants}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  whileHover={{ scale: 1.02, y: -4 }}
                  className={`bg-white/5 backdrop-blur-xl border ${transactionStyle.borderColor} rounded-2xl overflow-hidden hover:bg-white/[0.08] transition-all duration-300 flex flex-col`}
                >
                  {/* Lottery Ticket Image */}
                  <div className="w-full aspect-[4/3] rounded-t-2xl overflow-hidden bg-white/5 border-b border-white/10">
                    <Image
                      src={record.image}
                      alt={`${tCommon('images.lotteryTicket')} ${record.id}`}
                      width={400}
                      height={300}
                      className="w-full h-full object-cover"
                      unoptimized
                    />
                  </div>

                  {/* Card Content */}
                  <div className="flex flex-col gap-3 p-4 md:p-5">
                    {/* Rarity */}
                    <div className="flex items-center">
                      <span className={`text-base md:text-lg font-semibold ${rarityStyle.color}`}>
                        {rarityStyle.label}
                      </span>
                    </div>

                    {/* Transaction Type */}
                    <div className="flex items-center">
                      <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs md:text-sm font-medium ${transactionStyle.color} ${transactionStyle.bgColor} border ${transactionStyle.borderColor} whitespace-nowrap`}>
                        {transactionStyle.label}
                      </span>
                    </div>

                    {/* Price */}
                    <div className="flex items-baseline gap-2">
                      <span className="text-xl md:text-2xl font-bold text-white">
                        {record.price.toLocaleString(undefined, {
                          minimumFractionDigits: 3,
                          maximumFractionDigits: 3,
                        })}
                      </span>
                      <span className="text-sm text-white/60">
                        {record.currency}
                      </span>
                    </div>

                    {/* Timestamp */}
                    <div className="text-sm text-white/70 pt-2 border-t border-white/10">
                      {record.timestamp}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        )}

        {/* Empty State */}
        {!isLoading && !error && transactionRecords.length === 0 && (
          <motion.div
            className="text-center py-20 bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
          >
            <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
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
      </motion.div>
    </section>
  );
};

export default TransactionRecords;

