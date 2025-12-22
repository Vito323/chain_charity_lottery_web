"use client";

import React from "react";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import type { InvestmentReturns as InvestmentReturnsType } from "@/constants/nodes";

interface InvestmentReturnsProps {
  investmentReturns: InvestmentReturnsType;
  isStandard: boolean;
  isSuper: boolean;
  isInView: boolean;
}

const InvestmentReturns: React.FC<InvestmentReturnsProps> = ({
  investmentReturns,
  isStandard,
  isSuper,
  isInView,
}) => {
  const t = useTranslations("nodeDetail");

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
            {investmentReturns.initial}
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
            {investmentReturns.threeYearReturn}
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
            {investmentReturns.year1}
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
            {investmentReturns.year2}
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
            {investmentReturns.year3}
          </div>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={isInView ? { opacity: 1, scale: 1 } : {}}
        transition={{ delay: 0.7 }}
        className={`rounded-lg border-2 ${
          isStandard
            ? "border-emerald-500/50 bg-gradient-to-r from-emerald-900/30 via-teal-900/30 to-emerald-900/30"
            : isSuper
            ? "border-blue-500/50 bg-gradient-to-r from-blue-900/30 via-cyan-900/30 to-blue-900/30"
            : "border-purple-500/50 bg-gradient-to-r from-purple-900/30 via-pink-900/30 to-purple-900/30"
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
            {investmentReturns.totalReturnRate}
          </div>
        </div>
        <p className="text-xs text-white/80 leading-relaxed">
          {investmentReturns.returnDescription}
        </p>
      </motion.div>
    </div>
  );
};

export default InvestmentReturns;

