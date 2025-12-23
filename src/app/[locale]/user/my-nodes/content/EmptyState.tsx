'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useTranslations } from 'next-intl';

const EmptyState: React.FC = () => {
  const t = useTranslations('network.myNodes');

  return (
    <motion.div
      className="text-center py-20 bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6 }}
    >
      <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-6">
        <svg className="w-8 h-8 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
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
  );
};

export default EmptyState;

