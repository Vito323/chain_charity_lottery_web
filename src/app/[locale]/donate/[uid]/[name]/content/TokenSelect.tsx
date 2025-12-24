"use client";
import React, { useState, useMemo, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useAccount, useBalance, useChainId } from "wagmi";
import { useTranslations } from 'next-intl';
import { TokenInfo as DonationTokenInfo } from "@/hooks/useDonationForm";
import { useTokenInfoList, TokenInfo as TokenInfoList } from "@/hooks/useTokenInfo";

// 统一的 TokenInfo 接口，兼容两种用法
interface UnifiedTokenInfo extends DonationTokenInfo {
  formattedBalance?: string;
  balance?: string;
}

// 代币图标映射
const TOKEN_ICONS: Record<string, string> = {
  ETH: "fa-ethereum",
  POL: "fa-polygon",
  MATIC: "fa-polygon",
  BNB: "fa-bnb",
  USDC: "fa-circle",
  USDT: "fa-circle",
  DAI: "fa-circle",
  AAVE: "fa-circle",
  LINK: "fa-circle",
  UNI: "fa-circle",
  WBTC: "fa-circle",
};

interface TokenSelectProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (token: DonationTokenInfo) => void;
  tokenList: { address: string }[];
  isLoading?: boolean;
  searchTerm: string;
  hideZeroBalance: boolean;
}

