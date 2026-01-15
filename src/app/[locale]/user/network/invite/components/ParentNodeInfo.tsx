"use client";

import React from "react";
import { motion, type Variants } from "framer-motion";
import { useTranslations } from "next-intl";
import type { ParentNodeInfo as ParentNodeInfoType } from "../types";
import CopyButton from "@/components/copy-button";

interface ParentNodeInfoProps {
  parentNode: ParentNodeInfoType;
  isInView: boolean;
  variants: Variants;
}

const ParentNodeInfo: React.FC<ParentNodeInfoProps> = ({
  parentNode,
  isInView,
  variants,
}) => {
  const t = useTranslations("network.invite");
  const tCommon = useTranslations("common");

  // 节点类型颜色配置
  const nodeTypeConfig = {
    genesis: {
      badgeColor: "bg-purple-500/20 border-purple-500/30 text-purple-300",
      dotColor: "bg-purple-400",
      gradient: "from-purple-600 via-pink-600 to-purple-600",
      bgGradient: "bg-purple-500/10",
    },
    super: {
      badgeColor: "bg-blue-500/20 border-blue-500/30 text-blue-300",
      dotColor: "bg-blue-400",
      gradient: "from-blue-600 via-cyan-600 to-blue-600",
      bgGradient: "bg-blue-500/10",
    },
    standard: {
      badgeColor: "bg-emerald-500/20 border-emerald-500/30 text-emerald-300",
      dotColor: "bg-emerald-400",
      gradient: "from-emerald-600 via-teal-600 to-emerald-600",
      bgGradient: "bg-emerald-500/10",
    },
  };

  const config = nodeTypeConfig[parentNode.nodeType];

  // 格式化地址显示
  const formatAddress = (address: string) => {
    if (address.length <= 10) return address;
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  // 格式化日期
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <motion.section variants={variants} className="relative">
      <div className="relative rounded-xl sm:rounded-2xl border border-white/10 bg-gradient-to-br from-slate-900/90 via-slate-950/95 to-slate-900/90 p-4 sm:p-5 md:p-6 shadow-xl overflow-hidden">
        {/* Background gradient effects */}
        <div
          className={`pointer-events-none absolute -top-20 -right-16 sm:-top-32 sm:-right-24 w-48 h-48 sm:w-72 sm:h-72 blur-3xl opacity-40 ${config.bgGradient}`}
        />
        <div
          className={`pointer-events-none absolute -bottom-20 -left-16 sm:-bottom-32 sm:-left-24 w-56 h-56 sm:w-80 sm:h-80 blur-3xl opacity-40 ${config.bgGradient}`}
        />

        <div className="relative z-10">
          {/* Section Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.2 }}
            className="mb-6 sm:mb-8"
          >
            <div className="flex items-center gap-2 mb-4">
              <div className={`w-2 h-2 rounded-full ${config.dotColor} animate-pulse`} />
              <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-white">
                {t("parentNode.title") || "Parent Node Information"}
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-white/70">
              {t("parentNode.subtitle") || "Your referral node information"}
            </p>
          </motion.div>

          {/* Main Info Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.3 }}
            className="rounded-lg sm:rounded-xl border border-white/10 bg-white/5 p-4 sm:p-5 md:p-6 mb-4 sm:mb-6"
          >
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6">
              {/* Avatar Section */}
              <div className="flex-shrink-0">
                <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-full bg-gradient-to-br border-2 border-white/20 flex items-center justify-center overflow-hidden">
                  {parentNode.avatar ? (
                    <img
                      src={parentNode.avatar}
                      alt={parentNode.name || t("parentNode.title") || "Parent Node"}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className={`w-full h-full bg-gradient-to-br ${config.gradient} flex items-center justify-center text-white text-xl sm:text-2xl md:text-3xl font-bold`}>
                      {parentNode.name?.[0]?.toUpperCase() || parentNode.address[0]?.toUpperCase() || "P"}
                    </div>
                  )}
                </div>
              </div>

              {/* Info Section */}
              <div className="flex-1 w-full sm:w-auto">
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mb-3">
                  <h3 className="text-base sm:text-lg md:text-xl font-bold text-white">
                    {parentNode.name || formatAddress(parentNode.address)}
                  </h3>
                  <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs font-medium ${config.badgeColor}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${config.dotColor}`} />
                    {t(`parentNode.nodeType.${parentNode.nodeType}`) || 
                      `${parentNode.nodeType.charAt(0).toUpperCase() + parentNode.nodeType.slice(1)} Node`}
                  </div>
                </div>

                {/* Address with Copy */}
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-3">
                  <span className="text-xs sm:text-sm text-white/60">
                    {t("parentNode.address") || "Address"}:
                  </span>
                  <div className="flex items-center gap-2">
                    <code className="text-xs sm:text-sm text-white/80 font-mono bg-white/5 px-2 py-1 rounded">
                      {formatAddress(parentNode.address)}
                    </code>
                    <CopyButton text={parentNode.address} />
                  </div>
                </div>

                {/* Join Date */}
                <div className="text-xs sm:text-sm text-white/60">
                  <span>{t("parentNode.joinDate") || "Join Date"}: </span>
                  <span className="text-white/80">{formatDate(parentNode.joinDate)}</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Stats Grid */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.4 }}
            className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4"
          >
            {/* Node Count */}
            <div className="rounded-lg sm:rounded-xl border border-white/10 bg-white/5 p-3 sm:p-4 text-center">
              <div className="text-xs text-white/60 mb-1 sm:mb-2">
                {t("parentNode.nodeCount") || "Node Count"}
              </div>
              <div className="text-lg sm:text-xl md:text-2xl font-bold text-white">
                {parentNode.nodeCount.toLocaleString()}
              </div>
            </div>

            {/* Total Earnings */}
            <div className="rounded-lg sm:rounded-xl border border-white/10 bg-white/5 p-3 sm:p-4 text-center">
              <div className="text-xs text-white/60 mb-1 sm:mb-2">
                {t("parentNode.totalEarnings") || "Total Earnings"}
              </div>
              <div className="text-lg sm:text-xl md:text-2xl font-bold text-emerald-400">
                ${parentNode.totalEarnings.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
            </div>

            {/* Level */}
            <div className="rounded-lg sm:rounded-xl border border-white/10 bg-white/5 p-3 sm:p-4 text-center">
              <div className="text-xs text-white/60 mb-1 sm:mb-2">
                {t("parentNode.level") || "Level"}
              </div>
              <div className="text-lg sm:text-xl md:text-2xl font-bold text-purple-400">
                Lv.{parentNode.level}
              </div>
            </div>

            {/* Referral Count */}
            <div className="rounded-lg sm:rounded-xl border border-white/10 bg-white/5 p-3 sm:p-4 text-center">
              <div className="text-xs text-white/60 mb-1 sm:mb-2">
                {t("parentNode.referralCount") || "Referrals"}
              </div>
              <div className="text-lg sm:text-xl md:text-2xl font-bold text-blue-400">
                {parentNode.referralCount.toLocaleString()}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
};

export default ParentNodeInfo;
