'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useTranslations, useLocale } from 'next-intl';
import { LotteryTicket } from '@/app/[locale]/nft-market/types';

interface LotteryRedemptionSuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  ticket: LotteryTicket;
  ticketCount: number; // 用户持有的彩票总数或出售次数
  type?: 'redemption' | 'follow' | 'purchase' | 'sell'; // 类型：兑换、跟投、购买或出售
}

const LotteryRedemptionSuccessModal: React.FC<LotteryRedemptionSuccessModalProps> = ({
  isOpen,
  onClose,
  ticket,
  ticketCount,
  type = 'redemption',
}) => {
  const t = useTranslations('lottery.modals.success');
  const locale = useLocale();
  const router = useRouter();
  const isFollowType = type === 'follow';
  const isPurchaseType = type === 'purchase';
  const isSellType = type === 'sell';

  const handleViewTickets = () => {
    onClose();
    if (isSellType) {
      router.push('/lottery/my-tickets?tab=listed');
    } else {
      router.push('/user');
    }
  };

  const handleNFTMarketplace = () => {
    onClose();
    router.push('/nft-market');
  };

  const handleContinueRedemption = () => {
    onClose();
    if (isSellType) {
      // 继续出售，可以导航到我的彩票页面
      router.push('/lottery/my-tickets?tab=hold');
    } else {
      // 可以保持当前页面或导航到彩票列表
    }
  };

  if (!isOpen) return null;

  // 获取序数后缀 - 根据语言环境返回不同的格式
  const getOrdinalSuffix = (num: number): string => {
    // 中文使用"第X个"格式，英文使用"Xst/nd/rd/th"格式
    if (locale === 'zh') {
      return `${num}`;
    }
    const j = num % 10;
    const k = num % 100;
    if (j === 1 && k !== 11) return num + 'st';
    if (j === 2 && k !== 12) return num + 'nd';
    if (j === 3 && k !== 13) return num + 'rd';
    return num + 'th';
  };

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
          className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-gradient-to-b from-slate-900 via-slate-950 to-slate-900 border border-white/10 rounded-3xl shadow-2xl overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="p-6 sm:p-8 space-y-6 text-center">
            {/* Title */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">
                {isSellType
                  ? t('title.sell')
                  : isPurchaseType 
                    ? t('title.purchase') 
                    : isFollowType 
                      ? t('title.follow') 
                      : t('title.redemption')}
              </h2>
              <p className="text-sm sm:text-base text-white/70">
                {isSellType
                  ? t('description.sell', { count: ticketCount, ordinal: locale === 'zh' ? '' : getOrdinalSuffix(ticketCount) })
                  : t(`description.${isPurchaseType ? 'purchase' : isFollowType ? 'follow' : 'redemption'}`, { count: ticketCount, ordinal: locale === 'zh' ? '' : getOrdinalSuffix(ticketCount) })}
              </p>
            </motion.div>

            {/* Lottery Ticket NFT Card - Image Only */}
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
              className="relative w-full max-w-lg mx-auto"
            >
              <div className="relative rounded-2xl overflow-hidden border-2 border-yellow-500/50 shadow-2xl">
                <div className="relative w-full aspect-[3/4]">
                  <Image
                    src={ticket.image}
                    alt={`Lottery Ticket ${ticket.id}`}
                    fill
                    className="object-cover"
                    unoptimized
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = '/images/placeholder-all.png';
                    }}
                  />
                </div>
              </div>
            </motion.div>

            {/* Informational Messages */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="space-y-2 text-sm sm:text-base text-white/70"
            >
              {isSellType ? (
                <p>{t('info.sell')}</p>
              ) : (
                <>
                  <p>{t('info.drawResults')}</p>
                  {(isPurchaseType || type === 'redemption') && (
                    <p>{t('info.marketplace')}</p>
                  )}
                </>
              )}
            </motion.div>

            {/* View Tickets Link */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <button
                onClick={handleViewTickets}
                className="text-sm sm:text-base text-purple-400 hover:text-purple-300 transition-colors cursor-pointer inline-flex items-center gap-1"
              >
                {isSellType
                  ? t('viewTickets.listed')
                  : isFollowType 
                    ? t('viewTickets.follow') 
                    : t('viewTickets.default')} <span>&gt;</span>
              </button>
            </motion.div>

            {/* Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4"
            >
              <button
                onClick={handleNFTMarketplace}
                className="flex-1 rounded-full py-3 px-4 bg-white/10 hover:bg-white/20 border border-white/20 text-white text-sm sm:text-base font-medium transition-colors cursor-pointer"
              >
                {t('buttons.marketplace')}
              </button>
              <button
                onClick={handleContinueRedemption}
                className="flex-1 rounded-full py-3 px-4 bg-white/10 hover:bg-white/20 border border-white/20 text-white text-sm sm:text-base font-medium transition-colors cursor-pointer"
              >
                {isSellType
                  ? t('buttons.continueSell')
                  : isPurchaseType 
                    ? t('buttons.continuePurchase') 
                    : isFollowType 
                      ? t('buttons.continueFollow') 
                      : t('buttons.continueRedemption')}
              </button>
            </motion.div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default LotteryRedemptionSuccessModal;

