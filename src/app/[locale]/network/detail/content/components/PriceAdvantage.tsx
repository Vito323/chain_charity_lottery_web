"use client";

import React from "react";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import type { PriceAdvantage as PriceAdvantageType } from "@/constants/nodes";

interface PriceAdvantageProps {
  priceAdvantage: PriceAdvantageType;
  isInView: boolean;
}

const PriceAdvantage: React.FC<PriceAdvantageProps> = ({
  priceAdvantage,
  isInView,
}) => {
  const t = useTranslations("nodeDetail");

  return (
    <div className="space-y-3 sm:space-y-4 md:flex md:flex-col">
      <h2 className="text-base sm:text-lg md:text-xl font-semibold text-white mb-3 sm:mb-4">
        {t("purchase.priceAdvantage")}
      </h2>
      <div className="grid grid-cols-2 gap-2 sm:gap-3">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={isInView ? { opacity: 1, x: 0 } : {}}
          transition={{ delay: 0.2 }}
          className="rounded-lg border border-white/10 bg-white/5 p-3 sm:p-4"
        >
          <div className="text-xs text-white/60 mb-1">
            {t("purchase.nodePrice")}
          </div>
          <div className="text-lg sm:text-xl md:text-2xl font-bold text-emerald-400">
            {priceAdvantage.nodePrice}
          </div>
          <p className="text-xs text-white/60 mt-1">
            {t("purchase.exclusivePrice")}
          </p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={isInView ? { opacity: 1, x: 0 } : {}}
          transition={{ delay: 0.3 }}
          className="rounded-lg border border-white/10 bg-white/5 p-3 sm:p-4"
        >
          <div className="text-xs text-white/60 mb-1">
            {t("purchase.publicPrice")}
          </div>
          <div className="text-lg sm:text-xl md:text-2xl font-bold text-white">
            {priceAdvantage.publicPrice}
          </div>
          <p className="text-xs text-white/60 mt-1">
            {t("purchase.publicOffering")}
          </p>
        </motion.div>
      </div>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={isInView ? { opacity: 1, scale: 1 } : {}}
        transition={{ delay: 0.4 }}
        className="rounded-lg border-2 border-emerald-500/50 bg-linear-to-r from-emerald-900/30 to-teal-900/30 p-3 sm:p-4 md:mt-auto"
      >
        <div className="flex items-center justify-between gap-2 mb-1.5">
          <div className="text-xs text-white/70">
            {t("purchase.advantage")}
          </div>
          <div className="text-xl sm:text-2xl md:text-3xl font-extrabold text-emerald-400">
            {priceAdvantage.advantage}
          </div>
        </div>
        <p className="text-xs text-white/80">
          {t("purchase.advantageDescription")}
        </p>
      </motion.div>
    </div>
  );
};

export default PriceAdvantage;

