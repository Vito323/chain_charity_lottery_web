'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useTranslations, useLocale } from 'next-intl';

interface NodePurchaseSuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  nodeType: 'genesis' | 'super' | 'standard';
  nodeCount?: number; // 用户持有的节点总数
  certificateId?: number; // 证书ID（仅创世节点）
}

const NodePurchaseSuccessModal: React.FC<NodePurchaseSuccessModalProps> = ({
  isOpen,
  onClose,
  nodeType,
  nodeCount = 1,
}) => {
  const t = useTranslations('nodePurchaseModal.success');
  const tCommon = useTranslations('common');
  const locale = useLocale();
  const router = useRouter();
  const isGenesis = nodeType === 'genesis';

  // 获取序数后缀 - 根据语言环境返回不同的格式
  const getOrdinalSuffix = (num: number): string => {
    if (locale === 'zh') {
      return `${num}`;
    }
    if (num === 1) return 'st';
    if (num === 2) return 'nd';
    if (num === 3) return 'rd';
    return 'th';
  };

  const handleViewNodes = () => {
    onClose();
    router.push('/network');
  };

  const handleReturnHome = () => {
    onClose();
    router.push('/');
  };

  const handleContinuePurchase = () => {
    onClose();
    // 可以保持当前页面或导航到节点列表
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[110] flex items-center justify-center p-4"
        onClick={onClose}
      >
        {/* Backdrop */}
        <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />

        {/* Modal */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          transition={{ type: 'spring', duration: 0.4 }}
          className="relative w-full max-w-md max-h-[90vh] overflow-y-auto bg-gradient-to-b from-slate-900 via-slate-950 to-slate-900 border border-white/10 rounded-3xl shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="p-4 sm:p-6 md:p-8 space-y-4 sm:space-y-6 text-center relative">
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
            {/* Title */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="pt-2 pr-10 sm:pr-12"
            >
              <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-1 sm:mb-2">
                {t('title')}
              </h2>
              <p className="text-xs sm:text-sm md:text-base text-white/70">
                {t('description', { count: nodeCount, ordinal: locale === 'zh' ? '' : getOrdinalSuffix(nodeCount) })}
              </p>
            </motion.div>

            {/* Certificate Image (Genesis Node) or Success Icon (Standard) */}
            <motion.div
              className="relative flex items-center justify-center"
            >
              {isGenesis ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.3 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{
                    delay: 0.3,
                    type: 'spring',
                    stiffness: 200,
                    damping: 20,
                    duration: 0.6
                  }}
                  className="relative w-full max-w-[200px] sm:max-w-xs aspect-[3/4] rounded-2xl overflow-hidden border-2 border-yellow-500/50 shadow-2xl"
                >
                  <Image
                    src="/images/placeholder-all.png"
                    alt={tCommon('images.genesisNodeCertificate')}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                </motion.div>
              ) : (
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-white/10 border-4 border-emerald-500/50 flex items-center justify-center mx-auto">
                  <motion.svg
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.3, type: 'spring', stiffness: 200 }}
                    className="w-10 h-10 sm:w-12 sm:h-12 text-emerald-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={3}
                      d="M5 13l4 4L19 7"
                    />
                  </motion.svg>
                </div>
              )}
            </motion.div>

            {/* View Nodes Link */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <button
                onClick={handleViewNodes}
                className="text-sm sm:text-base text-purple-400 hover:text-purple-300 transition-colors cursor-pointer inline-flex items-center gap-1"
              >
                {t('viewNodes')} <span>&gt;</span>
              </button>
            </motion.div>

            {/* Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="flex flex-col sm:flex-row gap-2 sm:gap-3 pt-2 sm:pt-4"
            >
              <button
                onClick={handleReturnHome}
                className="flex-1 rounded-full py-2.5 sm:py-3 px-4 bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs sm:text-sm md:text-base font-medium transition-colors cursor-pointer"
              >
                {t('returnHome')}
              </button>
              <button
                onClick={handleContinuePurchase}
                className="flex-1 rounded-full py-2.5 sm:py-3 px-4 bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs sm:text-sm md:text-base font-medium transition-colors cursor-pointer"
              >
                {t('continuePurchase')}
              </button>
            </motion.div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default NodePurchaseSuccessModal;

