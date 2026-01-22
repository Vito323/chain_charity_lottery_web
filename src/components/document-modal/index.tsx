"use client";
import React, { useEffect } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { useTranslations } from "next-intl";
import MarkdownRenderer from "@/components/markdown-renderer";

interface DocumentModalProps {
  show: boolean;
  title: string;
  content: string;
  onClose: () => void;
  mounted: boolean;
}

export const DocumentModal: React.FC<DocumentModalProps> = ({
  show,
  title,
  content,
  onClose,
  mounted,
}) => {
  const tCommon = useTranslations("common");

  // 处理 body 滚动
  useEffect(() => {
    if (show) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [show]);

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {show && (
        <motion.div
          key="document-modal"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-10001 flex items-center justify-center p-4"
          onClick={onClose}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />

          {/* Modal Content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative bg-linear-to-b from-slate-900 via-slate-950 to-slate-900 rounded-2xl shadow-2xl border border-white/10 backdrop-blur-xl max-w-4xl w-full max-h-[90vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-white/10">
              <h2 className="text-xl md:text-2xl font-bold text-white pr-8">
                {title}
              </h2>
              <button
                onClick={onClose}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 active:bg-white/30 transition-colors shrink-0"
                aria-label={tCommon("wallet.close")}
              >
                <i className="fa fa-times text-white/80 text-sm"></i>
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6 md:p-8">
              <div className="prose prose-invert max-w-none">
                <MarkdownRenderer content={content} />
              </div>
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-white/10">
              <button
                onClick={onClose}
                className="w-full px-6 py-3 bg-linear-to-br from-purple-600 to-pink-600 text-white border-0 rounded-full font-medium cursor-pointer transition-all duration-200 hover:from-purple-700 hover:to-pink-700 active:from-purple-800 active:to-pink-800"
              >
                {tCommon("wallet.close")}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
};
