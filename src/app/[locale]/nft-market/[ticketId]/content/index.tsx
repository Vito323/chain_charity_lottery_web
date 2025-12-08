'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { TicketImage } from './components/TicketImage';
import { BasicInfoTab } from './components/BasicInfoTab';
import { HistoryTab } from './components/HistoryTab';
import LotteryRedemptionModal from '@/components/lottery-redemption-modal';
import LotteryRedemptionSuccessModal from '@/components/lottery-redemption-success-modal';
import LotteryFollowInvestmentModal from '@/components/lottery-follow-investment-modal';
import LotterySellModal from '@/components/lottery-sell-modal';
import LotteryDelistModal from '@/components/lottery-delist-modal';
import { DetailTab, LotteryTicket, PurchaseRecord, WinningRecord } from './types';
import { LotteryTicket as MarketLotteryTicket } from '@/app/[locale]/nft-market/types';

interface LotteryTicketDetailProps {
  ticketId: string;
  type: 'new' | 'market' | 'hold' | 'listed';
}

// Mock data - in production, this would come from an API
const mockTicketData: LotteryTicket = {
  id: '1',
  series: 'BRUNO MARS SIGNATURE SERIES',
  level: 'ADVANCED LEVEL',
  title: '24K MAGIC',
  image: '/images/placeholder-all.png',
  rarity: 'rare',
  rarityLabel: 'Rare',
  rarityPercentage: '25%',
  maxPrize: '$1,000',
  basicWinRate: '1/2,000',
  redemptionCost: '500',
  currency: 'CLT',
  salePrice: '818,266',
  validUntil: '2025-10-10 18:18:18',
  holderAddress: '0x6F7A8B9CDD1E2F3A4B5C6D7E8F9A0B1C2D3E4F5',
  educationPercentage: '55%',
  educationPartner: 'UNESCO',
  educationDescription: 'This lottery ticket will help fund 50 school lunches',
  educationPartnerFull: 'UNICEF',
  dnaId: '678901-2345-67',
  dnaAddress: '0x6F7A8B9CDD1E...',
  rareLevel: 'H.S01',
  opds: '1 in 800',
  prize: '$1,000 USDT',
  rights: 'Weekly Special Draws',
  date: '2025-01-15 19:15:35',
  icons: ['graduation', 'music', 'books'],
};

// Mock history data
const mockPurchaseRecords: PurchaseRecord[] = [
  {
    buyerAddress: '0xA1B2C3D4E5F6A7B8C9D0E1F2A3B4C5D6E7F8A9B0',
    priceUsdt: '100,000',
    priceClt: '588,235',
    time: '2025-08-08 18:18:18',
  },
  {
    buyerAddress: '0x9F8E7D6C5B4A3928172635445362718190A1B2C3',
    priceUsdt: '80,000',
    priceClt: '470,588',
    time: '2025-07-08 18:18:18',
  },
  {
    buyerAddress: '0x1122334455667788990011223344556677889900',
    priceUsdt: '60,000',
    priceClt: '352,941',
    time: '2025-06-08 18:18:18',
  },
  {
    buyerAddress: '0x5566778899001122334455667788990011223344',
    priceUsdt: '20,000',
    priceClt: '117,647',
    time: '2025-05-08 18:18:18',
  },
];

const mockWinningRecords: WinningRecord[] = [
  {
    winnerAddress: '0xA1B2C3D4E5F6A7B8C9D0E1F2A3B4C5D6E7F8A9B0',
    prizeUsdt: '1,000',
    time: '2025-08-08 18:18:18',
  },
];

