"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { motion, type Variants } from "framer-motion";
import { useTranslations } from "next-intl";
import { renderTicketMetadata, type TicketMetadata } from "@/service/asset";
import { goldShimmerStyle, rarityConfig } from "@/utils/lottery";
import { formatCurrency } from "@/utils/currency";
import type { LotteryHistoryDetail } from "@/service/lottery";
import type { WinningType } from "./index";

interface WinningTicketCardProps {
  winnerDna: string;
  type: WinningType;
  winningId: string;
  lotteryHistory: LotteryHistoryDetail | null;
  variants: Variants;
}

const WinningTicketCard: React.FC<WinningTicketCardProps> = ({
  winnerDna,
  type,
  winningId,
  lotteryHistory,
  variants,
}) => {
  const t = useTranslations("lottery.winningDetail");
  const tCommon = useTranslations("common");

  const [ticketMetadata, setTicketMetadata] = useState<TicketMetadata | null>(
    null
  );
  const [isLoadingMetadata, setIsLoadingMetadata] = useState(false);
  const [imageError, setImageError] = useState(false);

  // 如果中奖了，根据中奖票的 dna 获取 Metadata（包含图片）
  useEffect(() => {
    if (winnerDna) {
      const fetchTicketMetadata = async () => {
        try {
          setIsLoadingMetadata(true);
          setImageError(false);
          // 移除 0x 前缀（如果存在）
          const dnaWithoutPrefix =
            winnerDna.startsWith("0x") || winnerDna.startsWith("0X")
              ? winnerDna.slice(2)
              : winnerDna;

          // 只调用 renderTicketMetadata 接口
          const metadataResponse = await renderTicketMetadata(dnaWithoutPrefix);

          if (metadataResponse && metadataResponse.data) {
            setTicketMetadata(metadataResponse.data);
          }
        } catch (error) {
          console.error("Failed to fetch ticket metadata:", error);
          setImageError(true);
        } finally {
          setIsLoadingMetadata(false);
        }
      };

      fetchTicketMetadata();
    }
  }, [winnerDna]);

  // 从 metadata attributes 中提取信息
  const getAttributeValue = (traitType: string): string => {
    if (!ticketMetadata?.attributes) return "";
    const attribute = ticketMetadata.attributes.find(
      (attr) => attr.trait_type.toLowerCase() === traitType.toLowerCase()
    );
    return attribute?.value || "";
  };

  // 获取 Rank 属性
  const rankValue =
    getAttributeValue("Rank") || getAttributeValue("rank") || "";
  const rarityStyle = rankValue ? rarityConfig[rankValue.toLowerCase()] : null;
  const isMythic = rankValue.toLowerCase() === "mythic";

  // 获取 NFT name
  const nftName = ticketMetadata?.name || "";

  // 获取图片 URL
  const ticketImageUrl = ticketMetadata?.image || null;

  return (
    <motion.div
      key={`winner-${winningId}`}
      variants={variants}
      initial="hidden"
      animate="visible"
      className="relative  backdrop-blur-xl  border-white/10 rounded-2xl md:rounded-3xl p-4 md:p-6 mb-0"
    >
      <div className="flex flex-col gap-4 md:gap-6">
        <div className="shrink-0 w-full">
          <div
            className="relative w-full max-w-xs mx-auto rounded-xl overflow-hidden bg-linear-to-br from-slate-800 to-slate-900"
            style={{
              aspectRatio: "16/10",
              border: rarityStyle
                ? `2px solid ${rarityStyle.borderColor}`
                : "2px solid rgba(255, 255, 255, 0.1)",
            }}
          >
            {isLoadingMetadata ? (
              <div className="absolute inset-0 flex items-center justify-center bg-slate-800/50">
                <div className="w-8 h-8 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              </div>
            ) : ticketImageUrl && !imageError ? (
              <>
                <Image
                  src={ticketImageUrl}
                  alt={`${tCommon("images.winningTicket")} ${winningId}`}
                  fill
                  className="object-cover z-0"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  unoptimized
                  onError={() => {
                    setImageError(true);
                  }}
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent z-10 pointer-events-none" />

                {/* 黄金闪烁效果 - 仅在 mythic 时显示 */}
                {isMythic && (
                  <>
                    <style>{goldShimmerStyle}</style>
                    <div
                      className="absolute inset-0 pointer-events-none overflow-hidden z-20"
                      style={{
                        borderRadius: "0.75rem",
                      }}
                    >
                      <div
                        className="absolute inset-0"
                        style={{
                          background:
                            "linear-gradient(90deg, transparent 0%, rgba(255, 240, 120, 0.4) 30%, rgba(255, 250, 150, 0.6) 50%, rgba(255, 240, 120, 0.4) 70%, transparent 100%)",
                          animation: "goldShimmer 3s ease-in-out infinite",
                          width: "50%",
                          height: "100%",
                        }}
                      />
                    </div>
                  </>
                )}
              </>
            ) : (
              <div className="absolute inset-0 flex items-center justify-center bg-slate-800/50">
                <Image
                  src="/images/placeholder-all.png"
                  alt={`${tCommon("images.winningTicket")} ${winningId}`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  priority={false}
                />
              </div>
            )}
          </div>
        </div>

        <div className="flex-1 space-y-2 md:space-y-3">
          <div>
            {isLoadingMetadata ? (
              <div className="space-y-2">
                <div className="h-5 md:h-6 bg-white/10 rounded animate-pulse" />
                <div className="h-4 md:h-5 bg-white/10 rounded animate-pulse w-2/3" />
              </div>
            ) : (
              <>
                {/* NFT Name */}
                {nftName && (
                  <h2 className="text-lg md:text-xl font-bold text-white mb-2 md:mb-3 text-center">
                    {nftName}
                  </h2>
                )}

                {/* Rank 标签 */}
                {rankValue && rarityStyle && (
                  <div className="mb-2 md:mb-3 flex justify-center">
                    <span
                      className={`inline-flex items-center px-2 md:px-3 py-0.5 md:py-1 rounded-full text-xs md:text-sm font-semibold ${rarityStyle.color} bg-linear-to-r ${rarityStyle.bgGradient} border`}
                      style={{ borderColor: rarityStyle.borderColor }}
                    >
                      {rankValue}
                    </span>
                  </div>
                )}

                {ticketMetadata?.description && (
                  <p className="text-xs md:text-sm text-white/70 mt-2 text-center px-2">
                    {ticketMetadata.description}
                  </p>
                )}
              </>
            )}
          </div>

          {type === "follow" &&
            lotteryHistory?.lotteryDrawTickets?.[0]?.reward && (
              <div className="pt-2 md:pt-3 border-t border-white/10">
                <div className="text-white/60 text-xs md:text-sm mb-1 text-center">
                  {t("followBetAmount")}
                </div>
                <div className="text-base md:text-lg font-bold text-white text-center">
                  {formatCurrency(
                    Number(lotteryHistory.lotteryDrawTickets[0].reward),
                    "",
                    6
                  )}{" "}
                  USDT
                </div>
              </div>
            )}
        </div>
      </div>
    </motion.div>
  );
};

export default WinningTicketCard;
