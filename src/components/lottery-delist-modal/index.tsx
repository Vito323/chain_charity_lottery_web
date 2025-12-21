'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { useTranslations } from 'next-intl';

interface LotteryDelistModalProps {
  isOpen: boolean;
  onClose: () => void;
  ticketId: string;
  ticketImage?: string;
  onConfirmDelist?: () => void;
}

const LotteryDelistModal: React.FC<LotteryDelistModalProps> = ({
  isOpen,
  onClose,
  ticketId,
  ticketImage = '/images/placeholder-all.png',
  onConfirmDelist,
}) => {
  const t = useTranslations('lottery.modals.delist');
  const tCommon = useTranslations('common');
  const [isProcessing, setIsProcessing] = useState(false);

  // 当Modal关闭时重置所有状态
  useEffect(() => {
    if (!isOpen) {
      setIsProcessing(false);
    }
  }, [isOpen]);

  const handleConfirmDelist = async () => {
    if (isProcessing) {
      return;
    }

    setIsProcessing(true);

    try {
      // Mock下架流程 - 模拟异步操作
      console.log('Processing delist for ticket:', ticketId);
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // 关闭Modal
      onClose();

      // 触发成功回调（在Modal关闭后）
      if (onConfirmDelist) {
        // 使用 setTimeout 确保 Modal 关闭动画完成后再触发成功回调
        setTimeout(() => {
          onConfirmDelist();
        }, 100);
      }
    } catch (error) {
      console.error('Delist failed:', error);
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
          className="relative w-full max-w-lg bg-gradient-to-b from-slate-900 via-slate-950 to-slate-900 border border-white/10 rounded-3xl shadow-2xl"
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

            {/* Title */}
            <div className="pt-2 pr-12 sm:pr-16">
              <h2 className="text-xl sm:text-2xl font-bold text-white">{t('title')}</h2>
            </div>

            {/* Content Area - Flexbox Layout */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6">
              {/* Left: Ticket Image */}
              <div className="flex-shrink-0 w-full sm:w-auto">
                <div className="relative w-full sm:w-32 md:w-40 aspect-[3/4] rounded-xl overflow-hidden border border-white/10 bg-gradient-to-br from-slate-800 to-slate-900">
                  <Image
                    src={ticketImage}
                    alt={`${tCommon('images.lotteryTicket')} ${ticketId}`}
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 100vw, 160px"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = '/images/placeholder-all.png';
                    }}
                  />
                </div>
              </div>

              {/* Right: Description Text */}
              <div className="flex-1 flex items-center">
                <p className="text-sm sm:text-base text-white/70 leading-relaxed">
                  {t('description')}
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 sm:gap-4 pt-2">
              {/* Cancel Button */}
              <button
                onClick={onClose}
                disabled={isProcessing}
                className="flex-1 sm:flex-none px-6 sm:px-8 py-3 sm:py-3.5 rounded-xl font-semibold text-sm sm:text-base bg-white/10 text-white border border-white/20 hover:bg-white/20 transition-all duration-300 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {tCommon('actions.cancel')}
              </button>

              {/* Confirm Button */}
              <button
                onClick={handleConfirmDelist}
                disabled={isProcessing}
                className={`flex-1 sm:flex-none px-6 sm:px-8 py-3 sm:py-3.5 rounded-xl font-semibold text-sm sm:text-base transition-all duration-300 flex items-center justify-center gap-2 ${
                  isProcessing
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
                ) : (
                  tCommon('actions.confirm')
                )}
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default LotteryDelistModal;

