"use client";
import React from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { useTranslations } from 'next-intl';
import { DropdownContent } from './DropdownContent';

interface MobileBottomSheetProps {
  show: boolean;
  account: { address: string };
  chain: { id: number; name?: string; iconUrl?: string };
  openChainModal: () => void;
  onClose: () => void;
  mounted: boolean;
}

export const MobileBottomSheet: React.FC<MobileBottomSheetProps> = ({
  show,
  account,
  chain,
  openChainModal,
  onClose,
  mounted,
}) => {
  const tCommon = useTranslations('common');

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {show && (
        <motion.div
          key="bottom-sheet"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-9999 md:hidden"
          onClick={onClose}
        >
          {/* 遮罩背景 */}
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
          
          {/* Bottom Sheet 容器 */}
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="absolute bottom-0 left-0 right-0 bg-gradient-to-b from-slate-900 via-slate-950 to-slate-900 rounded-t-3xl shadow-2xl border-t border-white/10 max-h-[85vh] overflow-hidden flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* 拖拽指示器 */}
            <div className="flex justify-center pt-4 pb-3 cursor-grab active:cursor-grabbing" onTouchStart={() => {}}>
              <div className="w-12 h-1.5 bg-white/30 rounded-full"></div>
            </div>
            
            {/* 标题和关闭按钮 */}
            <div className="flex items-center justify-between px-5 pb-4 border-b border-white/10">
              <h3 className="text-lg font-semibold text-white">{tCommon('wallet.walletMenu')}</h3>
              <button
                onClick={onClose}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 active:bg-white/30 transition-colors"
                aria-label={tCommon('wallet.close')}
              >
                <i className="fa fa-times text-white/80 text-sm"></i>
              </button>
            </div>

            {/* 内容 */}
            <div className="overflow-y-auto flex-1 overscroll-contain">
              <DropdownContent
                account={account}
                chain={chain}
                openChainModal={openChainModal}
                onCloseDropdown={onClose}
              />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
};

