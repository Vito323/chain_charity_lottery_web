"use client";
import React, { useState, useEffect } from "react";
import "./style.scss";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

const DEVELOPER_RESOURCES = [
  { label: "开始使用", path: "/getting-started" },
  { label: "开发者资源", path: "/developer-resources" },
  { label: "NFT", path: "/nft", description: "大规模铸造、销售和交易 NFT" },
  { label: "游戏", path: "/gaming", description: "Web3 游戏，Web2 速度" },
  { label: "支付", path: "/payments", description: "大规模去中心化支付" },
  { label: "DAO", path: "/dao", description: "真正有效的治理" },
];

const LEARNING_RESOURCES = [
  { label: "Chainova Cookbook", path: "/cookbook", external: true },
  { label: "ChainDev", path: "/chaindev", external: true },
  { label: "Chainova 文档", path: "/docs", external: true },
  { label: "Metaplex 文档", path: "/metaplex-docs", external: true },
];

const CAREERS = [
  { label: "我们正在招聘", path: "/careers" },
  { label: "查看职位", path: "/jobs", external: true },
];

const GUIDES = [
  { label: "Figment Learn", path: "/figment-learn", external: true },
  { label: "Questbook x Superteam", path: "/questbook", external: true },
  { label: "构建 Chainova 程序入门", path: "/intro-programs", external: true },
  { label: "Anchor 框架入门", path: "/intro-anchor", external: true },
  { label: "Chainova 全栈开发指南", path: "/fullstack-guide", external: true },
  { label: "Chainova 区块链概念入门", path: "/blockchain-concepts", external: true },
];

const LandingHeader = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleDropdownToggle = (dropdown: string) => {
    setActiveDropdown(activeDropdown === dropdown ? null : dropdown);
  };

  const DropdownMenu = ({ items, title }: { items: any[], title: string }) => (
    <motion.div
      className="dropdown-menu"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      transition={{ duration: 0.2 }}
    >
      <div className="dropdown-content">
        <h3 className="dropdown-title">{title}</h3>
        <div className="dropdown-items">
          {items.map((item, index) => (
            <Link
              key={index}
              href={item.path}
              className="dropdown-item"
              target={item.external ? "_blank" : undefined}
              rel={item.external ? "noopener noreferrer" : undefined}
            >
              <div className="item-content">
                <span className="item-label">{item.label}</span>
                {item.description && (
                  <span className="item-description">{item.description}</span>
                )}
              </div>
              {item.external && (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path d="M7 17L17 7M17 7H7M17 7V17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              )}
            </Link>
          ))}
        </div>
      </div>
    </motion.div>
  );

  return (
    <motion.header 
      className={`landing-header ${isScrolled ? 'scrolled' : ''}`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="container">
        <div className="header-content">
          <div className="logo">
            <Link href="/" title="Chainova">
              <span className="logo-text">Chainova</span>
            </Link>
          </div>
          
          <nav className="main-nav">
            <ul>
              <li className="nav-item dropdown">
                <button 
                  className="nav-link"
                  onMouseEnter={() => handleDropdownToggle('developers')}
                  onMouseLeave={() => setActiveDropdown(null)}
                >
                  开发者
                </button>
                <AnimatePresence>
                  {activeDropdown === 'developers' && (
                    <DropdownMenu items={DEVELOPER_RESOURCES} title="资源" />
                  )}
                </AnimatePresence>
              </li>
              
              <li className="nav-item dropdown">
                <button 
                  className="nav-link"
                  onMouseEnter={() => handleDropdownToggle('learning')}
                  onMouseLeave={() => setActiveDropdown(null)}
                >
                  学习
                </button>
                <AnimatePresence>
                  {activeDropdown === 'learning' && (
                    <DropdownMenu items={LEARNING_RESOURCES} title="学习资源" />
                  )}
                </AnimatePresence>
              </li>
              
              <li className="nav-item dropdown">
                <button 
                  className="nav-link"
                  onMouseEnter={() => handleDropdownToggle('careers')}
                  onMouseLeave={() => setActiveDropdown(null)}
                >
                  职业
                </button>
                <AnimatePresence>
                  {activeDropdown === 'careers' && (
                    <DropdownMenu items={CAREERS} title="职业机会" />
                  )}
                </AnimatePresence>
              </li>
              
              <li className="nav-item dropdown">
                <button 
                  className="nav-link"
                  onMouseEnter={() => handleDropdownToggle('guides')}
                  onMouseLeave={() => setActiveDropdown(null)}
                >
                  指南和教程
                </button>
                <AnimatePresence>
                  {activeDropdown === 'guides' && (
                    <DropdownMenu items={GUIDES} title="指南和教程" />
                  )}
                </AnimatePresence>
              </li>
            </ul>
          </nav>
          
          <div className="header-actions">
            <button className="connect-wallet-btn">
              连接钱包
            </button>
            
            <button 
              className="mobile-menu-btn"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <span></span>
              <span></span>
              <span></span>
            </button>
          </div>
        </div>
      </div>
      
      {/* 移动端菜单 */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            className="mobile-menu"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="mobile-menu-content">
              <div className="mobile-nav-section">
                <h3>开发者</h3>
                {DEVELOPER_RESOURCES.map((item, index) => (
                  <Link key={index} href={item.path} className="mobile-nav-item">
                    {item.label}
                  </Link>
                ))}
              </div>
              
              <div className="mobile-nav-section">
                <h3>学习</h3>
                {LEARNING_RESOURCES.map((item, index) => (
                  <Link key={index} href={item.path} className="mobile-nav-item">
                    {item.label}
                  </Link>
                ))}
              </div>
              
              <div className="mobile-nav-section">
                <h3>职业</h3>
                {CAREERS.map((item, index) => (
                  <Link key={index} href={item.path} className="mobile-nav-item">
                    {item.label}
                  </Link>
                ))}
              </div>
              
              <div className="mobile-nav-section">
                <h3>指南和教程</h3>
                {GUIDES.map((item, index) => (
                  <Link key={index} href={item.path} className="mobile-nav-item">
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
};

export default LandingHeader;

