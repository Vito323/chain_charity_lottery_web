'use client';
import { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';

export interface TokenInfo {
  symbol: string;
  name: string;
  icon?: string;
  balance?: string;
  decimals?: number;
  displayBalance?: string;
  isNative: boolean;
  address?: string;
}

interface DonationFormState {
  selectedToken: TokenInfo | null;
  amount: string;
  showTokenModal: boolean;
  searchTerm: string;
  hideZeroBalance: boolean;
}

export const useDonationForm = () => {
  const account = useAccount();
  
  const [formState, setFormState] = useState<DonationFormState>({
    selectedToken: null,
    amount: '',
    showTokenModal: false,
    searchTerm: '',
    hideZeroBalance: false,
  });

  // 重置表单状态
  const resetForm = () => {
    setFormState({
      selectedToken: null,
      amount: '',
      showTokenModal: false,
      searchTerm: '',
      hideZeroBalance: false,
    });
  };

  // 当链切换时重置表单
  useEffect(() => {
    resetForm();
  }, [account.chainId]);

  // 更新表单状态
  const updateFormState = (updates: Partial<DonationFormState>) => {
    setFormState(prev => ({ ...prev, ...updates }));
  };

  // 处理代币选择
  const handleTokenSelect = (token: TokenInfo) => {
    updateFormState({ 
      selectedToken: token, 
      showTokenModal: false 
    });
  };

  // 处理金额变化
  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateFormState({ amount: e.target.value });
  };

  // 处理钱包连接

  return {
    formState,
    updateFormState,
    handleTokenSelect,
    handleAmountChange,
    resetForm,
    isConnected: account.isConnected,
    chainId: account.chainId
  };
};
