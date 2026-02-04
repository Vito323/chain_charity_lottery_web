"use client";

import React from "react";
import { useTranslations } from "next-intl";

type ConfirmBindModalProps = {
  open: boolean;
  address: string;
  onCancel: () => void;
  onConfirm: () => void | Promise<void>;
};

const ConfirmBindModal: React.FC<ConfirmBindModalProps> = ({
  open,
  address,
  onCancel,
  onConfirm,
}) => {
  const t = useTranslations("bindNode");

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[1000] flex items-center justify-center px-6"
      onClick={onCancel}
    >
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
      <div
        className="relative w-full max-w-md rounded-3xl border border-white/10 bg-slate-950/80 backdrop-blur-xl shadow-2xl p-6 sm:p-7"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        <div className="text-white text-xl sm:text-2xl font-bold mb-2">
          {t("modals.confirmBind.title")}
        </div>
        <div className="text-white/70 text-sm sm:text-base leading-relaxed mb-4">
          {t("modals.confirmBind.description")}
        </div>
        <div className="mt-2 rounded-2xl border border-white/10 bg-slate-900/60 px-4 py-3">
          <div className="text-xs text-white/60 mb-1">
            {t("modals.confirmBind.addressLabel")}
          </div>
          <div className="font-mono text-sm text-white break-all overflow-wrap-anywhere">
            {address}
          </div>
        </div>
        <div className="mt-6 flex flex-col sm:flex-row gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="w-full sm:flex-1 inline-flex items-center justify-center rounded-full px-6 py-3 text-sm sm:text-base font-semibold border border-white/15 text-white/80 bg-white/5 hover:bg-white/10 hover:text-white transition-all duration-300 cursor-pointer"
          >
            {t("modals.confirmBind.cancel")}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="w-full sm:flex-1 inline-flex items-center justify-center rounded-full px-6 py-3 text-sm sm:text-base font-semibold text-white bg-linear-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 shadow-lg shadow-purple-500/30 transition-all duration-300 cursor-pointer"
          >
            {t("modals.confirmBind.confirm")}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmBindModal;

