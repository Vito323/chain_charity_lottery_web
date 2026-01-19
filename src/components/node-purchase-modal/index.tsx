'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAccount } from 'wagmi';
import { useTranslations } from 'next-intl';
import { isMockMode, requireRealCall } from '@/utils/mock';
import { NODES_DATA, getNodeById, type NodeData } from '@/constants/nodes';

interface NodePurchaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  nodeType: 'genesis' | 'super' | 'standard';
  nodePrice: number; // 节点价格（美元或USDT）
  exclusivePrice: number; // 专享价格（美元/CCT）
  remaining?: number; // 剩余数量（仅普通节点需要）
  onPurchaseSuccess?: (nodeType: 'genesis' | 'super' | 'standard', certificateId?: number) => void;
}

const NodePurchaseModal: React.FC<NodePurchaseModalProps> = ({
  isOpen,
  onClose,
  nodeType,
  nodePrice,
  exclusivePrice,
  remaining = 0,
  onPurchaseSuccess,
}) => {
  const t = useTranslations('nodePurchaseModal');
  const tCommon = useTranslations('common');
  const { isConnected } = useAccount();
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [quantity, setQuantity] = useState<number>(1);
  const [isProcessing, setIsProcessing] = useState(false);

  // 获取当前节点数据
  const currentNode: NodeData | undefined = NODES_DATA.find((node) => node.id === nodeType);
  const isStandard = nodeType === 'standard';
  const maxQuantity = isStandard ? remaining : 1;

  // 当Modal关闭时重置所有状态
  useEffect(() => {
    if (!isOpen) {
      setAcceptedTerms(false);
      setQuantity(1);
      setIsProcessing(false);
    }
  }, [isOpen]);

  // 计算实付价（CCT）- 使用当前节点数据
  const actualPaymentCLT = currentNode 
    ? Math.floor((currentNode.price * quantity) / exclusivePrice)
    : Math.floor((nodePrice * quantity) / exclusivePrice);

  // 处理数量变化
  const handleQuantityChange = (delta: number) => {
    setQuantity((prev) => {
      const newQuantity = prev + delta;
      if (newQuantity < 1) return 1;
      if (isStandard && newQuantity > maxQuantity) return maxQuantity;
      return newQuantity;
    });
  };

  const handleQuantityInput = (value: string) => {
    const numValue = parseInt(value, 10);
    if (isNaN(numValue) || numValue < 1) {
      setQuantity(1);
      return;
    }
    if (isStandard && numValue > maxQuantity) {
      setQuantity(maxQuantity);
      return;
    }
    setQuantity(numValue);
  };

  // 如果没有找到节点数据，返回 null
  if (!currentNode) return null;

  const handleConfirmPurchase = async () => {
    if (!isConnected || !acceptedTerms || isProcessing) {
      return;
    }
    
    setIsProcessing(true);
    
    try {
      // 模拟加载过程
      await new Promise((resolve) => setTimeout(resolve, 1500));
      
      // In mock mode, require real API call or wallet transaction
      if (isMockMode()) {
        requireRealCall(`Node purchase for ${nodeType} node with quantity ${isStandard ? quantity : 1}`, 'server');
        setIsProcessing(false);
        return;
      }
      
      // Mock购买流程 - 模拟异步操作
      // 模拟购买成功
      console.log('Purchase successful:', {
        nodeType,
        quantity: isStandard ? quantity : 1,
        actualPaymentCLT,
      });
      
      // 关闭购买Modal
      onClose();
      
      // 触发成功回调
      if (onPurchaseSuccess) {
        onPurchaseSuccess(nodeType);
      }
    } catch (error) {
      console.error('Purchase failed:', error);
      setIsProcessing(false);
      // 这里可以显示错误提示
    }
  };

  if (!isOpen || !currentNode) return null;

  const nodeTypeName = currentNode.name;

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
                    {nodeTypeName} {t('salePrice')}{isStandard ? ` (${t('perShare')})` : ''}
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

            {/* Purchase Quantity Section (Only for Standard Nodes) */}
            {isStandard && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-white/70">
                    {t('purchaseQuantity')} {remaining > 0 && `(${remaining.toLocaleString()} ${t('sharesRemaining')})`}
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleQuantityChange(-1)}
                      disabled={quantity <= 1}
                      className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center text-white cursor-pointer transition-colors"
                      aria-label={tCommon('accessibility.decreaseQuantity')}
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                      </svg>
                    </button>
                    <input
                      type="number"
                      value={quantity}
                      onChange={(e) => handleQuantityInput(e.target.value)}
                      min={1}
                      max={maxQuantity}
                      className="w-16 h-8 text-center bg-white/5 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    />
                    <button
                      onClick={() => handleQuantityChange(1)}
                      disabled={quantity >= maxQuantity}
                      className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center text-white cursor-pointer transition-colors"
                      aria-label={tCommon('accessibility.increaseQuantity')}
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Payment Info */}
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4 sm:p-5">
              <div className="flex items-center justify-between">
                <div className="text-sm text-white/70">{t('actualPaymentPrice')}</div>
                <div className="text-xl sm:text-2xl font-bold text-white">
                  {actualPaymentCLT.toLocaleString()} CCT
                </div>
              </div>
            </div>

            {/* Terms and Conditions */}
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="terms-checkbox"
                checked={acceptedTerms}
                onChange={(e) => setAcceptedTerms(e.target.checked)}
                className="w-5 h-5 rounded border-white/20 bg-white/5 text-purple-500 focus:ring-2 focus:ring-purple-500/50 cursor-pointer"
              />
              <label htmlFor="terms-checkbox" className="flex-1 text-sm text-white/70 cursor-pointer">
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

            {/* Confirm Purchase Button */}
            <button
              onClick={handleConfirmPurchase}
              disabled={!isConnected || !acceptedTerms || isProcessing}
              className={`w-full rounded-full py-4 px-6 text-base sm:text-lg font-semibold transition-all duration-300 flex items-center justify-center gap-2 ${
                !isConnected || !acceptedTerms || isProcessing
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
              ) : !isConnected ? (
                tCommon('actions.connectWalletFirst')
              ) : (
                t('confirmPurchase')
              )}
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default NodePurchaseModal;

