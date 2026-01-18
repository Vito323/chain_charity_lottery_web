"use client";
import React, { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { useAccount } from "wagmi";
import { TokenInfo } from "@/hooks/useDonationForm";
import { useMasterContract } from "@/hooks/useMasterContract";
import { userToken } from "@/service/user";
import { formatCurrency } from "@/utils/currency";

interface TokenSelectionProps {
  onTokenChange: (token: TokenInfo | null) => void;
}

export const TokenSelection: React.FC<TokenSelectionProps> = ({
  onTokenChange,
}) => {
  const t = useTranslations("donate");
  const tCommon = useTranslations("common");
  const { address, isConnected } = useAccount();
  const { getDonationToken } = useMasterContract();
  
  const [usdtAddress, setUsdtAddress] = useState<string | null>(null);
  const [usdtBalance, setUsdtBalance] = useState<string>("0");
  const [usdtDecimals, setUsdtDecimals] = useState<number>(18);
  const [isBalanceLoading, setIsBalanceLoading] = useState(false);

  // 获取 USDT 合约地址
  useEffect(() => {
    const fetchUsdtAddress = async () => {
      try {
        const address = await getDonationToken();
        if (address) {
          setUsdtAddress(address);
        }
      } catch (error) {
        console.error('Failed to fetch USDT token address:', error);
      }
    };

    fetchUsdtAddress();
  }, [getDonationToken]);

  // 使用 userToken API 获取 USDT 余额和 decimals
  useEffect(() => {
    const fetchUsdtTokenInfo = async () => {
      if (!isConnected || !address || !usdtAddress) {
        setUsdtBalance("0");
        return;
      }

      setIsBalanceLoading(true);
      try {
        const response = await userToken(address, usdtAddress);
        if (response?.data) {
          const { balance, decimals } = response.data;
          setUsdtBalance(balance);
          setUsdtDecimals(decimals || 18);
        }
      } catch (error) {
        console.error('Failed to fetch USDT token info:', error);
        setUsdtBalance("0");
      } finally {
        setIsBalanceLoading(false);
      }
    };

    fetchUsdtTokenInfo();
  }, [isConnected, address, usdtAddress]);

  // 构建USDT TokenInfo
  const usdtTokenInfo = useMemo<TokenInfo | null>(() => {
    if (!isConnected || !usdtAddress) {
      return null;
    }

    return {
      symbol: "USDT",
      name: "Tether USD",
      decimals: usdtDecimals,
      address: usdtAddress,
      balance: usdtBalance,
      displayBalance: usdtBalance,
      isNative: false,
    };
  }, [isConnected, usdtAddress, usdtBalance, usdtDecimals]);

  // 当USDT信息变化时，通知父组件
  useEffect(() => {
    onTokenChange(usdtTokenInfo);
  }, [usdtTokenInfo, onTokenChange]);

  return (
    <div className="mb-6">
      {/* <label className="block text-sm font-medium text-white/80 mb-3">{t('selectToken')}</label> */}
      <div className="flex items-center gap-3 p-4 bg-white/5 rounded-xl border border-white/10">
        <div className="flex items-center gap-3 flex-1">
          {isConnected ? (
            <>
              <Image
                src="/icons/tokens/USDT.svg"
                alt="USDT"
                width={32}
                height={32}
                className="rounded-full"
              />
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-white font-medium">USDT</span>
                  {isBalanceLoading && (
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white/80 rounded-full animate-spin"></div>
                  )}
                </div>
                {!isBalanceLoading && (
                  <p className="text-xs text-white/60 mt-1">
                    {tCommon('labels.balance', { balance: formatCurrency(usdtBalance || 0, '', 6), symbol: "USDT" })}
                  </p>
                )}
              </div>
            </>
          ) : (
            <>
              <div className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center">
                <svg
                  className="w-4 h-4 text-white/60"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <span className="text-white/60 font-medium">
              {tCommon('actions.connectWalletFirst')}
              </span>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
