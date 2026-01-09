"use client";
import React from "react";
import { motion } from "framer-motion";
import { useTranslations } from 'next-intl';
import BigNumber from "bignumber.js";
import { formatCurrency } from "@/utils/currency";

// 辅助函数：向下取整格式化（不四舍五入）
const floorToFixed = (value: BigNumber | number | null | undefined, decimals: number = 2): string => {
  if (!value) {
    return '0';
  }
  if (value instanceof BigNumber) {
    return value.decimalPlaces(decimals, BigNumber.ROUND_DOWN).toFixed(decimals);
  }
  const multiplier = Math.pow(10, decimals);
  return (Math.floor(value * multiplier) / multiplier).toFixed(decimals);
};

// 辅助函数：向下取整格式化（不指定小数位数，使用默认）
const floorToString = (value: BigNumber | null | undefined): string => {
  if (!value) {
    return '0';
  }
  return value.decimalPlaces(0, BigNumber.ROUND_DOWN).toFixed();
};

interface AmountInputProps {
  usdtBalance: string | null;
  amount: string;
  selectedQuickAmount: number | null;
  quickAmounts: number[];
  isConnected: boolean;
  isProcessing: boolean;
  onAmountChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onQuickAmountSelect: (value: number) => void;
}

export const AmountInput: React.FC<AmountInputProps> = ({
  usdtBalance,
  amount,
  selectedQuickAmount,
  quickAmounts,
  isConnected,
  isProcessing,
  onAmountChange,
  onQuickAmountSelect,
}) => {
  const t = useTranslations('donate');
  const tCommon = useTranslations('common');

  // 获取USDT余额
  const tokenBalance = React.useMemo(() => {
    if (!usdtBalance) {
      return null;
    }
    return new BigNumber(usdtBalance);
  }, [usdtBalance]);

  // 处理金额输入变化，限制不超过余额，最大两位小数
  const handleAmountChangeWithLimit = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    // 如果输入为空，直接更新
    if (!inputValue || inputValue === '') {
      onAmountChange(e);
      return;
    }

    // 限制最多两位小数
    const decimalRegex = /^\d*\.?\d{0,2}$/;
    if (!decimalRegex.test(inputValue)) {
      // 如果不符合两位小数格式，截断为两位小数
      const parts = inputValue.split('.');
      if (parts.length === 2 && parts[1].length > 2) {
        const truncatedValue = `${parts[0]}.${parts[1].substring(0, 2)}`;
        const truncatedEvent = {
          ...e,
          target: {
            ...e.target,
            value: truncatedValue,
          },
        } as React.ChangeEvent<HTMLInputElement>;
        onAmountChange(truncatedEvent);
        return;
      }
      // 如果格式不合法（比如包含多个小数点），不更新
      return;
    }

    const inputBN = new BigNumber(inputValue);
    
    // 如果输入值无效（NaN或负数），不更新
    if (inputBN.isNaN() || inputBN.isLessThan(0)) {
      return;
    }

    // 如果有余额限制，检查是否超过余额
    if (tokenBalance && inputBN.isGreaterThan(tokenBalance)) {
      // 如果超过余额，设置为余额值（保留两位小数，向下取整）
      const maxAmountEvent = {
        ...e,
        target: {
          ...e.target,
          value: floorToFixed(tokenBalance, 2),
        },
      } as React.ChangeEvent<HTMLInputElement>;
      onAmountChange(maxAmountEvent);
      return;
    }

    // 正常更新
    onAmountChange(e);
  };

  // 检查快速金额是否超过余额
  const isQuickAmountDisabled = React.useCallback((quickAmount: number) => {
    if (!isConnected || isProcessing) {
      return true;
    }
    if (!tokenBalance) {
      return false; // 如果没有余额信息，不禁用
    }
    return new BigNumber(quickAmount).isGreaterThan(tokenBalance);
  }, [isConnected, isProcessing, tokenBalance]);

  // 获取输入框的最大值
  const maxAmount = React.useMemo(() => {
    if (!tokenBalance) {
      return undefined;
    }
    return floorToString(tokenBalance);
  }, [tokenBalance]);

  // 检查当前输入是否超过余额
  const isAmountExceeded = React.useMemo(() => {
    if (!amount || !tokenBalance) {
      return false;
    }
    const amountBN = new BigNumber(amount);
    return amountBN.isGreaterThan(tokenBalance);
  }, [amount, tokenBalance]);

  return (
    <div className="mb-6">      
      {/* Quick Amount Selection */}
      <div className="mb-4">
        <div className="grid grid-cols-3 gap-3">
          {quickAmounts.map((quickAmount) => {
            const isDisabled = isQuickAmountDisabled(quickAmount);
            return (
              <motion.button
                key={quickAmount}
                whileHover={!isDisabled ? { scale: 1.02 } : {}}
                whileTap={!isDisabled ? { scale: 0.98 } : {}}
                onClick={() => !isDisabled && onQuickAmountSelect(quickAmount)}
                disabled={isDisabled}
                className={`relative p-4 bg-white/5 border rounded-xl transition-all duration-300 ${
                  selectedQuickAmount === quickAmount
                    ? 'border-purple-500/50 bg-purple-500/10 shadow-lg shadow-purple-500/20'
                    : isDisabled
                    ? 'border-white/5 bg-white/5 opacity-40 cursor-not-allowed'
                    : 'border-white/10 hover:bg-white/10 hover:border-white/20'
                } ${isDisabled ? 'opacity-40 cursor-not-allowed' : ''}`}
                title={isDisabled ? tCommon('validation.insufficientBalanceMax', { max: floorToString(tokenBalance) }) : ''}
              >
                <span className={`font-medium text-base ${isDisabled ? 'text-white/40' : 'text-white'}`}>
                  {quickAmount} USDT
                </span>
                {selectedQuickAmount === quickAmount && !isDisabled && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="absolute bottom-2 right-2"
                  >
                    <svg className="w-4 h-4 text-purple-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </motion.div>
                )}
                {isDisabled && (
                  <div className="absolute inset-0 flex items-center justify-center" />
                )}
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Custom Amount Input */}
      <div className="relative">
        <input
          type="number"
          className={`w-full p-4 bg-white/5 border rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none ${
            isAmountExceeded
              ? 'border-red-500/50 focus:ring-red-500/50'
              : 'border-white/10 focus:ring-purple-500/50'
          }`}
          placeholder={`Other Amount (Max: ${formatCurrency(tokenBalance?.toFixed() || 0, '')} USDT)`}
          value={amount}
          onChange={handleAmountChangeWithLimit}
          disabled={!isConnected || isProcessing}
          min="0"
          max={maxAmount}
          step="0.000001"
        />
        <div className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 text-sm">
          USDT
        </div>
        {amount && parseFloat(amount) <= 0 && (
          <p className="mt-2 text-sm text-red-400">{tCommon('validation.pleaseEnterAmount')}</p>
        )}
        {isAmountExceeded && tokenBalance && (
          <p className="mt-2 text-sm text-red-400">
            {tCommon('validation.insufficientBalanceMax', { max: formatCurrency(tokenBalance?.toFixed() || 0, '') })}
          </p>
        )}
      </div>
    </div>
  );
};