const LotteryTicketDetail: React.FC<LotteryTicketDetailProps> = ({ ticketId, type }) => {
  const t = useTranslations('nftDetail');
  // In production, fetch ticket by ticketId
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const _ticketId = ticketId; // Reserved for future API integration
  const ticket = mockTicketData;
  const [activeTab, setActiveTab] = React.useState<DetailTab>('basic');
  const [tabKey, setTabKey] = React.useState(0);
  
  // Modal states
  const [isRedemptionModalOpen, setIsRedemptionModalOpen] = useState(false);
  const [isPurchaseModalOpen, setIsPurchaseModalOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [successModalType, setSuccessModalType] = useState<'redemption' | 'follow' | 'purchase' | 'sell'>('redemption');
  const [isFollowInvestmentModalOpen, setIsFollowInvestmentModalOpen] = useState(false);
  const [isSellModalOpen, setIsSellModalOpen] = useState(false);
  const [isDelistModalOpen, setIsDelistModalOpen] = useState(false);
  const [mockTicketCount, setMockTicketCount] = useState(8); // Mock ticket count

  // Determine which content to show
  // For 'hold' and 'listed', show basic tab (similar to 'new' and 'market')
  const currentTab: DetailTab = (type === 'new' || type === 'hold') ? 'basic' : activeTab;

  // Update key when tab changes to force re-render
  React.useEffect(() => {
    setTabKey((prev) => prev + 1);
  }, [activeTab]);

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

  const handleRedeem = () => {
    setIsRedemptionModalOpen(true);
  };

  // Handle redemption confirmation
  const handleRedemptionConfirm = () => {
    setIsRedemptionModalOpen(false);
    setSuccessModalType('redemption');
    // Wait for redemption modal to close before showing success modal
    setTimeout(() => {
      setIsSuccessModalOpen(true);
      setMockTicketCount(prev => prev + 1);
    }, 300);
  };

  // Convert detail ticket to market ticket format for success modal
  const convertToMarketTicket = (): MarketLotteryTicket => {
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

  const handlePurchase = () => {
    setIsPurchaseModalOpen(true);
  };

  // Handle purchase confirmation
  const handlePurchaseConfirm = () => {
    setIsPurchaseModalOpen(false);
    setSuccessModalType('purchase');
    // Wait for purchase modal to close before showing success modal
    setTimeout(() => {
      setIsSuccessModalOpen(true);
      setMockTicketCount(prev => prev + 1);
    }, 300);
  };

  const handleFollow = () => {
    setIsFollowInvestmentModalOpen(true);
  };

  // Handle follow investment confirmation
  const handleFollowConfirm = (shares: number) => {
    console.log('Follow investment confirmed with', shares, 'shares');
    setIsFollowInvestmentModalOpen(false);
    setSuccessModalType('follow');
    // Wait for follow investment modal to close before showing success modal
    setTimeout(() => {
      setIsSuccessModalOpen(true);
      setMockTicketCount(prev => prev + 1);
    }, 300);
  };

  // Handle sell functionality for hold tickets
  const handleSell = () => {
    setIsSellModalOpen(true);
  };

  // Handle sell confirmation
  const handleSellConfirm = (salePrice: number, duration: number) => {
    console.log('Selling ticket:', ticketId, 'Price:', salePrice, 'Duration:', duration);
    // TODO: Implement actual sell API call
    // After selling, update the ticket status or redirect
    setSuccessModalType('sell');
    setTimeout(() => {
      setIsSuccessModalOpen(true);
      setMockTicketCount(prev => prev + 1);
    }, 300);
  };

  // Handle delist functionality for listed tickets
  const handleDelist = () => {
    setIsDelistModalOpen(true);
  };

  // Handle delist confirmation
  const handleDelistConfirm = () => {
    console.log('Delisting ticket:', ticketId);
    // TODO: Implement actual delist API call
    // After delisting, update the ticket status or redirect
    // For now, just show a success message
    alert('Ticket delisted successfully');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
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
              {ticket.series}
            </h1>
            <p className="text-lg md:text-xl text-white/70">{ticket.level}</p>
          </motion.div>

          {/* Main Ticket Card - Image */}
          <TicketImage ticket={ticket} type={type} />

          {/* Tabs: Basic Info / History - Show for market and listed types */}
          {(type === 'market' || type === 'listed') && (
            <motion.div
              variants={itemVariants}
              className="mb-6 md:mb-8 flex justify-center"
            >
              <div className="inline-flex items-center rounded-full bg-white/5 border border-white/10 p-1 backdrop-blur-sm">
                {(['basic', 'history'] as DetailTab[]).map((tab) => (
                  <button
                    key={tab}
                    type="button"
                    onClick={() => setActiveTab(tab)}
                    className={`px-4 md:px-6 py-1.5 md:py-2 text-xs md:text-sm font-semibold rounded-full transition-all duration-200 cursor-pointer ${
                      activeTab === tab
                        ? 'bg-white text-slate-900 shadow-md shadow-black/20'
                        : 'text-white/70 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    {tab === 'basic' ? t('tabs.basicInfo') : t('tabs.history')}
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {/* Content Area with AnimatePresence */}
          <div className="relative min-h-[400px]">
            <AnimatePresence mode="wait" initial={false}>
              {currentTab === 'basic' ? (
                <BasicInfoTab
                  key={`basic-info-${tabKey}`}
                  ticket={ticket}
                  type={type}
                  onRedeem={handleRedeem}
                  onPurchase={handlePurchase}
                  onFollow={handleFollow}
                  onSell={type === 'hold' ? handleSell : undefined}
                  onDelist={type === 'listed' ? handleDelist : undefined}
                />
              ) : currentTab === 'history' ? (
                <HistoryTab
                  key={`history-tab-${tabKey}`}
                  purchaseRecords={mockPurchaseRecords}
                  winningRecords={mockWinningRecords}
                />
              ) : null}
            </AnimatePresence>
          </div>
        </motion.div>
      </main>

      {/* Redemption Modal - Only for new lottery */}
      {type === 'new' && (
        <>
          <LotteryRedemptionModal
            isOpen={isRedemptionModalOpen}
            onClose={() => setIsRedemptionModalOpen(false)}
            ticketId={ticket.id}
            redemptionPrice={parseFloat(ticket.redemptionCost)}
            onConfirmRedemption={handleRedemptionConfirm}
            mockMode={true}
          />

          {/* Success Modal */}
          <LotteryRedemptionSuccessModal
            isOpen={isSuccessModalOpen}
            onClose={() => setIsSuccessModalOpen(false)}
            ticket={convertToMarketTicket()}
            ticketCount={mockTicketCount}
            type="redemption"
          />
        </>
      )}

      {/* Sell Modal - Only for hold tickets */}
      {type === 'hold' && (
        <>
          <LotterySellModal
            isOpen={isSellModalOpen}
            onClose={() => setIsSellModalOpen(false)}
            ticketId={ticket.id}
            purchasePrice={ticket.salePrice ? parseFloat(ticket.salePrice.replace(/,/g, '')) : parseFloat(ticket.redemptionCost)}
            onConfirmSell={handleSellConfirm}
            mockMode={true}
          />

          {/* Success Modal */}
          <LotteryRedemptionSuccessModal
            isOpen={isSuccessModalOpen}
            onClose={() => setIsSuccessModalOpen(false)}
            ticket={convertToMarketTicket()}
            ticketCount={mockTicketCount}
            type={successModalType}
          />
        </>
      )}

      {/* Purchase Modal, Follow Investment Modal and Success Modal - Only for market lottery */}
      {type === 'market' && (
        <>
          {/* Purchase Modal */}
          <LotteryRedemptionModal
            isOpen={isPurchaseModalOpen}
            onClose={() => setIsPurchaseModalOpen(false)}
            ticketId={ticket.id}
            redemptionPrice={ticket.salePrice ? parseFloat(ticket.salePrice.replace(/,/g, '')) : parseFloat(ticket.redemptionCost)}
            onConfirmRedemption={handlePurchaseConfirm}
            mockMode={true}
            type="purchase"
          />

          {/* Follow Investment Modal */}
          <LotteryFollowInvestmentModal
            isOpen={isFollowInvestmentModalOpen}
            onClose={() => setIsFollowInvestmentModalOpen(false)}
            ticketId={ticket.id}
            redemptionCost={parseFloat(ticket.redemptionCost)}
            maxPrize={ticket.maxPrize}
            onConfirmFollow={handleFollowConfirm}
            mockMode={true}
          />
          
          {/* Success Modal */}
          <LotteryRedemptionSuccessModal
            isOpen={isSuccessModalOpen}
            onClose={() => setIsSuccessModalOpen(false)}
            ticket={convertToMarketTicket()}
            ticketCount={mockTicketCount}
            type={successModalType}
          />
        </>
      )}

      {/* Delist Modal - Only for listed tickets */}
      {type === 'listed' && (
        <LotteryDelistModal
          isOpen={isDelistModalOpen}
          onClose={() => setIsDelistModalOpen(false)}
          ticketId={ticket.id}
          ticketImage={ticket.image}
          onConfirmDelist={handleDelistConfirm}
        />
      )}
    </div>
  );
};

export default LotteryTicketDetail;
