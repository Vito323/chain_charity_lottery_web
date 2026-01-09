"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { useAccount, useChainId } from 'wagmi';
import { toast } from 'react-toastify';
import useGlobalStore from '@/store';
import LotteryWithdrawModal from '@/components/lottery-withdraw-modal';
import { useMasterContract } from '@/hooks/useMasterContract';
import { getChainById } from '@/lib/chain-config';
import { formatUnits } from 'ethers';
import { formatCurrency } from '@/utils/currency';

const WithdrawPage = () => {
  const t = useTranslations('lottery.withdraw');
  const tCommon = useTranslations('common');
  const { address, isConnected } = useAccount();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  
  const withdrawAmountFromStore = useGlobalStore(state => state.withdrawAmount);
  const setWithdrawAmount = useGlobalStore(state => state.setWithdrawAmount);
  const chainId = useChainId();
  const { getUserWithdrawableAmount, withdrawBonus, getWithdrawPaused } = useMasterContract();

  // 获取可提现金额
  const fetchWithdrawAmount = useCallback(async () => {
    if (!isConnected || !address) {
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      const response = await getUserWithdrawableAmount(address);
      const value = formatUnits(response, 18);
      setWithdrawAmount(value || '0');
    } catch (err) {
      console.error('Failed to fetch withdraw amount:', err);
      setError(tCommon('errors.failedToLoad'));
      setWithdrawAmount('0');
    } finally {
      setIsLoading(false);
    }
  }, [isConnected, address, setWithdrawAmount, getUserWithdrawableAmount, tCommon]);

  // 组件挂载时获取数据
  useEffect(() => {
    fetchWithdrawAmount();
  }, [fetchWithdrawAmount]);

  // 处理提现按钮点击
  const handleWithdrawClick = () => {
    if (!isConnected || !address) {
      return;
    }
    setShowModal(true);
  };

  // 处理确认提现
  const handleConfirmWithdraw = async () => {
    // 1. 基础验证：检查钱包连接和地址
    if (!isConnected || !address) {
      toast.error(tCommon('wallet.notConnected'));
      return;
    }

    // 2. 检查提现金额是否大于0
    const amount = parseFloat(withdrawAmountFromStore || '0');
    if (isNaN(amount) || amount <= 0) {
      toast.error(tCommon('validation.invalidAmount'));
      return;
    }

    // 3. 链ID验证：检查当前链是否与预期链一致
    const expectedChainId = Number(process.env.NEXT_PUBLIC_DEFAULT_CHAIN_ID);
    if (chainId !== expectedChainId) {
      const currentChainInfo = getChainById(chainId);
      const expectedChainInfo = getChainById(expectedChainId);
      toast.error(
        tCommon('wallet.wrongNetworkMessage', {
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

    // 4. 检查提现是否暂停
    try {
      const isPaused = await getWithdrawPaused();
      if (isPaused) {
        toast.error(t('errors.withdrawPaused'));
        return;
      }
    } catch (err) {
      console.error('Failed to check withdraw paused status:', err);
      toast.error(tCommon('errors.failedToLoad'));
      return;
    }

    // 5. 执行提现操作
    try {
      setIsLoading(true);
      setError(null);

      // 调用提现接口
      const txHash = await withdrawBonus();
      
      // 提现成功
      toast.success(
        t('success.withdrawSuccess'),
        {
          autoClose: 5000,
        }
      );

      // 关闭模态框
      setShowModal(false);

      // 刷新可提现金额
      await fetchWithdrawAmount();
    } catch (err: any) {
      console.error('Withdraw failed:', err);
      
      // 处理用户拒绝交易的情况
      if (err?.message?.includes('user rejected') || err?.message?.includes('User rejected')) {
        toast.error(tCommon('wallet.transactionRejected'));
      } else if (err?.message?.includes('insufficient funds')) {
        toast.error(tCommon('wallet.insufficientFunds'));
      } else {
        const errorMessage = err?.message || tCommon('errors.withdrawFailed');
        setError(errorMessage);
        toast.error(errorMessage);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: 'easeOut' as const,
      },
    },
  };

  return (
    <section className="relative py-20 min-h-screen">
      {/* Background Elements */}
      <div className="absolute inset-0 z-0">
        <motion.div
          className="absolute top-20 right-10 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
        <motion.div
          className="absolute bottom-20 left-10 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      </div>

      <motion.div
        className="relative z-10 max-w-4xl mx-auto px-6 md:px-8"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Section Header */}
        <motion.div variants={itemVariants} className="text-center mb-16">
          <motion.div
            className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full border border-white/15 bg-white/5 backdrop-blur-sm text-white/90 mb-6"
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.6 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-sm">{t('badge')}</span>
          </motion.div>

          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            {t('title')} <span className="bg-linear-to-r from-purple-300 via-pink-300 to-fuchsia-300 bg-clip-text text-transparent">{t('titleHighlight')}</span>
          </h2>
          <p className="text-lg md:text-xl text-white/80 max-w-3xl mx-auto leading-relaxed">
            {t('subtitle')}
          </p>
        </motion.div>

        {/* Main Content Card */}
        <motion.div
          variants={itemVariants}
          className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 sm:p-8 md:p-10"
        >
          {!isConnected ? (
            /* Not Connected State */
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">
                {t('connect.title')}
              </h3>
              <p className="text-white/60">
                {t('connect.description')}
              </p>
            </div>
          ) : (
            /* Connected State */
            <div className="space-y-6">
              {/* Withdrawable Amount */}
              <div className="rounded-2xl border border-white/10 bg-white/5 p-6 sm:p-8">
                <div className="text-sm sm:text-base text-white/70 mb-3">
                  {t('withdrawableAmount')}
                </div>
                {isLoading ? (
                  <div className="flex items-center gap-3">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span className="text-2xl sm:text-3xl font-bold text-white">
                      {tCommon('status.loading')}
                    </span>
                  </div>
                ) : error ? (
                  <div className="text-xl sm:text-2xl font-bold text-red-400">
                    {error}
                  </div>
                ) : (
                  <div className="text-3xl sm:text-4xl md:text-5xl font-bold text-white">
                    {formatCurrency(withdrawAmountFromStore, '', 6)} USDT
                  </div>
                )}
              </div>

              {/* Wallet Address */}
              <div className="rounded-2xl border border-white/10 bg-white/5 p-6 sm:p-8">
                <div className="text-sm sm:text-base text-white/70 mb-3">
                  {t('walletAddress')}
                </div>
                <div className="flex items-start gap-3">
                  <div className="flex-1 text-base sm:text-lg font-mono font-semibold text-white break-all overflow-wrap-anywhere">
                    {address || '--'}
                  </div>
                  {address && (
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(address);
                      }}
                      className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-white/60 hover:text-white transition-colors cursor-pointer shrink-0"
                      title={tCommon('wallet.copyFullAddress')}
                    >
                      <i className="fa fa-copy text-sm"></i>
                    </button>
                  )}
                </div>
              </div>

              {/* Withdraw Button */}
              <button
                onClick={handleWithdrawClick}
                disabled={isLoading || !withdrawAmountFromStore || parseFloat(withdrawAmountFromStore) <= 0}
                className={`w-full rounded-full py-4 px-6 text-base sm:text-lg font-semibold transition-all duration-300 flex items-center justify-center gap-2 ${
                  isLoading || !withdrawAmountFromStore || parseFloat(withdrawAmountFromStore) <= 0
                    ? 'bg-gray-600/50 text-gray-400 cursor-not-allowed'
                    : 'bg-linear-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700 shadow-lg shadow-purple-500/30 cursor-pointer hover:-translate-y-0.5 hover:shadow-xl hover:shadow-purple-500/40'
                }`}
              >
                {t('withdrawButton')}
              </button>
            </div>
          )}
        </motion.div>
      </motion.div>

      {/* Withdraw Modal */}
      <LotteryWithdrawModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        withdrawAmount={withdrawAmountFromStore}
        onConfirmWithdraw={handleConfirmWithdraw}
      />
    </section>
  );
};

export default WithdrawPage;

