import React from 'react';
import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { LotteryTicket } from '../types';

interface BasicInfoTabProps {
  ticket: LotteryTicket;
  type: 'new' | 'market' | 'hold' | 'listed';
  onRedeem?: () => void;
  onPurchase?: () => void;
  onFollow?: () => void;
  onSell?: () => void;
  onDelist?: () => void;
}

export const BasicInfoTab: React.FC<BasicInfoTabProps> = ({
  ticket,
  type,
  onRedeem,
  onPurchase,
  onFollow,
  onSell,
  onDelist,
}) => {
  const t = useTranslations('nftDetail');
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      {/* Statistics Section */}
      <div className="mb-8 md:mb-12">
        <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-4 sm:p-6 md:p-8 border border-white/10">
          <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-white mb-4 sm:mb-6 text-center">
            {ticket.title}
          </h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 md:gap-8 mb-6 sm:mb-8">
            <div className="text-center">
              <div className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-1 sm:mb-2">
                {ticket.rarityPercentage}
              </div>
              <div className="text-white/60 text-xs sm:text-sm md:text-base">{t('stats.rarity')}</div>
            </div>
            <div className="text-center">
              <div className="text-xl sm:text-2xl md:text-3xl font-bold text-emerald-400 mb-1 sm:mb-2">
                {ticket.maxPrize}
              </div>
              <div className="text-white/60 text-xs sm:text-sm md:text-base">{t('stats.maxPrize')}</div>
            </div>
            {/* <div className="text-center">
              <div className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-1 sm:mb-2">
                {ticket.basicWinRate}
              </div>
              <div className="text-white/60 text-xs sm:text-sm md:text-base">{t('stats.baseWinRate')}</div>
            </div> */}
          </div>

          {/* Education Support Section */}
          <div className="bg-linear-to-r from-emerald-900/30 to-emerald-800/20 rounded-xl p-4 sm:p-5 md:p-6 mb-4 sm:mb-6 border border-emerald-500/20">
            <h3 className="text-base sm:text-lg md:text-xl font-bold text-white mb-2 sm:mb-3">{t('education.title')}</h3>
            <p className="text-white/80 text-xs sm:text-sm md:text-base mb-2 sm:mb-3 leading-relaxed">
              {ticket.educationDescription}
            </p>
            <div className="text-white/60 text-xs sm:text-sm">
              {t('education.partner')}: {ticket.educationPartnerFull}
            </div>
          </div>

          {/* NFT Lottery Instructions */}
          <div className="bg-white/5 rounded-xl p-4 sm:p-5 md:p-6 border border-white/10">
            <h3 className="text-base sm:text-lg md:text-xl font-bold text-white mb-3 sm:mb-4">{t('instructions.title')}</h3>
            <ul className="space-y-2 sm:space-y-3 text-white/80 text-xs sm:text-sm md:text-base">
              <li className="flex items-start gap-3">
                <span className="text-emerald-400 mt-1">•</span>
                <span>{t('instructions.item1')}</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-emerald-400 mt-1">•</span>
                <span>{t('instructions.item2')}</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-emerald-400 mt-1">•</span>
                <span>{t('instructions.item3')}</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Action Section */}
      {type === 'new' || type === 'hold' ? (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4 bg-white/5 backdrop-blur-sm rounded-2xl p-4 sm:p-5 md:p-6 border border-white/10">
          <div className="text-white/80 text-xs sm:text-sm md:text-base text-center sm:text-left w-full sm:w-auto">
            <span className="text-white/60">
              {type === 'new' ? t('actions.newLotteryRedemptionPrice') + ' ' : t('actions.purchasePrice') + ' '}
            </span>
            <span className="text-white font-semibold">
              {type === 'new' ? ticket.redemptionCost : ticket.salePrice || ticket.redemptionCost} {ticket.currency}
            </span>
          </div>
          {type === 'new' ? (
            <button
              onClick={onRedeem}
              className="w-full sm:w-auto px-6 md:px-8 py-2.5 sm:py-3 md:py-3.5 rounded-xl font-semibold text-xs sm:text-sm md:text-base bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50 transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer"
            >
              {t('actions.redeem')}
            </button>
          ) : (
            <button
              onClick={onSell}
              className="w-full sm:w-auto px-6 md:px-8 py-2.5 sm:py-3 md:py-3.5 rounded-xl font-semibold text-xs sm:text-sm md:text-base bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50 transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer"
            >
              {t('actions.sell')}
            </button>
          )}
        </div>
      ) : type === 'listed' ? (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4 bg-white/5 backdrop-blur-sm rounded-2xl p-4 sm:p-5 md:p-6 border border-white/10">
          <div className="text-white/80 text-xs sm:text-sm md:text-base text-center sm:text-left w-full sm:w-auto">
            <span className="text-white/60">{t('actions.purchasePrice')}: </span>
            <span className="text-white font-semibold">
              {ticket.salePrice || ticket.redemptionCost} {ticket.currency}
            </span>
          </div>
          <button
            onClick={onDelist}
            className="w-full sm:w-auto px-6 md:px-8 py-2.5 sm:py-3 md:py-3.5 rounded-xl font-semibold text-xs sm:text-sm md:text-base bg-white/10 text-white border border-white/20 hover:bg-white/20 transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer"
          >
            {t('actions.delist')}
          </button>
        </div>
      ) : (
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
          <button
            onClick={onFollow}
            className="w-full sm:w-auto px-6 md:px-8 py-2.5 sm:py-3 md:py-3.5 rounded-xl font-semibold text-xs sm:text-sm md:text-base bg-white/10 text-white border border-white/20 hover:bg-white/20 transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer"
          >
            {t('actions.follow')}
          </button>
          <button
            onClick={onPurchase}
            className="w-full sm:w-auto px-6 md:px-8 py-2.5 sm:py-3 md:py-3.5 rounded-xl font-semibold text-xs sm:text-sm md:text-base bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50 transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer"
          >
            {t('actions.purchase')}
          </button>
        </div>
      )}
    </motion.div>
  );
};

