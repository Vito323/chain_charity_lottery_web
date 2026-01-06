'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { toast } from 'react-toastify';
import { useAccount, useChainId } from 'wagmi';
import { useReadContract } from 'wagmi';
import { formatUnits, parseUnits } from 'viem';
import BigNumber from 'bignumber.js';
import { TicketImage } from './components/TicketImage';
import { BasicInfoTab } from './components/BasicInfoTab';
import { HistoryTab } from './components/HistoryTab';
import LotteryRedemptionModal from '@/components/lottery-redemption-modal';
import LotteryRedemptionSuccessModal from '@/components/lottery-redemption-success-modal';
import LotteryFollowInvestmentModal from '@/components/lottery-follow-investment-modal';
import LotterySellModal from '@/components/lottery-sell-modal';
import LotteryDelistModal from '@/components/lottery-delist-modal';
import HoldTicketDetail from './HoldTicketDetail';
import { DetailTab, LotteryTicket, PurchaseRecord, WinningRecord } from './types';
import { LotteryTicket as MarketLotteryTicket } from '@/app/[locale]/nft-market/types';
import { LotterySeries, mintLotteryTicket, mintPending } from '@/service/lottery';
import { useLotteryNFTContract } from '@/hooks/useLotteryNFTContract';
import { getRarityPercentageFromRank, rankToRarity } from '@/utils/lottery';
import { getChainById } from '@/lib/chain-config';

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
  rarityPercentage: `${getRarityPercentageFromRank(1)}%`,
  maxPrize: '$1,000',
  basicWinRate: '1/2,000',
  redemptionCost: '500',
  currency: 'CCT',
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

// CCT 代币地址
const CCT_TOKEN_ADDRESS = '0x510c241672e6ff04b0Ad76211cb141716a27EE2e' as `0x${string}`;

// ERC20 ABI (仅包含 balanceOf 和 decimals)
const ERC20_ABI = [
  {
    constant: true,
    inputs: [{ name: '_owner', type: 'address' }],
    name: 'balanceOf',
    outputs: [{ name: 'balance', type: 'uint256' }],
    type: 'function',
  },
  {
    constant: true,
    inputs: [],
    name: 'decimals',
    outputs: [{ name: '', type: 'uint8' }],
    type: 'function',
  },
] as const;

// Convert LotterySeries to LotteryTicket
const convertLotterySeriesToTicket = (series: LotterySeries): LotteryTicket => {
  const rarity = rankToRarity(series.rank);
  return {
    id: series.id.toString(),
    series: series.seriesName || series.title,
    level: series.template || 'STANDARD LEVEL',
    title: series.title,
    image: series.src || '/images/placeholder-all.png',
    rarity,
    rarityLabel: rarity.charAt(0).toUpperCase() + rarity.slice(1),
    rarityPercentage: `${getRarityPercentageFromRank(series.rank)}%`,
    maxPrize: `${series.highest.toLocaleString()} USDT`,
    basicWinRate: `1/${series.rate}`,
    redemptionCost: series.price.toString(),
    currency: 'CCT',
    educationPercentage: '55%',
    educationPartner: series.cooperation || 'UNESCO',
    educationDescription: series.description || 'This lottery ticket supports education initiatives',
    educationPartnerFull: series.cooperation || 'UNESCO',
    dnaId: series.id.toString(),
    dnaAddress: '0x...',
    rareLevel: `H.S${series.rank.toString().padStart(2, '0')}`,
    opds: `1 in ${series.rate}`,
    prize: `${series.highest.toLocaleString()} USDT`,
    rights: 'Weekly Special Draws',
    date: new Date(series.createdAt).toLocaleString(),
    icons: ['graduation', 'music', 'books'],
  };
};

