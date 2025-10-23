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
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";

interface ContentProps {
  uid: string;
  name: string;
}

const Content = ({ uid, name }: ContentProps) => {
  const chainId = useChainId();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [showTokenModal, setShowTokenModal] = React.useState(false);
  const { donateToken, donate, isLoading: donationLoading } = useFundPoolManager();
  const { isConnected } = useAccount();
  const { openConnectModal } = useConnectModal();
  const { tokenPrices, calculateUSDValue } = useTokenPrices();
  const [tokenListLoading, setTokenListLoading] = React.useState(false);
  const [whiteTokenList, setWhiteTokenList] = React.useState<string[]>([]);
  const { address } = useAccount();
  const [isProcessing, setIsProcessing] = React.useState(false);
  const [donationSuccess, setDonationSuccess] = React.useState(false);
  const { formState, handleTokenSelect, handleAmountChange } =
    useDonationForm();

  const { selectedToken, amount, searchTerm, hideZeroBalance } = formState;

  const getWhiteTokenList = async () => {
    try {
      setTokenListLoading(true);
      const response = await queryWhiteTokenList();
      if(response.ok) {
        setWhiteTokenList(response.data || []);
      }
    } catch (error) {
      console.error(error);
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

  // 处理返回上一页的逻辑
  const handleReturnToPreviousPage = React.useCallback(() => {
    const returnUrl = searchParams.get('returnUrl');
    if (returnUrl) {
      router.push(returnUrl);
      return;
    }
    if (window.history.length > 1) {
      router.back();
    } else {
      router.push(`/project/${uid}`);
    }
  }, [searchParams, router, uid]);

  // 成功状态自动重置和返回上一页
  React.useEffect(() => {
    if (donationSuccess) {
      const timer = setTimeout(() => {
        setDonationSuccess(false);
        handleReturnToPreviousPage();
      }, 200);
      return () => clearTimeout(timer);
    }
  }, [donationSuccess, handleReturnToPreviousPage]);

  const handleConnectWallet = async () => {
    if (isConnected) {
      // 验证输入
      if (!selectedToken) {
        toast.error("Please select a token");
        return;
      }
      
      if (!amount || parseFloat(amount) <= 0) {
        toast.error("Please enter a valid amount");
        return;
      }

      // 处理捐赠逻辑
      try {
        setIsProcessing(true);
        setDonationSuccess(false);
        
        const result = selectedToken.isNative 
          ? (await donate(uid, amount)) 
          : (await donateToken(uid, selectedToken.address!, amount));
          
        if (result) {
          setDonationSuccess(true);
          toast.success("Donation successful! Thank you for your support.");
          // 重置表单
          handleAmountChange({ target: { value: "" } } as React.ChangeEvent<HTMLInputElement>);
        } else {
          toast.error("Donation failed. Please try again.");
        }
      } catch (error: any) {
        console.error("Donation failed:", error);
        
        // 根据错误类型显示不同的错误信息
        let errorMessage = "Donation failed. Please try again.";
        if (error.message?.includes("user rejected")) {
          errorMessage = "Transaction was cancelled by user";
        } else if (error.message?.includes("insufficient funds")) {
          errorMessage = "Insufficient balance for this transaction";
        } else if (error.message?.includes("gas")) {
          errorMessage = "Transaction failed due to gas issues";
        }
        
        toast.error(errorMessage);
      } finally {
        setIsProcessing(false);
      }
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
                        className={`amount-input ${amount && parseFloat(amount) <= 0 ? 'error' : ''}`}
                        placeholder="0"
                        value={amount}
                        onChange={handleAmountChange}
                        disabled={!isConnected || !selectedToken || isProcessing}
                        min="0"
                        step="0.000001"
                      />
                      {amount && parseFloat(amount) <= 0 && (
                        <div className="input-error-message">
                          Please enter a valid amount
                        </div>
                      )}
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
                    className={`connect-wallet-btn ${isProcessing ? 'processing' : ''} ${donationSuccess ? 'success' : ''}`}
                    onClick={handleConnectWallet}
                    disabled={isProcessing || donationLoading || (isConnected && (!selectedToken || !amount || parseFloat(amount) <= 0))}
                  >
                    {isProcessing || donationLoading ? (
                      <>
                        <i className="fa fa-spinner fa-spin"></i>
                        Processing...
                      </>
                    ) : donationSuccess ? (
                      <>
                        <i className="fa fa-check"></i>
                        Donation Successful!
                      </>
                    ) : isConnected ? (
                      "Donate Now"
                    ) : (
                      "Connect Wallet"
                    )}
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
