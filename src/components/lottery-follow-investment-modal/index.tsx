'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAccount } from 'wagmi';
import { useTranslations } from 'next-intl';

interface LotteryFollowInvestmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  ticketId: string;
  redemptionCost: number; // 彩票兑换成本（CLT）
  maxPrize?: string; // 最大奖金（用于计算说明）
  onConfirmFollow?: (shares: number) => void;
  mockMode?: boolean; // 允许在未连接钱包时测试
}

const LotteryFollowInvestmentModal: React.FC<LotteryFollowInvestmentModalProps> = ({
  isOpen,
  onClose,
  ticketId,
  redemptionCost,
  maxPrize = '$1,000',
  onConfirmFollow,
  mockMode = false,
}) => {
  const t = useTranslations('lottery.modals.follow');
  const tCommon = useTranslations('common');
  const { isConnected } = useAccount();
  const canProceed = mockMode || isConnected;
  const [shares, setShares] = useState(1);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  // 当Modal关闭时重置所有状态
  useEffect(() => {
    if (!isOpen) {
      setShares(1);
      setAcceptedTerms(false);
      setIsProcessing(false);
    }
  }, [isOpen]);

  // 计算实付价
  const actualPayment = shares * 10; // 每份10 CLT（根据图片显示）

  // 处理份数变化
  const handleSharesChange = (delta: number) => {
    setShares((prev) => {
      const newShares = prev + delta;
      if (newShares < 1) return 1;
      return newShares;
    });
  };

  const handleSharesInput = (value: string) => {
    const numValue = parseInt(value, 10);
    if (isNaN(numValue) || numValue < 1) {
      setShares(1);
      return;
    }
    setShares(numValue);
  };

  const handleConfirmFollow = async () => {
    if (!canProceed || !acceptedTerms || isProcessing) {
      return;
    }

    setIsProcessing(true);

    try {
      // Mock跟投流程 - 模拟异步操作
      console.log('Processing follow investment for ticket:', ticketId, 'shares:', shares);
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // 关闭Modal
      onClose();

      // 触发成功回调（在Modal关闭后）
      if (onConfirmFollow) {
        setTimeout(() => {
          onConfirmFollow(shares);
        }, 100);
      }
    } catch (error) {
      console.error('Follow investment failed:', error);
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
        className="fixed inset-0 z-[100] flex items-center justify-center p-4"
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
          className="relative w-full max-w-md max-h-[90vh] overflow-y-auto bg-gradient-to-b from-slate-900 via-slate-950 to-slate-900 border border-white/10 rounded-3xl shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="p-4 sm:p-6 md:p-8 space-y-4 sm:space-y-6 relative">
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 sm:top-6 sm:right-6 z-10 p-2 rounded-full bg-white/5 hover:bg-white/10 text-white/70 hover:text-white transition-colors cursor-pointer"
              aria-label={tCommon('accessibility.close')}
            >
              <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Header Section */}
            <div className="space-y-4 pt-2 pr-10 sm:pr-12">
              <h2 className="text-xl sm:text-2xl font-bold text-white">{t('title')}</h2>
            </div>

            {/* Redemption Cost */}
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4 sm:p-5">
              <div className="flex items-center justify-between">
                <div className="text-sm sm:text-base text-white/70">{t('redemptionCost')}</div>
                <div className="text-xl sm:text-2xl font-bold text-white">
                  {redemptionCost.toLocaleString()} CLT
                </div>
              </div>
            </div>

            {/* Shares Input */}
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4 sm:p-5">
              <div className="flex items-center justify-between mb-3 sm:mb-4">
                <div className="text-sm sm:text-base text-white/70">{t('numberOfShares')}</div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleSharesChange(-1)}
                    disabled={shares <= 1}
                    className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center text-white cursor-pointer transition-colors"
                    aria-label={tCommon('accessibility.decreaseShares')}
                  >
                    <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                    </svg>
                  </button>
                  <input
                    type="number"
                    value={shares}
                    onChange={(e) => handleSharesInput(e.target.value)}
                    min={1}
                    className="w-16 sm:w-20 h-8 sm:h-10 text-center bg-white/5 border border-white/20 rounded-lg text-white text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-purple-500/50 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  />
                  <button
                    onClick={() => handleSharesChange(1)}
                    className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 flex items-center justify-center text-white cursor-pointer transition-colors"
                    aria-label={tCommon('accessibility.increaseShares')}
                  >
                    <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            {/* Actual Payment Price */}
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4 sm:p-5">
              <div className="flex items-center justify-between">
                <div className="text-sm sm:text-base text-white/70">{t('actualPaymentPrice')}</div>
                <div className="text-xl sm:text-2xl font-bold text-white">
                  {actualPayment.toLocaleString()} CLT
                </div>
              </div>
            </div>

            {/* Reward Calculation Formula */}
            <div className="rounded-xl border border-white/10 bg-white/5 p-3 sm:p-4">
              <p className="text-xs sm:text-sm text-white/60 leading-relaxed">
                {t('rewardFormula')}
              </p>
            </div>

            {/* Terms and Conditions */}
            <div className="flex items-start gap-3">
              <input
                type="checkbox"
                id="terms-checkbox-follow"
                checked={acceptedTerms}
                onChange={(e) => setAcceptedTerms(e.target.checked)}
                className="mt-1 w-5 h-5 rounded border-white/20 bg-white/5 text-purple-500 focus:ring-2 focus:ring-purple-500/50 cursor-pointer flex-shrink-0"
              />
              <label htmlFor="terms-checkbox-follow" className="flex-1 text-xs sm:text-sm md:text-base text-white/70 cursor-pointer">
                {tCommon('terms.accept')}{' '}
                <a href="#" className="text-purple-400 hover:text-purple-300 underline">
                  {tCommon('terms.service')}
                </a>{' '}
                {tCommon('terms.and')}{' '}
                <a href="#" className="text-purple-400 hover:text-purple-300 underline">
                  {tCommon('terms.privacy')}
                </a>
              </label>
            </div>

            {/* Confirm Follow Investment Button */}
            <button
              onClick={handleConfirmFollow}
              disabled={!canProceed || !acceptedTerms || isProcessing}
              className={`w-full rounded-full py-3 sm:py-4 px-6 text-sm sm:text-base md:text-lg font-semibold transition-all duration-300 flex items-center justify-center gap-2 ${
                !canProceed || !acceptedTerms || isProcessing
                  ? 'bg-gray-600/50 text-gray-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700 shadow-lg shadow-purple-500/30 cursor-pointer'
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
              ) : !canProceed ? (
                tCommon('actions.connectWalletFirst')
              ) : (
                t('confirm')
              )}
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default LotteryFollowInvestmentModal;

