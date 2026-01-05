"use client";
import React from "react";
import { motion } from "framer-motion";
import { DropdownContent } from './DropdownContent';

interface DesktopDropdownProps {
  show: boolean;
  account: { address: string };
  chain: { id: number; name?: string; iconUrl?: string };
  openChainModal: () => void;
  onClose: () => void;
}

export const DesktopDropdown: React.FC<DesktopDropdownProps> = ({
  show,
  account,
  chain,
  openChainModal,
  onClose,
}) => {
  if (!show) return null;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: -10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95, y: -10 }}
      transition={{ duration: 0.2 }}
      className="hidden md:flex md:flex-col absolute top-full right-0 bg-slate-900/95 rounded-2xl shadow-2xl shadow-black/40 z-[1000] mt-3 overflow-hidden border border-white/10 backdrop-blur-xl min-w-[300px] max-w-[300px] max-h-[85vh]"
    >
      <DropdownContent
        account={account}
        chain={chain}
        openChainModal={openChainModal}
        onCloseDropdown={onClose}
      />
    </motion.div>
  );
};

