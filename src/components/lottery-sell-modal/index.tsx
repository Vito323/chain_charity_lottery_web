'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAccount } from 'wagmi';
import { useTranslations } from 'next-intl';
import { isMockMode, requireRealCall } from '@/utils/mock';
import { ServiceAgreementModal } from '@/components/service-agreement-modal';
import { PrivacyPolicyModal } from '@/components/privacy-policy-modal';

interface LotterySellModalProps {
  isOpen: boolean;
  onClose: () => void;
  ticketId: string;
  purchasePrice: number; // 购买价格（CCT）
  onConfirmSell?: (salePrice: number, duration: number) => void;
  mockMode?: boolean; // 允许在未连接钱包时测试
}

const LotterySellModal: React.FC<LotterySellModalProps> = ({
  isOpen,
  onClose,
  ticketId,
  purchasePrice,
  onConfirmSell,
  mockMode = false,
}) => {
  const t = useTranslations('lottery.modals.sell');
  const tCommon = useTranslations('common');
  const { isConnected } = useAccount();
  const canProceed = mockMode || isConnected;
  const [salePrice, setSalePrice] = useState<string>(purchasePrice.toLocaleString());
  const [duration, setDuration] = useState<string>('7');
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showServiceAgreement, setShowServiceAgreement] = useState(false);
  const [showPrivacyPolicy, setShowPrivacyPolicy] = useState(false);
  const [mounted, setMounted] = useState(false);

  // 计算手续费
  const serviceFeeRate = 0.025; // 2.5%
  const creatorFeeRate = 0.002; // 0.2%
  const numericSalePrice = parseFloat(salePrice.replace(/,/g, '')) || 0;

  // 处理 mounted 状态
  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  // 当Modal关闭时重置所有状态
  useEffect(() => {
    if (!isOpen) {
      setSalePrice(purchasePrice.toLocaleString());
      setDuration('7');
      setAcceptedTerms(false);
      setIsProcessing(false);
      setShowServiceAgreement(false);
      setShowPrivacyPolicy(false);
    }
  }, [isOpen, purchasePrice]);

  // 处理 body 滚动
  useEffect(() => {
    if (showServiceAgreement || showPrivacyPolicy) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [showServiceAgreement, showPrivacyPolicy]);

  // 格式化数字输入
  const handleSalePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^\d]/g, '');
    if (value === '') {
      setSalePrice('');
      return;
    }
    const numValue = parseFloat(value);
    if (!isNaN(numValue)) {
      setSalePrice(numValue.toLocaleString());
    }
  };

  const handleDurationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^\d]/g, '');
    setDuration(value);
  };

  const handleConfirmSell = async () => {
    if (!canProceed || !acceptedTerms || isProcessing || numericSalePrice <= 0 || !duration || parseInt(duration) <= 0) {
      return;
    }

    setIsProcessing(true);

    try {
      // 模拟加载过程
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // In mock mode, require real API call or wallet transaction
      if (isMockMode()) {
        requireRealCall(`Lottery sell for ticket ${ticketId} with price ${numericSalePrice} and duration ${duration}`, 'server');
        setIsProcessing(false);
        return;
      }

      // Mock出售流程 - 模拟异步操作
      console.log('Processing sell for ticket:', ticketId, 'Price:', numericSalePrice, 'Duration:', duration);

      // 关闭Modal
      onClose();

      // 触发成功回调（在Modal关闭后）
      if (onConfirmSell) {
        // 使用 setTimeout 确保 Modal 关闭动画完成后再触发成功回调
        setTimeout(() => {
          onConfirmSell(numericSalePrice, parseInt(duration));
        }, 100);
      }
    } catch (error) {
      console.error('Sell failed:', error);
      setIsProcessing(false);
    }
  };

  const isFormValid = numericSalePrice > 0 && duration && parseInt(duration) > 0 && acceptedTerms;

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
          className="relative w-full max-w-md bg-gradient-to-b from-slate-900 via-slate-950 to-slate-900 border border-white/10 rounded-3xl shadow-2xl"
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
            <div className="pt-2 pr-12 sm:pr-16">
              <h2 className="text-xl sm:text-2xl font-bold text-white">{t('title')}</h2>
            </div>

            {/* Content Area */}
            <div className="space-y-4">
              {/* Sale Price Input */}
              <div className="space-y-3">
                <label className="text-sm sm:text-base text-white/70 block mb-2">{t('salePrice')}</label>
                <div className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 p-4">
                  <input
                    type="text"
                    value={salePrice}
                    onChange={handleSalePriceChange}
                    placeholder="0"
                    className="flex-1 bg-transparent text-white text-lg sm:text-xl font-semibold outline-none placeholder:text-white/30"
                  />
                  <span className="text-white/70 text-sm sm:text-base">CCT</span>
                </div>
              </div>

              {/* Duration Input */}
              <div className="space-y-3">
                <label className="text-sm sm:text-base text-white/70 block mb-2">{t('saleDuration')}</label>
                <div className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 p-4">
                  <input
                    type="text"
                    value={duration}
                    onChange={handleDurationChange}
                    placeholder="7"
                    className="flex-1 bg-transparent text-white text-lg sm:text-xl font-semibold outline-none placeholder:text-white/30"
                  />
                  <span className="text-white/70 text-sm sm:text-base">{tCommon('time.days')}</span>
                </div>
              </div>

              {/* Fees Section */}
              <div className="space-y-3 rounded-2xl border border-white/10 bg-white/5 p-4">
                <h3 className="text-sm sm:text-base font-semibold text-white/70">{t('handlingFee')}</h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm sm:text-base">
                    <span className="text-white/60">{t('serviceFee')}</span>
                    <span className="text-white font-semibold">{serviceFeeRate * 100}%</span>
                  </div>
                  <div className="flex items-center justify-between text-sm sm:text-base">
                    <span className="text-white/60">{t('creatorFee')}</span>
                    <span className="text-white font-semibold">{creatorFeeRate * 100}%</span>
                  </div>
                </div>
              </div>

              {/* Terms and Conditions */}
              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  id="terms-checkbox-sell"
                  checked={acceptedTerms}
                  onChange={(e) => setAcceptedTerms(e.target.checked)}
                  className="mt-1 w-5 h-5 rounded border-white/20 bg-white/5 text-purple-500 focus:ring-2 focus:ring-purple-500/50 cursor-pointer flex-shrink-0"
                />
                <label htmlFor="terms-checkbox-sell" className="flex-1 text-sm sm:text-base text-white/70 cursor-pointer">
                  {tCommon('terms.accept')}{' '}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setShowServiceAgreement(true);
                    }}
                    className="text-purple-400 hover:text-purple-300 underline bg-transparent border-0 p-0 cursor-pointer"
                  >
                    {tCommon('terms.service')}
                  </button>{' '}
                  {tCommon('terms.and')}{' '}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setShowPrivacyPolicy(true);
                    }}
                    className="text-purple-400 hover:text-purple-300 underline bg-transparent border-0 p-0 cursor-pointer"
                  >
                    {tCommon('terms.privacy')}
                  </button>
                </label>
              </div>
            </div>

            {/* Confirm Sell Button */}
            <button
              onClick={handleConfirmSell}
                disabled={!canProceed || !isFormValid || isProcessing}
                className={`w-full rounded-full py-4 px-6 text-base sm:text-lg font-semibold transition-all duration-300 flex items-center justify-center gap-2 ${
                  !canProceed || !isFormValid || isProcessing
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
                  t('confirmSubmission')
                )}
            </button>
          </div>
        </motion.div>
      </motion.div>
      <ServiceAgreementModal
        show={showServiceAgreement}
        onClose={() => setShowServiceAgreement(false)}
        mounted={mounted}
      />
      <PrivacyPolicyModal
        show={showPrivacyPolicy}
        onClose={() => setShowPrivacyPolicy(false)}
        mounted={mounted}
      />
    </AnimatePresence>
  );
};

export default LotterySellModal;

