"use client";

import React from "react";
import { motion, type Variants } from "framer-motion";
import { useTranslations } from "next-intl";
import { useChainId } from "wagmi";
import { type LotteryHistoryDetail } from "@/service/lottery";
import { getScanUrl } from "@/utils/chain-info";
import { CopyButton } from "@/components/copy-button";
import dayjs from "dayjs";

interface DrawInformationProps {
  lotteryHistory: LotteryHistoryDetail | null;
  isLoading: boolean;
  variants: Variants;
}

const DrawInformation: React.FC<DrawInformationProps> = ({
  lotteryHistory,
  isLoading,
  variants,
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
      <h3 className="text-xl md:text-2xl font-bold text-white">
        {t("drawInformation")}
      </h3>

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

      {/* Timestamp */}
      <motion.div
        variants={variants}
        className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-4 md:p-6"
      >
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="text-white/60 text-sm md:text-base">
            {t("timestamp")}
          </div>
          {isLoading ? (
            <SkeletonText className="w-48" />
          ) : (
            <div className="text-white font-semibold text-sm md:text-base font-mono">
              {lotteryHistory
                ? `${dayjs().format("YYYY-MM-DD HH:mm:ss")} #${lotteryHistory.id}`
                : "-"}
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default DrawInformation;
