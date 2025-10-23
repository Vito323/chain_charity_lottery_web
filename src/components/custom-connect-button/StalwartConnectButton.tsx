"use client";
import React, { useState, useRef, useEffect } from "react";
import { useDisconnect } from "wagmi";
import { ConnectButton } from '@rainbow-me/rainbowkit';
import Image from 'next/image';
import { useRouter } from "next/navigation";

const StalwartConnectButton = () => {
  const { disconnect } = useDisconnect();
  const [showDropdown, setShowDropdown] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

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
                    Connect wallet
                  </button>
                );
              }

              if (chain.unsupported) {
                return (
                  <button
                    className="relative bg-gradient-to-br from-red-600 to-red-700 text-white border-0 rounded-full px-7 py-3.5 text-base font-semibold cursor-pointer transition-all duration-300 ease-out font-inherit flex items-center gap-2 shadow-lg shadow-red-600/25 overflow-hidden min-w-[140px] justify-center hover:from-red-700 hover:to-red-800 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-red-600/35 active:translate-y-0 active:shadow-lg active:shadow-red-600/25 focus:outline-none before:absolute before:top-0 before:-left-full before:w-full before:h-full before:bg-gradient-to-r before:from-transparent before:via-white/20 before:to-transparent before:transition-all before:duration-500 hover:before:left-full"
                    onClick={openChainModal}
                  >
                    Wrong network
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
            
            {showDropdown && connected && (
              <div className="absolute top-full right-0 bg-slate-900/95 rounded-2xl shadow-2xl shadow-black/40 min-w-[300px] z-[1000] mt-3 overflow-hidden border border-white/10 backdrop-blur-xl animate-in fade-in-0 zoom-in-95 duration-300 sm:right-0 sm:left-auto sm:min-w-[280px] sm:max-w-[calc(100vw-32px)] sm:mr-4 md:min-w-[300px] md:max-w-none md:mr-0">
                <div className="p-5 border-b border-white/10 sm:p-4">
                  <div className="mb-4">
                    <div className="text-xs font-semibold text-white/60 uppercase tracking-wider mb-2">WALLET</div>
                    <div className="flex items-center gap-2">
                      <div className="text-base font-bold text-white font-mono sm:text-sm">{formatAddress(account.address)}</div>
                      <button 
                        className="bg-transparent border-0 text-white/60 cursor-pointer p-1 rounded transition-all duration-200 hover:bg-white/10 hover:text-purple-600"
                        onClick={() => {
                          navigator.clipboard.writeText(account.address);
                          setCopySuccess(true);
                          setTimeout(() => setCopySuccess(false), 2000);
                        }}
                        title="Copy full address"
                      >
                        <i className={`fa text-xs ${copySuccess ? 'fa-check' : 'fa-copy'}`}></i>
                      </button>
                    </div>
                  </div>
                  
                  <div>
                    <div className="text-xs font-semibold text-white/60 uppercase tracking-wider mb-2">Network</div>
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 bg-gradient-to-br from-purple-600 to-pink-600 text-white rounded-full flex items-center justify-center text-xs font-bold overflow-hidden">
                        {(() => {
                          if (chain.iconUrl) {
                            return (
                              <Image 
                                src={chain.iconUrl} 
                                alt={chain.name || 'Chain'} 
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
                      <span className="text-sm font-bold text-white flex-1 sm:text-xs">{chain.name}</span>
                      <button 
                        className="text-xs text-pink-400 bg-transparent border-0 cursor-pointer font-medium p-0 no-underline hover:text-pink-300 hover:underline"
                        onClick={() => {
                          openChainModal();
                          setShowDropdown(false);
                        }}
                      >
                        Switch Network
                      </button>
                    </div>
                  </div>
                </div>
                
                <div className="py-2 max-h-[300px] overflow-y-auto overflow-x-hidden scrollbar-thin scrollbar-track-white/10 scrollbar-thumb-white/30 hover:scrollbar-thumb-white/50">
                  <button 
                    className="block w-full px-5 py-3.5 bg-transparent border-0 text-left text-sm text-white cursor-pointer transition-all duration-200 ease-out font-inherit font-medium relative box-border hover:bg-gradient-to-r hover:from-purple-600/10 hover:to-pink-600/5 hover:text-purple-300 hover:translate-x-0.5 active:translate-x-0.5 sm:px-4 sm:py-2.5 sm:text-xs"
                    onClick={() => {
                      router.push("/user");
                      setShowDropdown(false);
                    }}
                  >
                    User Center
                  </button>
                  <button 
                    className="block w-full px-5 py-3.5 bg-transparent border-0 text-left text-sm text-red-400 cursor-pointer transition-all duration-200 ease-out font-inherit font-medium relative box-border border-t border-white/10 mt-2 pt-4 hover:bg-gradient-to-r hover:from-red-400/10 hover:to-red-400/5 hover:text-red-300 hover:translate-x-0.5 active:translate-x-0.5 sm:px-4 sm:py-2.5 sm:text-xs"
                    onClick={() => {
                      disconnect();
                      setShowDropdown(false);
                    }}
                  >
                    Disconnect
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

export default StalwartConnectButton;
