"use client";
import React from "react";
import { motion } from "framer-motion";
import { useTranslations } from 'next-intl';

interface DonateButtonProps {
  isConnected: boolean;
  isProcessing: boolean;
  donationLoading: boolean;
  donationSuccess: boolean;
  amount: string;
  onClick: () => void;
}

export const DonateButton: React.FC<DonateButtonProps> = ({
  isConnected,
  isProcessing,
  donationLoading,
  donationSuccess,
  amount,
  onClick,
}) => {
  const t = useTranslations('donate');
  const tCommon = useTranslations('common');

  const isDisabled = isProcessing || donationLoading || (isConnected && (!amount || parseFloat(amount) <= 0));

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={`w-full py-4 px-6 rounded-xl font-semibold text-lg transition-all duration-300 ${
        isProcessing
          ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30 cursor-not-allowed'
          : donationSuccess
          ? 'bg-green-500/20 text-green-400 border border-green-500/30 cursor-default'
          : isConnected && amount && parseFloat(amount) > 0
          ? 'bg-linear-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white shadow-lg hover:shadow-purple-500/25'
          : 'bg-white/10 text-white/60 border border-white/20 cursor-not-allowed'
      }`}
      onClick={onClick}
      disabled={isDisabled}
    >
      {isProcessing || donationLoading ? (
        <div className="flex items-center justify-center gap-2">
          <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          {tCommon('actions.processing')}
        </div>
      ) : donationSuccess ? (
        <div className="flex items-center justify-center gap-2">
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
          {t('donationSuccessful')}
        </div>
      ) : isConnected ? (
        tCommon('actions.donateNow')
      ) : (
        tCommon('actions.connectWallet')
      )}
    </motion.button>
  );
};

