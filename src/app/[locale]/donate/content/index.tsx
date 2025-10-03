"use client";
import React from "react";
import { Modal, Form } from "react-bootstrap";
import Image from "next/image";
import "./style.scss";
import { useTokenPrices } from "@/hooks/useTokenPrices";
import { useTokenBalances } from "@/hooks/useTokenBalances";
import { useChainInfo } from "@/hooks/useChainInfo";
import { useDonationForm } from "@/hooks/useDonationForm";
import { useAccount } from "wagmi";

const Content = () => {
  // 使用自定义hooks
  const { tokenPrices, calculateUSDValue } = useTokenPrices();
  const { tokenBalances, isConnected } = useTokenBalances();
  const {address} = useAccount();
  const { currentChain } = useChainInfo();
  const {
    formState,
    handleTokenSelect,
    handleAmountChange,
    handleConnectWallet,
    updateFormState
  } = useDonationForm();

  // 解构formState
  const { selectedToken, amount, showTokenModal, searchTerm, hideZeroBalance } = formState;

  const tokens = [
    {
      symbol: "ETH",
      name: "Ethereum",
      icon:  "fa-ethereum",
      balance: tokenBalances.ETH || "0.0000",
    },
    {
      symbol: "USDC",
      name: "USD Coin",
      icon:   "fa-circle",
      balance: tokenBalances.USDC || "0.0000",
    },
    {
      symbol: "USDT",
      name: "Tether",
      icon:  "fa-circle",
      balance: tokenBalances.USDT || "0.0000",
    },
    {
      symbol: "DAI",
      name: "Dai Stablecoin",
      icon:  "fa-circle",
      balance: tokenBalances.DAI || "0.0000",
    },
    {
      symbol: "AAVE",
      name: "Aave",
      icon:  "fa-circle",
      balance: tokenBalances.AAVE || "0.0000",
    },
    {
      symbol: "LINK",
      name: "ChainLink Token",
      icon:  "fa-circle",
      balance: tokenBalances.LINK || "0.0000",
    },
    {
      symbol: "UNI",
      name: "Uniswap",
      icon:  "fa-circle",
      balance: tokenBalances.UNI || "0.0000",
    },
    {
      symbol: "WBTC",
      name: "Wrapped Bitcoin",
      icon:  "fa-circle",
      balance: tokenBalances.WBTC || "0.0000",
    },
  ];

  const filteredTokens = tokens.filter((token) => {
    const matchesSearch =
      token.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
      token.name.toLowerCase().includes(searchTerm.toLowerCase());
    const hasBalance = !hideZeroBalance || parseFloat(token.balance) > 0;
    return matchesSearch && hasBalance;
  });

  return (
    <div className="wpo-donation-page-area section-padding">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-6 col-md-8 col-12">
            <div className="crypto-donation-form">
              <div className="form-header">
                <h2>Enter your donation</h2>
              </div>

              <div className="form-content">
                {/* 钱包连接区域 */}
                <div className="wallet-connect-section">
                  <div className="wallet-connect-field">
                    <i className="fa fa-wallet wallet-icon"></i>
                    <span className="wallet-text">
                      {isConnected
                        ? `${address}`
                        : "Please connect your wallet"}
                    </span>
                  </div>
                </div>

                {/* 代币选择区域 */}
                <div className="token-selection-section">
                  <div className="token-input-container">
                    <div
                      className={
                        isConnected
                          ? "token-selector"
                          : "token-selector disabled"
                      }
                      onClick={() => {
                        if (isConnected) {
                          updateFormState({ showTokenModal: true });
                        }
                      }}
                    >
                      <div className="selected-token-display">
                        {/* {selectedToken && tokenIcons[selectedToken] ? (
                          <Image
                            src={tokenIcons[selectedToken]}
                            alt={selectedToken}
                            width={20}
                            height={20}
                            className="selected-token-icon"
                          />
                        ) : null} */}
                        <span className="token-label">
                          {selectedToken || "Select Token"}
                        </span>
                      </div>
                      <i className="fa fa-chevron-down dropdown-icon"></i>
                    </div>
                    <div className="amount-input-container">
                      <input
                        type="number"
                        className="amount-input"
                        placeholder="0"
                        value={amount}
                        onChange={handleAmountChange}
                        disabled={!isConnected || !selectedToken}
                      />
                    </div>
                    <div className="usd-value-container">
                      {
                        <span className="token-price">
                          {selectedToken ? `1 ${selectedToken} = ` : ""}$
                          {(tokenPrices[selectedToken] || 0).toFixed(2)}
                        </span>
                      }
                    </div>
                  </div>
                </div>

                {/* 总捐赠显示 */}
                <div className="total-donation-section">
                  <div className="total-donation-field">
                    <span className="total-label">Your total donation</span>
                    <span className="total-value">
                      {amount && selectedToken
                        ? `$${calculateUSDValue(amount, selectedToken)}`
                        : "---"}
                    </span>
                  </div>
                </div>

                {/* 连接钱包按钮 */}
                <div className="connect-wallet-section">
                  <button
                    className="connect-wallet-btn"
                    onClick={handleConnectWallet}
                    disabled={isConnected ? (!selectedToken || !amount) : false}
                  >
                    {isConnected ? "Donate Now" : "Connect Wallet"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 代币选择Modal */}
      <Modal
        show={showTokenModal}
        onHide={() => updateFormState({ showTokenModal: false })}
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
              onChange={(e) => updateFormState({ searchTerm: e.target.value })}
              className="token-search-input"
            />
          </div>

          {/* 隐藏零余额选项 */}
          <div className="hide-zero-balance-section">
            <Form.Check
              type="checkbox"
              label="Hide 0 balance tokens"
              checked={hideZeroBalance}
              onChange={(e) => updateFormState({ hideZeroBalance: e.target.checked })}
              className="hide-zero-checkbox"
            />
          </div>

          {/* 代币列表 */}
          <div className="token-list-section">
            {filteredTokens.map((token) => (
              <div
                key={token.symbol}
                className={`token-list-item ${parseFloat(token.balance) === 0 ? "disabled" : ""}`}
                onClick={() => {
                  if (parseFloat(token.balance) > 0) {
                    handleTokenSelect(token.symbol);
                  }
                }}
              >
                <div className="token-icon-container">
                  {token.icon.startsWith("http") ? (
                    <Image
                      src={token.icon}
                      alt={token.symbol}
                      width={32}
                      height={32}
                      className="token-list-icon-img"
                      onError={(e) => {
                        // 如果图片加载失败，回退到Font Awesome图标
                        const target = e.target as HTMLImageElement;
                        target.style.display = "none";
                        const fallbackIcon =
                          target.nextElementSibling as HTMLElement;
                        if (fallbackIcon) {
                          fallbackIcon.style.display = "flex";
                        }
                      }}
                    />
                  ) : null}
                  <i
                    className={`fa ${token.icon} token-list-icon`}
                    style={{
                      display: token.icon.startsWith("http") ? "none" : "flex",
                    }}
                  ></i>
                  <div className="givbacks-indicator">
                    <i className="fa fa-hand-paper givbacks-icon"></i>
                  </div>
                </div>
                <div className="token-info">
                  <div className="token-symbol">{token.symbol}</div>
                  <div className="token-name">{token.name}</div>
                </div>
                <div className="token-balance">{token.balance}</div>
              </div>
            ))}
          </div>
        </Modal.Body>
        {/* <Modal.Footer className="token-modal-footer">
          <div className="givbacks-info">
            <i className="fa fa-hand-paper givbacks-icon"></i>
            <span>GIVbacks eligible tokens</span>
          </div>
        </Modal.Footer> */}
      </Modal>
    </div>
  );
};

export default Content;