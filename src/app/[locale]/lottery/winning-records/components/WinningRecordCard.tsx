'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';

export type WinningType = 'lottery' | 'follow';

export interface WinningRecord {
  id: string;
  ticketImage: string;
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
  const winningTypeLabel = record.winningType === 'lottery' 
    ? t('lotteryWon') 
    : t('followWon');
  
  const winningTypeBadge = record.winningType === 'lottery'
    ? 'from-blue-500/10 to-blue-600/5 border-blue-500/30 text-blue-400'
    : 'from-purple-500/10 to-purple-600/5 border-purple-500/30 text-purple-400';

  // Format winning time
  const formatTime = (timeString: string) => {
    try {
      const [date, time] = timeString.split(' ');
      const [year, month, day] = date.split('-');
      const [hour, minute] = time.split(':');
      const dateObj = new Date(
        parseInt(year),
        parseInt(month) - 1,
        parseInt(day),
        parseInt(hour),
        parseInt(minute)
      );
      
      return {
        date: dateObj.toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
        }),
        time: dateObj.toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
        }),
      };
    } catch {
      return {
        date: timeString.split(' ')[0] || '',
        time: timeString.split(' ')[1] || '',
      };
    }
  };

  const formattedTime = formatTime(record.winningTime);

  return (
    <Link href={`/lottery/winning/${record.id}?type=${record.winningType}`} className="block">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: 0.6,
          delay: animationDelay,
          ease: 'easeOut',
        }}
        className="group relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-b from-slate-900/90 via-slate-950/95 to-slate-950/95 backdrop-blur-md shadow-lg shadow-black/40 will-change-transform cursor-pointer"
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
          className={`pointer-events-none absolute inset-x-[-40%] top-[-40%] h-40 bg-gradient-to-r ${winningTypeBadge} opacity-0 blur-3xl transition-opacity duration-200 group-hover:opacity-40`}
          style={{ willChange: 'opacity' }}
        />

        {/* Card Content */}
        <div className="relative p-3 sm:p-4 md:p-5">
          {/* Image Container */}
          <div className="block">
          <div className="relative mb-3 md:mb-4 rounded-xl overflow-hidden bg-gradient-to-br from-slate-800 to-slate-900 cursor-pointer">
            <div className="aspect-[3/4] relative">
              <Image
                src={record.ticketImage}
                alt={`Winning Ticket ${record.id}`}
                fill
                className="object-cover transition-transform duration-300 ease-out group-hover:scale-105"
                style={{ willChange: 'transform' }}
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = '/images/placeholder-all.png';
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            </div>
          </div>
        </div>

        {/* Rarity Badge */}
        <div className="mb-3 md:mb-4">
          <span
            className={`inline-flex items-center px-2 md:px-3 py-0.5 md:py-1 rounded-full text-xs md:text-sm font-semibold bg-gradient-to-r ${winningTypeBadge} border`}
          >
            {winningTypeLabel}
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
              minimumFractionDigits: 0,
              maximumFractionDigits: 3,
            })} {record.prizeCurrency}
          </div>
        </div>

        {/* Winning Time */}
        <div className="pt-2 border-t border-white/10">
          <div className="text-white/60 text-xs md:text-sm mb-1">{t('winningTime')}</div>
          <div className="text-white/80 text-xs">
            {formattedTime.date}
          </div>
          <div className="text-white/60 text-xs">
            {formattedTime.time}
          </div>
        </div>
      </div>
    </motion.div>
    </Link>
  );
};

export default WinningRecordCard;

