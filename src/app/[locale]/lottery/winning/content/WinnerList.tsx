"use client";

import React, { useMemo } from "react";
import { motion, type Variants } from "framer-motion";
import { useTranslations } from "next-intl";
import { useAccount } from "wagmi";
import { type LotteryHistoryDetail } from "@/service/lottery";
import { CopyButton } from "@/components/copy-button";
import { formatCurrency } from "@/utils/currency";
import { rankToRarity, rarityConfig, goldShimmerStyle } from "@/utils/lottery";

interface WinnerListProps {
  lotteryHistory: LotteryHistoryDetail | null;
  isLoading: boolean;
  variants: Variants;
  onPreviewNFT: (dna: string) => void;
}

const WinnerList: React.FC<WinnerListProps> = ({
  lotteryHistory,
  isLoading,
  variants,
  onPreviewNFT,
}) => {
  const t = useTranslations("lottery.winningDetail");
  const tCommon = useTranslations("common");
  const { address } = useAccount();

  // 按 score 从大到小排序
  const sortedTickets = useMemo(() => {
    if (!lotteryHistory?.lotteryDrawTickets) return [];
    return [...lotteryHistory.lotteryDrawTickets].sort((a, b) => {
      const scoreA = a.score || 0;
      const scoreB = b.score || 0;
      return scoreB - scoreA; // 从大到小排序
    });
  }, [lotteryHistory?.lotteryDrawTickets]);

  // 加载状态
  if (isLoading) {
    return (
      <motion.div variants={variants} className="mt-6 md:mt-8">
        <h3 className="text-xl md:text-2xl font-bold text-white mb-4 md:mb-6">
          {t("winnerList")}
        </h3>
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden">
          <div className="flex items-center justify-center py-20">
            <div className="flex flex-col items-center justify-center gap-4">
              <div className="w-12 h-12 border-4 border-white/20 border-t-white rounded-full animate-spin" />
              <p className="text-white/80 text-base md:text-lg">
                {tCommon("status.loading")}
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  // 没有数据
  if (!lotteryHistory?.lotteryDrawTickets || sortedTickets.length === 0) {
    return null;
  }

  return (
    <motion.div variants={variants} className="mt-6 md:mt-8">
      <h3 className="text-xl md:text-2xl font-bold text-white mb-4 md:mb-6">
        {t("winnerList")}
      </h3>
      <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/10">
                <th className="px-3 md:px-4 py-3 md:py-4 text-left text-white/60 text-sm md:text-base font-semibold whitespace-nowrap">
                  {t("ranking")}
                </th>
                <th className="px-3 md:px-4 py-3 md:py-4 text-left text-white/60 text-sm md:text-base font-semibold whitespace-nowrap">
                  NFT ID
                </th>
                <th className="px-3 md:px-4 py-3 md:py-4 text-left text-white/60 text-sm md:text-base font-semibold whitespace-nowrap">
                  {t("address")}
                </th>
                <th className="px-3 md:px-4 py-3 md:py-4 text-left text-white/60 text-sm md:text-base font-semibold whitespace-nowrap">
                  {t("reward")}
                </th>
                <th className="px-3 md:px-4 py-3 md:py-4 text-left text-white/60 text-sm md:text-base font-semibold whitespace-nowrap">
                  DNA
                </th>
                <th className="px-3 md:px-4 py-3 md:py-4 text-left text-white/60 text-sm md:text-base font-semibold whitespace-nowrap">
                  NFT {t("rarity")}
                </th>
                <th className="px-3 md:px-4 py-3 md:py-4 text-left text-white/60 text-sm md:text-base font-semibold whitespace-nowrap">
                  {t("previewNFT")}
                </th>
              </tr>
            </thead>
            <tbody>
              {sortedTickets.map((drawTicket, index) => {
                const isCurrentWallet =
                  address &&
                  drawTicket.ticket?.ownerId &&
                  address.toLowerCase() ===
                    drawTicket.ticket.ownerId.toLowerCase();

                // 获取稀有度信息
                const rank = drawTicket.ticket?.series?.rank;
                const rarity = rank ? rankToRarity(rank) : null;
                const rarityStyle = rarity ? rarityConfig[rarity] : null;

                return (
                  <motion.tr
                    key={`${drawTicket.ticket?.id || index}`}
                    initial="hidden"
                    animate="visible"
                    variants={variants}
                    className={`border-b last:border-b-0 transition-all duration-300 ${
                      isCurrentWallet
                        ? "bg-linear-to-r from-emerald-500/20 via-teal-500/20 to-emerald-500/20 border-emerald-400/40 hover:from-emerald-500/30 hover:via-teal-500/30 hover:to-emerald-500/30 shadow-lg shadow-emerald-500/20 relative"
                        : "border-white/10 hover:bg-white/8"
                    }`}
                  >
                    <td className="px-3 md:px-4 py-3 md:py-4 text-white/80 text-sm md:text-base relative whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <span
                          className={
                            isCurrentWallet ? "text-white font-semibold" : ""
                          }
                        >
                          #{index + 1}
                        </span>
                      </div>
                    </td>
                    <td className="px-3 md:px-4 py-3 md:py-4 text-white/80 text-sm md:text-base relative whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <span
                          className={
                            isCurrentWallet ? "text-white font-semibold" : ""
                          }
                        >
                          {drawTicket.ticket.id}
                        </span>
                      </div>
                    </td>
                    <td className="px-3 md:px-4 py-3 md:py-4 font-mono text-sm md:text-base relative whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <span
                          className={
                            isCurrentWallet
                              ? "text-white font-semibold bg-emerald-500/10 px-2 py-1 rounded-md"
                              : "text-white"
                          }
                        >
                          {drawTicket.ticket?.ownerId
                            ? drawTicket.ticket.ownerId.length > 14
                              ? `${drawTicket.ticket.ownerId.slice(
                                  0,
                                  6
                                )}...${drawTicket.ticket.ownerId.slice(-8)}`
                              : drawTicket.ticket.ownerId
                            : "-"}
                        </span>
                        {isCurrentWallet && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-linear-to-r from-emerald-400 to-teal-400 text-white shadow-md">
                            <i className="fa fa-star text-[10px]"></i>
                          </span>
                        )}
                      </div>
                    </td>
                    <td
                      className={`px-3 md:px-4 py-3 md:py-4 text-sm md:text-base whitespace-nowrap ${
                        isCurrentWallet ? "text-white font-semibold" : "text-white"
                      }`}
                    >
                      {drawTicket.reward
                        ? formatCurrency(drawTicket.reward, "", 6)
                        : "-"}{" "}
                      USDT
                    </td>
                    <td className="px-3 md:px-4 py-3 md:py-4 whitespace-nowrap">
                      {drawTicket.ticket?.dna ? (
                        <div className="flex items-center gap-2 relative">
                          <span
                            className={`font-mono text-sm md:text-base ${
                              isCurrentWallet
                                ? "text-white font-semibold"
                                : "text-white"
                            }`}
                          >
                            {drawTicket.ticket.dna.length > 14
                              ? `${drawTicket.ticket.dna.slice(
                                  0,
                                  6
                                )}...${drawTicket.ticket.dna.slice(-8)}`
                              : drawTicket.ticket.dna}
                          </span>
                          <CopyButton
                            text={drawTicket.ticket.dna}
                            tooltipPosition="top"
                          />
                        </div>
                      ) : (
                        <span
                          className={`font-mono text-sm md:text-base ${
                            isCurrentWallet ? "text-white/60" : "text-white"
                          }`}
                        >
                          -
                        </span>
                      )}
                    </td>
                    <td className="px-3 md:px-4 py-3 md:py-4 whitespace-nowrap">
                      {rarity && rarityStyle ? (
                        <div className="relative inline-flex items-center">
                          {/* 黄金闪烁效果 - 仅在 rank 5 (mythic) 时显示 */}
                          {rank === 5 && (
                            <>
                              <style>{goldShimmerStyle}</style>
                              <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-full">
                                <div
                                  className="absolute inset-0"
                                  style={{
                                    background:
                                      "linear-gradient(90deg, transparent 0%, rgba(255, 240, 120, 0.4) 30%, rgba(255, 250, 150, 0.7) 50%, rgba(255, 240, 120, 0.4) 70%, transparent 100%)",
                                    animation: "goldShimmer 3s ease-in-out infinite",
                                    width: "60%",
                                    height: "140%",
                                  }}
                                />
                              </div>
                            </>
                          )}
                          <span
                            className={`inline-flex items-center px-2 md:px-3 py-0.5 md:py-1 rounded-full text-xs md:text-sm font-semibold ${rarityStyle.color} bg-linear-to-r ${rarityStyle.bgGradient} border`}
                            style={{ borderColor: rarityStyle.borderColor }}
                          >
                            {tCommon(`rarity.${rarity}`)}
                          </span>
                        </div>
                      ) : (
                        <span className="text-white/40 text-sm md:text-base">
                          -
                        </span>
                      )}
                    </td>
                    <td className="px-3 md:px-4 py-3 md:py-4 whitespace-nowrap">
                      {drawTicket.ticket?.dna ? (
                        <button
                          onClick={() => {
                            onPreviewNFT(drawTicket.ticket.dna);
                          }}
                          className={`inline-flex items-center justify-center px-2 md:px-4 py-1.5 md:py-2 text-xs md:text-sm font-semibold text-white rounded-full transition-all duration-200 cursor-pointer active:scale-95 ${
                            isCurrentWallet
                              ? "bg-linear-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 shadow-lg shadow-emerald-500/40 hover:shadow-emerald-500/60"
                              : "bg-linear-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 shadow-lg shadow-purple-500/20 hover:shadow-purple-500/40"
                          }`}
                          title={t("previewNFT")}
                        >
                          <i className="fa fa-eye text-xs md:text-sm"></i>
                          <span className="hidden md:inline ml-1.5 md:ml-2">
                            {t("previewNFT")}
                          </span>
                        </button>
                      ) : (
                        <span className="text-white/40 text-sm md:text-base">
                          -
                        </span>
                      )}
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  );
};

export default WinnerList;
