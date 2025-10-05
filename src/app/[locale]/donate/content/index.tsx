"use client";
import React from "react";
import "./style.scss";
import { useTokenPrices } from "@/hooks/useTokenPrices";
import { useTokenBalances } from "@/hooks/useTokenBalances";
import { useDonationForm } from "@/hooks/useDonationForm";
import { useTokenList } from "@/hooks/useTokenList";
import { useAccount, useBalance, useChainId } from "wagmi";
import { queryWhiteTokenList } from "@/service/contract";
import { useFundPoolManager } from "@/hooks/useFundPoolManager";
import ModalSelect from "../modal-select";

interface ContentProps {
  uid: string;
  name: string;
}

const Content = ({ uid, name }: ContentProps) => {
  const chainId = useChainId();
  const [showTokenModal, setShowTokenModal] = React.useState(false);
  const { getAllowedTokens } = useFundPoolManager();
  const { tokenPrices, calculateUSDValue } = useTokenPrices();
  const { tokenBalances, isConnected } = useTokenBalances();
  const [whiteTokenList, setWhiteTokenList] = React.useState<string[]>([]);
  const [allowedTokens, setAllowedTokens] = React.useState<string[]>([]);
  const { address } = useAccount();

  const result = useBalance({
    address,
    chainId,
  });

  console.log(result, "result123");

  // 使用新的token列表hook
  const { loading: tokenListLoading } = useTokenList(
    whiteTokenList,
    allowedTokens,
    tokenBalances
  );
  const {
    formState,
    handleTokenSelect,
    handleAmountChange,
    handleConnectWallet,
  } = useDonationForm();

  // 解构formState
  const { selectedToken, amount, searchTerm, hideZeroBalance } = formState;

  // 代币列表现在通过ModalSelect组件处理

  const getWhiteTokenList = async () => {
    try {
      const response = await queryWhiteTokenList();
      console.log(response, "白名单token地址列表");
      setWhiteTokenList(response.data || []);
    } catch (error) {
      console.error("获取白名单token列表失败:", error);
    }
  };

  const queryAllowedTokens = React.useCallback(async () => {
    try {
      const response = await getAllowedTokens();
      setAllowedTokens(response || []);
    } catch (error) {
      console.error("获取允许的token列表失败:", error);
    }
  }, [getAllowedTokens]);

  React.useEffect(() => {
    if (isConnected && chainId) {
      queryAllowedTokens();
    }
  }, [isConnected, chainId, queryAllowedTokens]);

  const targetTokenList = React.useMemo(() => {
    const res = allowedTokens.filter((token) => whiteTokenList.includes(token));
    if (res.length > 0) {
      return res.map(item => ({address: item}));
    }
    return [];
  }, [allowedTokens, whiteTokenList]);

  React.useEffect(() => {
    getWhiteTokenList();
  }, []);

  console.log(targetTokenList, "targetTokenList");

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
        tokenListLoading={tokenListLoading}
        tokenList={targetTokenList}
      ></ModalSelect>
    </div>
  );
};

export default Content;
