"use client";
import React from "react";
import Image from "next/image";
import { useTranslations } from 'next-intl';
import { TokenInfo } from "@/hooks/useDonationForm";

interface TokenSelectionProps {
  selectedToken: TokenInfo | null;
  isConnected: boolean;
  onSelectClick: () => void;
}

export const TokenSelection: React.FC<TokenSelectionProps> = ({
  selectedToken,
  isConnected,
  onSelectClick,
}) => {
  const t = useTranslations('donate');

  return (
    <div className="mb-6">
      <label className="block text-sm font-medium text-white/80 mb-3">{t('selectToken')}</label>
      <div className="flex items-center gap-3 p-4 bg-white/5 rounded-xl border border-white/10">
        <div
          className={`flex items-center gap-3 flex-1 cursor-pointer ${
            !isConnected ? 'opacity-50 cursor-not-allowed' : ''
          }`}
          onClick={onSelectClick}
        >
          {selectedToken && selectedToken.symbol ? (
            <Image
              src={`/icons/tokens/${selectedToken.symbol}.svg`}
              alt={selectedToken.symbol}
              width={32}
              height={32}
              className="rounded-full"
            />
          ) : (
            <div className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center">
              <svg className="w-4 h-4 text-white/60" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
              </svg>
            </div>
          )}
          <span className="text-white font-medium">
            {selectedToken?.symbol || t('selectToken')}
          </span>
        </div>
        <svg className="w-5 h-5 text-white/60" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
        </svg>
      </div>
    </div>
  );
};

