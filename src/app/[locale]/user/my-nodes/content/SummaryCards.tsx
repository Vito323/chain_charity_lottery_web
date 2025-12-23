'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { formatCurrency } from '@/utils/currency';
import { NodeHolding } from './types';

interface SummaryCardsProps {
  variants: any;
  nodeHoldings: NodeHolding[];
}

const SummaryCards: React.FC<SummaryCardsProps> = ({ variants, nodeHoldings }) => {
  const t = useTranslations('network.myNodes');

  // Calculate totals
  const totalPurchaseCost = nodeHoldings.reduce((sum, node) => sum + node.purchaseCost.usd, 0);
  const totalYesterdayEarnings = nodeHoldings.reduce((sum, node) => sum + node.yesterdayEarnings.amount, 0);
  const totalAccumulatedEarnings = nodeHoldings.reduce((sum, node) => sum + node.accumulatedEarnings, 0);

  return (
    <motion.div
      variants={variants}
      initial="hidden"
      animate="visible"
      className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-12"
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
        <div className="text-xs text-white/50">{t('summary.acrossAllNodes')}</div>
      </motion.div>

      <motion.div
        className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6"
        whileHover={{ scale: 1.02, y: -4 }}
        transition={{ duration: 0.2 }}
      >
        <div className="text-sm text-white/60 mb-2">{t('summary.yesterdayEarnings')}</div>
        <div className="text-2xl md:text-3xl font-bold text-emerald-400 mb-1">
          +{formatCurrency(totalYesterdayEarnings)}
        </div>
        <div className="text-xs text-white/50">{t('summary.totalDailyReturn')}</div>
      </motion.div>

      <motion.div
        className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6"
        whileHover={{ scale: 1.02, y: -4 }}
        transition={{ duration: 0.2 }}
      >
        <div className="text-sm text-white/60 mb-2">{t('summary.accumulatedEarnings')}</div>
        <div className="text-2xl md:text-3xl font-bold text-purple-400 mb-1">
          +{formatCurrency(totalAccumulatedEarnings)}
        </div>
        <div className="text-xs text-white/50">{t('summary.totalReturnsToDate')}</div>
      </motion.div>
    </motion.div>
  );
};

export default SummaryCards;

