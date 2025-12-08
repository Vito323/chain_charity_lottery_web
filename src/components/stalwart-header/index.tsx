"use client";

import { useState, useEffect, useRef, useTransition, useMemo, memo } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useTranslations, useLocale } from 'next-intl';
import { Link, usePathname } from '@/i18n/navigation';
import { LNG_LIST } from '@/i18n/routing';
import StalwartConnectButton from '../custom-connect-button/StalwartConnectButton';

const navItems = [
  { key: 'home', href: '/' },
  { key: 'projects', href: '/project' },
  { key: 'lottery', href: '/lottery' },
  { key: 'nftMarket', href: '/nft-market' },
  { key: 'nodes', href: '/network' },
  { key: 'dao', href: '/dao' },
];

function StalwartHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [isLanguageMenuOpen, setIsLanguageMenuOpen] = useState(false);
  const pathname = usePathname();
  const locale = useLocale();
  const t = useTranslations('navigation');
  const [, startTransition] = useTransition();
  const languageMenuRef = useRef<HTMLDivElement>(null);

  // 缓存翻译文本，避免页面切换时的闪烁
  const translatedNavItems = useMemo(() => {
    try {
      return navItems.map(item => {
        const translated = t(item.key);
        return {
          ...item,
          label: translated && translated !== item.key ? translated : item.key
        };
      });
    } catch {
      // 如果翻译失败，使用原始 key
      return navItems.map(item => ({
        ...item,
        label: item.key
      }));
    }
  }, [t]);

  // 缓存语言标签文本
  const languageLabel = useMemo(() => {
    return LNG_LIST.find(lang => lang.value === locale)?.shortLabel || 'En';
  }, [locale]);

  // 缓存语言切换文本
  const languageText = useMemo(() => {
    return t('language') || 'Language';
  }, [t]);


  const handleLanguageChange = (newLocale: string) => {
    if (newLocale !== locale) {
      // 立即关闭菜单，提供即时反馈
      setIsLanguageMenuOpen(false);
      
      startTransition(() => {
        // 设置 cookie 来切换语言
        document.cookie = `NEXT_LOCALE=${newLocale}; path=/; max-age=31536000; SameSite=Lax`;
        // 重新加载页面以应用新语言
        window.location.reload();
      });
    } else {
      setIsLanguageMenuOpen(false);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (languageMenuRef.current && !languageMenuRef.current.contains(event.target as Node)) {
        setIsLanguageMenuOpen(false);
      }
    };

    if (isLanguageMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isLanguageMenuOpen]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header 
      className="fixed top-0 inset-x-0 z-50 will-change-transform"
      style={{ pointerEvents: 'auto' }}
      suppressHydrationWarning
    >
      <div
        className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8"
        style={{ 
          paddingTop: scrolled ? 12 : 20, 
          paddingBottom: scrolled ? 12 : 20,
          transition: 'padding 0.3s ease-out'
        }}
      >
        <div
          className={`relative rounded-2xl border transition-all duration-300 ${
            scrolled 
              ? 'border-white/10 bg-slate-900/70 backdrop-blur-xl shadow-lg shadow-black/30' 
              : 'border-transparent bg-transparent'
          }`}
          style={{ 
            transform: scrolled ? 'scale(0.98)' : 'scale(1)',
            transition: 'transform 0.3s ease-out'
          }}
        >
          <div className="flex items-center justify-between px-6 py-4 min-h-[64px]">
            {/* Logo */}
            <Link href="#" className="flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 via-pink-500 to-fuchsia-500 flex items-center justify-center shadow-lg group-hover:shadow-purple-500/25 transition-all duration-300">
                <span className="text-white font-bold text-lg">H</span>
              </div>
              <span className="text-white font-bold text-xl tracking-tight">Hawaiian Nation Charity</span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-8">
              {translatedNavItems.map((item) => {
                // 对于 Home 路径，只在精确匹配时才选中（不能是其他路径的子路径）
                const isActive = item.href === '/' 
                  ? pathname === '/' || pathname === ''
                  : pathname === item.href || (item.href !== '#' && pathname.startsWith(item.href + '/'));
                return (
                  <div
                    key={item.href}
                    className="relative"
                  >
                    <Link
                      href={item.href}
                      className={`relative font-medium text-sm transition-all duration-200 group block ${
                        isActive 
                          ? 'text-white' 
                          : 'text-white/80 hover:text-white'
                      }`}
                    >
                      <span className="block">
                        {item.label}
                        <span className={`absolute -bottom-1 left-0 h-0.5 bg-gradient-to-r from-purple-400 to-pink-400 transition-all duration-300 ${
                          isActive 
                            ? 'w-full' 
                            : 'w-0 group-hover:w-full'
                        }`} />
                      </span>
                    </Link>
                  </div>
                );
              })}
            </nav>

            {/* Language Switcher & CTA Button */}
            <div className="hidden md:flex items-center gap-4">
              {/* Language Switcher */}
              <div className="relative" ref={languageMenuRef}>
                <motion.button
                  onClick={() => setIsLanguageMenuOpen(!isLanguageMenuOpen)}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl border border-white/20 text-white/80 hover:text-white hover:bg-white/10 transition-all duration-200"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span className="text-sm font-medium">
                    {languageLabel}
                  </span>
                  <motion.span
                    animate={{ rotate: isLanguageMenuOpen ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                    className="text-xs"
                  >
                    ▼
                  </motion.span>
                </motion.button>

                <AnimatePresence>
                  {isLanguageMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      className="absolute top-full right-0 mt-2 rounded-xl border border-white/10 bg-slate-900/95 backdrop-blur-xl shadow-xl shadow-black/30 overflow-hidden min-w-[120px]"
                    >
                      {LNG_LIST.map((lang) => (
                        <motion.button
                          key={lang.value}
                          onClick={() => handleLanguageChange(lang.value)}
                          className={`w-full px-4 py-2 text-left text-sm font-medium transition-all duration-200 ${
                            locale === lang.value
                              ? 'text-white bg-white/10'
                              : 'text-white/80 hover:text-white hover:bg-white/5'
                          }`}
                          whileHover={{ x: 2 }}
                        >
                          {lang.label}
                        </motion.button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* CTA Button */}
              <div>
                <StalwartConnectButton />
              </div>
            </div>

            {/* Mobile Menu Button */}
            <motion.button
              className="md:hidden inline-flex items-center justify-center w-12 h-12 rounded-xl border border-white/20 text-white hover:bg-white/10 transition-all duration-200"
              onClick={() => setOpen((v) => !v)}
              aria-label="Toggle Menu"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <motion.div
                className="w-6 h-6 flex flex-col justify-center items-center"
                animate={open ? "open" : "closed"}
              >
                <motion.span
                  className="w-5 h-0.5 bg-white rounded-full"
                  variants={{
                    closed: { rotate: 0, y: 0 },
                    open: { rotate: 45, y: 6 }
                  }}
                />
                <motion.span
                  className="w-5 h-0.5 bg-white rounded-full mt-1"
                  variants={{
                    closed: { opacity: 1 },
                    open: { opacity: 0 }
                  }}
                />
                <motion.span
                  className="w-5 h-0.5 bg-white rounded-full mt-1"
                  variants={{
                    closed: { rotate: 0, y: 0 },
                    open: { rotate: -45, y: -6 }
                  }}
                />
              </motion.div>
            </motion.button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="lg:hidden absolute top-full left-4 right-4 mt-2"
          >
            <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-xl shadow-black/20 p-6">
              <nav className="flex flex-col gap-1">
                {translatedNavItems.map((item) => {
                  // 对于 Home 路径，只在精确匹配时才选中（不能是其他路径的子路径）
                  const isActive = item.href === '/' 
                    ? pathname === '/' || pathname === ''
                    : pathname === item.href || (item.href !== '#' && pathname.startsWith(item.href + '/'));
                  return (
                    <div
                      key={item.href}
                    >
                      <Link
                        href={item.href}
                        onClick={() => setOpen(false)}
                        className={`px-4 py-3 rounded-xl font-medium transition-all duration-200 block ${
                          isActive 
                            ? 'text-white bg-white/20 border border-white/30' 
                            : 'text-white/80 hover:text-white hover:bg-white/10'
                        }`}
                      >
                        <span className="block">
                          {item.label}
                        </span>
                      </Link>
                    </div>
                  );
                })}
                
                {/* Mobile Language Switcher */}
                <div className="mt-2">
                  <div className="px-4 py-3 rounded-xl border border-white/20 bg-white/5">
                    <div className="text-xs text-white/60 mb-2 font-medium">{languageText}</div>
                    <div className="flex gap-2">
                      {LNG_LIST.map((lang) => (
                        <motion.button
                          key={lang.value}
                          onClick={() => {
                            handleLanguageChange(lang.value);
                            setOpen(false);
                          }}
                          className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                            locale === lang.value
                              ? 'text-white bg-white/20 border border-white/30'
                              : 'text-white/80 hover:text-white hover:bg-white/10 border border-transparent'
                          }`}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          {lang.label}
                        </motion.button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mt-4">
                  <StalwartConnectButton />
                </div>
              </nav>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

// 使用 memo 包装组件，优化性能
export default memo(StalwartHeader);

