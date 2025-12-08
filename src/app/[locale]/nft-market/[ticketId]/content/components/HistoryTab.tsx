import React from 'react';
import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { PurchaseRecord, WinningRecord } from '../types';

interface HistoryTabProps {
  purchaseRecords: PurchaseRecord[];
  winningRecords: WinningRecord[];
}

const formatAddress = (address: string) => {
  if (address.length <= 10) return address;
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
};

export const HistoryTab: React.FC<HistoryTabProps> = ({
  purchaseRecords,
  winningRecords,
}) => {
  const t = useTranslations('nftDetail.history');
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="mb-8 md:mb-12"
    >
      <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-4 sm:p-6 md:p-8 border border-white/10">
        {/* Summary Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 md:gap-8 mb-6 md:mb-8 pb-6 md:pb-8 border-b border-white/10">
          <div className="text-center">
            <div className="text-xs sm:text-sm text-white/60 mb-1 sm:mb-2">{t('generation')}</div>
            <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-white">{t('generationValue')}</div>
          </div>
          <div className="text-center">
            <div className="text-xs sm:text-sm text-white/60 mb-1 sm:mb-2">{t('baseValue')}</div>
            <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-emerald-400">{t('baseValueAmount')}</div>
          </div>
          <div className="text-center">
            <div className="text-xs sm:text-sm text-white/60 mb-1 sm:mb-2">{t('familyBadge')}</div>
            <div className="inline-flex items-center justify-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/15 text-xs sm:text-sm text-white/80">
              <svg className="w-5 h-5 text-emerald-300" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
              </svg>
              <span>{t('premiumLineage')}</span>
            </div>
          </div>
        </div>

        {/* Purchase Records */}
        <div className="mb-6 md:mb-8">
          <h3 className="text-base sm:text-lg md:text-xl font-bold text-white mb-3 sm:mb-4">
            {t('purchaseRecords')}
          </h3>
          <div className="rounded-xl border border-white/10 bg-slate-900/40 overflow-hidden">
            {/* Table Header */}
            <div className="grid grid-cols-4 gap-2 sm:gap-4 px-4 sm:px-6 py-3 bg-white/5 border-b border-white/10">
              <div className="text-xs sm:text-sm font-semibold text-white/80">{t('buyer')}</div>
              <div className="text-xs sm:text-sm font-semibold text-white/80 text-right">{t('price')}</div>
              <div className="hidden sm:block text-xs sm:text-sm font-semibold text-white/80 text-right">{t('priceClt')}</div>
              <div className="text-xs sm:text-sm font-semibold text-white/80 text-right">{t('purchaseTime')}</div>
            </div>
            {/* Table Rows */}
            <div className="divide-y divide-white/5">
              {purchaseRecords.map((record) => (
                <div
                  key={`${record.buyerAddress}-${record.time}`}
                  className="grid grid-cols-4 gap-2 sm:gap-4 px-4 sm:px-6 py-3 sm:py-4 hover:bg-white/5 transition-colors"
                >
                  <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                    <div className="h-8 w-8 sm:h-10 sm:w-10 flex-shrink-0 rounded-full bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-white/10" />
                    <span className="font-mono text-[10px] sm:text-xs text-white/90 truncate">
                      {formatAddress(record.buyerAddress)}
                    </span>
                  </div>
                  <div className="text-right">
                    <div className="text-xs sm:text-sm font-semibold text-white">{record.priceUsdt}</div>
                    <div className="text-[10px] sm:text-xs text-white/50">USDT</div>
                  </div>
                  <div className="hidden sm:block text-right">
                    <div className="text-xs sm:text-sm font-medium text-white/80">{record.priceClt}</div>
                    <div className="text-[10px] sm:text-xs text-white/50">CLT</div>
                  </div>
                  <div className="text-right">
                    <div className="text-[10px] sm:text-xs text-white/70">{record.time}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Winning Records */}
        <div>
          <h3 className="text-base sm:text-lg md:text-xl font-bold text-white mb-3 sm:mb-4">
            {t('winningRecords')}
          </h3>
          <div className="rounded-xl border border-white/10 bg-slate-900/40 overflow-hidden">
            {/* Table Header */}
            <div className="grid grid-cols-3 gap-2 sm:gap-4 px-4 sm:px-6 py-3 bg-white/5 border-b border-white/10">
              <div className="text-xs sm:text-sm font-semibold text-white/80">{t('winner')}</div>
              <div className="text-xs sm:text-sm font-semibold text-white/80 text-right">{t('prize')}</div>
              <div className="text-xs sm:text-sm font-semibold text-white/80 text-right">{t('winningTime')}</div>
            </div>
            {/* Table Rows */}
            <div className="divide-y divide-white/5">
              {winningRecords.length > 0 ? (
                winningRecords.map((record) => (
                  <div
                    key={`${record.winnerAddress}-${record.time}`}
                    className="grid grid-cols-3 gap-2 sm:gap-4 px-4 sm:px-6 py-3 sm:py-4 hover:bg-white/5 transition-colors"
                  >
                    <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                      <div className="h-8 w-8 sm:h-10 sm:w-10 flex-shrink-0 rounded-full bg-gradient-to-br from-emerald-500/20 to-blue-500/20 border border-white/10" />
                      <span className="font-mono text-[10px] sm:text-xs text-white/90 truncate">
                        {formatAddress(record.winnerAddress)}
                      </span>
                    </div>
                    <div className="text-right">
                      <div className="text-xs sm:text-sm font-semibold text-emerald-400">{record.prizeUsdt}</div>
                      <div className="text-[10px] sm:text-xs text-white/50">USDT</div>
                    </div>
                    <div className="text-right">
                      <div className="text-[10px] sm:text-xs text-white/70">{record.time}</div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="px-4 sm:px-6 py-8 text-center text-white/50 text-sm">
                  {t('noWinningRecords')}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

