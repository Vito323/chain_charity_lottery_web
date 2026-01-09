'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslations } from 'next-intl';

interface CopyButtonProps {
  /**
   * 要复制到剪贴板的文本
   */
  text: string;
  /**
   * 自定义类名
   */
  className?: string;
  /**
   * 自定义提示文本（可选）
   */
  title?: string;
  /**
   * 图标大小
   * @default "xs"
   */
  iconSize?: 'xs' | 'sm' | 'base' | 'lg';
  /**
   * 成功提示显示位置
   * @default "top"
   */
  tooltipPosition?: 'top' | 'bottom';
  /**
   * 成功提示显示持续时间（毫秒）
   * @default 2000
   */
  successDuration?: number;
}

/**
 * 复制按钮组件
 * 
 * 带有动画效果的复制按钮，点击后将文本复制到剪贴板并显示成功提示。
 * 
 * @example
 * ```tsx
 * <CopyButton text="0x1234...5678" />
 * ```
 */
export const CopyButton: React.FC<CopyButtonProps> = ({
  text,
  className = 'text-white/40 hover:text-white/80 cursor-pointer transition-colors duration-200 relative',
  title,
  iconSize = 'xs',
  tooltipPosition = 'top',
  successDuration = 2000,
}) => {
  const tCommon = useTranslations('common');
  const [copySuccess, setCopySuccess] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), successDuration);
  };

  const iconSizeClass = {
    xs: 'text-xs',
    sm: 'text-sm',
    base: 'text-base',
    lg: 'text-lg',
  }[iconSize];

  const tooltipClassName = tooltipPosition === 'top' 
    ? 'absolute -top-8 left-1/2 transform -translate-x-1/2'
    : 'absolute -bottom-8 left-1/2 transform -translate-x-1/2';

  const arrowClassName = tooltipPosition === 'top'
    ? 'absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-emerald-500'
    : 'absolute bottom-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-b-4 border-transparent border-b-emerald-500';

  const tooltipAnimation = tooltipPosition === 'top'
    ? {
        initial: { opacity: 0, y: -10, scale: 0.8 },
        animate: { opacity: 1, y: -20, scale: 1 },
        exit: { opacity: 0, y: -30, scale: 0.8 },
      }
    : {
        initial: { opacity: 0, y: 10, scale: 0.8 },
        animate: { opacity: 1, y: 20, scale: 1 },
        exit: { opacity: 0, y: 30, scale: 0.8 },
      };

  return (
    <motion.button
      onClick={handleCopy}
      className={className}
      title={title || tCommon('wallet.copyFullAddress')}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      aria-label={title || tCommon('wallet.copyFullAddress')}
    >
      <AnimatePresence mode="wait">
        <motion.i
          key={copySuccess ? 'check' : 'copy'}
          initial={{ opacity: 0, scale: 0.5, rotate: -180 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          exit={{ opacity: 0, scale: 0.5, rotate: 180 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          className={`fa ${iconSizeClass} ${copySuccess ? 'fa-check text-emerald-400' : 'fa-copy'}`}
        />
      </AnimatePresence>
      <AnimatePresence>
        {copySuccess && (
          <motion.div
            {...tooltipAnimation}
            transition={{ duration: 0.3 }}
            className={`${tooltipClassName} px-2 py-1 bg-emerald-500 text-white text-xs rounded whitespace-nowrap pointer-events-none z-10`}
          >
            {tCommon('wallet.copied')}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className={arrowClassName}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.button>
  );
};

export default CopyButton;
