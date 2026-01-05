import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { LotteryTicket } from '../types';
import { RarityType } from '@/app/[locale]/nft-market/types';
import { renderTicket } from '@/service/asset';
import { rarityConfig, goldShimmerStyle } from '@/utils/lottery';

interface TicketImageProps {
  ticket: LotteryTicket;
  type: 'new' | 'market' | 'hold' | 'listed';
}

export const TicketImage: React.FC<TicketImageProps> = ({ ticket, type }) => {
  const t = useTranslations('nftDetail.stats');
  const tCommon = useTranslations('common');
  
  // SVG 状态
  const [svgUrl, setSvgUrl] = useState<string | null>(null);
  const [isLoadingSvg, setIsLoadingSvg] = useState(true);
  const [svgError, setSvgError] = useState(false);
  
  // 将 rarity 字符串转换为 RarityType
  const rarity = (ticket.rarity?.toLowerCase() || 'common') as RarityType;
  const rarityStyle = rarityConfig[rarity] || rarityConfig.common;
  const isMythic = rarity === 'mythic';
  
  // 调用 renderTicket 获取 SVG
  useEffect(() => {
    const fetchSvg = async () => {
      try {
        setIsLoadingSvg(true);
        setSvgError(false);
        const svgDataUrl = await renderTicket(ticket.id);
        setSvgUrl(svgDataUrl);
      } catch (error) {
        console.error('Failed to render ticket SVG:', error);
        setSvgError(true);
      } finally {
        setIsLoadingSvg(false);
      }
    };

    fetchSvg();
  }, [ticket.id]);
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="relative mb-8 md:mb-12"
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
        {/* Left: NFT Image - 16:10 比例 */}
        <div 
          className="relative rounded-xl overflow-hidden bg-slate-900/50 backdrop-blur-md shadow-xl"
          style={{ 
            border: `2px solid ${rarityStyle.borderColor}`,
          }}
        >
          <div 
            className="relative w-full max-w-md mx-auto lg:max-w-none"
            style={{ aspectRatio: '16/10' }}
          >
            {isLoadingSvg ? (
              <div className="absolute inset-0 flex items-center justify-center bg-slate-800/50">
                <div className="w-8 h-8 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              </div>
            ) : svgUrl && !svgError ? (
              <img
                src={svgUrl}
                alt={`${tCommon('images.lotteryTicket')} ${ticket.series} - ${ticket.level}`}
                className="w-full h-full object-cover"
                onError={() => {
                  setSvgError(true);
                }}
              />
            ) : (
              <Image
                src={ticket.image || '/images/placeholder-all.png'}
                alt={`${tCommon('images.lotteryTicket')} ${ticket.series} - ${ticket.level}`}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
                priority
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = '/images/placeholder-all.png';
                }}
              />
            )}
            
            {/* 黄金闪烁效果 - 仅在 mythic (rank 5) 时显示 */}
            {isMythic && (
              <>
                <style>{goldShimmerStyle}</style>
                <div 
                  className="absolute inset-0 pointer-events-none overflow-hidden"
                  style={{
                    borderRadius: '0.375rem'
                  }}
                >
                  <div 
                    className="absolute inset-0"
                    style={{
                      background: 'linear-gradient(90deg, transparent 0%, rgba(255, 215, 0, 0.6) 30%, rgba(255, 223, 0, 0.9) 50%, rgba(255, 215, 0, 0.6) 70%, transparent 100%)',
                      animation: 'goldShimmer 3s ease-in-out infinite',
                      width: '50%',
                      height: '100%',
                    }}
                  />
                </div>
              </>
            )}
          </div>
        </div>

        {/* Right: Ticket Info */}
        <div className="flex flex-col justify-center space-y-4 sm:space-y-6">
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-4 sm:p-6 border border-white/10">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-4">
              {ticket.title}
            </h2>
            <p className="text-base sm:text-lg text-white/70 mb-4">{tCommon(`rarity.${ticket.rarity}`)}</p>
            
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
                    <div className="h-8 w-8 rounded-full bg-white/10 shrink-0" />
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
                      <div className="h-8 w-8 rounded-full bg-white/10 shrink-0" />
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

