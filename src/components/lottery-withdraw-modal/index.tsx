'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAccount } from 'wagmi';
import { useTranslations } from 'next-intl';
import { formatAddress } from '@/components/custom-connect-button/utils';

interface LotteryWithdrawModalProps {
  isOpen: boolean;
  onClose: () => void;
  withdrawAmount: string;
  onConfirmWithdraw?: () => void | Promise<void>;
}

const LotteryWithdrawModal: React.FC<LotteryWithdrawModalProps> = ({
  isOpen,
  onClose,
  withdrawAmount,
  onConfirmWithdraw,
}) => {
  const t = useTranslations('lottery.withdraw');
  const tCommon = useTranslations('common');
  const { isConnected, address } = useAccount();
  const [isProcessing, setIsProcessing] = React.useState(false);

  // 格式化金额，保留5位小数
  const formatAmount = (amount: string): string => {
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount)) return '0.000000';
    return numAmount.toFixed(6);
  };

  // 当Modal关闭时重置所有状态
  React.useEffect(() => {
    if (!isOpen) {
      setIsProcessing(false);
    }
  }, [isOpen]);

  const handleConfirmWithdraw = async () => {
    if (!isConnected || !address || isProcessing) {
      return;
    }

    setIsProcessing(true);

    try {
      // 调用提现函数（待实现）
      await onConfirmWithdraw?.();
    } catch (error) {
      console.error('Withdraw failed:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-100 flex items-center justify-center p-4"
        onClick={onClose}
      >
        {/* Backdrop */}
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

        {/* Modal */}
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 20 }}
          transition={{ type: 'spring', duration: 0.3 }}
          className="relative w-full max-w-md bg-linear-to-b from-slate-900 via-slate-950 to-slate-900 border border-white/10 rounded-3xl shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="p-6 sm:p-8 space-y-6 relative">
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-6 right-6 sm:top-8 sm:right-8 z-10 p-2 rounded-full bg-white/5 hover:bg-white/10 text-white/70 hover:text-white transition-colors cursor-pointer"
              aria-label={tCommon('accessibility.close')}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Header Section */}
            <div className="space-y-4 pt-2 pr-12 sm:pr-16">
              <h2 className="text-xl sm:text-2xl font-bold text-white">
                {t('modal.title')}
              </h2>
            </div>

            {/* Withdraw Amount */}
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4 sm:p-5">
              <div className="flex items-center justify-between">
                <div className="text-sm sm:text-base text-white/70">
                  {t('modal.amount')}
                </div>
                <div className="text-xl sm:text-2xl font-bold text-white">
                  {formatAmount(withdrawAmount)} USDT
                </div>
              </div>
            </div>

            {/* Withdraw Address */}
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4 sm:p-5">
              <div className="space-y-2">
                <div className="text-sm sm:text-base text-white/70">
                  {t('modal.address')}
                </div>
                <div className="text-base sm:text-lg font-mono font-semibold text-white">
                  {address ? formatAddress(address) : '--'}
                </div>
              </div>
            </div>

            {/* Confirm Withdraw Button */}
            <button
              onClick={handleConfirmWithdraw}
              disabled={!isConnected || !address || isProcessing}
              className={`w-full rounded-full py-4 px-6 text-base sm:text-lg font-semibold transition-all duration-300 flex items-center justify-center gap-2 ${
                !isConnected || !address || isProcessing
                  ? 'bg-gray-600/50 text-gray-400 cursor-not-allowed'
                  : 'bg-linear-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700 shadow-lg shadow-purple-500/30 cursor-pointer'
              }`}
            >
              {isProcessing ? (
                <>
                  <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  {tCommon('actions.processing')}
                </>
              ) : !isConnected ? (
                tCommon('actions.connectWalletFirst')
              ) : (
                t('modal.confirm')
              )}
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default LotteryWithdrawModal;

