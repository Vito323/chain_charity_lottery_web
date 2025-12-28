'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAccount } from 'wagmi';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { formatCurrency } from '@/utils/currency';
import ConnectButton from '@/components/custom-connect-button/ConnectButton';
import { isMockMode, requireRealCall } from '@/utils/mock';

// Node purchase record interface
interface NodePurchaseRecord {
  id: string;
  nodeType: 'genesis' | 'super' | 'standard';
  purchaseCost: {
    usd: number;
    clt: number;
  };
  purchaseTime: string;
}

// Default mock data based on the image
const defaultPurchaseRecords: NodePurchaseRecord[] = [
  {
    id: '1',
    nodeType: 'genesis',
    purchaseCost: {
      usd: 100000,
      clt: 588235,
    },
    purchaseTime: '2025-08-08 18:18:18',
  },
  {
    id: '2',
    nodeType: 'genesis',
    purchaseCost: {
      usd: 100000,
      clt: 588235,
    },
    purchaseTime: '2025-08-08 18:18:18',
  },
  {
    id: '3',
    nodeType: 'super',
    purchaseCost: {
      usd: 50000,
      clt: 294117,
    },
    purchaseTime: '2025-08-08 18:18:18',
  },
  {
    id: '4',
    nodeType: 'super',
    purchaseCost: {
      usd: 50000,
      clt: 294117,
    },
    purchaseTime: '2025-08-08 18:18:18',
  },
  {
    id: '5',
    nodeType: 'standard',
    purchaseCost: {
      usd: 10000,
      clt: 588235,
    },
    purchaseTime: '2025-08-08 18:18:18',
  },
  {
    id: '6',
    nodeType: 'standard',
    purchaseCost: {
      usd: 10000,
      clt: 588235,
    },
    purchaseTime: '2025-08-08 18:18:18',
  },
  {
    id: '7',
    nodeType: 'standard',
    purchaseCost: {
      usd: 10000,
      clt: 294117,
    },
    purchaseTime: '2025-08-08 18:18:18',
  },
  {
    id: '8',
    nodeType: 'standard',
    purchaseCost: {
      usd: 10000,
      clt: 294117,
    },
    purchaseTime: '2025-08-08 18:18:18',
  },
];

