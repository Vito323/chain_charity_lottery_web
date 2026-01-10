"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { useChainId, useAccount } from "wagmi";
import { useRouter } from "@/i18n/navigation";
import { type LotteryHistory } from "@/service/lottery";
import { getScanUrl } from "@/utils/chain-info";
import { CopyButton } from "@/components/copy-button";
import dayjs from "dayjs";
import { formatCurrency } from "@/utils/currency";
import NFTPreviewModal from "./NFTPreviewModal";

export type WinningType = "lottery" | "follow";

interface WinningDetailProps {
  winningId: string;
  type: WinningType;
}

const WinningDetail: React.FC<WinningDetailProps> = ({ winningId, type }) => {
  const t = useTranslations("lottery.winningDetail");
  const tCommon = useTranslations("common");
  const chainId = useChainId();
  const { address } = useAccount();
  const router = useRouter();
  const scanUrl = getScanUrl(chainId);

  // 从 localStorage 读取数据
  const [lotteryHistory, setLotteryHistory] = useState<LotteryHistory | null>(
    null
  );
  
  // NFT 预览弹窗状态
  const [previewModalOpen, setPreviewModalOpen] = useState(false);
  const [previewDna, setPreviewDna] = useState<string | null>(null);

  // 清空所有以 lottery_history_ 开头的缓存
  const clearLotteryHistoryCache = () => {
    try {
      const keysToRemove: string[] = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith("lottery_history_")) {
          keysToRemove.push(key);
        }
      }
      keysToRemove.forEach((key) => localStorage.removeItem(key));
    } catch (error) {
      console.error("Failed to clear lottery history cache:", error);
    }
  };

  // 从 localStorage 读取数据并检查日期
  useEffect(() => {
    try {
      const storedData = localStorage.getItem(`lottery_history_${winningId}`);
      if (storedData) {
        const data = JSON.parse(storedData) as LotteryHistory;

        // 检查开奖时间的日期与当天日期是否相符
        const drawDate = dayjs(data.createdAt).format("YYYY-MM-DD");
        const todayDate = dayjs().format("YYYY-MM-DD");

        if (drawDate !== todayDate) {
          // 日期不符，清空缓存并跳转
          setLotteryHistory(null);
          clearLotteryHistoryCache();
          return;
        }

        setLotteryHistory(data);
      }
    } catch (error) {
      console.error("Failed to load lottery history from localStorage:", error);
      setLotteryHistory(null);
      clearLotteryHistoryCache();
    }
  }, [winningId, router]);


  // 如果没有数据，返回 null 或显示错误
  if (!lotteryHistory) {
    return (
      <section className="relative py-20 md:py-32">
        <div className="relative z-10 max-w-4xl mx-auto px-6 md:px-8">
          <div className="text-center py-20 bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl">
            <p className="text-white/80">
              {tCommon("errors.failedToLoadHistory")}
            </p>
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

        {/* Prize Pool Amount */}
        {/* <motion.div
          variants={itemVariants}
          className="bg-linear-to-r from-emerald-500/20 via-teal-500/20 to-emerald-500/20 backdrop-blur-xl border border-emerald-500/30 rounded-3xl p-6 md:p-8 mb-6 md:mb-8"
        >
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="text-white/70 text-base md:text-lg">
              {t("prizePoolAmount")}
            </div>
            <div className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white">
              ≈{formatCurrency(lotteryHistory.total, "", 6)} USDT
            </div>
          </div>
        </motion.div> */}

        {/* Draw Information */}
        <motion.div variants={itemVariants} className="space-y-6 md:space-y-8">
          <h3 className="text-xl md:text-2xl font-bold text-white">
            {t("drawInformation")}
          </h3>

          {/* Draw Time */}
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-4 md:p-6">
            <div className="flex items-center justify-between">
              <div className="text-white/60 text-sm md:text-base">
                {t("drawTime")}
              </div>
              <div className="text-white font-semibold text-base md:text-lg">
                {dayjs(lotteryHistory.createdAt).format("YYYY-MM-DD HH:mm:ss")}
              </div>
            </div>
          </div>

          {/* Draw Hash */}
          {lotteryHistory.drawLotteryTxHash && (
            <motion.div
              variants={itemVariants}
              className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-4 md:p-6"
            >
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="text-white/60 text-sm md:text-base">
                  {t("drawHash")}
                </div>
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
              </div>
            </motion.div>
          )}

          {/* VRF */}
          {lotteryHistory.dna && (
            <motion.div
              variants={itemVariants}
              className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-4 md:p-6"
            >
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="text-white/60 text-sm md:text-base">
                  {t("VRF")}
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-white font-semibold text-sm md:text-base font-mono">
                    {lotteryHistory.dna.length > 14
                      ? `${lotteryHistory.dna.slice(
                          0,
                          6
                        )}...${lotteryHistory.dna.slice(-8)}`
                      : lotteryHistory.dna}
                  </span>
                  <CopyButton text={lotteryHistory.dna} />
                </div>
              </div>
            </motion.div>
          )}

          {/* Timestamp */}
          <motion.div
            variants={itemVariants}
            className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-4 md:p-6"
          >
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="text-white/60 text-sm md:text-base">
                {t("timestamp")}
              </div>
              <div className="text-white font-semibold text-sm md:text-base font-mono">
                {`${dayjs().format("YYYY-MM-DD HH:mm:ss")} #${
                  lotteryHistory.id
                }`}
              </div>
            </div>
          </motion.div>

          {/* Winner List */}
          {lotteryHistory.lotteryDrawTickets &&
            lotteryHistory.lotteryDrawTickets.length > 0 && (
              <motion.div variants={itemVariants} className="mt-6 md:mt-8">
                <h3 className="text-xl md:text-2xl font-bold text-white mb-4 md:mb-6">
                  {t("winnerList")}
                </h3>
                <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-white/10">
                          <th className="px-3 md:px-4 py-3 md:py-4 text-left text-white/60 text-sm md:text-base font-semibold">
                            NFT ID
                          </th>
                          <th className="px-3 md:px-4 py-3 md:py-4 text-left text-white/60 text-sm md:text-base font-semibold">
                            {t("address")}
                          </th>
                          <th className="px-3 md:px-4 py-3 md:py-4 text-left text-white/60 text-sm md:text-base font-semibold">
                            {t("reward")}
                          </th>
                          <th className="px-3 md:px-4 py-3 md:py-4 text-left text-white/60 text-sm md:text-base font-semibold">
                            DNA
                          </th>
                          <th className="px-3 md:px-4 py-3 md:py-4 text-left text-white/60 text-sm md:text-base font-semibold">
                            {t("previewNFT")}
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {lotteryHistory.lotteryDrawTickets.map(
                          (drawTicket, index) => {
                            const isCurrentWallet = address && drawTicket.ticket?.ownerId && 
                              address.toLowerCase() === drawTicket.ticket.ownerId.toLowerCase();
                            
                            return (
                              <motion.tr
                                key={index}
                                variants={itemVariants}
                                className={`border-b last:border-b-0 transition-all duration-300 ${
                                  isCurrentWallet
                                    ? "bg-linear-to-r from-emerald-500/20 via-teal-500/20 to-emerald-500/20 border-emerald-400/40 hover:from-emerald-500/30 hover:via-teal-500/30 hover:to-emerald-500/30 shadow-lg shadow-emerald-500/20 relative"
                                    : "border-white/10 hover:bg-white/8"
                                }`}
                              >
                                {/* {isCurrentWallet && (
                                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-linear-to-b from-emerald-400 to-teal-400 rounded-r-full"></div>
                                )} */}
                                <td className="px-3 md:px-4 py-3 md:py-4 text-white/80 text-sm md:text-base relative">
                                  <div className="flex items-center gap-2">
                                    <span className={isCurrentWallet ? "text-white font-semibold" : ""}>
                                      {drawTicket.ticket.id}
                                    </span>
                                  </div>
                                </td>
                                <td className="px-3 md:px-4 py-3 md:py-4 font-mono text-sm md:text-base relative">
                                  <div className="flex items-center gap-2">
                                    <span className={isCurrentWallet ? "text-white font-semibold bg-emerald-500/10 px-2 py-1 rounded-md" : "text-white"}>
                                      {drawTicket.ticket?.ownerId
                                        ? drawTicket.ticket.ownerId.length > 14
                                          ? `${drawTicket.ticket.ownerId.slice(
                                              0,
                                              6
                                            )}...${drawTicket.ticket.ownerId.slice(
                                              -8
                                            )}`
                                          : drawTicket.ticket.ownerId
                                        : "-"}
                                    </span>
                                    {isCurrentWallet && (
                                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-linear-to-r from-emerald-400 to-teal-400 text-white shadow-md">
                                        <i className="fa fa-star text-[10px]"></i>
                                        {/* YOU */}
                                      </span>
                                    )}
                                  </div>
                                </td>
                                <td className={`px-3 md:px-4 py-3 md:py-4 text-sm md:text-base ${isCurrentWallet ? "text-white font-semibold" : "text-white"}`}>
                                  {drawTicket.reward
                                    ? formatCurrency(drawTicket.reward, "", 6)
                                    : "-"} USDT
                                </td>
                                <td className="px-3 md:px-4 py-3 md:py-4">
                                  {drawTicket.ticket?.dna ? (
                                    <div className="flex items-center gap-2 relative">
                                      <span className={`font-mono text-sm md:text-base ${isCurrentWallet ? "text-white font-semibold" : "text-white"}`}>
                                        {drawTicket.ticket.dna.length > 14
                                          ? `${drawTicket.ticket.dna.slice(
                                              0,
                                              6
                                            )}...${drawTicket.ticket.dna.slice(
                                              -8
                                            )}`
                                          : drawTicket.ticket.dna}
                                      </span>
                                      <CopyButton
                                        text={drawTicket.ticket.dna}
                                        tooltipPosition="top"
                                      />
                                    </div>
                                  ) : (
                                    <span className={`font-mono text-sm md:text-base ${isCurrentWallet ? "text-white/60" : "text-white"}`}>
                                      -
                                    </span>
                                  )}
                                </td>
                                <td className="px-3 md:px-4 py-3 md:py-4">
                                  {drawTicket.ticket?.dna ? (
                                    <button
                                      onClick={() => {
                                        setPreviewDna(drawTicket.ticket.dna);
                                        setPreviewModalOpen(true);
                                      }}
                                      className={`inline-flex items-center justify-center px-2 md:px-4 py-1.5 md:py-2 text-xs md:text-sm font-semibold text-white rounded-full transition-all duration-200 cursor-pointer active:scale-95 ${
                                        isCurrentWallet
                                          ? "bg-linear-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 shadow-lg shadow-emerald-500/40 hover:shadow-emerald-500/60"
                                          : "bg-linear-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 shadow-lg shadow-purple-500/20 hover:shadow-purple-500/40"
                                      }`}
                                      title={t("previewNFT")}
                                    >
                                      <i className="fa fa-eye text-xs md:text-sm"></i>
                                      <span className="hidden md:inline ml-1.5 md:ml-2">{t("previewNFT")}</span>
                                    </button>
                                  ) : (
                                    <span className="text-white/40 text-sm md:text-base">-</span>
                                  )}
                                </td>
                              </motion.tr>
                            );
                          }
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </motion.div>
            )}
        </motion.div>
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
