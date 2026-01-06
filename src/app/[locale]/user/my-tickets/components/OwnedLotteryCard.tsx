'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { RarityType } from '@/app/[locale]/nft-market/types';
import { useRouter } from 'next/navigation';
import { rarityConfig, goldShimmerStyle } from '@/utils/lottery';

interface OwnedLotteryTicket {
  id: string;
  image: string;
  rarity: RarityType;
  rarityLabel: string;
  purchasePrice: number; // Purchase price in CCT
  currency: string;
}

interface OwnedLotteryCardProps {
  ticket: OwnedLotteryTicket;
  animationDelay?: number;
  isListed?: boolean;
  onSell?: (ticketId: string) => void;
  onDelist?: (ticketId: string) => void;
}

const OwnedLotteryCard: React.FC<OwnedLotteryCardProps> = ({ 
  ticket, 
  animationDelay = 0,
  isListed = false,
  onSell,
  onDelist
}) => {
  const t = useTranslations('myTickets.card');
  const tCommon = useTranslations('common');
  const rarityStyle = rarityConfig[ticket.rarity];
  const [isProcessing, setIsProcessing] = useState(false);
  const router = useRouter();

  const handleSell = async () => {
    router.push(`/nft-market/${ticket.id}?type=sell`);
  };

  const handleDelist = async () => {
    router.push(`/nft-market/${ticket.id}?type=delist`);
  };

  // 检查图片是否是 SVG（来自 render API 或 .svg 扩展名）
  const isSvgImage = ticket.image.includes('/render/') || 
                     ticket.image.includes('.svg') || 
                     ticket.image.startsWith('data:image/svg+xml');

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
        <Link href={`/nft-market/${ticket.id}?type=${isListed ? 'listed' : 'hold'}`} className="block">
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
              {isSvgImage ? (
                // 使用普通 img 标签处理 SVG
                <img
                  src={ticket.image}
                  alt={`${tCommon('images.lotteryTicket')} ${ticket.id}`}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = '/images/placeholder-all.png';
                  }}
                />
              ) : (
                // 使用 Next.js Image 组件处理其他图片格式
                <Image
                  src={ticket.image}
                  alt={`${tCommon('images.lotteryTicket')} ${ticket.id}`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 280px, (max-width: 1024px) 350px, 350px"
                  unoptimized={ticket.image.startsWith('data:')}
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = '/images/placeholder-all.png';
                  }}
                />
              )}
              <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent" />
              
              {/* 黄金闪烁效果 - 仅在 mythic 时显示 */}
              {ticket.rarity === 'mythic' && (
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
            className={`inline-flex items-center px-2 md:px-3 py-0.5 md:py-1 rounded-full text-xs md:text-sm font-semibold ${rarityStyle.color} bg-linear-to-r ${rarityStyle.bgGradient} border`}
            style={{ borderColor: rarityStyle.borderColor }}
          >
            {ticket.rarityLabel}
          </span>
        </div>

        {/* Purchase Price */}
        <div className="mb-3 md:mb-4">
          <div className="flex items-center justify-between">
            <span className="text-white/60 text-xs md:text-sm">{t('purchasePrice')}</span>
            <span className="text-white font-bold text-sm md:text-base">
              {ticket.purchasePrice.toLocaleString(undefined, {
                minimumFractionDigits: 3,
                maximumFractionDigits: 3,
              })} {ticket.currency}
            </span>
          </div>
        </div>

        {/* Sell/Delist Button */}
        <button
          onClick={isListed ? handleDelist : handleSell}
          disabled={isProcessing}
          className={`w-full py-2 md:py-2.5 rounded-xl font-semibold text-xs md:text-sm lg:text-base bg-white/10 border border-white/20 text-white transition-all duration-200 ease-out hover:bg-white/20 hover:scale-[1.02] hover:shadow-lg active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed ${
            isProcessing ? 'cursor-wait' : ''
          }`}
          style={{ willChange: 'transform' }}
        >
          {isProcessing 
            ? tCommon('actions.processing') 
            : isListed 
              ? t('delist') 
              : t('sell')}
        </button>
      </div>
    </motion.div>
  );
};

export default OwnedLotteryCard;