const LotteryTicketDetail: React.FC<LotteryTicketDetailProps> = ({ ticketId, type }) => {
  // When type is 'hold', use the separate HoldTicketDetail component
  // which fetches data from wallet instead of localStorage
  if (type === 'hold') {
    return <HoldTicketDetail ticketId={ticketId} />;
  }

  const t = useTranslations('nftDetail');
  const tCommon = useTranslations('common');
  const { address, isConnected, chain } = useAccount();
  const chainId = useChainId();
  const { mint, isLoading: isMinting } = useLotteryNFTContract();
  
  // 从本地存储读取 LotterySeries 数据
  const [lotterySeries, setLotterySeries] = useState<LotterySeries | null>(null);
  
  useEffect(() => {
    const storageKey = `lottery_ticket_${ticketId}`;
    const storedData = localStorage.getItem(storageKey);
    if (storedData) {
      try {
        const series = JSON.parse(storedData) as LotterySeries;
        setLotterySeries(series);
      } catch (error) {
        console.error('Failed to parse stored lottery series:', error);
      }
    }
  }, [ticketId]);
  
  // 转换为 LotteryTicket 用于显示
  const ticket = useMemo(() => {
    if (lotterySeries) {
      return convertLotterySeriesToTicket(lotterySeries);
    }
    return mockTicketData;
  }, [lotterySeries]);
  
  // 查询 CCT 余额
  const { data: cctBalance, refetch: refetchCCTBalance } = useReadContract({
    address: CCT_TOKEN_ADDRESS,
    abi: ERC20_ABI,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
    query: {
      enabled: isConnected && !!address,
      refetchInterval: 10000,
    },
  });
  
  // 查询 CCT decimals
  const { data: cctDecimals } = useReadContract({
    address: CCT_TOKEN_ADDRESS,
    abi: ERC20_ABI,
    functionName: 'decimals',
  });
  const [activeTab, setActiveTab] = React.useState<DetailTab>('basic');
  const [tabKey, setTabKey] = React.useState(0);
  
  // Modal states
  const [isRedemptionModalOpen, setIsRedemptionModalOpen] = useState(false);
  const [isPurchaseModalOpen, setIsPurchaseModalOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [successModalType, setSuccessModalType] = useState<'redemption' | 'follow' | 'purchase' | 'sell'>('redemption');
  const [isFollowInvestmentModalOpen, setIsFollowInvestmentModalOpen] = useState(false);
  const [isDelistModalOpen, setIsDelistModalOpen] = useState(false);
  const [mockTicketCount, setMockTicketCount] = useState(8); // Mock ticket count

  // Determine which content to show
  // For 'new', show basic tab (similar to 'hold')
  const currentTab: DetailTab = type === 'new' ? 'basic' : activeTab;

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

  // Handle redemption confirmation - 实现完整的兑换流程
  const handleRedemptionConfirm = async () => {
    if (!isConnected || !address || !lotterySeries) {
      toast.error(tCommon('errors.pleaseConnectWallet'));
      return;
    }

    // 链ID验证 - 在交易前检查当前链是否匹配
    const expectedChainId = Number(process.env.NEXT_PUBLIC_DEFAULT_CHAIN_ID);
    
    if (chainId !== expectedChainId) {
      const currentChainInfo = chain || getChainById(chainId);
      const expectedChainInfo = getChainById(expectedChainId);
      toast.error(
        tCommon('wallet.wrongNetworkMessage', {
          expectedName: expectedChainInfo.name,
          expectedId: expectedChainId,
          currentName: currentChainInfo.name,
          currentId: chainId,
        }),
        {
          autoClose: 5000,
        }
      );
      return;
    }

    try {
      // 注意：不在这里关闭 modal，让 modal 在调用期间保持打开状态
      
      // 1. 调用 preMintLotteryTicket 获取签名信息
      toast.info(tCommon('actions.processing'), {
        autoClose: 1000,
      });
      const preMintResponse = await mintPending(lotterySeries.id, address);
      
      if (!preMintResponse.ok) {
        toast.error(preMintResponse.msg || tCommon('errors.failedToLoad'));
        return;
      }
      const preMintInfo = preMintResponse.data;
      // 2. 查询 CCT 余额
      const balanceResult = await refetchCCTBalance();
      const balance = balanceResult.data;
      const decimals = (cctDecimals as number) || 18;
      console.log('balance', balance, cctDecimals);
      if (!balance) {
        toast.error(tCommon('errors.failedToLoad'));
        return;
      }
      const requiredAmountBigInt = BigInt(preMintInfo.amount);
      const requiredAmountFormatted = formatUnits(requiredAmountBigInt, decimals);
      
      // 钱包余额是 bigint（原始值），转换为格式化值
      const balanceBigInt = typeof balance === 'bigint' ? balance : BigInt(balance.toString());
      const userBalanceFormatted = formatUnits(balanceBigInt, decimals);
      
      // 使用 BigNumber 进行比对（两者都是格式化值）
      const requiredAmountBN = new BigNumber(requiredAmountFormatted);
      const userBalanceBN = new BigNumber(userBalanceFormatted);
      if (userBalanceBN.isLessThan(requiredAmountBN)) {
        toast.error(tCommon('errors.insufficientFunds'));
        return;
      }

      console.log('preMintInfo', preMintInfo);
      const txHash = await mint(
        preMintInfo.dna,
        preMintInfo.uri,
        preMintInfo.signature,
        preMintInfo.amount,
        preMintInfo.nonce,
        preMintInfo.deadline,
        decimals
      );
      console.log(txHash);
      if (txHash) {
        await mintLotteryTicket(preMintInfo.dna, txHash);
      }

      // 只有在成功时才关闭 modal 并显示成功模态
      setIsRedemptionModalOpen(false);
      // 5. 显示成功模态
      setSuccessModalType('redemption');
      setTimeout(() => {
        setIsSuccessModalOpen(true);
        setMockTicketCount(prev => prev + 1);
      }, 300);
      
    } catch (error: any) {
      console.error('Redemption error:', error);
      console.log('error', error.message);
      let errorMessage = error?.message || tCommon('errors.networkError');
      // 如果错误信息包含 "user rejected action"，只截取括号前面的部分
      const bracketIndex = errorMessage.indexOf('(');
      errorMessage = bracketIndex > -1 ? errorMessage.substring(0, bracketIndex).trim() : errorMessage;
      toast.error(errorMessage);
      // 错误情况下不关闭 modal，让用户可以重试
    }
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
    toast.success(tCommon('success.delistSuccess'));
  };

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
            {lotterySeries && (
              <p className="text-lg md:text-xl text-white/70">
                {tCommon(`rarity.${rankToRarity(lotterySeries.rank)}`)}
              </p>
            )}
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
                  onSell={undefined}
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
