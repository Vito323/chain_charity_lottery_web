"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";
import { useTranslations, useLocale } from "next-intl";
import "./style.scss";

// 导航菜单配置 - 参考 GraphLinq 网站结构
const NAVIGATION_MENU = [
  {
    key: "our-chain",
    label: "我们的链",
    children: [
      { key: "about", label: "关于 Graphlinq", path: "/about" },
      { key: "chain-status", label: "链状态", path: "/chain-status" },
      { key: "block-explorer", label: "区块浏览器", path: "/explorer" },
      { key: "bridge", label: "跨链桥", path: "/bridge" },
    ]
  },
  {
    key: "products",
    label: "产品",
    children: [
      { key: "ai-chatbot", label: "AI 聊天机器人", path: "/ai-chatbot" },
      { key: "no-code-ide", label: "无代码 IDE", path: "/ide" },
      { key: "analytics", label: "分析工具", path: "/analytics" },
      { key: "marketplace", label: "市场", path: "/marketplace" },
    ]
  },
  {
    key: "resources",
    label: "资源",
    children: [
      { key: "documentation", label: "文档", path: "/docs" },
      { key: "lite-paper", label: "白皮书", path: "/whitepaper" },
      { key: "blog", label: "博客", path: "/blog" },
      { key: "add-metamask", label: "添加到 MetaMask", path: "/add-metamask" },
    ]
  },
  {
    key: "home",
    label: "首页",
    path: "/",
  },
] as {key: string; label: string; path?: string; children?: {key: string; label: string; path: string;}[];}[];

