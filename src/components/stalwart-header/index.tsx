"use client";

import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import StalwartConnectButton from '../custom-connect-button/StalwartConnectButton';

const navItems = [
  { label: 'Home', href: '/' },
  { label: 'Projects', href: '/project' },
  { label: 'Lottery', href: '/lottery' },
  { label: 'NFT Market', href: '/nft-market' },
  { label: 'Nodes', href: '/network' },
  { label: 'Dao', href: '/dao' },
];

export default function StalwartHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header className="fixed top-0 inset-x-0 z-50">
      <motion.div
        className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8"
        animate={{ paddingTop: scrolled ? 12 : 20, paddingBottom: scrolled ? 12 : 20 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
      >
        <motion.div
          className={`relative rounded-2xl border transition-all duration-300 ${
            scrolled 
              ? 'border-white/10 bg-slate-900/70 backdrop-blur-xl shadow-lg shadow-black/30' 
              : 'border-transparent bg-transparent'
          }`}
          animate={{
            scale: scrolled ? 0.98 : 1,
          }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
        >
          <div className="flex items-center justify-between px-6 py-4">
            {/* Logo */}
            <Link href="#" className="flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 via-pink-500 to-fuchsia-500 flex items-center justify-center shadow-lg group-hover:shadow-purple-500/25 transition-all duration-300">
                <span className="text-white font-bold text-lg">C</span>
              </div>
              <span className="text-white font-bold text-xl tracking-tight">Charity</span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-8">
              {navItems.map((item, index) => {
                // 对于 Home 路径，只在精确匹配时才选中（不能是其他路径的子路径）
                const isActive = item.href === '/' 
                  ? pathname === '/' || pathname === ''
                  : pathname === item.href || (item.href !== '#' && pathname.startsWith(item.href + '/'));
                return (
                  <motion.a
                    key={item.href}
                    href={item.href}
                    className={`relative font-medium text-sm transition-all duration-200 group ${
                      isActive 
                        ? 'text-white' 
                        : 'text-white/80 hover:text-white'
                    }`}
                    whileHover={{ y: -1 }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    {item.label}
                    <span className={`absolute -bottom-1 left-0 h-0.5 bg-gradient-to-r from-purple-400 to-pink-400 transition-all duration-300 ${
                      isActive 
                        ? 'w-full' 
                        : 'w-0 group-hover:w-full'
                    }`} />
                  </motion.a>
                );
              })}
            </nav>

            {/* CTA Button */}
            <motion.div
              className="hidden md:flex"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 }}
            >
              <StalwartConnectButton />
            </motion.div>

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
        </motion.div>
      </motion.div>

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
                {navItems.map((item, index) => {
                  // 对于 Home 路径，只在精确匹配时才选中（不能是其他路径的子路径）
                  const isActive = item.href === '/' 
                    ? pathname === '/' || pathname === ''
                    : pathname === item.href || (item.href !== '#' && pathname.startsWith(item.href + '/'));
                  return (
                    <motion.a
                      key={item.href}
                      href={item.href}
                      className={`px-4 py-3 rounded-xl font-medium transition-all duration-200 ${
                        isActive 
                          ? 'text-white bg-white/20 border border-white/30' 
                          : 'text-white/80 hover:text-white hover:bg-white/10'
                      }`}
                      onClick={() => setOpen(false)}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      whileHover={{ x: 4 }}
                    >
                      {item.label}
                    </motion.a>
                  );
                })}
                <motion.div
                  className="mt-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <StalwartConnectButton />
                </motion.div>
              </nav>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}


