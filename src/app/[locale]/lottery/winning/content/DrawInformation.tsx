"use client";

import React from "react";
import { motion, type Variants } from "framer-motion";
import { useTranslations } from "next-intl";
import { useChainId } from "wagmi";
import { type LotteryHistoryDetail } from "@/service/lottery";
import { getScanUrl } from "@/utils/chain-info";
import { CopyButton } from "@/components/copy-button";
import dayjs from "dayjs";
import { formatCurrency } from "@/utils/currency";

interface DrawInformationProps {
  lotteryHistory: LotteryHistoryDetail | null;
  isLoading: boolean;
  variants: Variants;
  currentPeriod: number;
  maxPeriod: number;
  canGoPrevious: boolean;
  canGoNext: boolean;
  onNavigate: (direction: "previous" | "next") => void;
}

const DrawInformation: React.FC<DrawInformationProps> = ({
  lotteryHistory,
  isLoading,
  variants,
  currentPeriod,
  maxPeriod,
  canGoPrevious,
  canGoNext,
  onNavigate,
}) => {
  const t = useTranslations("lottery.winningDetail");
  const chainId = useChainId();
  const scanUrl = getScanUrl(chainId);

  // 骨架屏组件
  const SkeletonText = ({ className = "" }: { className?: string }) => (
    <div className={`h-5 bg-white/10 rounded animate-pulse ${className}`} />
  );

  return (
    <motion.div variants={variants} className="space-y-6 md:space-y-8">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <h3 className="text-xl md:text-2xl font-bold text-white">
          {t("drawInformation")}
        </h3>
        {/* Navigation Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => onNavigate("previous")}
            disabled={!canGoPrevious}
            className={`
              px-4 py-2 rounded-xl font-semibold text-sm md:text-base
              transition-all duration-300 flex items-center gap-2
              ${
                canGoPrevious
                  ? "bg-linear-to-r from-purple-600/80 to-pink-600/80 hover:from-purple-600 hover:to-pink-600 text-white border border-white/20 hover:border-white/30 cursor-pointer hover:scale-105 active:scale-95 shadow-lg hover:shadow-purple-500/20"
                  : "bg-white/5 text-white/30 border border-white/10 cursor-not-allowed opacity-50"
              }
            `}
            title={canGoPrevious ? t("navigation.previousPeriod") : t("navigation.noPreviousPeriod")}
          >
            <i className="fa fa-chevron-left text-xs"></i>
            <span className="hidden sm:inline">{t("navigation.previous")}</span>
          </button>
          <button
            onClick={() => onNavigate("next")}
            disabled={!canGoNext}
            className={`
              px-4 py-2 rounded-xl font-semibold text-sm md:text-base
              transition-all duration-300 flex items-center gap-2
              ${
                canGoNext
                  ? "bg-linear-to-r from-purple-600/80 to-pink-600/80 hover:from-purple-600 hover:to-pink-600 text-white border border-white/20 hover:border-white/30 cursor-pointer hover:scale-105 active:scale-95 shadow-lg hover:shadow-purple-500/20"
                  : "bg-white/5 text-white/30 border border-white/10 cursor-not-allowed opacity-50"
              }
            `}
            title={canGoNext ? t("navigation.nextPeriod") : t("navigation.noNextPeriod")}
          >
            <span className="hidden sm:inline">{t("navigation.next")}</span>
            <i className="fa fa-chevron-right text-xs"></i>
          </button>
        </div>
      </div>

      {/* Draw Time */}
      <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-4 md:p-6">
        <div className="flex items-center justify-between">
          <div className="text-white/60 text-sm md:text-base">
            {t("drawTime")}
          </div>
          {isLoading ? (
            <SkeletonText className="w-40" />
          ) : (
            <div className="text-white font-semibold text-base md:text-lg">
              {lotteryHistory
                ? dayjs(lotteryHistory.createdAt).format("YYYY-MM-DD HH:mm:ss")
                : "-"}
            </div>
          )}
        </div>
      </div>

      {/* Draw Hash */}
      {(!isLoading && lotteryHistory?.drawLotteryTxHash) || isLoading ? (
        <motion.div
          variants={variants}
          className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-4 md:p-6"
        >
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="text-white/60 text-sm md:text-base">
              {t("drawHash")}
            </div>
            {isLoading ? (
              <SkeletonText className="w-48" />
            ) : lotteryHistory?.drawLotteryTxHash ? (
              <div className="flex items-center gap-2">
                <span className="text-white font-semibold text-sm md:text-base font-mono">
                  {lotteryHistory.drawLotteryTxHash.length > 14
                    ? `${lotteryHistory.drawLotteryTxHash.slice(
                        0,
                        6
                      )}...${lotteryHistory.drawLotteryTxHash.slice(-8)}`
                    : lotteryHistory.drawLotteryTxHash}
                </span>
                <button
                  onClick={() =>
                    window.open(
                      `${scanUrl}${lotteryHistory.drawLotteryTxHash}`,
                      "_blank"
                    )
                  }
                  className="text-white/40 hover:text-white/80 cursor-pointer transition-colors duration-200"
                  title="View Transaction Details"
                >
                  <i className="fa fa-external-link text-xs"></i>
                </button>
              </div>
            ) : null}
          </div>
        </motion.div>
      ) : null}

      {/* VRF */}
      {(!isLoading && lotteryHistory?.dna) || isLoading ? (
        <motion.div
          variants={variants}
          className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-4 md:p-6"
        >
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="text-white/60 text-sm md:text-base">{t("VRF")}</div>
            {isLoading ? (
              <SkeletonText className="w-48" />
            ) : lotteryHistory?.dna ? (
              <div className="flex items-center gap-2">
                <span className="text-white font-semibold text-sm md:text-base font-mono">
                  {lotteryHistory.dna.length > 14
                    ? `${lotteryHistory.dna.slice(0, 6)}...${lotteryHistory.dna.slice(-8)}`
                    : lotteryHistory.dna}
                </span>
                <CopyButton text={lotteryHistory.dna} />
              </div>
            ) : null}
          </div>
        </motion.div>
      ) : null}

      {/* Average Score */}
      {!isLoading &&
      lotteryHistory?.threshold &&
      parseFloat(lotteryHistory.threshold) <= 10000 && (
        <motion.div
          key="average-score"
          variants={variants}
          initial="hidden"
          animate="visible"
          className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-4 md:p-6"
        >
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="text-white/60 text-sm md:text-base">
              {t("averageScore")}
            </div>
            <div className="text-white font-semibold text-sm md:text-base">
              {formatCurrency(
                parseFloat(lotteryHistory.threshold) / 100,
                "",
                2
              )}
            </div>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default DrawInformation;
