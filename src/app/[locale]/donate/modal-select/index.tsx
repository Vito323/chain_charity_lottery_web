"use client";

import Image from "next/image";
import React from "react";
import { Form, Modal } from "react-bootstrap";
import { useAccount, useBalance, useChainId, useReadContract } from "wagmi";

const ERC20_ABI = [
  {
    constant: true,
    inputs: [{ name: "_owner", type: "address" }],
    name: "balanceOf",
    outputs: [{ name: "balance", type: "uint256" }],
    type: "function",
  },
  {
    constant: true,
    inputs: [],
    name: "decimals",
    outputs: [{ name: "", type: "uint8" }],
    type: "function",
  },
  {
    constant: true,
    inputs: [],
    name: "symbol",
    outputs: [{ name: "", type: "string" }],
    type: "function",
  },
  {
    constant: true,
    inputs: [],
    name: "name",
    outputs: [{ name: "", type: "string" }],
    type: "function",
  },
] as const;

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

export interface TokenInfo {
  symbol: string;
  name: string;
  icon?: string;
  balance?: string;
  decimals?: number;
  displayBalance?: string;
  isNative: boolean;
  address?: string;
}

export interface ModalSelectProps {
  showTokenModal: boolean;
  changeModalState: (state: boolean) => void;
  searchTerm: string;
  hideZeroBalance: boolean;
  tokenList: { address: string }[];
  handleTokenSelect: (symbol: string) => void;
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
  const [filteredTokens, setFilteredTokens] = React.useState<TokenInfo[]>([]);
  const chainId = useChainId();
  const { address } = useAccount();


  // 获取原生代币余额
  const { data: nativeBalance } = useBalance({
    address,
    chainId,
  });

  // 构建完整的代币列表
  const buildTokenList = React.useCallback(() => {
    const tokens: TokenInfo[] = [];

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

    // 2. 添加ERC20代币
    tokenList.forEach(({ address: tokenAddress }) => {
      if (
        tokenAddress &&
        tokenAddress !== "0x0000000000000000000000000000000000000000"
      ) {
        tokens.push({
          symbol: "",
          name: "",
          icon: "fa-circle",
          balance: "0.0000",
          decimals: 18,
          isNative: false,
          address: tokenAddress,
        });
      }
    });

    setFilteredTokens(tokens);
  }, [nativeBalance, tokenList]);

  // 当依赖项变化时重新构建列表
  React.useEffect(() => {
    buildTokenList();
  }, [buildTokenList]);

  // 过滤代币列表
  const filteredTokenList = React.useMemo(() => {
    return filteredTokens
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
  }, [filteredTokens, searchTerm, hideZeroBalance]);

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
          {propTokenListLoading ? (
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
                handleTokenSelect={handleTokenSelect}
              />
            ))
          )}
        </div>
      </Modal.Body>
    </Modal>
  );
};

interface TokenListItemProps {
  token: TokenInfo;
  handleTokenSelect: (symbol: string) => void;
}

const TokenListItem = ({ token, handleTokenSelect }: TokenListItemProps) => {
  const { address: accountAddress } = useAccount();
  const chainId = useChainId();

  // 获取代币信息（符号、名称、小数位数）
  const tokenSymbolData = useReadContract({
    address: token.address as `0x${string}`,
    abi: ERC20_ABI,
    functionName: "symbol",
    chainId: chainId,
    query: {
      enabled:
        !!token.address &&
        !token.isNative &&
        token.address !== "0x0000000000000000000000000000000000000000",
    },
  });

  const tokenNameData = useReadContract({
    address: token.address as `0x${string}`,
    abi: ERC20_ABI,
    functionName: "name",
    chainId: chainId,
    query: {
      enabled:
        !!token.address &&
        !token.isNative &&
        token.address !== "0x0000000000000000000000000000000000000000",
    },
  });

  const tokenDecimalsData = useReadContract({
    address: token.address as `0x${string}`,
    abi: ERC20_ABI,
    functionName: "decimals",
    chainId: chainId,
    query: {
      enabled:
        !!token.address &&
        !token.isNative &&
        token.address !== "0x0000000000000000000000000000000000000000",
    },
  });

  const tokenBalanceData = useReadContract({
    address: token.address as `0x${string}`,
    abi: ERC20_ABI,
    functionName: "balanceOf",
    args: accountAddress ? [accountAddress] : undefined,
    chainId: chainId,
    query: {
      enabled:
        !!accountAddress &&
        !!token.address &&
        !token.isNative &&
        token.address !== "0x0000000000000000000000000000000000000000",
      refetchInterval: 10000,
    },
  });

  // 构建完整的代币信息
  const tokenInfo = React.useMemo(() => {
    if (token.isNative) {
      return token; // 原生代币信息已经完整
    }

    const symbol = (tokenSymbolData.data as string) || "";
    const name = (tokenNameData.data as string) || "";
    const decimals = Number(tokenDecimalsData.data) || 18;
    const balance = tokenBalanceData.data
      ? (Number(tokenBalanceData.data) / Math.pow(10, decimals)).toFixed(4)
      : "0.0000";

      return {
        ...token,
        symbol,
        name,
        decimals,
        balance,
        icon: TOKEN_ICONS[symbol] || "fa-circle",
      };
  }, [
    token,
    tokenSymbolData.data,
    tokenNameData.data,
    tokenDecimalsData.data,
    tokenBalanceData.data,
  ]);

  const handleClick = () => {
    if (parseFloat(tokenInfo.balance || "0") > 0) {
      handleTokenSelect(tokenInfo.symbol);
    }
  };

  return (
    <div
      className={`token-list-item ${
        parseFloat(tokenInfo.balance || "0") === 0 ? "disabled" : ""
      }`}
      onClick={handleClick}
    >
      <div className="token-icon-container">
        <Image
          src={"/icons/tokens/" + tokenInfo.symbol + ".svg"}
          alt={tokenInfo.symbol}
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
          <i className="fa fa-hand-paper givbacks-icon"></i>
        </div>
      </div>
      <div className="token-info">
        <div className="token-symbol">{tokenInfo.symbol}</div>
        <div className="token-name">{tokenInfo.name}</div>
      </div>
      <div className="token-balance">{tokenInfo.balance}</div>
    </div>
  );
};

export default ModalSelect;
