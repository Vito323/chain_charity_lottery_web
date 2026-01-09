'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion } from 'framer-motion';
import { useAccount } from 'wagmi';
import { useRouter } from '@/i18n/navigation';
import { useTranslations } from 'next-intl';
import { useMasterContract } from '@/hooks/useMasterContract';
import { formatCurrency } from '@/utils/currency';
import { formatUnits } from 'ethers';
import useGlobalStore from '@/store';

interface WithdrawAmountSectionProps {
  /**
   * 倒计时是否已完成(开奖完成)
   * 当倒计时结束时,延迟1秒刷新可提现金额
   */
  isDrawComplete: boolean;
}

const WithdrawAmountSection: React.FC<WithdrawAmountSectionProps> = ({
  isDrawComplete,
}) => {
  const { address, isConnected } = useAccount();
  const router = useRouter();
  const t = useTranslations('lottery.withdraw');
  const tCommon = useTranslations('common');
  const { getUserWithdrawableAmount } = useMasterContract();
  
  // 从store获取和设置可提现金额
  const withdrawAmountFromStore = useGlobalStore(state => state.withdrawAmount);
  const setWithdrawAmount = useGlobalStore(state => state.setWithdrawAmount);
  
  const [isLoading, setIsLoading] = useState(false);
  
  // 用于跟踪是否已经在倒计时结束时刷新过
  const hasRefreshedOnCompleteRef = useRef(false);
  const refreshTimerRef = useRef<NodeJS.Timeout | null>(null);

  // 获取可提现金额
  const fetchWithdrawAmount = useCallback(async () => {
    if (!isConnected || !address) {
      setWithdrawAmount('0');
      return;
    }

    try {
      setIsLoading(true);
      const response = await getUserWithdrawableAmount(address);
      const value = formatUnits(response, 18);
      setWithdrawAmount(value || '0');
    } catch (error) {
      console.error('Failed to fetch withdraw amount:', error);
      setWithdrawAmount('0');
    } finally {
      setIsLoading(false);
    }
  }, [isConnected, address, getUserWithdrawableAmount, setWithdrawAmount]);

  // 组件挂载或钱包连接时获取可提现金额
  useEffect(() => {
    if (isConnected && address) {
      fetchWithdrawAmount();
    } else {
      setWithdrawAmount('0');
    }
  }, [isConnected, address, fetchWithdrawAmount, setWithdrawAmount]);

  // 监听倒计时结束,延迟1秒刷新可提现金额
  useEffect(() => {
    if (isDrawComplete && isConnected && address) {
      // 清理之前的定时器
      if (refreshTimerRef.current) {
        clearTimeout(refreshTimerRef.current);
        refreshTimerRef.current = null;
      }
      
      // 如果还没刷新过,则延迟1秒刷新可提现金额
      if (!hasRefreshedOnCompleteRef.current) {
        refreshTimerRef.current = setTimeout(() => {
          hasRefreshedOnCompleteRef.current = true;
          fetchWithdrawAmount();
        }, 1000);
      }
    } else {
      // 当倒计时未完成时,重置刷新标志,允许下次倒计时结束时再次刷新
      hasRefreshedOnCompleteRef.current = false;
    }

    // 清理函数
    return () => {
      if (refreshTimerRef.current) {
        clearTimeout(refreshTimerRef.current);
        refreshTimerRef.current = null;
      }
    };
  }, [isDrawComplete, isConnected, address, fetchWithdrawAmount]);

  // 组件卸载时清理定时器
  useEffect(() => {
    return () => {
      if (refreshTimerRef.current) {
        clearTimeout(refreshTimerRef.current);
        refreshTimerRef.current = null;
      }
      hasRefreshedOnCompleteRef.current = false;
    };
  }, []);

  // 处理提现按钮点击
  const handleWithdrawClick = () => {
    router.push('/lottery/withdraw');
  };

  // 如果钱包未连接,不显示此组件
  if (!isConnected) {
    return null;
  }

  return (
    <motion.div
      className="flex items-center justify-between gap-4 px-4 py-3 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* 提现金额 */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:gap-2 flex-1 min-w-0">
        <span className="text-sm sm:text-base text-white/70 whitespace-nowrap">
          {t('withdrawableAmount')}:
        </span>
        {isLoading ? (
          <div className="flex items-center gap-2">
            <svg
              className="animate-spin h-4 w-4 text-white/60"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            <span className="text-sm text-white/60">{tCommon('status.loading')}</span>
          </div>
        ) : (
          <span className="text-base sm:text-lg font-bold text-white truncate">
            {formatCurrency(withdrawAmountFromStore, '', 6)} USDT
          </span>
        )}
      </div>

      {/* 提现按钮 */}
      <motion.button
        onClick={handleWithdrawClick}
        className="px-4 py-2 sm:px-6 sm:py-2.5 bg-linear-to-r from-purple-600 to-pink-600 text-white text-sm sm:text-base font-semibold rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all duration-300 whitespace-nowrap cursor-pointer shadow-lg shadow-purple-500/30"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        disabled={isLoading}
      >
        {t('withdrawButton')}
      </motion.button>
    </motion.div>
  );
};

export default WithdrawAmountSection;