const TokenSelect: React.FC<TokenSelectProps> = ({
  isOpen,
  onClose,
  onSelect,
  tokenList,
  isLoading = false,
  searchTerm: propSearchTerm,
  hideZeroBalance: propHideZeroBalance,
}) => {
  const tCommon = useTranslations('common');
  const tDonate = useTranslations('donate');
  const [searchInput, setSearchInput] = useState(propSearchTerm);
  const [hideZeroBalance, setHideZeroBalance] = useState(propHideZeroBalance);
  const chainId = useChainId();
  const { address } = useAccount();

  // 获取原生代币余额
  const { data: nativeBalance, refetch: refetchNativeBalance } = useBalance({
    address,
    chainId,
  });

  // 获取 ERC20 token 信息列表 - 使用 useMemo 避免不必要的重新计算
  const erc20TokenAddresses = useMemo(() => {
    return tokenList
      .filter(({ address }) => 
        address && address !== "0x0000000000000000000000000000000000000000"
      )
      .map(({ address }) => address);
  }, [tokenList]);

  const { 
    data: erc20TokenInfos, 
    isLoading: erc20TokensLoading,
    refetch: refetchERC20Balances
  } = useTokenInfoList(erc20TokenAddresses);

  // 刷新所有余额的函数
  const refreshAllBalances = useCallback(async () => {
    try {
      console.log('Refreshing balances when modal opens...');
      await Promise.all([
        refetchNativeBalance(),
        refetchERC20Balances()
      ]);
      console.log('Balances refreshed successfully');
    } catch (error) {
      console.error('Failed to refresh balances:', error);
    }
  }, [refetchNativeBalance, refetchERC20Balances]);

  // 当 modal 显示时刷新余额
  useEffect(() => {
    if (isOpen) {
      refreshAllBalances();
    }
  }, [isOpen, refreshAllBalances]);

  // 构建完整的代币列表 - 使用 useMemo 避免无限循环
  const allTokens = useMemo(() => {
    const tokens: UnifiedTokenInfo[] = [];

    // 1. 添加原生代币（始终在第一位）- 使用useBalance返回的信息
    if (nativeBalance) {
      const balance = (Number(nativeBalance.value) / Math.pow(10, nativeBalance.decimals)).toFixed(4);
      // 为原生代币提供友好的名称
      const getNativeTokenName = (symbol: string) => {
        const nameMap: Record<string, string> = {
          ETH: "Ethereum",
          POL: "Polygon",
          MATIC: "Polygon",
          BNB: "BNB Smart Chain",
          AVAX: "Avalanche",
        };
        return nameMap[symbol] || symbol;
      };
      
      tokens.push({
        symbol: nativeBalance.symbol,
        name: getNativeTokenName(nativeBalance.symbol),
        icon: TOKEN_ICONS[nativeBalance.symbol] || "fa-circle",
        balance,
        decimals: nativeBalance.decimals,
        isNative: true,
        address: "0x0000000000000000000000000000000000000000",
      });
    }

    // 2. 添加ERC20代币 - 使用 useTokenInfoList 获取的信息
    if (erc20TokenInfos && erc20TokenInfos.length > 0) {
      erc20TokenInfos.forEach((tokenInfo: TokenInfoList) => {
        tokens.push({
          symbol: tokenInfo.symbol,
          name: tokenInfo.name,
          icon: TOKEN_ICONS[tokenInfo.symbol] || "fa-circle",
          balance: tokenInfo.formattedBalance,
          formattedBalance: tokenInfo.formattedBalance,
          decimals: tokenInfo.decimals,
          isNative: false,
          address: tokenInfo.address,
        });
      });
    }

    return tokens;
  }, [nativeBalance, erc20TokenInfos]);

  // 过滤代币列表
  const filteredTokens = useMemo(() => {
    return allTokens
      .filter((token) => {
        const matchesSearch =
          token.symbol.toLowerCase().includes(searchInput.toLowerCase()) ||
          token.name.toLowerCase().includes(searchInput.toLowerCase());
        const hasBalance =
          !hideZeroBalance || parseFloat(token.balance || "0") > 0;
        return matchesSearch && hasBalance;
      })
      .sort((a, b) => {
        // 确保原生代币始终在第一位
        if (a.isNative && !b.isNative) return -1;
        if (!a.isNative && b.isNative) return 1;
        return 0;
      });
  }, [allTokens, searchInput, hideZeroBalance]);

  const handleTokenSelect = (token: UnifiedTokenInfo) => {
    // 转换为 DonationTokenInfo 格式
    const donationTokenInfo: DonationTokenInfo = {
      symbol: token.symbol,
      name: token.name,
      icon: token.icon,
      balance: token.balance,
      decimals: token.decimals,
      isNative: token.isNative,
      address: token.address,
    };
    onSelect(donationTokenInfo);
    onClose();
  };

  // TokenListItem 组件定义
  const TokenListItem: React.FC<{
    token: UnifiedTokenInfo;
    handleTokenSelect: (token: UnifiedTokenInfo) => void;
    index: number;
  }> = ({ token, handleTokenSelect, index }) => {
    const handleClick = () => {
      if (parseFloat(token.balance || "0") > 0) {
        handleTokenSelect(token);
      }
    };

    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.05 }}
        className={`flex items-center gap-3 p-4 rounded-xl hover:bg-white/10 transition-all duration-200 cursor-pointer group ${
          parseFloat(token.balance || "0") === 0 ? "opacity-50 cursor-not-allowed" : ""
        }`}
        onClick={handleClick}
      >
        <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center flex-shrink-0 relative shadow-lg">
          <Image
            src={`/icons/tokens/${token.symbol}.svg`}
            alt={token.symbol}
            width={40}
            height={40}
            className="w-10 h-10 rounded-full"
            onError={(e) => {
              // 如果图片加载失败，回退到Font Awesome图标
              const target = e.target as HTMLImageElement;
              target.style.display = "none";
              const fallbackIcon = target.nextElementSibling as HTMLElement;
              if (fallbackIcon) {
                fallbackIcon.style.display = "flex";
              }
            }}
          />
          <div 
            className="absolute -top-1 -right-1 w-4 h-4 bg-purple-500 rounded-full flex items-center justify-center"
            style={{ display: "none" }}
          >
            <i className={`fa ${token.icon} text-white text-xs`}></i>
          </div>
          <div 
            className="absolute -top-1 -right-1 w-4 h-4 bg-purple-500 rounded-full flex items-center justify-center"
            style={{ display: "none" }}
          >
            <i className="fa fa-hand-paper text-white text-xs"></i>
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <p className="!text-white !font-semibold !text-base leading-tight">{token.symbol}</p>
          <p className="!text-white/70 !text-sm !font-normal truncate leading-tight">{token.name}</p>
        </div>
        <div className="text-right">
          <p className="!text-white/60 !text-xs !font-normal uppercase tracking-wide">{tDonate('tokenSelect.balance')}</p>
          <p className="!text-white !text-sm !font-semibold leading-tight">{token.balance || "0.00"}</p>
        </div>
      </motion.div>
    );
  };

  if (!isOpen) return null;

  console.log('filteredTokens', JSON.stringify(filteredTokens, null, 2));

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        {/* Backdrop */}
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
        
        {/* Modal */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ type: "spring", duration: 0.3 }}
          className="relative w-full max-w-md bg-slate-800/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-white/10">
            <h3 className="text-xl font-bold text-white">{tDonate('tokenSelect.title')}</h3>
            <button
              onClick={onClose}
              className="p-2 text-white/60 hover:text-white transition-colors cursor-pointer"
              aria-label={tCommon('accessibility.close')}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Search */}
          <div className="p-6 border-b border-white/10">
            <div className="relative">
              <input
                type="text"
                placeholder={tDonate('tokenSelect.searchPlaceholder')}
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="w-full p-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-transparent"
              />
              <svg className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            
            {/* 隐藏零余额选项 */}
            <div className="mt-4">
              <label className="flex items-center gap-3 text-white/80 cursor-pointer group">
                <div className="relative">
                  <input
                    type="checkbox"
                    checked={hideZeroBalance}
                    onChange={(e) => setHideZeroBalance(e.target.checked)}
                    className="sr-only"
                  />
                  <div className={`w-5 h-5 rounded-md border-2 transition-all duration-200 flex items-center justify-center ${
                    hideZeroBalance 
                      ? 'bg-gradient-to-r from-purple-500 to-pink-500 border-purple-500 shadow-lg shadow-purple-500/25' 
                      : 'bg-white/5 border-white/20 group-hover:border-white/40 group-hover:bg-white/10'
                  }`}>
                    {hideZeroBalance && (
                      <svg 
                        className="w-3 h-3 text-white" 
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                      >
                        <path 
                          strokeLinecap="round" 
                          strokeLinejoin="round" 
                          strokeWidth={3} 
                          d="M5 13l4 4L19 7" 
                        />
                      </svg>
                    )}
                  </div>
                </div>
                <span className="text-sm font-medium group-hover:text-white transition-colors">
                  {tDonate('tokenSelect.hideZeroBalance')}
                </span>
              </label>
            </div>
          </div>

          {/* Token List */}
          <div className="max-h-80 overflow-y-auto">
            {(isLoading || erc20TokensLoading) ? (
              <div className="flex items-center justify-center py-12">
                <div className="flex flex-col items-center gap-3">
                  <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
                  <p className="text-white/60">{tCommon('tokens.loadingTokens')}</p>
                </div>
              </div>
            ) : filteredTokens.length === 0 ? (
              <div className="flex items-center justify-center py-12">
                <div className="text-center">
                  <svg className="w-12 h-12 text-white/40 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.29-1.009-5.824-2.57M15 6.5a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <p className="text-white/60">
                    {searchInput 
                      ? tDonate('tokenSelect.noTokensFound', { search: searchInput })
                      : tDonate('tokenSelect.noTokensAvailable')}
                  </p>
                  {searchInput && (
                    <button 
                      className="mt-2 px-4 py-2 text-purple-400 hover:text-purple-300 transition-colors"
                      onClick={() => setSearchInput("")}
                    >
                      {tDonate('tokenSelect.clearSearch')}
                    </button>
                  )}
                </div>
              </div>
            ) : (
              <div className="p-2">
                {filteredTokens.map((token, index) => (
                  <TokenListItem
                    key={token.address || token.symbol}
                    token={token}
                    handleTokenSelect={handleTokenSelect}
                    index={index}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-6 border-t border-white/10">
            <div className="flex items-center gap-2 text-sm text-white/60">
              <svg className="w-4 h-4 text-purple-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              <span>{tDonate('tokenSelect.footerHint')}</span>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default TokenSelect;
