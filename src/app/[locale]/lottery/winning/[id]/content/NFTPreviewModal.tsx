"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslations } from "next-intl";
import WinningTicketCard from "./WinningTicketCard";
import type { LotteryHistory } from "@/service/lottery";
import type { WinningType } from "./index";
import { type Variants } from "framer-motion";

interface NFTPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  dna: string | null;
  type: WinningType;
  winningId: string;
  lotteryHistory: LotteryHistory | null;
}

const NFTPreviewModal: React.FC<NFTPreviewModalProps> = ({
  isOpen,
  onClose,
  dna,
  type,
  winningId,
  lotteryHistory,
}) => {
  const tCommon = useTranslations("common");

  if (!isOpen || !dna) return null;

  // 卡片动画变体
  const cardVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.3,
      },
    },
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-100 flex items-center justify-center p-4"
        onClick={onClose}
      >
        {/* Backdrop */}
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

        {/* Modal Content */}
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 20 }}
          transition={{ type: "spring", duration: 0.3 }}
          className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto bg-gradient-to-b from-slate-900 via-slate-950 to-slate-900 border border-white/10 rounded-2xl md:rounded-3xl shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-3 right-3 md:top-4 md:right-4 z-10 w-8 h-8 md:w-10 md:h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white/70 hover:text-white transition-colors cursor-pointer"
            aria-label={tCommon("accessibility.close")}
          >
            <svg
              className="w-4 h-4 md:w-5 md:h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>

          {/* NFT Card Content */}
          <div className="p-4 md:p-6">
            <WinningTicketCard
              winnerDna={dna}
              type={type}
              winningId={winningId}
              lotteryHistory={lotteryHistory}
              variants={cardVariants}
            />
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default NFTPreviewModal;
