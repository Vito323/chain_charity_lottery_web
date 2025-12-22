"use client";
import React, { useState, useRef, useEffect } from "react";
import { useDisconnect } from "wagmi";
import { ConnectButton } from '@rainbow-me/rainbowkit';
import Image from 'next/image';
import "./style.scss";
import { useRouter } from "next/navigation";
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

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);


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
        // Note: If your app doesn't use authentication, you
        // can remove all 'authenticationStatus' checks
        const ready = mounted && authenticationStatus !== 'loading';
        const connected =
          ready &&
          account &&
          chain &&
          (!authenticationStatus ||
            authenticationStatus === 'authenticated');

        return (
          <div className="custom-connect-button" ref={dropdownRef}>
            {(() => {
              if (!connected) {
                return (
                  <button
                    className="connect-button-trigger"
                    onClick={openConnectModal}
                  >
                    {tCommon('actions.connectWallet')}
                  </button>
                );
              }

              if (chain.unsupported) {
                return (
                  <button
                    className="connect-button-trigger error"
                    onClick={openChainModal}
                  >
                    {tCommon('wallet.wrongNetwork')}
                  </button>
                );
              }

              return (
                <button
                  className="connect-button-trigger connected"
                  onClick={() => setShowDropdown(!showDropdown)}
                >
                  <span className="address-text">{formatAddress(account.address)}</span>
                  <i className={`fa fa-chevron-down dropdown-arrow ${showDropdown ? 'rotated' : ''}`}></i>
                </button>
              );
            })()}
            
            {showDropdown && connected && (
              <div className="wallet-dropdown">
                <div className="wallet-info">
                  <div className="wallet-section">
                    <div className="section-title">{tCommon('wallet.wallet')}</div>
                    <div className="wallet-address-container">
                      <div className="wallet-address">{formatAddress(account.address)}</div>
                      <button 
                        className="copy-button"
                        onClick={() => {
                          navigator.clipboard.writeText(account.address);
                          setCopySuccess(true);
                          setTimeout(() => setCopySuccess(false), 2000);
                        }}
                        title={tCommon('wallet.copyFullAddress')}
                      >
                        <i className={`fa ${copySuccess ? 'fa-check' : 'fa-copy'}`}></i>
                      </button>
                    </div>
                  </div>
                  
                  <div className="network-section">
                    <div className="section-title">{tCommon('wallet.network')}</div>
                    <div className="network-info">
                      <div className="network-icon">
                        {(() => {
                          if (chain.iconUrl) {
                            return (
                              <Image 
                                src={chain.iconUrl} 
                                alt={chain.name || tCommon('images.chain')} 
                                width={20} 
                                height={20} 
                                className="chain-icon-img" 
                              />
                            );
                          }
                          // 使用备用图标
                          const fallbackIcon = getFallbackChainIcon(chain.id);
                          return <span className="chain-icon-text">{fallbackIcon}</span>;
                        })()}
                      </div>
                      <span className="network-name">{chain.name}</span>
                      <button 
                        className="switch-network"
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
                
                <div className="navigation-menu">
                  <button 
                    className="menu-item"
                    onClick={() => {
                      // openAccountModal();
                      router.push("/user");
                      setShowDropdown(false);
                    }}
                  >
                    {tCommon('wallet.userCenter')}
                  </button>
                  <button 
                    className="menu-item"
                    onClick={() => {
                      router.push("/network/detail?tab=nodes");
                      setShowDropdown(false);
                    }}
                  >
                    {tCommon('wallet.holdNodes')}
                  </button>
                  {/* <button 
                    className="menu-item"
                    onClick={() => {
                      router.push("/network");
                      setShowDropdown(false);
                    }}
                  >
                    {tCommon('wallet.nodeEarnings')}
                  </button>
                  <button 
                    className="menu-item"
                    onClick={() => {
                      router.push("/network/purchase-history");
                      setShowDropdown(false);
                    }}
                  >
                    {tCommon('wallet.nodePurchaseRecords')}
                  </button> */}
                  <button 
                    className="menu-item"
                    onClick={() => {
                      router.push("/lottery/my-tickets");
                      setShowDropdown(false);
                    }}
                  >
                    {tCommon('wallet.holdLottery')}
                  </button>
                  <button 
                    className="menu-item"
                    onClick={() => {
                      router.push("/lottery/winning-records");
                      setShowDropdown(false);
                    }}
                  >
                    {tCommon('wallet.winningRecords')}
                  </button>
                  {/* <button 
                    className="menu-item"
                    onClick={() => {
                      router.push("/user/token-details");
                      setShowDropdown(false);
                    }}
                  >
                    {tCommon('wallet.tokenDetails')}
                  </button> */}
                  <button 
                    className="menu-item"
                    onClick={() => {
                      router.push("/user/donation-records");
                      setShowDropdown(false);
                    }}
                  >
                    {tCommon('wallet.donationRecords')}
                  </button>
                  <button 
                    className="menu-item"
                    onClick={() => {
                      router.push("/user/transaction-records");
                      setShowDropdown(false);
                    }}
                  >
                    {tCommon('wallet.transactionRecords')}
                  </button>
                  <button 
                    className="menu-item"
                    onClick={() => {
                      router.push("/user/earnings-details");
                      setShowDropdown(false);
                    }}
                  >
                    {tCommon('wallet.earningsDetails')}
                  </button>
                  <button 
                    className="menu-item sign-out"
                    onClick={() => {
                      disconnect();
                      setShowDropdown(false);
                    }}
                  >
                    {tCommon('wallet.disconnect')}
                  </button>
                </div>
              </div>
            )}
          </div>
        );
      }}
    </ConnectButton.Custom>
  );
};

export default CustomConnectButton;
