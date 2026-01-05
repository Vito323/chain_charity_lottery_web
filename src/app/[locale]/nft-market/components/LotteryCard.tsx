'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { LotterySeries } from '@/service/lottery';
import { RarityType } from '../types';
import { rankToRarity, rarityConfig, goldShimmerStyle } from '@/utils/lottery';
import { renderTicket } from '@/service/asset';

interface LotteryCardProps {
  ticket: LotterySeries;
  type: 'new' | 'market';
  animationDelay?: number;
}

const LotteryCard: React.FC<LotteryCardProps> = ({ ticket, type, animationDelay = 0 }) => {
  const t = useTranslations('nftMarket');
  const tCommon = useTranslations('common');
  const router = useRouter();
  
  // SVG 状态
  const [svgUrl, setSvgUrl] = useState<string | null>(null);
  const [isLoadingSvg, setIsLoadingSvg] = useState(true);
  const [svgError, setSvgError] = useState(false);
  
  // 根据 rank 转换为 rarity
  const rarity = rankToRarity(ticket.rank);
  const rarityStyle = rarityConfig[rarity];

  console.log(rarity);
  
  // 调用 renderTicket 获取 SVG
  useEffect(() => {
    const fetchSvg = async () => {
      try {
        setIsLoadingSvg(true);
        setSvgError(false);
        const svgDataUrl = await renderTicket(ticket.id.toString());
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
  
  // 格式化数据
  const currency = 'CCT';
  const basicWinRate = `1/${ticket.rate}`;
  const maxPrize = `${ticket.highest.toLocaleString()} USDT`;
  const redemptionCost = ticket.price.toString();

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.6,
        delay: animationDelay,
        ease: 'easeOut',
      }}
      className="group relative overflow-hidden rounded-2xl border border-white/10 bg-linear-to-b from-slate-900/90 via-slate-950/95 to-slate-950/95 backdrop-blur-md shadow-lg shadow-black/40 will-change-transform"
      style={{
        transform: 'translateZ(0)',
        transition: 'transform 0.2s cubic-bezier(0.4, 0, 0.2, 1), border-color 0.2s ease',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-8px) translateZ(0)';
        e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.2)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0) translateZ(0)';
        e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
      }}
    >
      {/* Glow effect */}
      <div
        className={`pointer-events-none absolute inset-x-[-40%] top-[-40%] h-40 bg-linear-to-r ${rarityStyle.bgGradient} opacity-0 blur-3xl transition-opacity duration-200 group-hover:opacity-40`}
        style={{ willChange: 'opacity' }}
      />

      {/* Card Content */}
      <div className="relative p-4 md:p-3">
        {/* Image Container - Clickable Link */}
        <Link 
          href={`/nft-market/${ticket.id}?type=${type}`}
          onClick={() => {
            // 存储 LotterySeries 数据到本地存储
            const storageKey = `lottery_ticket_${ticket.id}`;
            localStorage.setItem(storageKey, JSON.stringify(ticket));
          }}
          className="block"
        >
          <div 
            className="relative mb-3 md:mb-4 rounded-md overflow-hidden bg-linear-to-br from-slate-800 to-slate-900 cursor-pointer"
            style={{ 
              border: `2px solid ${rarityStyle.borderColor}`,
            }}
          >
            {/* 16:10 比例容器，移动端最小尺寸 280x176，桌面端标准尺寸 350x220 */}
            <div 
              className="relative w-full min-w-[280px] min-h-[176px]"
              style={{ aspectRatio: '16/10' }}
            >
              {isLoadingSvg ? (
                <div className="absolute inset-0 flex items-center justify-center bg-slate-800/50">
                  <div className="w-8 h-8 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                </div>
              ) : svgUrl && !svgError ? (
                <img
                  src={svgUrl}
                  alt={`${tCommon('images.lotteryTicket')} ${ticket.id}`}
                  className="w-full h-full object-cover"
                  onError={() => {
                    setSvgError(true);
                  }}
                />
              ) : (
                <Image
                  src={ticket.src}
                  alt={`${tCommon('images.lotteryTicket')} ${ticket.id}`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 280px, (max-width: 1024px) 350px, 350px"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = '/images/placeholder-all.png';
                  }}
                />
              )}
              <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent" />
              
              {/* 黄金闪烁效果 - 仅在 rank 5 (mythic) 时显示 */}
              {ticket.rank === 5 && !isLoadingSvg && svgUrl && (
                <>
                  <style>{goldShimmerStyle}</style>
                  <div 
                    className="absolute inset-0 pointer-events-none overflow-hidden"
                    style={{
                      borderRadius: '0.75rem'
                    }}
                  >
                    <div 
                      className="absolute inset-0"
                      style={{
                        background: 'linear-gradient(90deg, transparent 0%, rgba(255, 240, 120, 0.4) 30%, rgba(255, 250, 150, 0.6) 50%, rgba(255, 240, 120, 0.4) 70%, transparent 100%)',
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
        </Link>

        {/* Rarity Badge */}
        <div className="mb-3 md:mb-4">
          <span
            className={`inline-flex items-center px-2 md:px-3 py-0.5 md:py-1 rounded-full text-xs md:text-sm font-semibold ${rarityStyle.color} bg-linear-to-r ${rarityStyle.bgGradient} border ${rarityStyle.borderColor}`}
          >
            {tCommon(`rarity.${rarity}`)}
          </span>
        </div>

        {/* Content based on type */}
        {type === 'new' ? (
          <div className="space-y-2 md:space-y-3">
            {/* Basic Win Rate */}
            <div className="flex items-center justify-between text-xs md:text-sm">
              <span className="text-white/60">{t('card.basicWinRate')}</span>
              <span className="text-white font-semibold">{basicWinRate}</span>
            </div>

            {/* Max Prize */}
            <div className="flex items-center justify-between text-xs md:text-sm">
              <span className="text-white/60">{t('card.maxPrize')}</span>
              <span className="text-white font-semibold">{maxPrize}</span>
            </div>

            {/* Redemption Cost */}
            <div className="flex items-center justify-between pt-2 border-t border-white/10">
              <span className="text-white/60 text-xs md:text-sm">{t('card.redemptionCost')}</span>
              <span className="text-white font-bold text-sm md:text-base">
                {parseFloat(redemptionCost).toLocaleString()} {currency}
              </span>
            </div>
          </div>
        ) : (
          <div className="space-y-2 md:space-y-3">
            {/* Redemption Cost */}
            <div className="flex items-center justify-between text-xs md:text-sm">
              <span className="text-white/60">{t('card.redemptionCost')}</span>
              <span className="text-white font-semibold">
                {parseFloat(redemptionCost).toLocaleString()} {currency}
              </span>
            </div>

            {/* Sale Price - 目前使用 price 作为 salePrice，后续可根据实际需求调整 */}
            <div className="flex items-center justify-between pt-2 border-t border-white/10">
              <span className="text-white/60 text-xs md:text-sm">{t('card.salePrice')}</span>
              <span className="text-white font-bold text-sm md:text-base">
                {parseFloat(redemptionCost).toLocaleString()} {currency}
              </span>
            </div>
          </div>
        )}

        {/* Action Button */}
        <button
          onClick={() => {
            // 存储 LotterySeries 数据到本地存储
            const storageKey = `lottery_ticket_${ticket.id}`;
            localStorage.setItem(storageKey, JSON.stringify(ticket));
            router.push(`/nft-market/${ticket.id}?type=${type}`);
          }}  
          className={`w-full mt-3 md:mt-4 py-2 md:py-2.5 rounded-xl cursor-pointer font-semibold text-xs md:text-sm lg:text-base bg-linear-to-r ${rarityStyle.bgGradient} border ${rarityStyle.borderColor} text-white transition-all duration-200 ease-out hover:scale-[1.02] hover:shadow-lg hover:shadow-purple-500/20 active:scale-[0.98]`}
          style={{ willChange: 'transform' }}
        >
          {type === 'new' ? t('card.purchase') : t('card.buyNow')}
        </button>
      </div>
    </motion.div>
  );
};

export default LotteryCard;

