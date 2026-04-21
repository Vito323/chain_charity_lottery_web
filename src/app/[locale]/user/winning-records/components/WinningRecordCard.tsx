'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { useLocale, useTranslations } from 'next-intl';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import 'dayjs/locale/zh-cn';
import 'dayjs/locale/en';
import { type RarityType } from '@/app/[locale]/nft-market/types';
import { renderTicketByDna } from '@/service/asset';
import { goldShimmerStyle, rarityConfig } from '@/utils/lottery';

dayjs.extend(customParseFormat);

export type WinningType = 'lottery' | 'follow';

export interface WinningRecord {
  id: string;
  ticketImage: string;
  ticketDna: string;
  rarity: RarityType;
  drawNumber: string;
  winningType: WinningType;
  prizeAmount: number;
  prizeCurrency: string;
  winningTime: string;
}

interface WinningRecordCardProps {
  record: WinningRecord;
  animationDelay?: number;
}

const WinningRecordCard: React.FC<WinningRecordCardProps> = ({ 
  record, 
  animationDelay = 0 
}) => {
  const t = useTranslations('lottery.winningRecords.card');
  const tCommon = useTranslations('common');
  const locale = useLocale();
  const [imageUrl, setImageUrl] = useState<string>('');
  const [isLoadingImage, setIsLoadingImage] = useState(true);
  const [imageError, setImageError] = useState(false);
  const rarityStyle = rarityConfig[record.rarity] || rarityConfig.common;
  const isMythic = record.rarity === 'mythic';

  useEffect(() => {
    const loadImage = async () => {
      if (!record.ticketDna) {
        setImageUrl(record.ticketImage || '/images/placeholder-all.png');
        setIsLoadingImage(false);
        return;
      }

      try {
        setIsLoadingImage(true);
        setImageError(false);
        const dnaWithoutPrefix = record.ticketDna.startsWith('0x') || record.ticketDna.startsWith('0X')
          ? record.ticketDna.slice(2)
          : record.ticketDna;
        const renderedImageUrl = await renderTicketByDna(dnaWithoutPrefix);
        setImageUrl(renderedImageUrl);
      } catch {
        setImageError(true);
        setImageUrl(record.ticketImage || '/images/placeholder-all.png');
      } finally {
        setIsLoadingImage(false);
      }
    };
    loadImage();
  }, [record.ticketDna, record.ticketImage]);

  const isSvgImage = imageUrl.includes('/render/') || imageUrl.includes('.svg') || imageUrl.startsWith('data:image/svg+xml');
  const dateLocale = locale === 'zh' ? 'zh-cn' : 'en';

  const formatTime = (timeString: string) => {
    if (!timeString) {
      return {
        date: '',
        time: '',
      };
    }

    const parsed = dayjs(timeString, ['YYYY-MM-DD HH:mm', 'YYYY-MM-DD HH:mm:ss'], true);
    const timeValue = parsed.isValid() ? parsed : dayjs(timeString);
    if (!timeValue.isValid()) {
      return {
        date: '',
        time: '',
      };
    }

    const localized = timeValue.locale(dateLocale);
    return {
      date: localized.format(locale === 'zh' ? 'YYYY年M月D日' : 'MMM D, YYYY'),
      time: localized.format('HH:mm'),
    };
  };

  const formattedTime = formatTime(record.winningTime);

  return (
    <motion.div
    initial={{ opacity: 0, y: 30 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{
      duration: 0.6,
      delay: animationDelay,
      ease: 'easeOut',
    }}
    className="group relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-b from-slate-900/90 via-slate-950/95 to-slate-950/95 backdrop-blur-md shadow-lg shadow-black/40 will-change-transform"
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
    <div className="relative p-3 sm:p-4 md:p-5">
      {/* Image Container */}
      <div className="block">
      <div
        className="relative mb-3 md:mb-4 rounded-xl overflow-hidden bg-linear-to-br from-slate-800 to-slate-900 cursor-pointer"
        style={{ border: `2px solid ${rarityStyle.borderColor}` }}
      >
        <div className="relative w-full min-w-[280px] min-h-[176px]" style={{ aspectRatio: '16/10' }}>
          {isLoadingImage && (
            <div className="absolute inset-0 flex items-center justify-center bg-linear-to-br from-slate-800 to-slate-900">
              <div className="w-8 h-8 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            </div>
          )}
          {!isLoadingImage && imageUrl && (
            <>
              {isSvgImage ? (
                <img
                  src={imageUrl}
                  alt={`${tCommon('images.winningTicket')} ${record.id}`}
                  className="w-full h-full object-cover transition-transform duration-300 ease-out group-hover:scale-105"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = '/images/placeholder-all.png';
                    setImageError(true);
                  }}
                />
              ) : (
                <Image
                  src={imageUrl}
                  alt={`${tCommon('images.winningTicket')} ${record.id}`}
                  fill
                  className="object-cover transition-transform duration-300 ease-out group-hover:scale-105"
                  style={{ willChange: 'transform' }}
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  unoptimized={imageUrl.startsWith('data:')}
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = '/images/placeholder-all.png';
                    setImageError(true);
                  }}
                />
              )}
            </>
          )}
          {!isLoadingImage && (!imageUrl || imageError) && (
            <Image
              src="/images/placeholder-all.png"
              alt={`${tCommon('images.winningTicket')} ${record.id}`}
              fill
              className="object-cover"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            />
          )}
          <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent" />
          {isMythic && !isLoadingImage && imageUrl && (
            <>
              <style>{goldShimmerStyle}</style>
              <div
                className="absolute inset-0 pointer-events-none overflow-hidden"
                style={{ borderRadius: '0.75rem' }}
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
    </div>

    {/* Rarity Badge */}
    <div className="mb-3 md:mb-4">
      <span
        className={`inline-flex items-center px-2 md:px-3 py-0.5 md:py-1 rounded-full text-xs md:text-sm font-semibold ${rarityStyle.color} bg-gradient-to-r ${rarityStyle.bgGradient} border`}
        style={{ borderColor: rarityStyle.borderColor }}
      >
        {tCommon(`rarity.${record.rarity}`)}
      </span>
    </div>

    {/* Draw Number */}
    <div className="mb-2 md:mb-3">
      <div className="text-white/60 text-xs md:text-sm mb-1">{t('drawNumber')}</div>
      <div className="text-white font-semibold text-sm md:text-base">
        #{record.drawNumber}
      </div>
    </div>

    {/* Prize Amount */}
    <div className="mb-2 md:mb-3">
      <div className="text-white/60 text-xs md:text-sm mb-1">{t('prize')}</div>
      <div className="text-emerald-400 font-bold text-sm md:text-base">
        {record.prizeAmount.toLocaleString(undefined, {
          minimumFractionDigits: 6,
          maximumFractionDigits: 6,
        })} {record.prizeCurrency}
      </div>
    </div>

    {/* Winning Time */}
    <div className="pt-2 border-t border-white/10">
      <div className="text-white/60 text-xs md:text-sm mb-1">{t('winningTime')}</div>
      <div className="text-white/80 text-xs">
        {formattedTime.date} {formattedTime.time}
      </div>
    </div>
  </div>
</motion.div>
  );
};

export default WinningRecordCard;

