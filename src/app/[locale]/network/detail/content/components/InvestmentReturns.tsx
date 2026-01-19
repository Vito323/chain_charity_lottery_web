"use client";

import React, { useMemo } from "react";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";

interface InvestmentReturnsProps {
  price: number;
  reward: number;
  currency: string;
  isStandard: boolean;
  isSuper: boolean;
  isInView: boolean;
}

const InvestmentReturns: React.FC<InvestmentReturnsProps> = ({
  price,
  reward,
  currency,
  isStandard,
  isSuper,
  isInView,
}) => {
  const t = useTranslations("nodeDetail");

  // 计算各年回报
  // 第一年：reward * 50%
  // 第二年：剩下的50% = (reward - reward*50%) * 50% = reward * 25%
  // 第三年：剩下的全部 = reward - reward*50% - reward*25% = reward * 25%
  const year1Reward = useMemo(() => reward * 0.5, [reward]);
  const year2Reward = useMemo(() => reward * 0.25, [reward]);
  const year3Reward = useMemo(() => reward * 0.25, [reward]);
  const totalReward = useMemo(() => reward, [reward]);

  // 格式化数字显示
  const formatNumber = (num: number, decimals: number = 2) => {
    return num.toLocaleString(undefined, {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    });
  };

  // 计算总回报率
  const totalReturnRate = useMemo(() => {
    if (price === 0) return "0%";
    // 假设 CCT 价格为 1 USDT（这里可能需要根据实际情况调整）
    const returnRate = ((reward / price) * 100).toFixed(2);
    return `${returnRate}%`;
  }, [price, reward]);

  // 格式化初始价格
  const initialPrice = useMemo(() => {
    return `${formatNumber(price)} ${currency}`;
  }, [price, currency]);



  // 格式化3年回报
  const threeYearReturn = useMemo(() => {
    return `${formatNumber(totalReward)} CCT`;
  }, [totalReward]);

  // 格式化各年回报
  const year1Formatted = useMemo(() => `${formatNumber(year1Reward)} CCT`, [year1Reward]);
  const year2Formatted = useMemo(() => `${formatNumber(year2Reward)} CCT`, [year2Reward]);
  const year3Formatted = useMemo(() => `${formatNumber(year3Reward)} CCT`, [year3Reward]);

  return (
    <div className="space-y-3 sm:space-y-4">
      <h2 className="text-base sm:text-lg md:text-xl font-semibold text-white mb-3 sm:mb-4">
        {t("purchase.investmentReturns")}
      </h2>
      <div className="grid grid-cols-2 gap-2 sm:gap-3">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={isInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ delay: 0.2 }}
          className="rounded-lg border border-white/10 bg-white/5 p-3 sm:p-4"
        >
          <div className="text-xs text-white/60 mb-1">
            {t("purchase.initial")}
          </div>
          <div className="text-lg sm:text-xl md:text-2xl font-bold text-white">
            {initialPrice}
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={isInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ delay: 0.3 }}
          className="rounded-lg border border-white/10 bg-white/5 p-3 sm:p-4"
        >
          <div className="text-xs text-white/60 mb-1">
            {t("purchase.threeYearReturn")}
          </div>
          <div className="text-lg sm:text-xl md:text-2xl font-bold text-emerald-400">
            {threeYearReturn}
          </div>
        </motion.div>
      </div>

      <div className="grid grid-cols-3 gap-2">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.4 }}
          className="rounded-lg border border-white/10 bg-white/5 p-2.5 sm:p-3 text-center"
        >
          <div className="text-xs text-white/60 mb-1">
            {t("purchase.year1")}
          </div>
          <div className="text-sm sm:text-base font-bold text-white">
            {year1Formatted}
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.5 }}
          className="rounded-lg border border-white/10 bg-white/5 p-2.5 sm:p-3 text-center"
        >
          <div className="text-xs text-white/60 mb-1">
            {t("purchase.year2")}
          </div>
          <div className="text-sm sm:text-base font-bold text-white">
            {year2Formatted}
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.6 }}
          className="rounded-lg border border-white/10 bg-white/5 p-2.5 sm:p-3 text-center"
        >
          <div className="text-xs text-white/60 mb-1">
            {t("purchase.year3")}
          </div>
          <div className="text-sm sm:text-base font-bold text-white">
            {year3Formatted}
          </div>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={isInView ? { opacity: 1, scale: 1 } : {}}
        transition={{ delay: 0.7 }}
        className={`rounded-lg border-2 ${
          isStandard
            ? "border-emerald-500/50 bg-linear-to-r from-emerald-900/30 via-teal-900/30 to-emerald-900/30"
            : isSuper
            ? "border-blue-500/50 bg-linear-to-r from-blue-900/30 via-cyan-900/30 to-blue-900/30"
            : "border-purple-500/50 bg-linear-to-r from-purple-900/30 via-pink-900/30 to-purple-900/30"
        } p-3 sm:p-4`}
      >
        <div className="flex items-baseline justify-between gap-2 mb-1.5">
          <div className="text-xs text-white/70">
            {t("purchase.totalReturnRate")}
          </div>
          <div
            className={`text-xl sm:text-2xl md:text-3xl font-extrabold ${
              isStandard ? "text-emerald-300" : isSuper ? "text-blue-300" : "text-purple-300"
            }`}
          >
            {totalReturnRate}
          </div>
        </div>
        <p className="text-xs text-white/80 leading-relaxed">
          {isStandard
            ? t("purchase.standardReturnDescription")
            : isSuper
            ? t("purchase.superReturnDescription")
            : t("purchase.genesisReturnDescription")}
        </p>
      </motion.div>
    </div>
  );
};

export default InvestmentReturns;

