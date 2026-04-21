'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAccount } from 'wagmi';
import { useTranslations } from 'next-intl';
import { type NodeData } from '@/constants/nodes';
import { ServiceAgreementModal } from '@/components/service-agreement-modal';
import { PrivacyPolicyModal } from '@/components/privacy-policy-modal';

interface NodePurchaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentNode: NodeData; // 当前节点数据
  remaining?: number; // 剩余数量（仅普通节点需要）
  isProcessing?: boolean; // 是否正在处理购买
  onConfirmPurchase: (quantity: number, acceptedTerms: boolean) => void; // 确认购买回调
}

const NodePurchaseModal: React.FC<NodePurchaseModalProps> = ({
  isOpen,
  onClose,
  currentNode,
  remaining = 0,
  isProcessing = false,
  onConfirmPurchase,
}) => {
  const t = useTranslations('nodePurchaseModal');
  const tCommon = useTranslations('common');
  const { isConnected } = useAccount();
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [showServiceAgreement, setShowServiceAgreement] = useState(false);
  const [showPrivacyPolicy, setShowPrivacyPolicy] = useState(false);
  const [mounted, setMounted] = useState(false);

  // 固定数量为1
  const quantity = 1;

  const isStandard = currentNode.id === 'standard';

  // 从 currentNode 获取价格
  const nodePrice = currentNode.price;
  
  // 从 currentNode.priceAdvantage 获取专享价格
  // priceAdvantage.nodePrice 格式类似 "0.17/CCT" 或 "0.075USDT/CCT"
  // 需要提取数字部分
  const exclusivePrice = useMemo(() => {
    const priceStr = currentNode.priceAdvantage.nodePrice;
    // 提取数字部分（支持小数）
    const match = priceStr.match(/(\d+\.?\d*)/);
    return match ? parseFloat(match[1]) : 0.17; // 默认值
  }, [currentNode.priceAdvantage.nodePrice]);

  // 计算总价格（USDT）- 固定为1个节点的价格
  const totalPrice = nodePrice;

  // 处理 mounted 状态
  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  // 当Modal关闭时重置所有状态
  useEffect(() => {
    if (!isOpen) {
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

  const handleConfirmClick = () => {
    if (!isConnected || !acceptedTerms || isProcessing) {
      return;
    }
    // 固定传递数量1
    onConfirmPurchase(1, acceptedTerms);
  };

  if (!isOpen) return null;

  const nodeTypeName = currentNode.name;

  return (
    <AnimatePresence>
      <motion.div
        key="node-purchase-modal-container"
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
          className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-linear-to-b from-slate-900 via-slate-950 to-slate-900 border border-white/10 rounded-3xl shadow-2xl"
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
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <div className="text-sm text-white/60 mb-1">
                    {nodeTypeName} {t('salePrice')}
                  </div>
                  <div className="text-2xl sm:text-3xl font-bold text-white">
                    {currentNode.price.toLocaleString()} {currentNode.currency}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-white/60 mb-1">{t('exclusivePrice')}</div>
                  <div className="text-xl sm:text-2xl font-bold text-emerald-400">
                    {currentNode.priceAdvantage.nodePrice}
                  </div>
                </div>
              </div>
            </div>

            {/* Node Information Section */}
            <div className="space-y-4">
              <h3 className="text-lg sm:text-xl font-semibold text-white">{currentNode.name}</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                <div className="rounded-xl border border-white/10 bg-white/5 p-3 sm:p-4 text-center">
                  <div className="text-xs text-white/60 mb-1">{t('stats.limit')}</div>
                  <div className="text-lg sm:text-xl font-bold text-white">
                    {currentNode.stats.totalLimit.toLocaleString()}
                  </div>
                </div>
                <div className="rounded-xl border border-white/10 bg-white/5 p-3 sm:p-4 text-center">
                  <div className="text-xs text-white/60 mb-1">{t('stats.sold')}</div>
                  <div className="text-lg sm:text-xl font-bold text-emerald-400">
                    {currentNode.stats.sold.toLocaleString()}
                  </div>
                </div>
                <div className="rounded-xl border border-white/10 bg-white/5 p-3 sm:p-4 text-center">
                  <div className="text-xs text-white/60 mb-1">{t('stats.remaining')}</div>
                  <div className="text-lg sm:text-xl font-bold text-purple-400">
                    {currentNode.stats.remaining.toLocaleString()}
                  </div>
                </div>
              </div>
            </div>

            {/* NFT Display Section - Read Only */}
            <div className="space-y-4">
              <h3 className="text-lg sm:text-xl font-semibold text-white">{t('selectedNode')}</h3>
              <div className="flex justify-center">
                <div
                  className={`relative rounded-2xl border-2 border-yellow-500 ring-2 ring-yellow-500/50 bg-linear-to-br ${currentNode.nft.gradient} p-6 sm:p-8 aspect-[3/4] flex flex-col justify-center items-center shadow-xl max-w-[200px] w-full`}
                >
                  <div className="absolute top-3 right-3 w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center z-20">
                    <svg className="w-4 h-4 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div className="absolute inset-0 bg-linear-to-b from-transparent via-transparent to-black/20 rounded-2xl" />
                  <div className="relative z-10 text-center">
                    <h4 className="text-base sm:text-lg font-bold text-white/90 mb-2 leading-tight">
                      {currentNode.name}
                    </h4>
                    {/* <p className="text-xs sm:text-sm text-white/70 leading-tight">
                      {currentNode.description}
                    </p> */}
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Info */}
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4 sm:p-5">
              <div className="flex items-center justify-between">
                <div className="text-sm text-white/70">{t('actualPaymentPrice')}</div>
                <div className="text-xl sm:text-2xl font-bold text-white">
                  {totalPrice.toLocaleString()} USDT
                </div>
              </div>
            </div>

            {/* Terms and Conditions */}
            {/* <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="terms-checkbox"
                checked={acceptedTerms}
                onChange={(e) => setAcceptedTerms(e.target.checked)}
                className="w-5 h-5 rounded border-white/20 bg-white/5 text-purple-500 focus:ring-2 focus:ring-purple-500/50 cursor-pointer"
              />
              <label htmlFor="terms-checkbox" className="flex-1 text-sm text-white/70 cursor-pointer">
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
            </div> */}

            {/* Confirm Purchase Button */}
            <button
              onClick={handleConfirmClick}
              disabled={!isConnected || isProcessing}
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
                t('confirmPurchase')
              )}
            </button>
          </div>
        </motion.div>
      </motion.div>
      <ServiceAgreementModal
        key="service-agreement-modal"
        show={showServiceAgreement}
        onClose={() => setShowServiceAgreement(false)}
        mounted={mounted}
      />
      <PrivacyPolicyModal
        key="privacy-policy-modal"
        show={showPrivacyPolicy}
        onClose={() => setShowPrivacyPolicy(false)}
        mounted={mounted}
      />
    </AnimatePresence>
  );
};

export default NodePurchaseModal;

