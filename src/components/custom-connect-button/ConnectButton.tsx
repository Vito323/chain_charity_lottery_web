"use client";
import React, { useState, useRef, useEffect } from "react";
import { useDisconnect, useAccount } from "wagmi";
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { AnimatePresence } from "framer-motion";
import { useTranslations } from 'next-intl';
import { formatAddress } from './utils';
import { TermsModal } from './TermsModal';
import { MobileBottomSheet } from './MobileBottomSheet';
import { DesktopDropdown } from './DesktopDropdown';
import { userConnect } from '@/service/user';

const CustomConnectButton = () => {
  const { disconnect } = useDisconnect();
  const { address, isConnected } = useAccount();
  const [showDropdown, setShowDropdown] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const hasCalledConnectRef = useRef<string | null>(null);
  const tCommon = useTranslations('common');

  // 监听钱包连接状态，连接后调用 userConnect 接口验证
  useEffect(() => {
    if (isConnected && address) {
      // 防止重复调用：如果当前地址已经调用过，则不再调用
      if (hasCalledConnectRef.current === address) {
        return;
      }

      // 标记当前地址已开始调用
      hasCalledConnectRef.current = address;

      userConnect(address)
        .then((result) => {
          // 如果返回 false，则断开连接
          if (!result) {
            disconnect();
            hasCalledConnectRef.current = null; // 重置，允许重试
          }
        })
        .catch((error) => {
          console.error('Failed to call userConnect:', error);
          // 出错时也断开连接
          disconnect();
          hasCalledConnectRef.current = null; // 重置，允许重试
        });
    } else {
      // 如果断开连接，重置标记
      hasCalledConnectRef.current = null;
    }
  }, [isConnected, address, disconnect]);

  // 处理点击外部关闭下拉菜单
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };

    if (showDropdown) {
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

  // 处理条款弹窗的 body 滚动
  useEffect(() => {
    if (showTermsModal) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [showTermsModal]);

  const handleConnectClick = () => {
    setShowTermsModal(true);
  };

  const handleTermsAgree = () => {
    if (acceptedTerms) {
      setShowTermsModal(false);
      setAcceptedTerms(false);
      // openConnectModal 会在 ConnectButton.Custom 的渲染函数中提供
    }
  };

  const handleTermsCancel = () => {
    setShowTermsModal(false);
    setAcceptedTerms(false);
  };

  const handleCloseDropdown = () => {
    setShowDropdown(false);
  };

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

        // 处理同意条款后的连接
        const handleConfirmConnect = () => {
          if (acceptedTerms) {
            setShowTermsModal(false);
            setAcceptedTerms(false);
            openConnectModal();
          }
        };
        console.log(connected, mounted, 'connected1122');

        return (
          <div className="relative inline-block" ref={dropdownRef}>
            {(() => {
              if (!connected) {
                return (
                  <button
                    className="relative bg-linear-to-br from-purple-600 via-pink-600 to-rose-500 text-white border-0 rounded-full px-7 py-3.5 text-base font-semibold cursor-pointer transition-all duration-300 ease-out font-inherit flex items-center gap-2 shadow-lg shadow-purple-600/25 overflow-hidden min-w-[140px] justify-center hover:from-purple-700 hover:via-pink-700 hover:to-rose-600 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-purple-600/35 active:translate-y-0 active:shadow-lg active:shadow-purple-600/25 focus:outline-none before:absolute before:top-0 before:-left-full before:w-full before:h-full before:bg-gradient-to-r before:from-transparent before:via-white/20 before:to-transparent before:transition-all before:duration-500 hover:before:left-full"
                    onClick={handleConnectClick}
                  >
                    {tCommon('actions.connectWallet')}
                  </button>
                );
              }

              if (chain.unsupported) {
                return (
                  <button
                    className="relative bg-linear-to-br from-red-600 to-red-700 text-white border-0 rounded-full px-7 py-3.5 text-base font-semibold cursor-pointer transition-all duration-300 ease-out font-inherit flex items-center gap-2 shadow-lg shadow-red-600/25 overflow-hidden min-w-[140px] justify-center hover:from-red-700 hover:to-red-800 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-red-600/35 active:translate-y-0 active:shadow-lg active:shadow-red-600/25 focus:outline-none before:absolute before:top-0 before:-left-full before:w-full before:h-full before:bg-gradient-to-r before:from-transparent before:via-white/20 before:to-transparent before:transition-all before:duration-500 hover:before:left-full"
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
                  <MobileBottomSheet
                    show={showDropdown}
                    account={account}
                    chain={chain}
                    openChainModal={openChainModal}
                    onClose={handleCloseDropdown}
                    mounted={mounted}
                  />
                  <DesktopDropdown
                    show={showDropdown}
                    account={account}
                    chain={chain}
                    openChainModal={openChainModal}
                    onClose={handleCloseDropdown}
                  />
                </>
              )}
            </AnimatePresence>

            <TermsModal
              show={showTermsModal}
              acceptedTerms={acceptedTerms}
              onAcceptedTermsChange={setAcceptedTerms}
              onConfirm={handleConfirmConnect}
              onCancel={handleTermsCancel}
              mounted={mounted}
            />
          </div>
        );
      }}
    </ConnectButton.Custom>
  );
};

export default CustomConnectButton;
