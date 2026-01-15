"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslations } from "next-intl";
import { useAccount } from "wagmi";

interface BindConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  parentNodeAddress: string;
  onConfirmBind?: () => Promise<void> | void;
}

const BindConfirmModal: React.FC<BindConfirmModalProps> = ({
  isOpen,
  onClose,
  parentNodeAddress,
  onConfirmBind,
}) => {
  const t = useTranslations("network.invite.modals.bind");
  const tCommon = useTranslations("common");
  const { isConnected } = useAccount();
  const [isProcessing, setIsProcessing] = useState(false);

  // 当Modal关闭时重置所有状态
  useEffect(() => {
    if (!isOpen) {
      setIsProcessing(false);
    }
  }, [isOpen]);

  // 格式化地址显示
  const formatAddress = (address: string) => {
    if (address.length <= 10) return address;
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const handleConfirmBind = async () => {
    if (!isConnected || isProcessing) {
      return;
    }

    setIsProcessing(true);

    try {
      // 调用绑定接口
      if (onConfirmBind) {
        await onConfirmBind();
      }
      // 关闭Modal
      onClose();
    } catch (error) {
      console.error("Bind failed:", error);
      setIsProcessing(false);
    }
  };

  if (!isOpen) return null;

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

        {/* Modal */}
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 20 }}
          transition={{ type: "spring", duration: 0.3 }}
          className="relative w-full max-w-lg bg-linear-to-b from-slate-900 via-slate-950 to-slate-900 border border-white/10 rounded-3xl shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="p-6 sm:p-8 space-y-6 relative">
            {/* Close Button */}
            <button
              onClick={onClose}
              disabled={isProcessing}
              className="absolute top-6 right-6 sm:top-8 sm:right-8 z-10 p-2 rounded-full bg-white/5 hover:bg-white/10 text-white/70 hover:text-white transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label={tCommon("accessibility.close")}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Title */}
            <div className="pt-2 pr-12 sm:pr-16">
              <h2 className="text-xl sm:text-2xl font-bold text-white">
                {t("title") || "Confirm Binding"}
              </h2>
            </div>

            {/* Warning Icon */}
            <div className="flex justify-center">
              <div className="w-16 h-16 rounded-full bg-yellow-500/20 border border-yellow-500/30 flex items-center justify-center">
                <svg
                  className="w-8 h-8 text-yellow-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
              </div>
            </div>

            {/* Content */}
            <div className="space-y-4">
              <p className="text-sm sm:text-base text-white/80 leading-relaxed text-center">
                {t("description") ||
                  "Once you bind to this parent node, you cannot change it. Please confirm your decision."}
              </p>

              {/* Parent Node Address */}
              <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                <div className="text-xs text-white/60 mb-2">
                  {t("parentNodeAddress") || "Parent Node Address"}
                </div>
                <code className="text-sm text-white/90 font-mono break-all">
                  {formatAddress(parentNodeAddress)}
                </code>
              </div>

              {!isConnected && (
                <p className="text-sm text-yellow-400 text-center">
                  {t("connectWalletFirst") || "Please connect your wallet first"}
                </p>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 sm:gap-4 pt-2">
              {/* Cancel Button */}
              <button
                onClick={onClose}
                disabled={isProcessing}
                className="flex-1 sm:flex-none px-6 sm:px-8 py-3 sm:py-3.5 rounded-xl font-semibold text-sm sm:text-base bg-white/10 text-white border border-white/20 hover:bg-white/20 transition-all duration-300 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {tCommon("actions.cancel")}
              </button>

              {/* Confirm Button */}
              <button
                onClick={handleConfirmBind}
                disabled={!isConnected || isProcessing}
                className={`flex-1 sm:flex-none px-6 sm:px-8 py-3 sm:py-3.5 rounded-xl font-semibold text-sm sm:text-base transition-all duration-300 flex items-center justify-center gap-2 ${
                  !isConnected || isProcessing
                    ? "bg-gray-600/50 text-gray-400 cursor-not-allowed"
                    : "bg-linear-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700 shadow-lg shadow-purple-500/30 cursor-pointer"
                }`}
              >
                {isProcessing ? (
                  <>
                    <svg
                      className="animate-spin h-5 w-5"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    {tCommon("actions.processing")}
                  </>
                ) : (
                  t("confirmButton") || tCommon("actions.confirm")
                )}
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default BindConfirmModal;
