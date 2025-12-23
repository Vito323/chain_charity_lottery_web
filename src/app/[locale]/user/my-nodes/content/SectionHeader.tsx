'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';

interface SectionHeaderProps {
  variants: any;
}

const SectionHeader: React.FC<SectionHeaderProps> = ({ variants }) => {
  const t = useTranslations('network.myNodes');

  return (
    <motion.div 
      variants={variants} 
      className="text-center mb-16"
    >
      <motion.div
        className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full border border-white/15 bg-white/5 backdrop-blur-sm text-white/90 mb-6"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut', delay: 0.2 }}
      >
        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
        <span className="text-sm">{t('badge')}</span>
      </motion.div>

      <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
        {t('title')} <span className="bg-linear-to-r from-purple-300 via-pink-300 to-fuchsia-300 bg-clip-text text-transparent">{t('titleHighlight')}</span>
      </h2>
      <p className="text-lg md:text-xl text-white/80 max-w-3xl mx-auto leading-relaxed">
        {t('subtitle')}
      </p>
    </motion.div>
  );
};

export default SectionHeader;

