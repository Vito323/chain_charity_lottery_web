"use client";
import React, { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { useDisconnect } from "wagmi";
import { ConnectButton } from '@rainbow-me/rainbowkit';
import Image from 'next/image';
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { useTranslations } from 'next-intl';

const CustomConnectButton = () => {
  const { disconnect } = useDisconnect();
  const [showDropdown, setShowDropdown] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const tCommon = useTranslations('common');

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };

    if (showDropdown) {
      // 防止背景滚动
      document.body.style.overflow = 'hidden';
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showDropdown]);

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const getFallbackChainIcon = (chainId: number) => {
    const fallbackChains: { [key: number]: string } = {
      1: '⟠',
      137: '∞',
    };
    return fallbackChains[chainId] || '?';
  };

  // Dropdown内容组件
  const renderDropdownContent = (
    account: { address: string },
    chain: { id: number; name?: string; iconUrl?: string },
    openChainModal: () => void
  ) => (
    <>
      <div className="p-6 border-b border-white/10 md:p-5">
        <div className="mb-4">
          <div className="text-xs font-semibold text-white/60 uppercase tracking-wider mb-2">{tCommon('wallet.wallet')}</div>
          <div className="flex items-center gap-2">
            <div className="text-base font-bold text-white font-mono md:text-base sm:text-sm">{formatAddress(account.address)}</div>
            <button 
              className="bg-transparent border-0 text-white/60 cursor-pointer p-1 rounded transition-all duration-200 hover:bg-white/10 hover:text-purple-600 active:bg-white/20"
              onClick={() => {
                navigator.clipboard.writeText(account.address);
                setCopySuccess(true);
                setTimeout(() => setCopySuccess(false), 2000);
              }}
              title={tCommon('wallet.copyFullAddress')}
            >
              <i className={`fa text-xs ${copySuccess ? 'fa-check' : 'fa-copy'}`}></i>
            </button>
          </div>
        </div>
        
        <div>
          <div className="text-xs font-semibold text-white/60 uppercase tracking-wider mb-2">{tCommon('wallet.network')}</div>
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 bg-gradient-to-br from-purple-600 to-pink-600 text-white rounded-full flex items-center justify-center text-xs font-bold overflow-hidden">
              {(() => {
                if (chain.iconUrl) {
                  return (
                    <Image 
                      src={chain.iconUrl} 
                      alt={chain.name || tCommon('images.chain')} 
                      width={20} 
                      height={20} 
                      className="w-full h-full object-cover rounded-full" 
                    />
                  );
                }
                const fallbackIcon = getFallbackChainIcon(chain.id);
                return <span className="text-xs font-bold">{fallbackIcon}</span>;
              })()}
            </div>
            <span className="text-sm font-bold text-white flex-1 md:text-sm sm:text-xs">{chain.name}</span>
            <button 
              className="text-xs text-pink-400 bg-transparent border-0 cursor-pointer font-medium p-0 no-underline hover:text-pink-300 hover:underline active:text-pink-200"
              onClick={() => {
                openChainModal();
                setShowDropdown(false);
              }}
            >
              {tCommon('wallet.switchNetwork')}
            </button>
          </div>
        </div>
      </div>
      
      <div className="flex flex-col flex-1 min-h-0">
        <div className="py-2 flex-1 overflow-y-auto overflow-x-hidden scrollbar-thin scrollbar-track-white/10 scrollbar-thumb-white/30 hover:scrollbar-thumb-white/50 max-h-[300px] md:max-h-[300px]">
          <button 
            className="block w-full px-5 py-4 bg-transparent border-0 text-left text-base text-white cursor-pointer transition-all duration-200 ease-out font-inherit font-medium relative box-border active:bg-gradient-to-r active:from-purple-600/20 active:to-pink-600/10 md:px-5 md:py-3.5 md:text-sm md:hover:bg-gradient-to-r md:hover:from-purple-600/10 md:hover:to-pink-600/5 md:hover:text-purple-300"
            onClick={() => {
              router.push("/user");
              setShowDropdown(false);
            }}
          >
            {tCommon('wallet.userCenter')}
          </button>
          <button 
            className="block w-full px-5 py-4 bg-transparent border-0 text-left text-base text-white cursor-pointer transition-all duration-200 ease-out font-inherit font-medium relative box-border active:bg-gradient-to-r active:from-purple-600/20 active:to-pink-600/10 md:px-5 md:py-3.5 md:text-sm md:hover:bg-gradient-to-r md:hover:from-purple-600/10 md:hover:to-pink-600/5 md:hover:text-purple-300"
            onClick={() => {
              router.push("/network/my-nodes");
              setShowDropdown(false);
            }}
          >
            {tCommon('wallet.holdNodes')}
          </button>
          <button 
            className="block w-full px-5 py-4 bg-transparent border-0 text-left text-base text-white cursor-pointer transition-all duration-200 ease-out font-inherit font-medium relative box-border active:bg-gradient-to-r active:from-purple-600/20 active:to-pink-600/10 md:px-5 md:py-3.5 md:text-sm md:hover:bg-gradient-to-r md:hover:from-purple-600/10 md:hover:to-pink-600/5 md:hover:text-purple-300"
            onClick={() => {
              router.push("/network");
              setShowDropdown(false);
            }}
          >
            {tCommon('wallet.nodeEarnings')}
          </button>
          <button 
            className="block w-full px-5 py-4 bg-transparent border-0 text-left text-base text-white cursor-pointer transition-all duration-200 ease-out font-inherit font-medium relative box-border active:bg-gradient-to-r active:from-purple-600/20 active:to-pink-600/10 md:px-5 md:py-3.5 md:text-sm md:hover:bg-gradient-to-r md:hover:from-purple-600/10 md:hover:to-pink-600/5 md:hover:text-purple-300"
            onClick={() => {
              router.push("/network/purchase-history");
              setShowDropdown(false);
            }}
          >
            {tCommon('wallet.nodePurchaseRecords')}
          </button>
          <button 
            className="block w-full px-5 py-4 bg-transparent border-0 text-left text-base text-white cursor-pointer transition-all duration-200 ease-out font-inherit font-medium relative box-border active:bg-gradient-to-r active:from-purple-600/20 active:to-pink-600/10 md:px-5 md:py-3.5 md:text-sm md:hover:bg-gradient-to-r md:hover:from-purple-600/10 md:hover:to-pink-600/5 md:hover:text-purple-300"
            onClick={() => {
              router.push("/lottery/my-tickets");
              setShowDropdown(false);
            }}
          >
            {tCommon('wallet.holdLottery')}
          </button>
          <button 
            className="block w-full px-5 py-4 bg-transparent border-0 text-left text-base text-white cursor-pointer transition-all duration-200 ease-out font-inherit font-medium relative box-border active:bg-gradient-to-r active:from-purple-600/20 active:to-pink-600/10 md:px-5 md:py-3.5 md:text-sm md:hover:bg-gradient-to-r md:hover:from-purple-600/10 md:hover:to-pink-600/5 md:hover:text-purple-300"
            onClick={() => {
              router.push("/lottery/winning-records");
              setShowDropdown(false);
            }}
          >
            {tCommon('wallet.winningRecords')}
          </button>
          <button 
            className="block w-full px-5 py-4 bg-transparent border-0 text-left text-base text-white cursor-pointer transition-all duration-200 ease-out font-inherit font-medium relative box-border active:bg-gradient-to-r active:from-purple-600/20 active:to-pink-600/10 md:px-5 md:py-3.5 md:text-sm md:hover:bg-gradient-to-r md:hover:from-purple-600/10 md:hover:to-pink-600/5 md:hover:text-purple-300"
            onClick={() => {
              router.push("/user/token-details");
              setShowDropdown(false);
            }}
          >
            {tCommon('wallet.tokenDetails')}
          </button>
          <button 
            className="block w-full px-5 py-4 bg-transparent border-0 text-left text-base text-white cursor-pointer transition-all duration-200 ease-out font-inherit font-medium relative box-border active:bg-gradient-to-r active:from-purple-600/20 active:to-pink-600/10 md:px-5 md:py-3.5 md:text-sm md:hover:bg-gradient-to-r md:hover:from-purple-600/10 md:hover:to-pink-600/5 md:hover:text-purple-300"
            onClick={() => {
              router.push("/user/donation-records");
              setShowDropdown(false);
            }}
          >
            {tCommon('wallet.donationRecords')}
          </button>
        </div>
        <div className="border-t border-white/10 pt-2 pb-2">
          <button 
            className="block w-full px-5 py-4 bg-transparent border-0 text-left text-base text-red-400 cursor-pointer transition-all duration-200 ease-out font-inherit font-medium relative box-border active:bg-gradient-to-r active:from-red-400/20 active:to-red-400/10 md:px-5 md:py-3.5 md:text-sm md:hover:bg-gradient-to-r md:hover:from-red-400/10 md:hover:to-red-400/5 md:hover:text-red-300"
            onClick={() => {
              disconnect();
              setShowDropdown(false);
            }}
          >
            {tCommon('wallet.disconnect')}
          </button>
        </div>
      </div>
    </>
  );

  return (
    <ConnectButton.Custom>
      {({
        account,
        chain,
        openChainModal,
        openConnectModal,
        authenticationStatus,
        mounted,
      }) => {
        const ready = mounted && authenticationStatus !== 'loading';
        const connected =
          ready &&
          account &&
          chain &&
          (!authenticationStatus ||
            authenticationStatus === 'authenticated');

        return (
          <div className="relative inline-block" ref={dropdownRef}>
            {(() => {
              if (!connected) {
                return (
                  <button
                    className="relative bg-gradient-to-br from-purple-600 via-pink-600 to-rose-500 text-white border-0 rounded-full px-7 py-3.5 text-base font-semibold cursor-pointer transition-all duration-300 ease-out font-inherit flex items-center gap-2 shadow-lg shadow-purple-600/25 overflow-hidden min-w-[140px] justify-center hover:from-purple-700 hover:via-pink-700 hover:to-rose-600 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-purple-600/35 active:translate-y-0 active:shadow-lg active:shadow-purple-600/25 focus:outline-none before:absolute before:top-0 before:-left-full before:w-full before:h-full before:bg-gradient-to-r before:from-transparent before:via-white/20 before:to-transparent before:transition-all before:duration-500 hover:before:left-full"
                    onClick={openConnectModal}
                  >
                    {tCommon('actions.connectWallet')}
                  </button>
                );
              }

              if (chain.unsupported) {
                return (
                  <button
                    className="relative bg-gradient-to-br from-red-600 to-red-700 text-white border-0 rounded-full px-7 py-3.5 text-base font-semibold cursor-pointer transition-all duration-300 ease-out font-inherit flex items-center gap-2 shadow-lg shadow-red-600/25 overflow-hidden min-w-[140px] justify-center hover:from-red-700 hover:to-red-800 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-red-600/35 active:translate-y-0 active:shadow-lg active:shadow-red-600/25 focus:outline-none before:absolute before:top-0 before:-left-full before:w-full before:h-full before:bg-gradient-to-r before:from-transparent before:via-white/20 before:to-transparent before:transition-all before:duration-500 hover:before:left-full"
                    onClick={openChainModal}
                  >
                    {tCommon('wallet.wrongNetwork')}
                  </button>
                );
              }

              return (
                <button
                  className="relative bg-white/10 text-white border border-white/25 rounded-full px-7 py-3.5 text-base font-medium cursor-pointer transition-all duration-300 ease-out font-inherit flex items-center gap-2 shadow-lg shadow-black/10 backdrop-blur-sm overflow-hidden min-w-[140px] justify-center hover:bg-white/15 hover:border-white/40 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-black/20 focus:outline-none before:absolute before:top-0 before:-left-full before:w-full before:h-full before:bg-gradient-to-r before:from-transparent before:via-white/10 before:to-transparent before:transition-all before:duration-500 hover:before:left-full"
                    onClick={() => setShowDropdown(!showDropdown)}
                  >
                    <span className="text-white">{formatAddress(account.address)}</span>
                    <i className={`fa fa-chevron-down text-xs transition-transform duration-300 ease-out text-white/80 hover:text-white ${showDropdown ? 'rotate-180' : ''}`}></i>
                  </button>
              );
            })()}
            
            <AnimatePresence>
              {showDropdown && connected && (
                <>
                  {/* 移动端 Bottom Sheet - 使用 Portal 渲染到 body */}
                  {mounted && createPortal(
                    <AnimatePresence>
                      {showDropdown && (
                        <motion.div
                          key="bottom-sheet"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.3 }}
                          className="fixed inset-0 z-[9999] md:hidden"
                          onClick={() => setShowDropdown(false)}
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
                                onClick={() => setShowDropdown(false)}
                                className="w-8 h-8 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 active:bg-white/30 transition-colors"
                                aria-label={tCommon('wallet.close')}
                              >
                                <i className="fa fa-times text-white/80 text-sm"></i>
                              </button>
                            </div>

                            {/* 内容 */}
                            <div className="overflow-y-auto flex-1 overscroll-contain">
                              {renderDropdownContent(account, chain, openChainModal)}
                            </div>
                          </motion.div>
                        </motion.div>
                      )}
                    </AnimatePresence>,
                    document.body
                  )}

                  {/* 桌面端 Dropdown */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: -10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="hidden md:flex md:flex-col absolute top-full right-0 bg-slate-900/95 rounded-2xl shadow-2xl shadow-black/40 z-[1000] mt-3 overflow-hidden border border-white/10 backdrop-blur-xl min-w-[300px] max-w-[300px] max-h-[85vh]"
                  >
                    {renderDropdownContent(account, chain, openChainModal)}
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>
        );
      }}
    </ConnectButton.Custom>
  );
};

export default CustomConnectButton;
