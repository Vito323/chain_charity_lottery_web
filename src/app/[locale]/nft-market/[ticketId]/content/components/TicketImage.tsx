import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { LotteryTicket } from '../types';

interface TicketImageProps {
  ticket: LotteryTicket;
  type: 'new' | 'market' | 'hold' | 'listed';
}

export const TicketImage: React.FC<TicketImageProps> = ({ ticket, type }) => {
  const t = useTranslations('nftDetail.stats');
  const tCommon = useTranslations('common');
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="relative mb-8 md:mb-12"
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
        {/* Left: NFT Image */}
        <div className="relative rounded-2xl overflow-hidden border border-white/10 bg-slate-900/50 backdrop-blur-md shadow-xl">
          <div className="relative w-full aspect-square max-w-md mx-auto lg:max-w-none">
            <Image
              src="/images/placeholder-all.png"
              alt={`${tCommon('images.lotteryTicket')} ${ticket.series} - ${ticket.level}`}
              fill
              className="object-contain p-4"
              sizes="(max-width: 1024px) 100vw, 50vw"
              priority
            />
          </div>
        </div>

        {/* Right: Ticket Info */}
        <div className="flex flex-col justify-center space-y-4 sm:space-y-6">
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-4 sm:p-6 border border-white/10">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-4">
              {ticket.series}
            </h2>
            <p className="text-base sm:text-lg text-white/70 mb-4">{ticket.level}</p>
            
            <div className="grid grid-cols-3 gap-4 mb-4">
              <div className="text-center">
                <div className="text-lg sm:text-xl font-bold text-white mb-1">
                  {ticket.rarityPercentage}
                </div>
                <div className="text-white/60 text-xs sm:text-sm">{t('rarity')}</div>
              </div>
              <div className="text-center">
                <div className="text-lg sm:text-xl font-bold text-emerald-400 mb-1">
                  {ticket.maxPrize}
                </div>
                <div className="text-white/60 text-xs sm:text-sm">{t('maxPrize')}</div>
              </div>
              <div className="text-center">
                <div className="text-lg sm:text-xl font-bold text-white mb-1">
                  {ticket.basicWinRate}
                </div>
                <div className="text-white/60 text-xs sm:text-sm">{t('winRate')}</div>
              </div>
            </div>

            {(type === 'market' || type === 'listed') && ticket.salePrice && ticket.validUntil && ticket.holderAddress && (
              <div className="pt-4 border-t border-white/10 space-y-3">
                {type === 'listed' && (
                  <div className="mb-3">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs sm:text-sm font-semibold bg-white/10 text-white/80 border border-white/20">
                      {t('onSale')}
                    </span>
                  </div>
                )}
                <div>
                  <div className="text-white/60 text-xs sm:text-sm mb-1">{tCommon('labels.salePrice')}</div>
                  <div className="text-lg sm:text-xl font-bold text-white">
                    {ticket.salePrice} {ticket.currency}
                  </div>
                </div>
                <div>
                  <div className="text-white/60 text-xs sm:text-sm mb-1">{t('validUntil')}</div>
                  <div className="text-sm sm:text-base font-semibold text-white/90">
                    {ticket.validUntil}
                  </div>
                </div>
                <div>
                  <div className="text-white/60 text-xs sm:text-sm mb-2">{t('holder')}</div>
                  <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-full bg-white/10 flex-shrink-0" />
                    <div className="font-mono text-xs sm:text-sm text-white/80 truncate">
                      {ticket.holderAddress.slice(0, 6)}...{ticket.holderAddress.slice(-4)}
                    </div>
                  </div>
                </div>
              </div>
            )}
            {type === 'hold' && (
              <div className="pt-4 border-t border-white/10 space-y-3">
                <div>
                  <div className="text-white/60 text-xs sm:text-sm mb-1">{tCommon('labels.purchasePrice')}</div>
                  <div className="text-lg sm:text-xl font-bold text-white">
                    {ticket.salePrice || ticket.redemptionCost} {ticket.currency}
                  </div>
                </div>
                {ticket.holderAddress && (
                  <div>
                    <div className="text-white/60 text-xs sm:text-sm mb-2">{t('holder')}</div>
                    <div className="flex items-center gap-2">
                      <div className="h-8 w-8 rounded-full bg-white/10 flex-shrink-0" />
                      <div className="font-mono text-xs sm:text-sm text-white/80 truncate">
                        {ticket.holderAddress.slice(0, 6)}...{ticket.holderAddress.slice(-4)}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

