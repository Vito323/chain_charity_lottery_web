"use client";

import React from "react";
import { motion, type Variants } from "framer-motion";
import type { NodeTierId } from "@/constants/nodes";

interface NFT {
  id: string;
  nodeId: NodeTierId;
  nodeName: string;
  gradient: string;
  borderColor: string;
}

interface NFTSelectorProps {
  nfts: NFT[];
  selectedNodeId: NodeTierId;
  onNFTChange: (nodeId: NodeTierId) => void;
  isInView: boolean;
  variants: Variants;
}

const NFTSelector: React.FC<NFTSelectorProps> = ({
  nfts,
  selectedNodeId,
  onNFTChange,
  isInView,
  variants,
}) => {
  return (
    <motion.section
      variants={variants}
      className="space-y-3 sm:space-y-4"
    >
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3 md:gap-4">
        {nfts.map((nft, index) => (
          <motion.div
            key={nft.id}
            onClick={() => onNFTChange(nft.nodeId)}
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: index * 0.1 }}
            className={`relative rounded-xl sm:rounded-2xl border-2 ${
              selectedNodeId === nft.nodeId
                ? "border-yellow-500 ring-2 ring-yellow-500/50"
                : nft.borderColor
            } bg-linear-to-br ${nft.gradient} p-3 sm:p-4 md:p-6 aspect-[3/4] flex flex-col justify-between shadow-xl hover:scale-105 transition-all duration-300 cursor-pointer`}
          >
            {selectedNodeId === nft.nodeId && (
              <div className="absolute top-2 right-2 w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center z-20">
                <svg className="w-4 h-4 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            )}
            <div className="absolute inset-0 bg-linear-to-b from-transparent via-transparent to-black/20 rounded-xl sm:rounded-2xl" />
            <div className="relative z-10">
              <h3 className="text-xs sm:text-sm font-bold text-white/90 mb-2 leading-tight break-words">
                {nft.nodeName}
              </h3>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
};

export default NFTSelector;

