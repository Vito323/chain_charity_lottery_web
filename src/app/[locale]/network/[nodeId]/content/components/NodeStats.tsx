"use client";

import React from "react";
import { motion, type Variants } from "framer-motion";
import { useTranslations } from "next-intl";
import type { NodeStats as NodeStatsType } from "@/constants/nodes";

interface NodeStatsProps {
  stats: NodeStatsType;
  isStandard: boolean;
  isSuper: boolean;
  isInView: boolean;
  variants: Variants;
}

const NodeStats: React.FC<NodeStatsProps> = ({
  stats,
  isStandard,
  isSuper,
  isInView,
  variants,
}) => {
  const t = useTranslations("nodeDetail");
  const progressPercentage = (stats.sold / stats.totalLimit) * 100;

  return (
    <motion.section variants={variants} className="relative">
      <div className="relative rounded-xl sm:rounded-2xl border border-white/10 bg-linear-to-br from-slate-900/90 via-slate-950/95 to-slate-900/90 p-3 sm:p-4 md:p-5 shadow-xl overflow-hidden">
        {/* Background gradient effects */}
        <div
          className={`pointer-events-none absolute -top-20 -right-16 sm:-top-32 sm:-right-24 w-48 h-48 sm:w-72 sm:h-72 blur-3xl opacity-40 ${
            isStandard ? "bg-emerald-500/20" : isSuper ? "bg-blue-500/20" : "bg-purple-500/20"
          }`}
        />
        <div
          className={`pointer-events-none absolute -bottom-20 -left-16 sm:-bottom-32 sm:-left-24 w-56 h-56 sm:w-80 sm:h-80 blur-3xl opacity-40 ${
            isStandard ? "bg-teal-500/20" : isSuper ? "bg-cyan-500/20" : "bg-pink-500/20"
          }`}
        />

        <div className="relative z-10">
          {/* Genesis Layout - All nodes use this layout */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3 md:gap-4">
            {/* Total Investment Limit */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.2 }}
              className="rounded-lg sm:rounded-xl border border-white/10 bg-white/5 p-2.5 sm:p-3 md:p-4 text-center"
            >
              <div className="text-xs text-white/60 mb-1">{t("stats.limit")}</div>
              <div className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-white">
                {stats.totalLimit.toLocaleString()}
              </div>
            </motion.div>

            {/* Sold Count */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.3 }}
              className="rounded-lg sm:rounded-xl border border-white/10 bg-white/5 p-2.5 sm:p-3 md:p-4 text-center"
            >
              <div className="text-xs text-white/60 mb-1">{t("stats.sold")}</div>
              <div className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-emerald-400">
                {stats.sold.toLocaleString()}
              </div>
            </motion.div>

            {/* Remaining Count */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.4 }}
              className="rounded-lg sm:rounded-xl border border-white/10 bg-white/5 p-2.5 sm:p-3 md:p-4 text-center"
            >
              <div className="text-xs text-white/60 mb-1">
                {t("stats.remaining")}
              </div>
              <div className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-purple-400">
                {stats.remaining.toLocaleString()}
              </div>
            </motion.div>
          </div>

          {/* Progress Bar */}
          <motion.div
            initial={{ opacity: 0, scaleX: 0 }}
            animate={isInView ? { opacity: 1, scaleX: 1 } : {}}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="mt-3 sm:mt-4"
          >
            <div className="flex items-center justify-between text-xs text-white/70 mb-1">
              <span>{t("stats.progress")}</span>
              <span className="font-semibold">
                {progressPercentage.toFixed(1)}%
              </span>
            </div>
            <div className="relative h-2 rounded-full bg-white/10 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={
                  isInView ? { width: `${progressPercentage}%` } : {}
                }
                transition={{
                  delay: 0.6,
                  duration: 1,
                  ease: "easeOut",
                }}
                className={`absolute inset-y-0 left-0 bg-linear-to-r rounded-full ${
                  isStandard
                    ? "from-emerald-500 via-teal-500 to-emerald-500"
                    : isSuper
                    ? "from-blue-500 via-cyan-500 to-blue-500"
                    : "from-purple-500 via-pink-500 to-purple-500"
                }`}
              />
            </div>
            {stats.remaining > 0 && (
              <p className="text-xs text-white/60 text-center mt-1.5">
                {stats.remaining} {t("stats.remainingLowercase")}
              </p>
            )}
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
};

export default NodeStats;

