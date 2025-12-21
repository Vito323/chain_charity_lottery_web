'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { RarityType } from '@/app/[locale]/nft-market/types';

interface OwnedLotteryTicket {
  id: string;
  image: string;
  rarity: RarityType;
  rarityLabel: string;
  purchasePrice: number; // Purchase price in CLT
  currency: string;
}

interface OwnedLotteryCardProps {
  ticket: OwnedLotteryTicket;
  animationDelay?: number;
  isListed?: boolean;
  onSell?: (ticketId: string) => void;
  onDelist?: (ticketId: string) => void;
}

const rarityConfig: Record<RarityType, { color: string; bgGradient: string; borderColor: string }> = {
  common: {
    color: 'text-gray-400',
    bgGradient: 'from-gray-500/10 to-gray-600/5',
    borderColor: 'border-gray-500/30',
  },
  rare: {
    color: 'text-blue-400',
    bgGradient: 'from-blue-500/10 to-blue-600/5',
    borderColor: 'border-blue-500/30',
  },
  epic: {
    color: 'text-purple-400',
    bgGradient: 'from-purple-500/10 to-purple-600/5',
    borderColor: 'border-purple-500/30',
  },
  legendary: {
    color: 'text-orange-400',
    bgGradient: 'from-orange-500/10 to-orange-600/5',
    borderColor: 'border-orange-500/30',
  },
  mythic: {
    color: 'text-yellow-400',
    bgGradient: 'from-yellow-500/10 to-yellow-600/5',
    borderColor: 'border-yellow-500/30',
  },
};

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

  const handleSell = async () => {
    if (isProcessing) return;
    
    setIsProcessing(true);
    try {
      if (onSell) {
        await onSell(ticket.id);
      }
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDelist = async () => {
    if (isProcessing) return;
    
    setIsProcessing(true);
    try {
      if (onDelist) {
        await onDelist(ticket.id);
      }
    } finally {
      setIsProcessing(false);
    }
  };

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
        className={`pointer-events-none absolute inset-x-[-40%] top-[-40%] h-40 bg-gradient-to-r ${rarityStyle.bgGradient} opacity-0 blur-3xl transition-opacity duration-200 group-hover:opacity-40`}
        style={{ willChange: 'opacity' }}
      />

      {/* Card Content */}
      <div className="relative p-3 sm:p-4 md:p-5">
        {/* Image Container - Clickable Link */}
        <Link href={`/nft-market/${ticket.id}?type=${isListed ? 'listed' : 'hold'}`} className="block">
          <div className="relative mb-3 md:mb-4 rounded-xl overflow-hidden bg-gradient-to-br from-slate-800 to-slate-900 cursor-pointer">
            <div className="aspect-[3/4] relative">
              <Image
                src={ticket.image}
                alt={`${tCommon('images.lotteryTicket')} ${ticket.id}`}
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
        </Link>

        {/* Rarity Badge */}
        <div className="mb-3 md:mb-4">
          <span
            className={`inline-flex items-center px-2 md:px-3 py-0.5 md:py-1 rounded-full text-xs md:text-sm font-semibold ${rarityStyle.color} bg-gradient-to-r ${rarityStyle.bgGradient} border ${rarityStyle.borderColor}`}
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