const ModernNavbar = () => {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLanguageMenuOpen, setIsLanguageMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const t = useTranslations('navigation');
  const locale = useLocale();

  // 通用的动态路由匹配函数
  const isDynamicRouteMatch = (currentPath: string, routePath: string): boolean => {
    // 特殊处理根路由
    if (routePath === "/") {
      return currentPath === "/";
    }
    
    // 精确匹配
    if (currentPath === routePath) {
      return true;
    }
    
    // 简单的 startsWith 匹配（用于单层路由）
    if (currentPath.startsWith(routePath + '/')) {
      return true;
    }
    
    // 动态路由匹配：支持 /path/*/*.* 格式
    const dynamicRoutePattern = new RegExp(`^${routePath.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}/[^/]+(/[^/]+)?(/.*)?$`);
    return dynamicRoutePattern.test(currentPath);
  };

  // 监听滚动事件
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // 点击外部关闭菜单
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (isLanguageMenuOpen && !target.closest('.language-switcher')) {
        setIsLanguageMenuOpen(false);
      }
      if (activeDropdown && !target.closest('.dropdown-menu')) {
        setActiveDropdown(null);
      }
    };

    if (isLanguageMenuOpen || activeDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isLanguageMenuOpen, activeDropdown]);

  const handleConnectWallet = () => {
    // 这里可以集成钱包连接逻辑
    console.log("Connect Wallet clicked");
  };

  const handleLanguageChange = (newLocale: string) => {
    // 这里可以添加语言切换逻辑
    console.log("Language changed to:", newLocale);
    setIsLanguageMenuOpen(false);
  };

  const handleDropdownToggle = (key: string) => {
    setActiveDropdown(activeDropdown === key ? null : key);
  };

  const languages = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'zh', name: '中文', flag: '🇨🇳' }
  ];

  return (
    <motion.header 
      className={`modern-navbar ${isScrolled ? 'scrolled' : ''}`}
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <div className="navbar-container">
        {/* Logo 和品牌名称 */}
        <motion.div 
          className="navbar-brand"
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.2 }}
        >
          <Link href="/" className="brand-link">
            <div className="brand-icon">
              <motion.div
                className="icon-circle"
                animate={{ 
                  rotate: [0, 360],
                  scale: [1, 1.1, 1]
                }}
                transition={{ 
                  duration: 8,
                  repeat: Infinity,
                  ease: "linear"
                }}
              >
                <div className="icon-aperture">
                  <div className="aperture-segment"></div>
                  <div className="aperture-segment"></div>
                  <div className="aperture-segment"></div>
                  <div className="aperture-segment"></div>
                </div>
              </motion.div>
            </div>
            <span className="brand-name">ChainCharity</span>
          </Link>
        </motion.div>

        {/* 桌面端导航菜单 */}
        <nav className="navbar-nav desktop-nav">
          <ul className="nav-list">
            {NAVIGATION_MENU.map((item, index) => (
              <motion.li 
                key={index}
                className={`nav-item ${item.children ? 'dropdown' : ''}`}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.4 }}
                onMouseEnter={() => item.children && handleDropdownToggle(item.key)}
                onMouseLeave={() => item.children && setActiveDropdown(null)}
              >
                {item.children ? (
                  <>
                    <button className="nav-link dropdown-trigger">
                      <span>{item.label}</span>
                      <motion.span
                        className="dropdown-arrow"
                        animate={{ 
                          rotate: activeDropdown === item.key ? 180 : 0
                        }}
                        transition={{ duration: 0.3 }}
                      >
                        ▼
                      </motion.span>
                    </button>
                    
                    <AnimatePresence>
                      {activeDropdown === item.key && (
                        <motion.div
                          className="dropdown-menu"
                          initial={{ opacity: 0, y: -10, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: -10, scale: 0.95 }}
                          transition={{ duration: 0.2 }}
                        >
                          <div className="dropdown-content">
                            {item.children.map((child, childIndex) => (
                              <motion.div
                                key={childIndex}
                                className="dropdown-item"
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: childIndex * 0.05 }}
                              >
                                <Link
                                  href={child.path}
                                  className="dropdown-link"
                                  onClick={() => setActiveDropdown(null)}
                                >
                                  {child.label}
                                </Link>
                              </motion.div>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </>
                ) : (
                  <Link
                    href={item.path!}
                    className={`nav-link ${isDynamicRouteMatch(pathname, item.path!) ? "active" : ""}`}
                  >
                    <span>{item.label}</span>
                  </Link>
                )}
              </motion.li>
            ))}
          </ul>
        </nav>

        {/* 语言切换器和Connect Wallet 按钮 */}
        <motion.div 
          className="navbar-actions"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4, duration: 0.4 }}
        >
          {/* 语言切换器 */}
          <div className="language-switcher">
            <motion.button
              className="language-btn"
              onClick={() => setIsLanguageMenuOpen(!isLanguageMenuOpen)}
              whileHover={{ 
                scale: 1.05,
                boxShadow: "0 4px 12px rgba(59, 130, 246, 0.15)"
              }}
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
            >
              <motion.span 
                className="current-language"
                animate={{ 
                  scale: isLanguageMenuOpen ? 1.05 : 1
                }}
                transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
              >
                {languages.find(lang => lang.code === locale)?.flag || '🌐'}
              </motion.span>
              <motion.span
                className="dropdown-arrow"
                animate={{ 
                  rotate: isLanguageMenuOpen ? 180 : 0
                }}
                transition={{ 
                  duration: 0.3,
                  ease: [0.4, 0, 0.2, 1]
                }}
              >
                ▼
              </motion.span>
            </motion.button>
            
            <AnimatePresence>
              {isLanguageMenuOpen && (
                <motion.div
                  className="language-menu"
                  initial={{ opacity: 0, y: -15, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -15, scale: 0.9 }}
                  transition={{ 
                    duration: 0.25,
                    ease: [0.4, 0, 0.2, 1]
                  }}
                >
                  {languages.map((lang, index) => (
                    <motion.button
                      key={lang.code}
                      className={`language-option ${locale === lang.code ? 'active' : ''}`}
                      onClick={() => handleLanguageChange(lang.code)}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ 
                        delay: index * 0.05,
                        duration: 0.2,
                        ease: [0.4, 0, 0.2, 1]
                      }}
                      whileHover={{ 
                        backgroundColor: 'rgba(59, 130, 246, 0.08)',
                        x: 4
                      }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <span className="flag">{lang.flag}</span>
                      <span className="name">{lang.name}</span>
                    </motion.button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <motion.button
            className="connect-wallet-btn"
            onClick={handleConnectWallet}
            whileHover={{ 
              scale: 1.05,
              boxShadow: "0 8px 25px rgba(30, 41, 59, 0.25)"
            }}
            whileTap={{ 
              scale: 0.95,
              boxShadow: "0 4px 15px rgba(30, 41, 59, 0.15)"
            }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.3 }}
          >
            <motion.span 
              className="btn-content"
              whileHover={{ 
                background: "linear-gradient(45deg, transparent, rgba(255, 255, 255, 0.1), transparent)",
                backgroundSize: "200% 200%"
              }}
              transition={{ duration: 0.3 }}
            >
              {t('connectWallet')}
            </motion.span>
            
            {/* Ripple effect */}
            <motion.div
              className="ripple"
              initial={{ scale: 0, opacity: 0 }}
              whileTap={{ 
                scale: 1, 
                opacity: [0, 0.3, 0] 
              }}
              transition={{ duration: 0.6 }}
            />
          </motion.button>
        </motion.div>

        {/* 移动端菜单按钮 */}
        <motion.button
          className="mobile-menu-btn"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          aria-label={isMobileMenuOpen ? "关闭菜单" : "打开菜单"}
        >
          <motion.span
            className="hamburger-line"
            animate={{ 
              rotate: isMobileMenuOpen ? 45 : 0,
              y: isMobileMenuOpen ? 7 : 0
            }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          />
          <motion.span
            className="hamburger-line"
            animate={{ 
              opacity: isMobileMenuOpen ? 0 : 1,
              scale: isMobileMenuOpen ? 0 : 1
            }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          />
          <motion.span
            className="hamburger-line"
            animate={{ 
              rotate: isMobileMenuOpen ? -45 : 0,
              y: isMobileMenuOpen ? -7 : 0
            }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          />
        </motion.button>
      </div>

      {/* 移动端菜单 */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            className="mobile-menu"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            <div className="mobile-menu-content">
              {NAVIGATION_MENU.map((item, index) => (
                <motion.div
                  key={index}
                  className="mobile-nav-item"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.3 }}
                >
                  {item.children ? (
                    <div className="mobile-dropdown">
                      <button 
                        className="mobile-dropdown-trigger"
                        onClick={() => handleDropdownToggle(item.key)}
                      >
                        <span>{item.label}</span>
                        <motion.span
                          className="dropdown-arrow"
                          animate={{ 
                            rotate: activeDropdown === item.key ? 180 : 0
                          }}
                          transition={{ duration: 0.3 }}
                        >
                          ▼
                        </motion.span>
                      </button>
                      
                      <AnimatePresence>
                        {activeDropdown === item.key && (
                          <motion.div
                            className="mobile-dropdown-content"
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.3 }}
                          >
                            {item.children.map((child, childIndex) => (
                              <motion.div
                                key={childIndex}
                                className="mobile-dropdown-item"
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: childIndex * 0.05 }}
                              >
                                <Link
                                  href={child.path}
                                  className="mobile-dropdown-link"
                                  onClick={() => {
                                    setIsMobileMenuOpen(false);
                                    setActiveDropdown(null);
                                  }}
                                >
                                  {child.label}
                                </Link>
                              </motion.div>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  ) : (
                    <Link
                      href={item.path!}
                      className={`mobile-nav-link ${isDynamicRouteMatch(pathname, item.path!) ? "active" : ""}`}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {item.label}
                    </Link>
                  )}
                </motion.div>
              ))}
              
              {/* 移动端语言切换器 */}
              <motion.div
                className="mobile-language-switcher"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.3 }}
              >
                <div className="language-options">
                  {languages.map((lang) => (
                    <motion.button
                      key={lang.code}
                      className={`mobile-language-option ${locale === lang.code ? 'active' : ''}`}
                      onClick={() => {
                        handleLanguageChange(lang.code);
                        setIsMobileMenuOpen(false);
                      }}
                      whileHover={{ backgroundColor: 'rgba(59, 130, 246, 0.1)' }}
                    >
                      <span className="flag">{lang.flag}</span>
                      <span className="name">{lang.name}</span>
                    </motion.button>
                  ))}
                </div>
              </motion.div>
              
              <motion.div
                className="mobile-connect-btn"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.3 }}
              >
                <button
                  className="connect-wallet-btn mobile"
                  onClick={() => {
                    handleConnectWallet();
                    setIsMobileMenuOpen(false);
                  }}
                >
                  {t('connectWallet')}
                </button>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
};

export default ModernNavbar;
