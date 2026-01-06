'use client';

import React, { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { useAccount } from 'wagmi';
import { TicketImage } from './components/TicketImage';
import { BasicInfoTab } from './components/BasicInfoTab';
import LotterySellModal from '@/components/lottery-sell-modal';
import LotteryRedemptionSuccessModal from '@/components/lottery-redemption-success-modal';
import { LotteryTicket as MarketLotteryTicket } from '@/app/[locale]/nft-market/types';
import { LotteryTicket } from './types';
import { useWalletNFTs, WalletNFT } from '@/hooks/useWalletNFTs';
import { rankToRarity, getRarityPercentageFromRank } from '@/utils/lottery';

interface HoldTicketDetailProps {
  ticketId: string;
}

// Convert WalletNFT to LotteryTicket
const convertWalletNFTToTicket = (nft: WalletNFT): LotteryTicket => {
  // Extract rarity from metadata or default to common
  let rarity: string = 'common';
  let rarityLabel = 'Common';
  let purchasePrice = 0;
  let rank = 1;

  // Try to extract rarity from metadata
  if (nft.metadata) {
    const rankValue = (nft.metadata.rank as number) || (nft.metadata.rank as string);
    if (rankValue) {
      const rankNum = typeof rankValue === 'string' ? parseInt(rankValue, 10) : rankValue;
      if (!isNaN(rankNum)) {
        rank = rankNum;
        rarity = rankToRarity(rankNum);
        rarityLabel = rarity.charAt(0).toUpperCase() + rarity.slice(1);
      }
    }

    // Try to extract purchase price from metadata
    const price = (nft.metadata.price as number) || (nft.metadata.purchasePrice as number);
    if (price) {
      purchasePrice = typeof price === 'string' ? parseFloat(price) : price;
    }
  }

  // Default purchase price if not found in metadata
  if (purchasePrice === 0) {
    // Use rarity-based default prices
    switch (rarity) {
      case 'mythic':
        purchasePrice = 10000;
        break;
      case 'legendary':
        purchasePrice = 5000;
        break;
      case 'epic':
        purchasePrice = 1000;
        break;
      case 'rare':
        purchasePrice = 500;
        break;
      default:
        purchasePrice = 100;
    }
  }

  // Extract series name from metadata or use collection name
  const seriesName = (nft.metadata?.seriesName as string) || 
                     (nft.metadata?.title as string) || 
                     nft.collectionName || 
                     'BRUNO MARS SIGNATURE SERIES';
  
  const title = (nft.metadata?.title as string) || 
                (nft.metadata?.name as string) || 
                nft.name || 
                `Ticket #${nft.tokenId}`;

  // Extract other metadata fields
  const level = (nft.metadata?.template as string) || 
                (nft.metadata?.level as string) || 
                'STANDARD LEVEL';
  
  const maxPrize = (nft.metadata?.highest as number) || 
                   (nft.metadata?.maxPrize as number) || 
                   1000;
  
  const winRate = (nft.metadata?.rate as number) || 
                  (nft.metadata?.winRate as number) || 
                  2000;
  
  const redemptionCost = (nft.metadata?.price as number) || 
                        (nft.metadata?.redemptionCost as number) || 
                        purchasePrice;
  
  const educationPartner = (nft.metadata?.cooperation as string) || 
                           (nft.metadata?.educationPartner as string) || 
                           'UNESCO';
  
  const description = (nft.metadata?.description as string) || 
                      'This lottery ticket supports education initiatives';

  return {
    id: nft.id,
    series: seriesName,
    level,
    title,
    image: nft.image || '/images/placeholder-all.png',
    rarity,
    rarityLabel,
    rarityPercentage: `${getRarityPercentageFromRank(rank)}%`,
    maxPrize: `${maxPrize.toLocaleString()} USDT`,
    basicWinRate: `1/${winRate}`,
    redemptionCost: redemptionCost.toString(),
    currency: 'CCT',
    salePrice: purchasePrice.toString(),
    educationPercentage: '55%',
    educationPartner,
    educationDescription: description,
    educationPartnerFull: educationPartner,
    dnaId: nft.tokenId || nft.id,
    dnaAddress: nft.contractAddress || '0x...',
    rareLevel: `H.S${rank.toString().padStart(2, '0')}`,
    opds: `1 in ${winRate}`,
    prize: `${maxPrize.toLocaleString()} USDT`,
    rights: 'Weekly Special Draws',
    date: new Date().toLocaleString(),
    icons: ['graduation', 'music', 'books'],
  };
};

const HoldTicketDetail: React.FC<HoldTicketDetailProps> = ({ ticketId }) => {
  const t = useTranslations('nftDetail');
  const tCommon = useTranslations('common');
  const { isConnected, address } = useAccount();
  
  // Get lottery NFT contract address
  const lotteryContractAddress = useMemo(() => {
    if (typeof window === 'undefined') return null;
    return process.env.NEXT_PUBLIC_LOTTERY_NFT_CONTRACT_ADDRESS || null;
  }, []);
  
  // Fetch NFTs from wallet
  const { nfts, loading: nftsLoading, error: nftsError, refresh: refreshNFTs } = useWalletNFTs({
    pageSize: 100,
  });

  // Find the specific ticket from wallet NFTs
  const walletTicket = useMemo(() => {
    if (!isConnected || !lotteryContractAddress || !nfts.length) {
      return null;
    }

    // Filter NFTs that belong to the lottery contract
    const lotteryNFTs = nfts.filter((nft) => {
      if (!nft.contractAddress) return false;
      return nft.contractAddress.toLowerCase() === lotteryContractAddress.toLowerCase();
    });

    // Find the ticket by ticketId
    // ticketId could be:
    // 1. tokenId (e.g., "123")
    // 2. full id format (e.g., "0x...-123")
    const foundNFT = lotteryNFTs.find((nft) => {
      // Match by tokenId
      if (nft.tokenId === ticketId) return true;
      // Match by full id
      if (nft.id === ticketId) return true;
      // Match by id format: contractAddress-tokenId
      if (nft.id === `${nft.contractAddress}-${ticketId}`) return true;
      return false;
    });

    return foundNFT || null;
  }, [nfts, isConnected, lotteryContractAddress, ticketId]);

  // Convert to LotteryTicket format
  const ticket = useMemo(() => {
    if (walletTicket) {
      const convertedTicket = convertWalletNFTToTicket(walletTicket);
      // Override holderAddress with current wallet address
      if (address) {
        convertedTicket.holderAddress = address;
      }
      return convertedTicket;
    }
    return null;
  }, [walletTicket, address]);

  // Modal states
  const [isSellModalOpen, setIsSellModalOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [successModalType, setSuccessModalType] = useState<'redemption' | 'follow' | 'purchase' | 'sell'>('sell');
  const [mockTicketCount, setMockTicketCount] = useState(8);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
      },
    },
  };

  // Handle sell functionality
  const handleSell = () => {
    setIsSellModalOpen(true);
  };

  // Handle sell confirmation
  const handleSellConfirm = (salePrice: number, duration: number) => {
    console.log('Selling ticket:', ticketId, 'Price:', salePrice, 'Duration:', duration);
    // TODO: Implement actual sell API call
    // After selling, refresh NFTs to get updated data
    refreshNFTs();
    setIsSellModalOpen(false);
    setSuccessModalType('sell');
    setTimeout(() => {
      setIsSuccessModalOpen(true);
      setMockTicketCount(prev => prev + 1);
    }, 300);
  };

  // Convert detail ticket to market ticket format for success modal
  const convertToMarketTicket = (): MarketLotteryTicket => {
    if (!ticket) {
      return {
        id: ticketId,
        image: '/images/placeholder-all.png',
        rarity: 'common',
        rarityLabel: 'Common',
        redemptionCost: '0',
        currency: 'CCT',
        basicWinRate: '1/2000',
        maxPrize: '1000 USDT',
      };
    }
    return {
      id: ticket.id,
      image: ticket.image,
      rarity: ticket.rarity as MarketLotteryTicket['rarity'],
      rarityLabel: ticket.rarityLabel,
      redemptionCost: ticket.redemptionCost,
      currency: ticket.currency,
      basicWinRate: ticket.basicWinRate,
      maxPrize: ticket.maxPrize,
    };
  };

  // Loading state
  if (nftsLoading) {
    return (
      <div className="min-h-screen bg-linear-to-b from-slate-950 via-slate-900 to-slate-950">
        <main className="pt-28 md:pt-36 pb-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center py-20 bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl">
              <div className="w-8 h-8 border-2 border-white/30 border-t-white rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-white/80">{tCommon('status.loading')}</p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // Error state
  if (nftsError) {
    return (
      <div className="min-h-screen bg-linear-to-b from-slate-950 via-slate-900 to-slate-950">
        <main className="pt-28 md:pt-36 pb-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center py-20 bg-red-500/10 backdrop-blur-xl border border-red-500/20 rounded-3xl">
              <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">
                {tCommon('errors.failedToLoadTickets')}
              </h3>
              <p className="text-white/60">{nftsError}</p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // Not connected state
  if (!isConnected) {
    return (
      <div className="min-h-screen bg-linear-to-b from-slate-950 via-slate-900 to-slate-950">
        <main className="pt-28 md:pt-36 pb-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center py-20 bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl">
              <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">
                {tCommon('status.notConnected')}
              </h3>
              <p className="text-white/60">{tCommon('validation.pleaseConnectWallet')}</p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // Ticket not found state
  if (!ticket || !walletTicket) {
    return (
      <div className="min-h-screen bg-linear-to-b from-slate-950 via-slate-900 to-slate-950">
        <main className="pt-28 md:pt-36 pb-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center py-20 bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl">
              <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">
                {tCommon('empty.noDataFound')}
              </h3>
              <p className="text-white/60">
                {tCommon('empty.noItemsFound')}
              </p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-b from-slate-950 via-slate-900 to-slate-950">
      <main className="pt-28 md:pt-36 pb-20">
        <motion.div
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Header Section */}
          <motion.div variants={itemVariants} className="text-center mb-8 md:mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/15 bg-white/5 backdrop-blur-sm text-xs md:text-sm text-white/80 mb-4">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>{t('badge')}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold text-white mb-2">
              {ticket.title}
            </h1>
            <p className="text-lg md:text-xl text-white/70">
              {ticket.rarityLabel}
            </p>
          </motion.div>

          {/* Main Ticket Card - Image */}
          <TicketImage ticket={ticket} type="hold" />

          {/* Content Area */}
          <div className="relative min-h-[400px]">
            <BasicInfoTab
              ticket={ticket}
              type="hold"
              onSell={handleSell}
            />
          </div>
        </motion.div>
      </main>

      {/* Sell Modal */}
      <LotterySellModal
        isOpen={isSellModalOpen}
        onClose={() => setIsSellModalOpen(false)}
        ticketId={ticket.id}
        purchasePrice={ticket.salePrice ? parseFloat(ticket.salePrice.replace(/,/g, '')) : parseFloat(ticket.redemptionCost)}
        onConfirmSell={handleSellConfirm}
      />

      {/* Success Modal */}
      <LotteryRedemptionSuccessModal
        isOpen={isSuccessModalOpen}
        onClose={() => setIsSuccessModalOpen(false)}
        ticket={convertToMarketTicket()}
        ticketCount={mockTicketCount}
        type={successModalType}
      />
    </div>
  );
};

export default HoldTicketDetail;

