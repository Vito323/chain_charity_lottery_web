"use client";
import React from "react";
import { motion } from "framer-motion";
import { useTranslations } from 'next-intl';
import BigNumber from "bignumber.js";
import { TokenInfo } from "@/hooks/useDonationForm";

interface RewardDisplayProps {
  amount: string;
  selectedToken: TokenInfo | null;
  rewardInfo: { address: string; symbol: string; value: number } | null;
  isLoadingReward: boolean;
  calculateUSDValue: (amount: string, tokenSymbol: string) => string;
}

export const RewardDisplay: React.FC<RewardDisplayProps> = ({
  amount,
  selectedToken,
  rewardInfo,
  isLoadingReward,
  calculateUSDValue,
}) => {
  const t = useTranslations('donate');

  if (!amount || !selectedToken || parseFloat(amount) <= 0) {
    return null;
  }

  const numericAmount = parseFloat(amount);
  const percentage = Math.min(95, Math.max(5, Math.floor(numericAmount * 10)));
  
  // 使用 BigNumber 计算 USD 价值，精度5位小数
  const usdValueStr = calculateUSDValue(amount, selectedToken.symbol);
  const usdValueBN = new BigNumber(usdValueStr || 0);
  
  // 根据接口返回的汇率计算奖励：1USDT === 1 * value
  // 奖励 = USD价值 * value，使用 BigNumber 计算，精度5位小数
  const exchangeRateBN = rewardInfo?.value 
    ? new BigNumber(rewardInfo.value)
    : new BigNumber(1.2); // 默认值，如果接口未返回则使用
  
  const expectedCLTBN = usdValueBN.multipliedBy(exchangeRateBN).decimalPlaces(5, BigNumber.ROUND_DOWN);

  return (
    <div className="mb-6">
      <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-6 space-y-4">
        {isLoadingReward ? (
          <div className="flex items-center justify-center py-4">
            <svg className="w-5 h-5 animate-spin text-purple-400" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span className="ml-2 text-white/60 text-sm">Calculating reward...</span>
          </div>
        ) : (
          <>
            {/* Ranking Text */}
            <div className="flex items-center justify-between">
              <p className="text-white/90! text-sm">
                {t('ranking.exceeds', { percentage })}
              </p>
            </div>
            
            {/* Progress Bar */}
            <div className="relative">
              <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${percentage}%` }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                  className="h-full bg-linear-to-r from-purple-500 to-pink-500 rounded-full"
                />
              </div>
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ 
                  opacity: 1, 
                  scale: 1,
                }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 px-2 py-1 bg-gray-800/90 backdrop-blur-sm border border-white/20 rounded-md"
                style={{ left: `${percentage}%` }}
              >
                <span className="text-white text-xs font-semibold">
                  {percentage}%
                </span>
              </motion.div>
            </div>

            {/* Get Tokens Section */}
            <div className="pt-2 space-y-2">
              <div className="flex items-center gap-2">
                <h3 className="text-white font-semibold text-base">
                  {t('ranking.getTokens')}
                </h3>
                <div className="group relative">
                  <svg 
                    className="w-4 h-4 text-white/80 cursor-help" 
                    fill="currentColor" 
                    viewBox="0 0 20 20"
                  >
                    <path 
                      fillRule="evenodd" 
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" 
                      clipRule="evenodd" 
                    />
                  </svg>
                </div>
              </div>
              
              {/* Expected CLT Token Reward */}
              <p className="text-white/90! text-sm leading-relaxed">
                {t('ranking.expectedReward', { amount: expectedCLTBN.toFixed(5) })}
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

