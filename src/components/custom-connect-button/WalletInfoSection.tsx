"use client";
import React, { useState, useMemo } from "react";
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { formatAddress, getFallbackChainIcon } from './utils';
import useGlobalStore from '@/store';
import { useRouter } from 'next/navigation';

interface WalletInfoSectionProps {
  account: { address: string };
  chain: { id: number; name?: string; iconUrl?: string };
  openChainModal: () => void;
  onCloseDropdown: () => void;
}

export const WalletInfoSection: React.FC<WalletInfoSectionProps> = ({
  account,
  chain,
  openChainModal,
  onCloseDropdown,
}) => {
  const [copySuccess, setCopySuccess] = useState(false);
  const tCommon = useTranslations('common');
  const withdrawAmount = useGlobalStore(state => state.withdrawAmount);
  const router = useRouter();
  const handleCopyAddress = () => {
    navigator.clipboard.writeText(account.address);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2000);
  };

  const handleSwitchNetwork = () => {
    openChainModal();
    onCloseDropdown();
  };

  const handleWithdraw = () => {
    router.push('/lottery/withdraw');
  };

  // 格式化可提现金额，保留两位小数
  const formattedWithdrawableAmount = useMemo(() => {
    if (!withdrawAmount) return '0.00';
    const amount = parseFloat(withdrawAmount);
    return isNaN(amount) ? '0.00' : amount.toFixed(2);
  }, [withdrawAmount]);

  return (
    <div className="p-6 border-b border-white/10 md:p-5">
      <div className="mb-4">
        <div className="text-xs font-semibold text-white/60 uppercase tracking-wider mb-2">
          {tCommon('wallet.wallet')}
        </div>
        <div className="flex items-center gap-2">
          <div className="text-base font-bold text-white font-mono md:text-base sm:text-sm">
            {formatAddress(account.address)}
          </div>
          <button 
            className="bg-transparent border-0 text-white/60 cursor-pointer p-1 rounded transition-all duration-200 hover:bg-white/10 hover:text-purple-600 active:bg-white/20"
            onClick={handleCopyAddress}
            title={tCommon('wallet.copyFullAddress')}
          >
            <i className={`fa text-xs ${copySuccess ? 'fa-check' : 'fa-copy'}`}></i>
          </button>
        </div>
      </div>
      
      <div className="mb-4">
        <div className="text-xs font-semibold text-white/60 uppercase tracking-wider mb-2">
          {tCommon('wallet.network')}
        </div>
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 bg-linear-to-br from-purple-600 to-pink-600 text-white rounded-full flex items-center justify-center text-xs font-bold overflow-hidden">
            {chain.iconUrl ? (
              <Image 
                src={chain.iconUrl} 
                alt={chain.name || tCommon('images.chain')} 
                width={20} 
                height={20} 
                className="w-full h-full object-cover rounded-full" 
              />
            ) : (
              <span className="text-xs font-bold">{getFallbackChainIcon(chain.id)}</span>
            )}
          </div>
          <span className="text-sm font-bold text-white flex-1 md:text-sm sm:text-xs">
            {chain.name}
          </span>
          <button 
            className="text-xs text-pink-400 bg-transparent border-0 cursor-pointer font-medium p-0 no-underline hover:text-pink-300 hover:underline active:text-pink-200"
            onClick={handleSwitchNetwork}
          >
            {tCommon('wallet.switchNetwork')}
          </button>
        </div>
      </div>

      <div>
        <div className="text-xs font-semibold text-white/60 uppercase tracking-wider mb-2">
          {tCommon('wallet.withdrawableAmount')}
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm font-bold text-white flex-1 md:text-sm sm:text-xs">
            {formattedWithdrawableAmount} USDT
          </span>
          <button 
            className="text-xs text-pink-400 bg-transparent border-0 cursor-pointer font-medium p-0 no-underline hover:text-pink-300 hover:underline active:text-pink-200"
            onClick={handleWithdraw}
          >
            {tCommon('wallet.withdraw')}
          </button>
        </div>
      </div>
    </div>
  );
};

