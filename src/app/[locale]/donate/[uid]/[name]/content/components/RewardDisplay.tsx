"use client";
import React from "react";
import { motion } from "framer-motion";
import { useTranslations } from 'next-intl';
import BigNumber from "bignumber.js";
import { formatUnits } from "ethers";
import useGlobalStore from "@/store";

interface RewardDisplayProps {
  amount: string;
  rewardAmount: string | null;
  isLoadingReward: boolean;
  calculateExchangeAmount: (amount: string, tokenDecimals: number) => Promise<string>;
  ecosystemTokenDecimals: number | undefined;
  amountChanged: boolean;
  onRewardUpdate?: (rewardAmount: string) => void;
}

export const RewardDisplay: React.FC<RewardDisplayProps> = ({
  amount,
  rewardAmount,
  isLoadingReward,
  calculateExchangeAmount,
  ecosystemTokenDecimals,
  amountChanged,
  onRewardUpdate,
}) => {
  const t = useTranslations('donate');
  const config = useGlobalStore(state => state.config);
  const [countdown, setCountdown] = React.useState(60); // 倒计时60秒
  const [progress, setProgress] = React.useState(100); // 进度条百分比
  const countdownTimerRef = React.useRef<NodeJS.Timeout | null>(null);
  const progressIntervalRef = React.useRef<NodeJS.Timeout | null>(null);
  const stableAmountRef = React.useRef<string>("");
  const isCountingDownRef = React.useRef(false);

  // 检查 amount 是否有效（必须在所有 hooks 之后）
  const isValidAmount = amount && parseFloat(amount) > 0;

  const numericAmount = parseFloat(amount);
  const percentage = Math.min(95, Math.max(5, Math.floor(numericAmount * 10)));
  
  // 使用 BigNumber 计算 USD 价值（USDT固定）
  // const usdValueStr = calculateUSDValue(amount, 'USDT');
  // const usdValueBN = new BigNumber(usdValueStr || 0);
  
  // 使用奖励金额（从合约计算得到）
  const expectedCLTBN = rewardAmount 
    ? new BigNumber(rewardAmount)
    : new BigNumber(0);

  // 当 amount 变化时重置倒计时
  React.useEffect(() => {
    if (!isValidAmount) {
      // 如果 amount 无效，清除定时器
      if (countdownTimerRef.current) {
        clearInterval(countdownTimerRef.current);
        countdownTimerRef.current = null;
      }
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
        progressIntervalRef.current = null;
      }
      return;
    }

    if (amountChanged) {
      // 用户修改了 amount，重置倒计时和稳定 amount
      setCountdown(60);
      setProgress(100);
      stableAmountRef.current = amount;
      isCountingDownRef.current = false;
      
      // 清除所有定时器
      if (countdownTimerRef.current) {
        clearInterval(countdownTimerRef.current);
        countdownTimerRef.current = null;
      }
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
        progressIntervalRef.current = null;
      }
    }
  }, [amountChanged, amount, isValidAmount]);

  // 定时调用 calculateExchangeAmount（每分钟一次，仅当 amount 未变化时）
  React.useEffect(() => {
    // 清除之前的定时器
    if (countdownTimerRef.current) {
      clearInterval(countdownTimerRef.current);
      countdownTimerRef.current = null;
    }
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current);
      progressIntervalRef.current = null;
    }

    if (!isValidAmount || !ecosystemTokenDecimals) {
      return;
    }

    // 如果用户刚修改了 amount，等待防抖完成后再开始倒计时
    if (amountChanged) {
      return;
    }

    // amount 稳定（未变化），开始倒计时
    isCountingDownRef.current = true;
    stableAmountRef.current = amount;
    
    // 启动倒计时
    setCountdown(60);
    setProgress(100);

    // 倒计时定时器
    countdownTimerRef.current = setInterval(() => {
      setCountdown((prev) => {
        const newCountdown = prev <= 1 ? 60 : prev - 1;
        
        // 倒计时结束时，调用 calculateExchangeAmount
        // 使用 stableAmountRef 来确保使用启动倒计时时的 amount
        if (prev <= 1 && ecosystemTokenDecimals && stableAmountRef.current) {
          const currentAmount = stableAmountRef.current;
          calculateExchangeAmount(currentAmount, 6)
            .then((result) => {
              const rewardValue = formatUnits(result, ecosystemTokenDecimals);
              const rewardBN = new BigNumber(rewardValue);
              const formattedReward = rewardBN.decimalPlaces(6, BigNumber.ROUND_DOWN).toString();
              // 通过回调更新父组件的 rewardAmount
              onRewardUpdate?.(formattedReward);
            })
            .catch((error) => {
              console.error("定时更新奖励失败:", error);
            });
        }
        
        return newCountdown;
      });
    }, 1000);

    // 进度条更新（每秒更新一次）
    progressIntervalRef.current = setInterval(() => {
      setProgress((prev) => {
        if (prev <= 0) {
          return 100; // 重置进度
        }
        return prev - (100 / 60); // 每秒减少 100/60
      });
    }, 1000);

    return () => {
      if (countdownTimerRef.current) {
        clearInterval(countdownTimerRef.current);
        countdownTimerRef.current = null;
      }
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
        progressIntervalRef.current = null;
      }
      isCountingDownRef.current = false;
    };
  }, [amount, ecosystemTokenDecimals, amountChanged, calculateExchangeAmount, onRewardUpdate, isValidAmount]);

  // 如果 amount 无效，不渲染组件
  if (!isValidAmount) {
    return null;
  }

  // 计算圆形进度条的 stroke-dasharray
  const radius = 24; // 圆形半径
  const circumference = 2 * Math.PI * radius; // 周长
  const strokeDashoffset = circumference - (progress / 100) * circumference;

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
            <div className="pt-2 space-y-3">
              <div className="flex items-center justify-between">
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

                {/* 圆形进度条和倒计时 */}
                {!amountChanged && amount && parseFloat(amount) > 0 && (
                  <div className="relative w-12 h-12">
                    <svg className="w-12 h-12 transform -rotate-90" viewBox="0 0 52 52">
                      {/* 背景圆环 */}
                      <circle
                        cx="26"
                        cy="26"
                        r={radius}
                        stroke="rgba(255, 255, 255, 0.1)"
                        strokeWidth="4"
                        fill="none"
                      />
                      {/* 进度圆环 */}
                      <motion.circle
                        cx="26"
                        cy="26"
                        r={radius}
                        stroke="url(#gradient)"
                        strokeWidth="4"
                        fill="none"
                        strokeLinecap="round"
                        strokeDasharray={circumference}
                        initial={{ strokeDashoffset: circumference }}
                        animate={{ strokeDashoffset }}
                        transition={{ duration: 0.5, ease: "linear" }}
                      />
                      {/* 渐变定义 */}
                      <defs>
                        <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                          <stop offset="0%" stopColor="#a855f7" />
                          <stop offset="100%" stopColor="#ec4899" />
                        </linearGradient>
                      </defs>
                    </svg>
                    {/* 倒计时文字 */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-white text-xs font-semibold">
                        {countdown}s
                      </span>
                    </div>
                  </div>
                )}
              </div>
              
              {/* Expected CCT Token Reward */}
              <p className="text-white/90! text-sm leading-relaxed">
                {t('ranking.expectedReward', { 
                  amount: expectedCLTBN.isGreaterThan(0) ? expectedCLTBN.toFixed(6) : '0.000000', 
                  ecosystemToken: config?.ecosystemToken || 'CCT' 
                })}
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

