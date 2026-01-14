"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { type LotteryHistoryDetail, queryDrawHistoryDetail } from "@/service/lottery";
import NFTPreviewModal from "./NFTPreviewModal";
import DrawInformation from "./DrawInformation";
import WinnerList from "./WinnerList";

export type WinningType = "lottery" | "follow";

interface WinningDetailProps {
  winningId: string;
  type: WinningType;
}

const WinningDetail: React.FC<WinningDetailProps> = ({ winningId, type }) => {
  const t = useTranslations("lottery.winningDetail");
  const tCommon = useTranslations("common");

  // 数据状态
  const [lotteryHistory, setLotteryHistory] = useState<LotteryHistoryDetail | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // NFT 预览弹窗状态
  const [previewModalOpen, setPreviewModalOpen] = useState(false);
  const [previewDna, setPreviewDna] = useState<string | null>(null);

  // 从接口获取数据
  useEffect(() => {
    const fetchDrawHistoryDetail = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const drawId = parseInt(winningId, 10);
        if (isNaN(drawId)) {
          setError("Invalid draw ID");
          setIsLoading(false);
          return;
        }

        const response = await queryDrawHistoryDetail(drawId);
        
        if (response.ok && response.data) {
          setLotteryHistory(response.data);
        } else {
          const errorMsg = response.msg || response.code || "Failed to load draw history";
          setError(errorMsg);
          console.error("Failed to fetch draw history detail:", errorMsg);
        }
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : "Failed to load draw history";
        setError(errorMsg);
        console.error("Failed to fetch draw history detail:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDrawHistoryDetail();
  }, [winningId]);


  // 错误状态（只在有错误且没有数据时显示全屏错误）
  if (error && !lotteryHistory) {
    return (
      <section className="relative py-20 md:py-32">
        <div className="relative z-10 max-w-4xl mx-auto px-6 md:px-8">
          <div className="text-center py-20 bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl">
            <div className="flex flex-col items-center justify-center gap-4">
              <i className="fa fa-exclamation-triangle text-4xl text-white/60" />
              <p className="text-white/80 text-base md:text-lg">
                {error || tCommon("errors.failedToLoadHistory")}
              </p>
              <button
                onClick={() => {
                  setIsLoading(true);
                  setError(null);
                  const drawId = parseInt(winningId, 10);
                  if (!isNaN(drawId)) {
                    queryDrawHistoryDetail(drawId)
                      .then((response) => {
                        if (response.ok && response.data) {
                          setLotteryHistory(response.data);
                        } else {
                          setError(response.msg || response.code || "Failed to load draw history");
                        }
                      })
                      .catch((err) => {
                        setError(err instanceof Error ? err.message : "Failed to load draw history");
                      })
                      .finally(() => {
                        setIsLoading(false);
                      });
                  }
                }}
                className="mt-4 px-6 py-2 bg-linear-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-full transition-all duration-200 font-semibold"
              >
                {tCommon("retry") || "Retry"}
              </button>
            </div>
          </div>
        </div>
      </section>
    );
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut" as const,
      },
    },
  };


  return (
    <section className="relative py-20 md:py-32">
      {/* Background Elements */}

      <motion.div
        className="relative z-10 max-w-7xl mx-auto px-6 md:px-8"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Page Header */}
        <motion.div
          variants={itemVariants}
          className="text-center mb-12 md:mb-16"
        >
          <motion.div
            className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full border border-white/15 bg-white/5 backdrop-blur-sm text-white/90 mb-6"
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.6 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-sm">
              {type === "lottery" ? t("badge.lottery") : t("badge.follow")}
            </span>
          </motion.div>
        </motion.div>

        {/* Draw Information */}
        <DrawInformation
          lotteryHistory={lotteryHistory}
          isLoading={isLoading}
          variants={itemVariants}
        />

        {/* Winner List */}
        <WinnerList
          lotteryHistory={lotteryHistory}
          isLoading={isLoading}
          variants={itemVariants}
          onPreviewNFT={(dna) => {
            setPreviewDna(dna);
            setPreviewModalOpen(true);
          }}
        />
      </motion.div>

      {/* NFT Preview Modal */}
      {lotteryHistory && (
        <NFTPreviewModal
          isOpen={previewModalOpen}
          onClose={() => {
            setPreviewModalOpen(false);
            setPreviewDna(null);
          }}
          dna={previewDna}
          type={type}
          winningId={winningId}
          lotteryHistory={lotteryHistory}
        />
      )}
    </section>
  );
};

export default WinningDetail;
