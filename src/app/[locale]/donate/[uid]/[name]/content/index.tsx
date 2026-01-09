"use client";
import React from "react";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { useTokenPrices } from "@/hooks/useTokenPrices";
import { TokenInfo } from "@/hooks/useDonationForm";
import { useAccount, useChainId } from "wagmi";
import { useDonationContract } from "@/hooks/useDonationContract";
import { getChainById } from "@/lib/chain-config";
import { useConnectModal } from "@rainbow-me/rainbowkit";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import { useDebounce } from "@/hooks/useDebounce";
import { ProjectInfo } from "./components/ProjectInfo";
import { TokenSelection } from "./components/TokenSelection";
import { AmountInput } from "./components/AmountInput";
import { RewardDisplay } from "./components/RewardDisplay";
import { TotalDonation } from "./components/TotalDonation";
import { DonateButton } from "./components/DonateButton";
import BigNumber from "bignumber.js";
import { useMasterContract } from "@/hooks/useMasterContract";
import { formatUnits, ethers } from "ethers";
import {
  queryProjectProportion,
  ProjectProportionData,
  projectDonateCompleted,
} from "@/service/project";

interface DonateProps {
  uid: string;
  name: string;
}

const Donate = ({ uid, name }: DonateProps) => {
  const t = useTranslations("donate");
  const tCommon = useTranslations("common");
  const router = useRouter();
  const searchParams = useSearchParams();
  const { donate, isLoading: donationLoading } = useDonationContract();
  const {
    calculateExchangeAmount,
    isLoading: isLoadingMasterContract,
    getEcosystemTokenDecimals,
    getEcosystemToken,
    getDonationToken,
    getDonationTokenDecimals,
  } = useMasterContract();
  const { isConnected, chain } = useAccount();
  const { openConnectModal } = useConnectModal();
  // const { calculateUSDValue } = useTokenPrices();
  const { address } = useAccount();
  const [isProcessing, setIsProcessing] = React.useState(false);
  const [donationSuccess, setDonationSuccess] = React.useState(false);

  // 本地状态管理
  const [amount, setAmount] = React.useState<string>("");
  const [selectedToken, setSelectedToken] = React.useState<TokenInfo | null>(
    null
  );
  const [selectedQuickAmount, setSelectedQuickAmount] = React.useState<
    number | null
  >(null);
  const [rewardAmount, setRewardAmount] = React.useState<string | null>(null);
  const [isLoadingReward, setIsLoadingReward] = React.useState(false);
  const [amountChanged, setAmountChanged] = React.useState(false);
  const [ecosystemTokenDecimals, setEcosystemTokenDecimals] = React.useState<
    number | null
  >(null);
  const [proportionData, setProportionData] =
    React.useState<ProjectProportionData | null>(null);

  // 处理USDT代币变化（支持null）
  const handleTokenChange = React.useCallback((token: TokenInfo | null) => {
    if (token) {
      setSelectedToken({ ...token });
    }
  }, []);

  // 处理金额变化
  const handleAmountChange = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newAmount = e.target.value;
      setAmount(newAmount);
      setAmountChanged(true);

      // 如果输入了有效金额，立即显示 loading 状态
      if (newAmount && parseFloat(newAmount) > 0) {
        setIsLoadingReward(true);
      } else {
        // 如果金额无效，清除数据
        setRewardAmount(null);
        setProportionData(null);
        setIsLoadingReward(false);
      }
    },
    []
  );

  // 快速金额选项
  const quickAmounts = [2, 5, 10, 50, 100, 200];

  // 处理快速金额选择
  const handleQuickAmountSelect = (value: number) => {
    setSelectedQuickAmount(value);
    setAmount(value.toString());
    setAmountChanged(true);
  };

  // 获取 ecosystemToken decimals
  React.useEffect(() => {
    const fetchDecimals = async () => {
      try {
        console.log("[fetchDecimals] 开始获取 decimals");
        const decimals = await getEcosystemTokenDecimals();
        const token = await getEcosystemToken();
        const donationToken = await getDonationToken();
        console.log(
          "[fetchDecimals] 获取到的 token:",
          token,
          "类型:",
          typeof token
        );
        console.log(
          "[fetchDecimals] 获取到的 donationToken:",
          donationToken,
          "类型:",
          typeof donationToken
        );
        console.log(
          "[fetchDecimals] 获取到的 decimals:",
          decimals,
          "类型:",
          typeof decimals
        );

        if (decimals && decimals > 0) {
          console.log("[fetchDecimals] 设置 decimals:", decimals);
          setEcosystemTokenDecimals(decimals);
        } else {
          console.warn("[fetchDecimals] decimals 无效:", decimals);
          // 如果返回 0，可能是合约未初始化，尝试重试
          const retryTimeout = setTimeout(() => {
            console.log("[fetchDecimals] 重试获取 decimals");
            fetchDecimals();
          }, 2000);
          return () => clearTimeout(retryTimeout);
        }
      } catch (error) {
        console.error(
          "[fetchDecimals] 获取 ecosystemToken decimals 失败:",
          error
        );
      }
    };

    // 延迟执行，确保合约实例已初始化
    const timeout = setTimeout(() => {
      fetchDecimals();
    }, 100);

    return () => clearTimeout(timeout);
  }, [getEcosystemTokenDecimals]);

  // 使用防抖处理金额
  const debouncedAmount = useDebounce(amount, 800);

  // 同时获取奖励金额和项目比例数据（使用 Promise.all）
  const fetchRewardAndProportion = React.useCallback(
    async (amountToFetch: string) => {
      // 如果没有有效的金额，清除数据并返回
      if (!amountToFetch || parseFloat(amountToFetch) <= 0) {
        setRewardAmount(null);
        setProportionData(null);
        setAmountChanged(false);
        setIsLoadingReward(false);
        return;
      }

      // 如果 ecosystemTokenDecimals 还未获取，保持 loading 状态，等待 decimals 获取完成
      if (!ecosystemTokenDecimals) {
        // 保持 loading 状态，不执行计算
        return;
      }

      try {
        // 确保 loading 状态已设置（可能在 handleAmountChange 中已设置）
        setIsLoadingReward(true);

        // 使用 Promise.all 同时调用两个接口
        const [exchangeResult, proportionResponse] = await Promise.all([
          calculateExchangeAmount(amountToFetch, 18),
          queryProjectProportion(uid, amountToFetch),
        ]);

        // 处理奖励金额
        //TODO 美金精度暂时
        const rewardValue = formatUnits(exchangeResult, 18);
        setRewardAmount(rewardValue);

        // 处理比例数据
        if (proportionResponse.ok) {
          setProportionData(proportionResponse.data);
        } else {
          setProportionData(null);
        }
      } catch (error) {
        console.error("获取奖励和比例数据失败:", error);
        setRewardAmount(null);
        setProportionData(null);
      } finally {
        setIsLoadingReward(false);
        setAmountChanged(false);
      }
    },
    [calculateExchangeAmount, uid]
  );

  // 当防抖后的金额变化或 ecosystemTokenDecimals 获取完成时，获取数据
  React.useEffect(() => {
    fetchRewardAndProportion(debouncedAmount);
  }, [fetchRewardAndProportion, debouncedAmount]);

  // 当输入框值变化时，如果不在快速金额列表中，清除选中状态
  React.useEffect(() => {
    const currentAmount = parseFloat(amount);
    if (selectedQuickAmount !== null && currentAmount !== selectedQuickAmount) {
      setSelectedQuickAmount(null);
    }
  }, [amount, selectedQuickAmount]);

  // 当链切换时重置表单
  const chainId = useChainId();
  const prevChainIdRef = React.useRef<number | undefined>(undefined);
  React.useEffect(() => {
    // 只在chainId真正变化时重置（不是初始化时）
    if (
      prevChainIdRef.current !== undefined &&
      prevChainIdRef.current !== chainId
    ) {
      setAmount("");
      setSelectedToken(null);
      setSelectedQuickAmount(null);
      setRewardAmount(null);
      setAmountChanged(false);
    }
    prevChainIdRef.current = chainId;
  }, [chainId]);

  // 处理返回上一页的逻辑
  const handleReturnToPreviousPage = React.useCallback(() => {
    const returnUrl = searchParams.get("returnUrl");
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
      if (!amount || parseFloat(amount) <= 0) {
        toast.error(tCommon("validation.pleaseEnterAmount"));
        return;
      }

      // 检查余额是否足够
      if (selectedToken?.balance) {
        const balanceBN = new BigNumber(selectedToken.balance);
        const amountBN = new BigNumber(amount);

        if (amountBN.isGreaterThan(balanceBN)) {
          toast.error(
            tCommon("validation.insufficientBalanceMax", {
              max: balanceBN.toFixed(),
            })
          );
          return;
        }
      }

      // 链ID验证和提示 - 在交易前明确显示当前连接的链信息
      const expectedChainId = Number(process.env.NEXT_PUBLIC_DEFAULT_CHAIN_ID);

      // 验证当前链ID是否与预期链ID一致
      if (chainId !== expectedChainId) {
        const currentChainInfo = chain || getChainById(chainId);
        const expectedChainInfo = getChainById(expectedChainId);
        toast.error(
          tCommon("wallet.wrongNetworkMessage", {
            expectedName: expectedChainInfo.name,
            expectedId: expectedChainId,
            currentName: currentChainInfo.name,
            currentId: chainId,
          }),
          {
            autoClose: 5000,
          }
        );
        return;
      }

      // 显示当前链信息（仅在链ID正确时）
      const chainInfo = chain || getChainById(chainId);
      toast.info(
        tCommon("wallet.currentNetworkInfo", {
          name: chainInfo.name,
          id: chainId,
        }),
        {
          autoClose: 3000,
        }
      );

      // 处理捐赠逻辑
      try {
        setIsProcessing(true);
        setDonationSuccess(false);

        // 合约内部从 masterContract 获取代币地址，所以我们必须使用 masterContract 的 donationToken
        // 获取捐赠代币地址（必须从 masterContract 获取，因为合约内部使用这个地址）
        const tokenAddress = await getDonationToken();
        if (!tokenAddress || tokenAddress === ethers.ZeroAddress) {
          throw new Error("捐赠代币地址未找到");
        }

        // 获取代币精度（从 masterContract 获取，确保与合约期望的一致）
        let tokenDecimals = 18; // 默认值
        try {
          const decimals = await getDonationTokenDecimals();
          if (decimals && decimals > 0) {
            tokenDecimals = decimals;
          }
        } catch (error) {
          console.warn("获取代币精度失败，使用默认值 18:", error);
        }
        // 添加调试信息
        console.log("捐赠参数:", {
          projectId: uid,
          amount,
          tokenAddress,
          tokenDecimals,
        });

        const result = await donate(uid, amount, tokenAddress, tokenDecimals);

        if (result) {
          setDonationSuccess(true);
          toast.success(tCommon("success.donationSuccess"));
          // 重置表单
          setAmount("");
          setSelectedQuickAmount(null);
          setRewardAmount(null);
          setAmountChanged(false);
          await projectDonateCompleted(uid, address as string, amount, result);
        } else {
          toast.error(tCommon("errors.donationFailed"));
        }
      } catch (error: any) {
        console.error("Donation failed:", error);
        console.error("Error details:", {
          message: error.message,
          reason: error.reason,
          code: error.code,
          data: error.data,
        });

        // 根据错误类型显示不同的错误信息
        let errorMessage = tCommon("errors.donationFailed");
        if (error.message?.includes("user rejected")) {
          errorMessage = tCommon("errors.transactionCancelled");
        } else if (error.message?.includes("insufficient funds")) {
          errorMessage = tCommon("errors.insufficientFunds");
        } else if (error.message?.includes("gas")) {
          errorMessage = tCommon("errors.gasIssue");
        } else if (error.message?.includes("allowance") || error.message?.includes("approve")) {
          errorMessage = "代币授权失败，请重试";
        } else if (error.message?.includes("reverted") || error.reason?.includes("reverted")) {
          // 合约执行回退
          if (error.reason) {
            errorMessage = `交易失败: ${error.reason}`;
          } else if (error.message?.includes("require(false)")) {
            errorMessage = "交易失败：合约条件检查未通过，请检查项目ID和金额是否正确";
          } else {
            errorMessage = "交易失败：合约执行回退，请检查项目ID、代币地址和金额是否正确";
          }
        }

        toast.error(errorMessage, {
          autoClose: 5000,
        });
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
              <span className="text-sm font-medium text-white/80">
                {t("badge")}
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="text-4xl md:text-5xl font-bold text-white mb-4"
            >
              {t("title")}
              <span className="bg-linear-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                {t("titleHighlight")}
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="text-lg text-white/70 max-w-md mx-auto"
            >
              {t("subtitle")}
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
            <TokenSelection onTokenChange={handleTokenChange} />

            {/* Amount Input */}
            <AmountInput
              usdtBalance={selectedToken?.balance || null}
              amount={amount}
              selectedQuickAmount={selectedQuickAmount}
              quickAmounts={quickAmounts}
              isConnected={isConnected}
              isProcessing={isProcessing}
              onAmountChange={handleAmountChange}
              onQuickAmountSelect={handleQuickAmountSelect}
            />

            {/* Donation Ranking & Token Reward */}
            <RewardDisplay
              amount={amount}
              rewardAmount={rewardAmount}
              isLoadingReward={isLoadingReward}
              // calculateUSDValue={calculateUSDValue}
              calculateExchangeAmount={calculateExchangeAmount}
              ecosystemTokenDecimals={ecosystemTokenDecimals ?? undefined}
              amountChanged={amountChanged}
              onRewardUpdate={setRewardAmount}
              surpassedCount={proportionData?.surpassedCount ?? null}
              totalDonors={proportionData?.totalDonors ?? null}
              onRefreshData={fetchRewardAndProportion}
            />

            {/* Total Donation */}
            <TotalDonation
              amount={amount}
              // calculateUSDValue={calculateUSDValue}
            />

            {/* Donate Button */}
            <DonateButton
              isConnected={isConnected}
              isProcessing={isProcessing}
              donationLoading={donationLoading}
              donationSuccess={donationSuccess}
              amount={amount}
              onClick={handleConnectWallet}
            />
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default Donate;
