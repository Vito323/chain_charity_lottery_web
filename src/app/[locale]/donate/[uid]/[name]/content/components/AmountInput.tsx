"use client";
import React from "react";
import { motion } from "framer-motion";
import { useTranslations } from 'next-intl';
import { formatCurrency } from "@/utils/currency";
import { TokenInfo } from "@/hooks/useDonationForm";
import BigNumber from "bignumber.js";

interface AmountInputProps {
  selectedToken: TokenInfo | null;
  amount: string;
  selectedQuickAmount: number | null;
  quickAmounts: number[];
  isConnected: boolean;
  isProcessing: boolean;
  tokenPrices: Record<string, number>;
  onAmountChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onQuickAmountSelect: (value: number) => void;
}

export const AmountInput: React.FC<AmountInputProps> = ({
  selectedToken,
  amount,
  selectedQuickAmount,
  quickAmounts,
  isConnected,
  isProcessing,
  tokenPrices,
  onAmountChange,
  onQuickAmountSelect,
}) => {
  const t = useTranslations('donate');
  const tCommon = useTranslations('common');

  // 获取代币余额
  const tokenBalance = React.useMemo(() => {
    if (!selectedToken || !selectedToken.balance) {
      return null;
    }
    // balance 可能是字符串格式的余额
    const balanceStr = selectedToken.balance || selectedToken.displayBalance || '0';
    return new BigNumber(balanceStr);
  }, [selectedToken]);

  // 处理金额输入变化，限制不超过余额
  const handleAmountChangeWithLimit = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    
    // 如果输入为空，直接更新
    if (!inputValue || inputValue === '') {
      onAmountChange(e);
      return;
    }

    const inputBN = new BigNumber(inputValue);
    
    // 如果输入值无效（NaN或负数），不更新
    if (inputBN.isNaN() || inputBN.isLessThan(0)) {
      return;
    }

    // 如果有余额限制，检查是否超过余额
    if (tokenBalance && inputBN.isGreaterThan(tokenBalance)) {
      // 如果超过余额，设置为余额值
      const maxAmountEvent = {
        ...e,
        target: {
          ...e.target,
          value: tokenBalance.toFixed(),
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
    return tokenBalance.toFixed();
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
      <label className="block text-sm font-medium text-white/80 mb-3">
        {t('amount')}
        {selectedToken && tokenBalance && (
          <span className="ml-2 text-xs text-white/60 font-normal">
            (Balance: {tokenBalance.toFixed()} {selectedToken.symbol})
          </span>
        )}
      </label>
      
      {/* Quick Amount Selection */}
      {selectedToken && (
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
                  title={isDisabled ? `Insufficient balance. Max: ${tokenBalance?.toFixed() || '0'} ${selectedToken.symbol}` : ''}
                >
                  <span className={`font-medium text-base ${isDisabled ? 'text-white/40' : 'text-white'}`}>
                    {quickAmount} {selectedToken.symbol}
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
                    <div className="absolute inset-0 flex items-center justify-center">
                      <svg className="w-5 h-5 text-red-400/60" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                    </div>
                  )}
                </motion.button>
              );
            })}
          </div>
        </div>
      )}

      {/* Custom Amount Input */}
      <div className="relative">
        <input
          type="number"
          className={`w-full p-4 bg-white/5 border rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none ${
            isAmountExceeded
              ? 'border-red-500/50 focus:ring-red-500/50'
              : 'border-white/10 focus:ring-purple-500/50'
          }`}
          placeholder={selectedToken ? `Other Amount (Max: ${tokenBalance?.toFixed() || '0'})` : "0.00"}
          value={amount}
          onChange={handleAmountChangeWithLimit}
          disabled={!isConnected || !selectedToken || isProcessing}
          min="0"
          max={maxAmount}
          step="0.000001"
        />
        {selectedToken && (
          <div className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 text-sm">
            {selectedToken.symbol}
          </div>
        )}
        {amount && parseFloat(amount) <= 0 && (
          <p className="mt-2 text-sm text-red-400">{tCommon('validation.pleaseEnterAmount')}</p>
        )}
        {isAmountExceeded && tokenBalance && selectedToken && (
          <p className="mt-2 text-sm text-red-400">
            Insufficient balance. Maximum: {tokenBalance.toFixed()} {selectedToken.symbol}
          </p>
        )}
      </div>
      {selectedToken && (
        <p className="mt-2 text-sm text-white/60">
          1 {selectedToken.symbol} = {formatCurrency(tokenPrices[selectedToken.symbol] || 0)}
        </p>
      )}
    </div>
  );
};

