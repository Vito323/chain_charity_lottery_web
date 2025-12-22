'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import ConnectButton from '@/components/custom-connect-button/ConnectButton';

interface ConnectWalletPromptProps {
  variants: any;
}

const ConnectWalletPrompt: React.FC<ConnectWalletPromptProps> = ({ variants }) => {
  const t = useTranslations('network.myNodes');

  return (
    <motion.div
      variants={variants}
      initial="hidden"
      animate="visible"
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
  );
};

export default ConnectWalletPrompt;

