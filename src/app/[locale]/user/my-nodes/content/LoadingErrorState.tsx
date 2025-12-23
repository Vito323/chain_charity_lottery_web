'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';

interface LoadingErrorStateProps {
  isLoading: boolean;
  error: string | null;
}

const LoadingErrorState: React.FC<LoadingErrorStateProps> = ({ isLoading, error }) => {
  const tCommon = useTranslations('common');
  const t = useTranslations('network.myNodes');

  if (isLoading) {
    return (
      <motion.div
        className="text-center py-20 bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
      >
        <div className="w-8 h-8 border-2 border-white/30 border-t-white rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-white/80">{tCommon('status.loading')}</p>
      </motion.div>
    );
  }

  if (error) {
    return (
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
          {tCommon('errors.failedToLoadNodeHoldings')}
        </h3>
        <p className="text-white/60">{error}</p>
      </motion.div>
    );
  }

  return null;
};

export default LoadingErrorState;

