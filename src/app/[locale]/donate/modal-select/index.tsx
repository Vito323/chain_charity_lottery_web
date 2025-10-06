"use client";

import Image from "next/image";
import React from "react";
import { Form, Modal } from "react-bootstrap";
import { useAccount, useBalance, useChainId } from "wagmi";
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
  USDC: "fa-circle",
  USDT: "fa-circle",
  DAI: "fa-circle",
  AAVE: "fa-circle",
  LINK: "fa-circle",
  UNI: "fa-circle",
  WBTC: "fa-circle",
};

// TokenInfo 接口现在从 useDonationForm 导入

export interface ModalSelectProps {
  showTokenModal: boolean;
  changeModalState: (state: boolean) => void;
  searchTerm: string;
  hideZeroBalance: boolean;
  tokenList: { address: string }[];
  handleTokenSelect: (token: DonationTokenInfo) => void;
  propTokenListLoading?: boolean;
}

const ModalSelect = ({
  showTokenModal,
  changeModalState,
  handleTokenSelect,
  tokenList,
  searchTerm: propSearchTerm,
  hideZeroBalance: propHideZeroBalance,
  propTokenListLoading,
}: ModalSelectProps) => {
  const [searchTerm, setSearchTerm] = React.useState(propSearchTerm);
  const [hideZeroBalance, setHideZeroBalance] =
    React.useState(propHideZeroBalance);
  // 移除 filteredTokens state，直接使用 allTokens
  const chainId = useChainId();
  const { address } = useAccount();


  // 获取原生代币余额
  const { data: nativeBalance, refetch: refetchNativeBalance } = useBalance({
    address,
    chainId,
  });

  // 获取 ERC20 token 信息列表 - 使用 useMemo 避免不必要的重新计算
  const erc20TokenAddresses = React.useMemo(() => {
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
  const refreshAllBalances = React.useCallback(async () => {
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
  React.useEffect(() => {
    if (showTokenModal) {
      refreshAllBalances();
    }
  }, [showTokenModal, refreshAllBalances]);




  // 构建完整的代币列表 - 使用 useMemo 避免无限循环
  const allTokens = React.useMemo(() => {
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
  const filteredTokenList = React.useMemo(() => {
    return allTokens
      .filter((token) => {
        const matchesSearch =
          token.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
          token.name.toLowerCase().includes(searchTerm.toLowerCase());
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
  }, [allTokens, searchTerm, hideZeroBalance]);

  return (
    <Modal
      show={showTokenModal}
      onHide={() => changeModalState?.(false)}
      centered
      className="token-select-modal"
    >
      <Modal.Header closeButton>
        <Modal.Title>Select a Token</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {/* 搜索框 */}
        <div className="token-search-section">
          <Form.Control
            type="text"
            placeholder="Search name or paste an address"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="token-search-input"
          />
        </div>

        {/* 隐藏零余额选项 */}
        <div className="hide-zero-balance-section">
          <Form.Check
            type="checkbox"
            label="Hide 0 balance tokens"
            checked={hideZeroBalance}
            onChange={(e) => setHideZeroBalance(e.target.checked)}
            className="hide-zero-checkbox"
          />
        </div>

        {/* 代币列表 */}
        <div className="token-list-section">
          {(propTokenListLoading || erc20TokensLoading) ? (
            <div className="loading-tokens">
              <div className="loading-icon">
                <i className="fa fa-spinner fa-spin"></i>
              </div>
              <div className="loading-content">
                <h4>Loading Token List</h4>
                <p>Please wait while we fetch available token information...</p>
              </div>
            </div>
          ) : filteredTokenList.length === 0 ? (
            <div className="no-tokens">
              <div className="no-tokens-icon">
                <i className="fa fa-search"></i>
              </div>
              <div className="no-tokens-content">
                <h4>No Available Tokens</h4>
                <p>
                  {searchTerm 
                    ? `No tokens found containing "${searchTerm}"` 
                    : "No tokens are currently available"}
                </p>
                {searchTerm && (
                  <button 
                    className="clear-search-btn"
                    onClick={() => setSearchTerm("")}
                  >
                    <i className="fa fa-times"></i>
                    Clear Search
                  </button>
                )}
              </div>
            </div>
          ) : (
            filteredTokenList.map((token) => (
              <TokenListItem
                key={token.address || token.symbol}
                token={token}
                handleTokenSelect={(t) => {
                  handleTokenSelect(t);
                  changeModalState(false);
                }}
              />
            ))
          )}
        </div>
      </Modal.Body>
    </Modal>
  );
};

interface TokenListItemProps {
  token: UnifiedTokenInfo;
  handleTokenSelect: (t: DonationTokenInfo) => void;
}

const TokenListItem = ({ token, handleTokenSelect }: TokenListItemProps) => {
  // token 信息已经在父组件中完整加载，直接使用
  const handleClick = () => {
    if (parseFloat(token.balance || "0") > 0) {
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
      handleTokenSelect(donationTokenInfo);
    }
  };

  return (
    <div
      className={`token-list-item ${
        parseFloat(token.balance || "0") === 0 ? "disabled" : ""
      }`}
      onClick={handleClick}
    >
      <div className="token-icon-container">
        <Image
          src={"/icons/tokens/" + token.symbol + ".svg"}
          alt={token.symbol}
          width={32}
          height={32}
          className="token-list-icon-img"
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
        <div className="givbacks-indicator">
          <i className="fa fa-hand-paper"></i>
        </div>
      </div>
      <div className="token-info">
        <div className="token-symbol">{token.symbol}</div>
        <div className="token-name">{token.name}</div>
      </div>
      <div className="token-balance">{token.balance}</div>
    </div>
  );
};

export default ModalSelect;
