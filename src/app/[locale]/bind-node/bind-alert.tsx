"use client";

import React from "react";
import { useTranslations } from "next-intl";

type AlreadyBoundModalProps = {
  open: boolean;
  onConfirm: () => void;
};

const AlreadyBoundModal: React.FC<AlreadyBoundModalProps> = ({ open, onConfirm }) => {
  const t = useTranslations("bindNode");

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center px-6">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
      <div
        className="relative w-full max-w-md rounded-3xl border border-white/10 bg-slate-950/80 backdrop-blur-xl shadow-2xl p-6 sm:p-7"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        <div className="text-white text-xl sm:text-2xl font-bold mb-2">
          {t("modals.alreadyBound.title")}
        </div>
        <div className="text-white/70 text-sm sm:text-base leading-relaxed mb-6">
          {t("modals.alreadyBound.description")}
        </div>
        <button
          type="button"
          onClick={onConfirm}
          className="w-full inline-flex items-center justify-center rounded-full px-6 py-3 text-sm sm:text-base font-semibold text-white bg-linear-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 shadow-lg shadow-purple-500/30 transition-all duration-300 cursor-pointer"
        >
          {t("modals.alreadyBound.confirm")}
        </button>
      </div>
    </div>
  );
};

export default AlreadyBoundModal;

