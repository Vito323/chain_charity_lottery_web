'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAccount } from 'wagmi';
import { useTranslations } from 'next-intl';
import { ServiceAgreementModal } from '@/components/service-agreement-modal';
import { PrivacyPolicyModal } from '@/components/privacy-policy-modal';

interface LotteryRedemptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  ticketId: string;
  redemptionPrice: number; // 兑换价格或售价（CCT）
  onConfirmRedemption?: () => void | Promise<void>;
  type?: 'redemption' | 'purchase'; // 类型：兑换或购买
}

const LotteryRedemptionModal: React.FC<LotteryRedemptionModalProps> = ({
  isOpen,
  onClose,
  ticketId,
  redemptionPrice,
  onConfirmRedemption,
  type = 'redemption',
}) => {
  const t = useTranslations('lottery.modals.redemption');
  const tCommon = useTranslations('common');
  const { isConnected } = useAccount();
  const isPurchaseType = type === 'purchase';
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showServiceAgreement, setShowServiceAgreement] = useState(false);
  const [showPrivacyPolicy, setShowPrivacyPolicy] = useState(false);
  const [mounted, setMounted] = useState(false);

  // 处理 mounted 状态
  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  // 当Modal关闭时重置所有状态
  useEffect(() => {
    if (!isOpen) {
      setAcceptedTerms(false);
      setIsProcessing(false);
      setShowServiceAgreement(false);
      setShowPrivacyPolicy(false);
    }
  }, [isOpen]);

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

  const handleConfirmRedemption = async () => {
    if (!isConnected || !acceptedTerms || isProcessing) {
      return;
    }

    setIsProcessing(true);

    try {
      // 调用真实的兑换函数
      // 注意：不在这里关闭 modal，由父组件控制关闭时机
      await onConfirmRedemption?.();
      // 如果 onConfirmRedemption 成功执行且没有抛出错误，父组件会负责关闭 modal
      // 如果抛出错误，则重置 processing 状态，保持 modal 打开
    } catch (error) {
      console.error('Redemption failed:', error);
      // 错误处理由父组件的 onConfirmRedemption 负责，这里只重置 processing 状态
      // 保持 modal 打开，让用户可以重试
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
                {isPurchaseType ? t('title.purchase') : t('title.redemption')}
              </h2>
            </div>

            {/* Price */}
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4 sm:p-5">
              <div className="flex items-center justify-between">
                <div className="text-sm sm:text-base text-white/70">
                  {isPurchaseType ? t('salePrice') : t('redemptionPrice')}
                </div>
                <div className="text-xl sm:text-2xl font-bold text-white">
                  {redemptionPrice.toLocaleString()} CCT
                </div>
              </div>
            </div>

            {/* Actual Payment Price */}
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4 sm:p-5">
              <div className="flex items-center justify-between">
                <div className="text-sm sm:text-base text-white/70">{t('actualPaymentPrice')}</div>
                <div className="text-xl sm:text-2xl font-bold text-white">
                  {redemptionPrice.toLocaleString()} CCT
                </div>
              </div>
            </div>

            {/* Terms and Conditions */}
            <div className="flex items-start gap-3">
              <input
                type="checkbox"
                id="terms-checkbox-redemption"
                checked={acceptedTerms}
                onChange={(e) => setAcceptedTerms(e.target.checked)}
                className="mt-1 w-5 h-5 rounded border-white/20 bg-white/5 text-purple-500 focus:ring-2 focus:ring-purple-500/50 cursor-pointer shrink-0"
              />
              <label htmlFor="terms-checkbox-redemption" className="flex-1 text-sm sm:text-base text-white/70 cursor-pointer">
                {tCommon('terms.accept')}{' '}
                {/* <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setShowServiceAgreement(true);
                  }}
                  className="text-purple-400 hover:text-purple-300 underline bg-transparent border-0 p-0 cursor-pointer"
                >
                  {tCommon('terms.service')}
                </button>{' '} */}
                {/* {tCommon('terms.and')}{' '} */}
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

            {/* Confirm Redemption Button */}
            <button
              onClick={handleConfirmRedemption}
              disabled={!isConnected || !acceptedTerms || isProcessing}
              className={`w-full rounded-full py-4 px-6 text-base sm:text-lg font-semibold transition-all duration-300 flex items-center justify-center gap-2 ${
                !isConnected || !acceptedTerms || isProcessing
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
                isPurchaseType ? t('confirmPurchase') : t('confirmRedemption')
              )}
            </button>
          </div>
        </motion.div>
      </motion.div>
      {/* <ServiceAgreementModal
        show={showServiceAgreement}
        isNFT
        onClose={() => setShowServiceAgreement(false)}
        mounted={mounted}
      /> */}
      <PrivacyPolicyModal
        isNFT
        show={showPrivacyPolicy}
        onClose={() => setShowPrivacyPolicy(false)}
        mounted={mounted}
      />
    </AnimatePresence>
  );
};

export default LotteryRedemptionModal;

