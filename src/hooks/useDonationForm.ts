import { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { useConnectModal } from '@rainbow-me/rainbowkit';

interface DonationFormState {
  selectedToken: string;
  amount: string;
  showTokenModal: boolean;
  searchTerm: string;
  hideZeroBalance: boolean;
}

export const useDonationForm = () => {
  const account = useAccount();
  const { openConnectModal } = useConnectModal();
  
  const [formState, setFormState] = useState<DonationFormState>({
    selectedToken: '',
    amount: '',
    showTokenModal: false,
    searchTerm: '',
    hideZeroBalance: false,
  });

  // 重置表单状态
  const resetForm = () => {
    setFormState({
      selectedToken: '',
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
  const handleTokenSelect = (token: string) => {
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
  const handleConnectWallet = () => {
    if (account.isConnected) {
      // 处理捐赠逻辑
      console.log('Processing donation...');
    } else {
      openConnectModal?.();
    }
  };

  return {
    formState,
    updateFormState,
    handleTokenSelect,
    handleAmountChange,
    handleConnectWallet,
    resetForm,
    isConnected: account.isConnected,
    chainId: account.chainId
  };
};
