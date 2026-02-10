"use client";
import React, { useState, useEffect } from "react";
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { formatAddress, formatInviteLink, getFallbackChainIcon } from './utils';
import useGlobalStore from '@/store';
import { useRouter } from 'next/navigation';
import { formatCurrency } from "@/utils/currency";
import { queryUserReferrer } from '@/service/user';

// Cache referrer by address to avoid duplicate API calls (e.g. Strict Mode or re-mounts)
const referrerCache: Record<string, string | null> = {};

interface WalletInfoSectionProps {
  account: { address: string };
  chain: { id: number; name?: string; iconUrl?: string };
  openChainModal: () => void;
  onCloseDropdown: () => void;
  showInviteLink: boolean;
}

export const WalletInfoSection: React.FC<WalletInfoSectionProps> = ({
  account,
  chain,
  openChainModal,
  onCloseDropdown,
  showInviteLink,
}) => {
  const [copySuccess, setCopySuccess] = useState(false);
  const [copyInviteSuccess, setCopyInviteSuccess] = useState(false);
  // const [referrer, setReferrer] = useState<string | null>(null);
  const tCommon = useTranslations('common');
  const withdrawAmount = useGlobalStore(state => state.withdrawAmount);
  const router = useRouter();

  // useEffect(() => {
  //   const addr = account.address;
  //   if (referrerCache[addr] !== undefined) {
  //     setReferrer(referrerCache[addr]);
  //     return;
  //   }
  //   let cancelled = false;
  //   queryUserReferrer(addr)
  //     .then((res) => {
  //       const value = res?.data ?? null;
  //       referrerCache[addr] = value;
  //       if (!cancelled) setReferrer(value);
  //     })
  //     .catch(() => {
  //       referrerCache[addr] = null;
  //       if (!cancelled) setReferrer(null);
  //     });
  //   return () => { cancelled = true; };
  // }, [account.address]);

  // const showInviteLink = referrer != null && referrer.trim() !== '' && referrer.trim().toLowerCase() !== '0x0';
  const handleCopyAddress = () => {
    navigator.clipboard.writeText(account.address);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2000);
  };

  const handleCopyInviteLink = () => {
    navigator.clipboard.writeText(window.location.origin + '/bind-node?referrer=' + account.address);
    setCopyInviteSuccess(true);
    setTimeout(() => setCopyInviteSuccess(false), 2000);
  };

  const handleSwitchNetwork = () => {
    openChainModal();
    onCloseDropdown();
  };

  const handleWithdraw = () => {
    router.push('/lottery/withdraw');
  };

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

      {showInviteLink && (
        <div className="mb-4">
          <div className="text-xs font-semibold text-white/60 uppercase tracking-wider mb-2">
            {tCommon('wallet.inviteLink')}
          </div>
          <div className="flex items-center gap-2">
            <div className="text-base font-bold text-white font-mono md:text-base sm:text-sm">
              {formatInviteLink(window.location.origin + '/bind-node?referrer=' + account.address)}
            </div>
            <button 
              className="bg-transparent border-0 text-white/60 cursor-pointer p-1 rounded transition-all duration-200 hover:bg-white/10 hover:text-purple-600 active:bg-white/20"
              onClick={handleCopyInviteLink}
              title={tCommon('wallet.copyInviteLink')}
            >
              <i className={`fa text-xs ${copyInviteSuccess ? 'fa-check' : 'fa-copy'}`}></i>
            </button>
          </div>
        </div>
      )}

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
            {formatCurrency(withdrawAmount, '', 2)} USDT
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

