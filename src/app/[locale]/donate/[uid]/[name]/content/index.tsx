"use client";
import React from "react";
import { motion } from "framer-motion";
import { useTranslations } from 'next-intl';
import { useTokenPrices } from "@/hooks/useTokenPrices";
import { useDonationForm } from "@/hooks/useDonationForm";
import { useAccount, useChainId } from "wagmi";
import { queryWhiteTokenList } from "@/service/contract";
import { useFundPoolManager } from "@/hooks/useDonationContract";
import TokenSelect from "./TokenSelect";
import { useConnectModal } from "@rainbow-me/rainbowkit";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import { currencyInfo } from "@/service/common";
import { useDebounce } from "@/hooks/useDebounce";
import { ProjectInfo } from "./components/ProjectInfo";
import { TokenSelection } from "./components/TokenSelection";
import { AmountInput } from "./components/AmountInput";
import { RewardDisplay } from "./components/RewardDisplay";
import { TotalDonation } from "./components/TotalDonation";
import { DonateButton } from "./components/DonateButton";
import BigNumber from "bignumber.js";

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
  const [selectedQuickAmount, setSelectedQuickAmount] = React.useState<number | null>(null);
  const [rewardInfo, setRewardInfo] = React.useState<{ address: string; symbol: string; value: number } | null>(null);
  const [isLoadingReward, setIsLoadingReward] = React.useState(false);

  const { selectedToken, amount, searchTerm, hideZeroBalance } = formState;

  // 快速金额选项
  const quickAmounts = [10, 20, 50, 100, 200, 500];

  // 处理快速金额选择
  const handleQuickAmountSelect = (value: number) => {
    setSelectedQuickAmount(value);
    handleAmountChange({ target: { value: value.toString() } } as React.ChangeEvent<HTMLInputElement>);
  };

  // 使用防抖处理金额和代币选择
  const debouncedAmount = useDebounce(amount, 800);
  const debouncedToken = useDebounce(selectedToken, 300);

  // 调用 currencyInfo 接口进行奖励计算
  const fetchRewardInfo = React.useCallback(async () => {
    if (!debouncedToken || !debouncedAmount || parseFloat(debouncedAmount) <= 0) {
      setRewardInfo(null);
      return;
    }

    try {
      setIsLoadingReward(true);
      const response = await currencyInfo();
      if (response.ok && response.data) {
        setRewardInfo(response.data);
      } else {
        setRewardInfo(null);
      }
    } catch (error) {
      setRewardInfo(null);
    } finally {
      setIsLoadingReward(false);
    }
  }, [debouncedToken, debouncedAmount]);

  // 当防抖后的代币或金额变化时，调用接口计算奖励
  React.useEffect(() => {
    fetchRewardInfo();
  }, [fetchRewardInfo]);

  // 当输入框值变化时，如果不在快速金额列表中，清除选中状态
  React.useEffect(() => {
    const currentAmount = parseFloat(amount);
    if (selectedQuickAmount !== null && currentAmount !== selectedQuickAmount) {
      setSelectedQuickAmount(null);
    }
  }, [amount, selectedQuickAmount]);

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

      // 检查余额是否足够
      if (selectedToken.balance) {
        const balanceBN = new BigNumber(selectedToken.balance);
        const amountBN = new BigNumber(amount);
        
        if (amountBN.isGreaterThan(balanceBN)) {
          toast.error(`Insufficient balance. Maximum: ${balanceBN.toFixed()} ${selectedToken.symbol}`);
          return;
        }
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
    <div className="min-h-screen bg-linear-to-br from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>

      <div className="relative z-10 flex items-center justify-center min-h-screen px-4 py-62">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="w-full max-w-lg"
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
              <span className="bg-linear-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
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
            <ProjectInfo uid={uid} name={name} />

            {/* Wallet Connection */}
            {/* <div className="mb-6">
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
            </div> */}

            {/* Token Selection */}
            <TokenSelection
              selectedToken={selectedToken}
              isConnected={isConnected}
              onSelectClick={() => {
                if (isConnected) {
                  setShowTokenModal(true);
                }
              }}
            />

            {/* Amount Input */}
            <AmountInput
              selectedToken={selectedToken}
              amount={amount}
              selectedQuickAmount={selectedQuickAmount}
              quickAmounts={quickAmounts}
              isConnected={isConnected}
              isProcessing={isProcessing}
              tokenPrices={tokenPrices}
              onAmountChange={handleAmountChange}
              onQuickAmountSelect={handleQuickAmountSelect}
            />

            {/* Donation Ranking & Token Reward */}
            <RewardDisplay
              amount={amount}
              selectedToken={selectedToken}
              rewardInfo={rewardInfo}
              isLoadingReward={isLoadingReward}
              calculateUSDValue={calculateUSDValue}
            />

            {/* Total Donation */}
            <TotalDonation
              amount={amount}
              selectedToken={selectedToken}
              calculateUSDValue={calculateUSDValue}
            />

            {/* Donate Button */}
            <DonateButton
              isConnected={isConnected}
              isProcessing={isProcessing}
              donationLoading={donationLoading}
              donationSuccess={donationSuccess}
              selectedToken={selectedToken}
              amount={amount}
              onClick={handleConnectWallet}
            />
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
