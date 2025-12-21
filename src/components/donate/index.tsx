"use client";
import React from "react";
import { motion } from "framer-motion";
import { useTranslations } from 'next-intl';
import { useTokenPrices } from "@/hooks/useTokenPrices";
import { useDonationForm } from "@/hooks/useDonationForm";
import { useAccount, useChainId } from "wagmi";
import { queryWhiteTokenList } from "@/service/contract";
import { useFundPoolManager } from "@/hooks/useFundPoolManager";
import TokenSelect from "./TokenSelect";
import { useConnectModal } from "@rainbow-me/rainbowkit";
import { formatCurrency } from "@/utils/currency";
import { toast } from "react-toastify";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";

interface DonateProps {
  uid: string;
  name: string;
}

const Donate = ({ uid, name }: DonateProps) => {
  const t = useTranslations('donate');
  const tCommon = useTranslations('common');
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
  const { formState, handleTokenSelect, handleAmountChange } = useDonationForm();

  const { selectedToken, amount, searchTerm, hideZeroBalance } = formState;

  const getWhiteTokenList = React.useCallback(async () => {
    try {
      setTokenListLoading(true);
      const response = await queryWhiteTokenList();
      if (response.ok && response.data) {
        // 确保返回的是数组格式
        const tokenList = Array.isArray(response.data) ? response.data : [];
        setWhiteTokenList(tokenList);
        console.log('White token list loaded:', tokenList);
      } else {
        console.warn('Failed to load white token list:', response.msg || 'Unknown error');
        setWhiteTokenList([]);
      }
    } catch (error) {
      console.error('Error loading white token list:', error);
      setWhiteTokenList([]);
    } finally {
      setTokenListLoading(false);
    }
  }, []);

  React.useEffect(() => {
    if (isConnected && chainId) {
      getWhiteTokenList();
    } else {
      // 如果未连接钱包，清空列表
      setWhiteTokenList([]);
    }
  }, [isConnected, chainId, getWhiteTokenList]);

  const targetTokenList = React.useMemo(() => {
    if (whiteTokenList.length > 0) {
      return whiteTokenList
        .filter((item) => item && typeof item === 'string' && item.trim() !== '')
        .map((item) => ({ address: item.trim() }));
    }
    return [];
  }, [whiteTokenList]);

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
        toast.error(tCommon('validation.pleaseSelectToken'));
        return;
      }
      
      if (!amount || parseFloat(amount) <= 0) {
        toast.error(tCommon('validation.pleaseEnterAmount'));
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
          toast.success(tCommon('success.donationSuccess'));
          // 重置表单
          handleAmountChange({ target: { value: "" } } as React.ChangeEvent<HTMLInputElement>);
        } else {
          toast.error(tCommon('errors.donationFailed'));
        }
      } catch (error: any) {
        console.error("Donation failed:", error);
        
        // 根据错误类型显示不同的错误信息
        let errorMessage = tCommon('errors.donationFailed');
        if (error.message?.includes("user rejected")) {
          errorMessage = tCommon('errors.transactionCancelled');
        } else if (error.message?.includes("insufficient funds")) {
          errorMessage = tCommon('errors.insufficientFunds');
        } else if (error.message?.includes("gas")) {
          errorMessage = tCommon('errors.gasIssue');
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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>

      <div className="relative z-10 flex items-center justify-center min-h-screen px-4 py-32">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="w-full max-w-md"
        >
          {/* Header Section */}
          <div className="text-center mb-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 backdrop-blur-sm border border-white/10 rounded-full mb-6"
            >
              <div className="w-2 h-2 bg-pink-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium text-white/80">{t('badge')}</span>
            </motion.div>
            
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="text-4xl md:text-5xl font-bold text-white mb-4"
            >
              {t('title')}  
              <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                {t('titleHighlight')}
              </span>
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="text-lg text-white/70 max-w-md mx-auto"
            >
              {t('subtitle')}
            </motion.p>
          </div>

          {/* Donation Form */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-2xl"
          >
            {/* Project Info */}
            <div className="mb-6 space-y-4">
              {/* Project Name */}
              <div className="flex items-center gap-4 p-5 bg-white/5 rounded-xl border border-white/10 hover:bg-white/10 transition-colors">
                <div className="w-14 h-14 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center flex-shrink-0 shadow-lg">
                  <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2H4zm2 6a2 2 0 114 0 2 2 0 01-4 0zm8 0a2 2 0 114 0 2 2 0 01-4 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                    <p className="!text-sm !font-semibold !text-white !uppercase !tracking-wide">{t('projectName')}</p>
                  </div>
                  <p className="text-white font-semibold text-lg break-words leading-relaxed">{decodeURIComponent(name)}</p>
                </div>
              </div>
              
              {/* Project ID */}
              <div className="flex items-center gap-4 p-5 bg-white/5 rounded-xl border border-white/10 hover:bg-white/10 transition-colors">
                <div className="w-14 h-14 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center flex-shrink-0 shadow-lg">
                  <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                    <p className="!text-sm !font-semibold !text-white !uppercase !tracking-wide">{t('projectId')}</p>
                  </div>
                  <p className="text-white font-mono text-base break-all bg-white/5 px-3 py-2 rounded-lg border border-white/10">{uid}</p>
                </div>
              </div>
            </div>

            {/* Wallet Connection */}
            <div className="mb-6">
              <div className="flex items-center gap-4 p-5 bg-white/5 rounded-xl border border-white/10 hover:bg-white/10 transition-colors">
                <div className="w-14 h-14 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center flex-shrink-0 shadow-lg">
                  <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4zM18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" />
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-400' : 'bg-yellow-400'}`}></div>
                    <p className="!text-sm !font-semibold !text-white !uppercase !tracking-wide">{t('walletAddress')}</p>
                  </div>
                  <p className="text-white font-mono text-base break-all bg-white/5 px-3 py-2 rounded-lg border border-white/10">
                    {isConnected ? address : tCommon('validation.pleaseConnectWallet')}
                  </p>
                </div>
              </div>
            </div>

            {/* Token Selection */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-white/80 mb-3">{t('selectToken')}</label>
              <div className="flex items-center gap-3 p-4 bg-white/5 rounded-xl border border-white/10">
                <div
                  className={`flex items-center gap-3 flex-1 cursor-pointer ${
                    !isConnected ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                  onClick={() => {
                    if (isConnected) {
                      setShowTokenModal(true);
                    }
                  }}
                >
                  {selectedToken && selectedToken.symbol ? (
                    <Image
                      src={`/icons/tokens/${selectedToken.symbol}.svg`}
                      alt={selectedToken.symbol}
                      width={32}
                      height={32}
                      className="rounded-full"
                    />
                  ) : (
                    <div className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center">
                      <svg className="w-4 h-4 text-white/60" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                      </svg>
                    </div>
                  )}
                  <span className="text-white font-medium">
                    {selectedToken?.symbol || t('selectToken')}
                  </span>
                </div>
                <svg className="w-5 h-5 text-white/60" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </div>
            </div>

            {/* Amount Input */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-white/80 mb-3">{t('amount')}</label>
              <div className="relative">
                <input
                  type="number"
                  className="w-full p-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
                  placeholder="0.00"
                  value={amount}
                  onChange={handleAmountChange}
                  disabled={!isConnected || !selectedToken || isProcessing}
                  min="0"
                  step="0.000001"
                />
                {amount && parseFloat(amount) <= 0 && (
                  <p className="mt-2 text-sm text-red-400">{tCommon('validation.pleaseEnterAmount')}</p>
                )}
              </div>
              {selectedToken && (
                <p className="mt-2 text-sm text-white/60">
                  1 {selectedToken.symbol} = {formatCurrency(tokenPrices[selectedToken.symbol] || 0)}
                </p>
              )}
            </div>

            {/* Total Donation */}
            <div className="mb-8">
              <div className="flex justify-between items-center p-4 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-xl border border-purple-500/20">
                <span className="text-white/80 font-medium">{t('totalDonation')}</span>
                <span className="text-white font-bold text-lg">
                  {amount && selectedToken
                    ? `$${calculateUSDValue(amount, selectedToken.symbol)}`
                    : "---"}
                </span>
              </div>
            </div>

            {/* Donate Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`w-full py-4 px-6 rounded-xl font-semibold text-lg transition-all duration-300 ${
                isProcessing
                  ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30 cursor-not-allowed'
                  : donationSuccess
                  ? 'bg-green-500/20 text-green-400 border border-green-500/30 cursor-default'
                  : isConnected && selectedToken && amount && parseFloat(amount) > 0
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white shadow-lg hover:shadow-purple-500/25'
                  : 'bg-white/10 text-white/60 border border-white/20 cursor-not-allowed'
              }`}
              onClick={handleConnectWallet}
              disabled={isProcessing || donationLoading || (isConnected && (!selectedToken || !amount || parseFloat(amount) <= 0))}
            >
              {isProcessing || donationLoading ? (
                <div className="flex items-center justify-center gap-2">
                  <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  {tCommon('actions.processing')}
                </div>
              ) : donationSuccess ? (
                <div className="flex items-center justify-center gap-2">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  {t('donationSuccessful')}
                </div>
              ) : isConnected ? (
                tCommon('actions.donateNow')
              ) : (
                tCommon('actions.connectWallet')
              )}
            </motion.button>
          </motion.div>
        </motion.div>
      </div>

      <TokenSelect
        isOpen={showTokenModal}
        onClose={() => setShowTokenModal(false)}
        onSelect={handleTokenSelect}
        tokenList={targetTokenList}
        isLoading={tokenListLoading}
        searchTerm={searchTerm}
        hideZeroBalance={hideZeroBalance}
      />
    </div>
  );
};

export default Donate;