const PurchaseHistory: React.FC = () => {
  const t = useTranslations('network.purchaseHistory');
  const tCommon = useTranslations('common');
  const { isConnected } = useAccount();
  
  // In mock mode, require real API call to fetch purchase history
  useEffect(() => {
    if (isMockMode()) {
      requireRealCall('Fetch node purchase history', 'network');
    }
  }, []);
  
  const [purchaseRecords] = useState<NodePurchaseRecord[]>(defaultPurchaseRecords);
  const [isLoading] = useState(false);
  const [error] = useState<string | null>(null);

  // Get node type display name
  const getNodeTypeName = (type: 'genesis' | 'super' | 'standard'): string => {
    switch (type) {
      case 'genesis':
        return tCommon('nodeTypes.genesis');
      case 'super':
        return tCommon('nodeTypes.super');
      case 'standard':
        return tCommon('nodeTypes.standard');
      default:
        return tCommon('nodeTypes.node');
    }
  };

  // Get node type badge color
  const getNodeTypeBadge = (type: 'genesis' | 'super' | 'standard') => {
    switch (type) {
      case 'genesis':
        return 'from-purple-500 to-pink-500';
      case 'super':
        return 'from-blue-500 to-cyan-500';
      case 'standard':
        return 'from-emerald-500 to-teal-500';
      default:
        return 'from-gray-500 to-gray-600';
    }
  };

  // Format purchase time
  const formatPurchaseTime = (timeString: string) => {
    try {
      const [date, time] = timeString.split(' ');
      const [year, month, day] = date.split('-');
      const [hour, minute, second] = time.split(':');
      const dateObj = new Date(
        parseInt(year),
        parseInt(month) - 1,
        parseInt(day),
        parseInt(hour),
        parseInt(minute),
        parseInt(second)
      );
      
      return {
        date: dateObj.toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
        }),
        time: dateObj.toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        }),
        full: `${date} ${time}`,
      };
    } catch {
      return {
        date: timeString.split(' ')[0] || '',
        time: timeString.split(' ')[1] || '',
        full: timeString,
      };
    }
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

  // Calculate totals
  const totalPurchaseCost = purchaseRecords.reduce((sum, record) => sum + record.purchaseCost.usd, 0);
  const totalNodes = purchaseRecords.length;

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
        {/* <motion.div variants={itemVariants} className="text-center mb-16">
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
        </motion.div> */}

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

        {/* Summary Cards */}
        {isConnected && purchaseRecords.length > 0 && (
          <motion.div
            variants={itemVariants}
            className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-12"
          >
            <motion.div
              className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6"
              whileHover={{ scale: 1.02, y: -4 }}
              transition={{ duration: 0.2 }}
            >
              <div className="text-sm text-white/60 mb-2">{t('summary.totalPurchaseCost')}</div>
              <div className="text-2xl md:text-3xl font-bold text-white mb-1">
                {formatCurrency(totalPurchaseCost)}
              </div>
              <div className="text-xs text-white/50">{t('summary.acrossAllPurchases')}</div>
            </motion.div>

            <motion.div
              className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6"
              whileHover={{ scale: 1.02, y: -4 }}
              transition={{ duration: 0.2 }}
            >
              <div className="text-sm text-white/60 mb-2">{t('summary.totalNodesPurchased')}</div>
              <div className="text-2xl md:text-3xl font-bold text-purple-400 mb-1">
                {totalNodes}
              </div>
              <div className="text-xs text-white/50">{t('summary.totalPurchaseCount')}</div>
            </motion.div>
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
              {tCommon('errors.failedToLoadPurchaseHistory')}
            </h3>
            <p className="text-white/60">{error}</p>
          </motion.div>
        )}

        {/* Purchase Records Table */}
        {!isLoading && !error && isConnected && purchaseRecords.length > 0 && (
          <motion.div
            variants={itemVariants}
            className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden"
          >
            {/* Desktop Table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full">
                <thead className="bg-white/5 border-b border-white/10">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-white/80 uppercase tracking-wider">
                      {t('table.node')}
                    </th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-white/80 uppercase tracking-wider">
                      {t('table.purchaseCost')}
                    </th>
                    <th className="px-6 py-4 text-right text-sm font-semibold text-white/80 uppercase tracking-wider">
                      {t('table.purchaseTime')}
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10">
                  {purchaseRecords.map((record, index) => {
                    const timeFormatted = formatPurchaseTime(record.purchaseTime);
                    return (
                      <motion.tr
                        key={record.id}
                        className="hover:bg-white/5 transition-all duration-200"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        whileHover={{ scale: 1.01 }}
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-3">
                            <span
                              className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r ${getNodeTypeBadge(record.nodeType)} text-white`}
                            >
                              {getNodeTypeName(record.nodeType)}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <div className="text-sm font-medium text-white">
                            {formatCurrency(record.purchaseCost.usd)}
                          </div>
                          <div className="text-xs text-white/60">
                            {record.purchaseCost.clt.toLocaleString()} CCT
                          </div>
                        </td>
                        <td className="px-6 py-4 text-right whitespace-nowrap">
                          <div className="text-sm font-medium text-white">
                            {timeFormatted.date}
                          </div>
                          <div className="text-xs text-white/60">
                            {timeFormatted.time}
                          </div>
                        </td>
                      </motion.tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards */}
            <div className="md:hidden divide-y divide-white/10">
              {purchaseRecords.map((record, index) => {
                const timeFormatted = formatPurchaseTime(record.purchaseTime);
                return (
                  <motion.div
                    key={record.id}
                    className="p-4 space-y-3"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <div className="flex items-center justify-between">
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r ${getNodeTypeBadge(record.nodeType)} text-white`}
                      >
                        {getNodeTypeName(record.nodeType)}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div>
                        <div className="text-white/60 text-xs mb-1">{t('table.purchaseCost')}</div>
                        <div className="text-white font-medium">
                          {formatCurrency(record.purchaseCost.usd)}
                        </div>
                        <div className="text-white/60 text-xs">
                          {record.purchaseCost.clt.toLocaleString()} CCT
                        </div>
                      </div>
                      
                      <div>
                        <div className="text-white/60 text-xs mb-1">{t('table.purchaseTime')}</div>
                        <div className="text-white font-medium text-xs">
                          {timeFormatted.date}
                        </div>
                        <div className="text-white/60 text-xs">
                          {timeFormatted.time}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        )}

        {/* Empty State */}
        {!isLoading && !error && isConnected && purchaseRecords.length === 0 && (
          <motion.div
            className="text-center py-20 bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
          >
            <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">
              {t('empty.title')}
            </h3>
            <p className="text-white/60 mb-6">
              {t('empty.description')}
            </p>
            <Link
              href="/network"
              className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-purple-600 to-pink-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-purple-500/30 hover:from-purple-700 hover:to-pink-700 transition-all duration-300"
            >
              {t('empty.browseNodeTiers')}
            </Link>
          </motion.div>
        )}
      </motion.div>
    </section>
  );
};

export default PurchaseHistory;

