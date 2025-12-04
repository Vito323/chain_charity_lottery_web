import React from 'react';
import { motion } from 'framer-motion';
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
            {ticket.series}
          </h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 md:gap-8 mb-6 sm:mb-8">
            <div className="text-center">
              <div className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-1 sm:mb-2">
                {ticket.rarityPercentage}
              </div>
              <div className="text-white/60 text-xs sm:text-sm md:text-base">Rarity</div>
            </div>
            <div className="text-center">
              <div className="text-xl sm:text-2xl md:text-3xl font-bold text-emerald-400 mb-1 sm:mb-2">
                {ticket.maxPrize}
              </div>
              <div className="text-white/60 text-xs sm:text-sm md:text-base">Max Prize</div>
            </div>
            <div className="text-center">
              <div className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-1 sm:mb-2">
                {ticket.basicWinRate}
              </div>
              <div className="text-white/60 text-xs sm:text-sm md:text-base">Base Win Rate</div>
            </div>
          </div>

          {/* Education Support Section */}
          <div className="bg-gradient-to-r from-emerald-900/30 to-emerald-800/20 rounded-xl p-4 sm:p-5 md:p-6 mb-4 sm:mb-6 border border-emerald-500/20">
            <h3 className="text-base sm:text-lg md:text-xl font-bold text-white mb-2 sm:mb-3">Education Support</h3>
            <p className="text-white/80 text-xs sm:text-sm md:text-base mb-2 sm:mb-3 leading-relaxed">
              {ticket.educationDescription}
            </p>
            <div className="text-white/60 text-xs sm:text-sm">
              Partner: {ticket.educationPartnerFull}
            </div>
          </div>

          {/* NFT Lottery Instructions */}
          <div className="bg-white/5 rounded-xl p-4 sm:p-5 md:p-6 border border-white/10">
            <h3 className="text-base sm:text-lg md:text-xl font-bold text-white mb-3 sm:mb-4">NFT Lottery & Redemption Instructions</h3>
            <ul className="space-y-2 sm:space-y-3 text-white/80 text-xs sm:text-sm md:text-base">
              <li className="flex items-start gap-3">
                <span className="text-emerald-400 mt-1">•</span>
                <span>Use tokens to purchase a permanent DNA identity NFT, become an ecosystem member.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-emerald-400 mt-1">•</span>
                <span>Draws 4 times a day, prizes automatically credited, with transparent winning probability.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-emerald-400 mt-1">•</span>
                <span>The ticket and rights can be inherited by future generations.</span>
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
              {type === 'new' ? 'New Lottery Redemption Price: ' : 'Purchase Price: '}
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
              Redeem Now
            </button>
          ) : (
            <button
              onClick={onSell}
              className="w-full sm:w-auto px-6 md:px-8 py-2.5 sm:py-3 md:py-3.5 rounded-xl font-semibold text-xs sm:text-sm md:text-base bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50 transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer"
            >
              Sell
            </button>
          )}
        </div>
      ) : type === 'listed' ? (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4 bg-white/5 backdrop-blur-sm rounded-2xl p-4 sm:p-5 md:p-6 border border-white/10">
          <div className="text-white/80 text-xs sm:text-sm md:text-base text-center sm:text-left w-full sm:w-auto">
            <span className="text-white/60">Sale Price: </span>
            <span className="text-white font-semibold">
              {ticket.salePrice || ticket.redemptionCost} {ticket.currency}
            </span>
          </div>
          <button
            onClick={onDelist}
            className="w-full sm:w-auto px-6 md:px-8 py-2.5 sm:py-3 md:py-3.5 rounded-xl font-semibold text-xs sm:text-sm md:text-base bg-white/10 text-white border border-white/20 hover:bg-white/20 transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer"
          >
            Delist
          </button>
        </div>
      ) : (
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
          <button
            onClick={onFollow}
            className="w-full sm:w-auto px-6 md:px-8 py-2.5 sm:py-3 md:py-3.5 rounded-xl font-semibold text-xs sm:text-sm md:text-base bg-white/10 text-white border border-white/20 hover:bg-white/20 transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer"
          >
            Follow Investment
          </button>
          <button
            onClick={onPurchase}
            className="w-full sm:w-auto px-6 md:px-8 py-2.5 sm:py-3 md:py-3.5 rounded-xl font-semibold text-xs sm:text-sm md:text-base bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50 transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer"
          >
            Purchase
          </button>
        </div>
      )}
    </motion.div>
  );
};

