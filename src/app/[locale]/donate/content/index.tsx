"use client";
import React from "react";
import "./style.scss";
import { useTokenPrices } from "@/hooks/useTokenPrices";
import { useDonationForm } from "@/hooks/useDonationForm";
import { useAccount, useChainId } from "wagmi";
import { queryWhiteTokenList } from "@/service/contract";
import { useFundPoolManager } from "@/hooks/useFundPoolManager";
import ModalSelect from "../modal-select";
import { useConnectModal } from "@rainbow-me/rainbowkit";
import { formatCurrency } from "@/utils/currency";
import { toast } from "react-toastify";
import Image from "next/image";

interface ContentProps {
  uid: string;
  name: string;
}

const Content = ({ uid, name }: ContentProps) => {
  const chainId = useChainId();
  const [showTokenModal, setShowTokenModal] = React.useState(false);
  const { donateToken } = useFundPoolManager();
  const { isConnected } = useAccount();
  const { openConnectModal } = useConnectModal();
  const { tokenPrices, calculateUSDValue } = useTokenPrices();
  const [tokenListLoading, setTokenListLoading] = React.useState(false);
  const [whiteTokenList, setWhiteTokenList] = React.useState<string[]>([]);
  const { address } = useAccount();

  // 使用新的token列表hook

  const { formState, handleTokenSelect, handleAmountChange } =
    useDonationForm();

  // 解构formState
  const { selectedToken, amount, searchTerm, hideZeroBalance } = formState;

  // 代币列表现在通过ModalSelect组件处理

  const getWhiteTokenList = async () => {
    try {
      setTokenListLoading(true);
      const response = await queryWhiteTokenList();
      if(response.ok) {
        setWhiteTokenList(response.data || []);
      }
    } catch (error) {
      console.error("获取白名单token列表失败:", error);
    } finally {
      setTokenListLoading(false);
    }
  };

  React.useEffect(() => {
    if (isConnected && chainId) {
      getWhiteTokenList();
    }
  }, [isConnected, chainId]);

  const targetTokenList = React.useMemo(() => {
    if (whiteTokenList.length > 0) {
      return whiteTokenList.map((item) => ({ address: item }));
    }
    return [];
  }, [whiteTokenList]);

  React.useEffect(() => {
    getWhiteTokenList();
  }, []);

  const handleConnectWallet = async () => {
    if (isConnected) {
      // 处理捐赠逻辑
      try {
        if (selectedToken) {
          const result = await donateToken(uid, selectedToken.address!, amount);
          if (result) {
            toast.success("Donation successful");
          } else {
            toast.error("Donation failed");
          }
        }
      } catch (error) {
        console.error("Donation failed:", error);
        toast.error("Donation failed");
      }

      console.log("Processing donation...");
    } else {
      openConnectModal?.();
    }
  };

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
                    {/* <i className="fa fa-wallet wallet-icon"></i> */}
                    <span className="wallet-text">
                      {isConnected
                        ? `${address}`
                        : "Please connect your wallet"}
                    </span>
                  </div>
                  <div className="project-id-field">
                    <span className="project-text">
                      Project: {decodeURIComponent(name)} <br></br>
                      
                    </span>
                  </div>
                  <div className="project-id-field">
                    <span className="project-text">
  
                      ID: {uid}
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
                          setShowTokenModal(true);
                        }
                      }}
                    >
                      <div className="selected-token-display">
                        {selectedToken && selectedToken.symbol ? (
                          <Image
                            src={`/icons/tokens/${selectedToken.symbol}.svg`}
                            alt={selectedToken.symbol}
                            width={20}
                            height={20}
                            className="selected-token-icon"
                          />
                        ) : null}
                        <span className="token-label">
                          {selectedToken?.symbol || "Select Token"}
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
                          {selectedToken ? `1 ${selectedToken.symbol} = ` : ""}
                          {formatCurrency(
                            tokenPrices[selectedToken?.symbol || ""] || 0
                          )}
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
                        ? `$${calculateUSDValue(amount, selectedToken.symbol)}`
                        : "---"}
                    </span>
                  </div>
                </div>

                {/* 连接钱包按钮 */}
                <div className="connect-wallet-section">
                  <button
                    className="connect-wallet-btn"
                    onClick={handleConnectWallet}
                    disabled={isConnected ? !selectedToken || !amount : false}
                  >
                    {isConnected ? "Donate Now" : "Connect Wallet"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <ModalSelect
        showTokenModal={showTokenModal}
        changeModalState={setShowTokenModal}
        handleTokenSelect={handleTokenSelect}
        searchTerm={searchTerm}
        hideZeroBalance={hideZeroBalance}
        tokenList={targetTokenList}
        propTokenListLoading={tokenListLoading}
      ></ModalSelect>
    </div>
  );
};

export default Content;
