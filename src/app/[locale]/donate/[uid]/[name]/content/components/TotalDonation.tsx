"use client";
import React from "react";
import { useTranslations } from 'next-intl';
import BigNumber from "bignumber.js";
import { TokenInfo } from "@/hooks/useDonationForm";

interface TotalDonationProps {
  amount: string;
  selectedToken: TokenInfo | null;
  calculateUSDValue: (amount: string, tokenSymbol: string) => string;
}

export const TotalDonation: React.FC<TotalDonationProps> = ({
  amount,
  selectedToken,
  calculateUSDValue,
}) => {
  const t = useTranslations('donate');

  return (
    <div className="mb-8">
      <div className="flex justify-between items-center p-4 bg-linear-to-r from-purple-500/10 to-pink-500/10 rounded-xl border border-purple-500/20">
        <span className="text-white/80 font-medium">{t('totalDonation')}</span>
        <span className="text-white font-bold text-lg">
          {amount && selectedToken
            ? (() => {
                const usdValueStr = calculateUSDValue(amount, selectedToken.symbol);
                const usdValueBN = new BigNumber(usdValueStr || 0);
                return `$${usdValueBN.decimalPlaces(2, BigNumber.ROUND_DOWN).toFixed(2)}`;
              })()
            : "---"}
        </span>
      </div>
    </div>
  );
};

