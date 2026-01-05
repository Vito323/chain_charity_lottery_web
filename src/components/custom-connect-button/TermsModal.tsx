"use client";
import React from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { useTranslations } from 'next-intl';

interface TermsModalProps {
  show: boolean;
  acceptedTerms: boolean;
  onAcceptedTermsChange: (accepted: boolean) => void;
  onConfirm: () => void;
  onCancel: () => void;
  mounted: boolean;
}

export const TermsModal: React.FC<TermsModalProps> = ({
  show,
  acceptedTerms,
  onAcceptedTermsChange,
  onConfirm,
  onCancel,
  mounted,
}) => {
  const tCommon = useTranslations('common');

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {show && (
        <motion.div
          key="terms-modal"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-[10000] flex items-center justify-center p-4"
          onClick={onCancel}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
          
          {/* Modal Content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="relative bg-gradient-to-b from-slate-900 via-slate-950 to-slate-900 rounded-2xl shadow-2xl border border-white/10 backdrop-blur-xl max-w-md w-full p-6 md:p-8"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={onCancel}
              className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 active:bg-white/30 transition-colors"
              aria-label={tCommon('wallet.close')}
            >
              <i className="fa fa-times text-white/80 text-sm"></i>
            </button>

            {/* Title */}
            <h2 className="text-xl md:text-2xl font-bold text-white mb-6 pr-8">
              {tCommon('actions.connectWallet')}
            </h2>

            {/* Terms Checkbox */}
            <div className="flex items-start gap-3 mb-6">
              <input
                type="checkbox"
                id="terms-checkbox-connect"
                checked={acceptedTerms}
                onChange={(e) => onAcceptedTermsChange(e.target.checked)}
                className="mt-1 w-5 h-5 rounded border-white/20 bg-white/5 text-purple-500 focus:ring-2 focus:ring-purple-500/50 cursor-pointer flex-shrink-0"
              />
              <label htmlFor="terms-checkbox-connect" className="flex-1 text-sm md:text-base text-white/70 cursor-pointer">
                {tCommon('terms.accept')}{' '}
                <a href="#" className="text-purple-400 hover:text-purple-300 underline">
                  {tCommon('terms.service')}
                </a>{' '}
                {tCommon('terms.and')}{' '}
                <a href="#" className="text-purple-400 hover:text-purple-300 underline">
                  {tCommon('terms.privacy')}
                </a>
              </label>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button
                onClick={onCancel}
                className="flex-1 px-6 py-3 bg-white/10 text-white border border-white/20 rounded-full font-medium cursor-pointer transition-all duration-200 hover:bg-white/15 hover:border-white/30 active:bg-white/20"
              >
                {tCommon('actions.cancel')}
              </button>
              <button
                onClick={onConfirm}
                disabled={!acceptedTerms}
                className="flex-1 px-6 py-3 bg-gradient-to-br from-purple-600 to-pink-600 text-white border-0 rounded-full font-medium cursor-pointer transition-all duration-200 hover:from-purple-700 hover:to-pink-700 active:from-purple-800 active:to-pink-800 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:from-purple-600 disabled:hover:to-pink-600"
              >
                {tCommon('actions.confirm')}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
};

