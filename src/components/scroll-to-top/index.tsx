'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslations } from 'next-intl';

export default function ScrollToTop() {
  const tCommon = useTranslations('common');
  const [isVisible, setIsVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isScrollingRef = useRef(false);

  // 获取滚动位置（兼容不同浏览器）
  const getScrollPosition = () => {
    if (typeof window !== 'undefined') {
      return window.scrollY || window.pageYOffset || document.documentElement.scrollTop || 0;
    }
    return 0;
  };

  // 监听滚动事件
  useEffect(() => {
    const toggleVisibility = () => {
      const scrollPosition = getScrollPosition();
      if (scrollPosition > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    // 初始检查
    toggleVisibility();

    // 使用 passive 选项优化性能
    window.addEventListener('scroll', toggleVisibility, { passive: true });
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  // 滚动到顶部
  const scrollToTop = () => {
    if (isLoading || isScrollingRef.current) return;

    setIsLoading(true);
    isScrollingRef.current = true;

    // 平滑滚动到顶部
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });

    // 监听滚动完成
    const checkScrollComplete = () => {
      const scrollPosition = getScrollPosition();
      if (scrollPosition <= 5) {
        // 滚动完成
        setIsLoading(false);
        isScrollingRef.current = false;
        if (scrollTimeoutRef.current) {
          clearTimeout(scrollTimeoutRef.current);
        }
      } else {
        // 继续检查
        scrollTimeoutRef.current = setTimeout(checkScrollComplete, 50);
      }
    };

    // 延迟检查，确保滚动开始
    scrollTimeoutRef.current = setTimeout(checkScrollComplete, 100);

    // 备用超时，防止滚动被中断
    setTimeout(() => {
      setIsLoading(false);
      isScrollingRef.current = false;
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    }, 2000);
  };

  // 清理定时器
  useEffect(() => {
    return () => {
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, []);

  return (
    <AnimatePresence>
      {isVisible && (
        <div className="fixed bottom-6 right-4 md:right-6 lg:right-8 z-50">
          <motion.button
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
            onClick={scrollToTop}
            disabled={isLoading}
            className="w-12 h-12 md:w-14 md:h-14 bg-gradient-to-r from-purple-600/80 to-pink-600/80 hover:from-purple-600 hover:to-pink-600 border border-white/20 rounded-full flex items-center justify-center text-white backdrop-blur-xl shadow-lg hover:shadow-purple-500/25 transition-all duration-300 group disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            aria-label={tCommon('accessibility.scrollToTop')}
          >
            {isLoading ? (
              <motion.div
                className="w-5 h-5 md:w-6 md:h-6 border-2 border-white border-t-transparent rounded-full"
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              />
            ) : (
              <motion.i
                whileHover={{ scale: 1.1, y: -2 }}
                whileTap={{ scale: 0.9 }}
                className="fa fa-arrow-up text-lg md:text-xl drop-shadow-sm"
              />
            )}
          </motion.button>
        </div>
      )}
    </AnimatePresence>
  );
}
