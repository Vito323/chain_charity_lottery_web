'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAccount } from 'wagmi';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import ConnectButton from '@/components/custom-connect-button/ConnectButton';
import { formatCurrency } from '@/utils/currency';

// Token detail interface
interface TokenDetail {
  id: string;
  tokenSymbol: string;
  tokenName: string;
  balance: number;
  value: number;
  currency: string;
  change24h: number;
  timestamp: string;
  logo?: string;
}

// Mock data
const defaultTokenDetails: TokenDetail[] = [
  {
    id: '1',
    tokenSymbol: 'CLT',
    tokenName: 'Community Lottery Token',
    balance: 2800,
    value: 2800,
    currency: 'CLT',
    change24h: 5.2,
    timestamp: '2025-08-08 18:18',
  },
  {
    id: '2',
    tokenSymbol: 'CLT',
    tokenName: 'Community Lottery Token',
    balance: 2800,
    value: 2800,
    currency: 'CLT',
    change24h: 0.1,
    timestamp: '2025-08-08 18:18',
  },
  {
    id: '3',
    tokenSymbol: 'CLT',
    tokenName: 'Community Lottery Token',
    balance: 2800,
    value: 2800,
    currency: 'CLT',
    change24h: -2.5,
    timestamp: '2025-08-08 18:18',
  },
  {
    id: '4',
    tokenSymbol: 'CLT',
    tokenName: 'Community Lottery Token',
    balance: 2800,
    value: 2800,
    currency: 'CLT',
    change24h: 5.2,
    timestamp: '2025-08-08 18:18',
  },
  {
    id: '5',
    tokenSymbol: 'CLT',
    tokenName: 'Community Lottery Token',
    balance: 2800,
    value: 2800,
    currency: 'CLT',
    change24h: 0.1,
    timestamp: '2025-08-08 18:18',
  },
  {
    id: '6',
    tokenSymbol: 'CLT',
    tokenName: 'Community Lottery Token',
    balance: 2800,
    value: 2800,
    currency: 'CLT',
    change24h: -2.5,
    timestamp: '2025-08-08 18:18',
  },
  {
    id: '7',
    tokenSymbol: 'CLT',
    tokenName: 'Community Lottery Token',
    balance: 2800,
    value: 2800,
    currency: 'CLT',
    change24h: 5.2,
    timestamp: '2025-08-08 18:18',
  },
  {
    id: '8',
    tokenSymbol: 'CLT',
    tokenName: 'Community Lottery Token',
    balance: 2800,
    value: 2800,
    currency: 'CLT',
    change24h: 0.1,
    timestamp: '2025-08-08 18:18',
  },
  {
    id: '9',
    tokenSymbol: 'CLT',
    tokenName: 'Community Lottery Token',
    balance: 2800,
    value: 2800,
    currency: 'CLT',
    change24h: -2.5,
    timestamp: '2025-08-08 18:18',
  },
  {
    id: '10',
    tokenSymbol: 'CLT',
    tokenName: 'Community Lottery Token',
    balance: 2800,
    value: 2800,
    currency: 'CLT',
    change24h: 5.2,
    timestamp: '2025-08-08 18:18',
  },
];

const TokenDetails: React.FC = () => {
  const t = useTranslations('user.tokenDetails');
  const tCommon = useTranslations('common');
  const { isConnected } = useAccount();
  const [tokenDetails] = useState<TokenDetail[]>(defaultTokenDetails);
  const [isLoading] = useState(false);
  const [error] = useState<string | null>(null);

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
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.3,
        ease: 'easeOut' as const,
      },
    },
  };

  // Calculate total portfolio value
  const totalPortfolioValue = tokenDetails.reduce((sum, token) => sum + token.value, 0);

  return (
    <section className="relative py-20 pt-32 md:py-32 md:pt-52">
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

        {/* Total Portfolio Value */}
        {isConnected && tokenDetails.length > 0 && (
          <motion.div
            variants={itemVariants}
            className="mb-12 md:mb-16"
          >
            <div className="bg-gradient-to-r from-purple-500/20 via-pink-500/20 to-fuchsia-500/20 backdrop-blur-xl border border-purple-500/30 rounded-3xl p-6 md:p-8">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="text-white/70 text-sm md:text-base">
                  {t('totalPortfolioValue')}
                </div>
                <div className="flex items-baseline gap-2">
                  <div className="text-3xl md:text-4xl lg:text-5xl font-bold text-white">
                    {formatCurrency(totalPortfolioValue)}
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
              {tCommon('errors.failedToLoadTokenDetails')}
            </h3>
            <p className="text-white/60">{error}</p>
          </motion.div>
        )}

        {/* Token Details List */}
        {!isLoading && !error && tokenDetails.length > 0 && (
          <motion.div
            variants={itemVariants}
            className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden"
          >
            {tokenDetails.map((token) => (
              <Link
                key={token.id}
                href={`/user/token-details/${token.id}`}
                className="group block relative px-6 py-4 md:px-8 md:py-5 border-b border-white/10 last:border-b-0 hover:bg-white/[0.08] active:bg-white/[0.12] transition-colors duration-150 ease-out cursor-pointer"
              >
                <div className="flex items-center justify-between gap-4">
                  {/* Left: Token Details */}
                  <div className="flex-1 min-w-0">
                    <div className="text-base md:text-lg font-semibold text-white truncate">
                      {token.balance.toLocaleString()} {token.currency}
                    </div>
                  </div>
                  {/* Right: Timestamp and Arrow */}
                  <div className="flex items-center gap-3 md:gap-4 flex-shrink-0">
                    <span className="text-sm md:text-base text-white/70 whitespace-nowrap">
                      {token.timestamp}
                    </span>
                    <svg 
                      className="w-5 h-5 md:w-6 md:h-6 text-white/40 flex-shrink-0 transition-transform duration-150 ease-out group-hover:translate-x-1" 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </Link>
            ))}
          </motion.div>
        )}

        {/* Empty State */}
        {!isLoading && !error && tokenDetails.length === 0 && (
          <motion.div
            className="text-center py-20 bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
          >
            <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">
              {t('empty.title')}
            </h3>
            <p className="text-white/60 mb-6">
              {t('empty.description')}
            </p>
          </motion.div>
        )}
      </motion.div>
    </section>
  );
};

export default TokenDetails;

