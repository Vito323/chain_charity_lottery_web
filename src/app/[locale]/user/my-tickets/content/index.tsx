'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAccount } from 'wagmi';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import OwnedLotteryCard from '../components/OwnedLotteryCard';
import ConnectButton from '@/components/custom-connect-button/ConnectButton';
import { RarityType } from '@/app/[locale]/nft-market/types';
import { getAssetOwner, AssetOwner } from '@/service/asset';
import { rankToRarity } from '@/utils/lottery';

type FilterTab = 'hold' | 'listed';

interface OwnedLotteryTicket {
  id: string;
  image: string;
  rarity: RarityType;
  rarityLabel: string;
  purchasePrice: number;
  currency: string;
  isListed?: boolean; // Whether the ticket is listed for sale
  dna: string; // DNA for rendering ticket image
}

// Convert AssetOwner to OwnedLotteryTicket
const convertAssetOwnerToTicket = (asset: AssetOwner): OwnedLotteryTicket => {
  // Use rank from series to determine rarity
  const rank = asset.series?.rank || 1;
  const rarity = rankToRarity(rank);
  const rarityLabel = rarity.charAt(0).toUpperCase() + rarity.slice(1);
  
  // Use price from series
  const purchasePrice = asset.series?.price || 0;

  return {
    id: asset.dna,
    image: '', // Image will be loaded in OwnedLotteryCard component
    rarity,
    rarityLabel,
    purchasePrice,
    currency: 'CCT',
    isListed: false, // All tickets from owner are not listed by default
    dna: asset.dna,
  };
};

const MyTickets: React.FC = () => {
  const { isConnected, address } = useAccount();
  const t = useTranslations('myTickets');
  const tCommon = useTranslations('common');
  const [activeTab, setActiveTab] = useState<FilterTab>('hold');
  const [assets, setAssets] = useState<AssetOwner[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch assets from getAssetOwner API
  useEffect(() => {
    const fetchAssets = async () => {
      if (!isConnected || !address) {
        setAssets([]);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);
        const response = await getAssetOwner(address);
        
        if (response.ok && response.data) {
          setAssets(response.data);
        } else {
          setError(response.msg || 'Failed to load tickets');
          setAssets([]);
        }
      } catch (err) {
        console.error('Failed to fetch assets:', err);
        setError(err instanceof Error ? err.message : 'Failed to load tickets');
        setAssets([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAssets();
  }, [isConnected, address]);

  // Convert assets to tickets
  const ownedTickets = useMemo(() => {
    if (!assets.length) {
      return [];
    }

    return assets.map((asset) => convertAssetOwnerToTicket(asset));
  }, [assets]);

  const refreshAssets = async () => {
    if (!isConnected || !address) return;
    
    try {
      setIsLoading(true);
      setError(null);
      const response = await getAssetOwner(address);
      
      if (response.ok && response.data) {
        setAssets(response.data);
      } else {
        setError(response.msg || 'Failed to load tickets');
      }
    } catch (err) {
      console.error('Failed to refresh assets:', err);
      setError(err instanceof Error ? err.message : 'Failed to load tickets');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSell = async (ticketId: string) => {
    // TODO: Implement sell functionality
    console.log('Selling ticket:', ticketId);
    // After selling, refresh assets to get updated data
    refreshAssets();
  };

  const handleDelist = async (ticketId: string) => {
    // TODO: Implement delist functionality
    console.log('Delisting ticket:', ticketId);
    // After delisting, refresh assets to get updated data
    refreshAssets();
  };

  // Filter tickets based on active tab
  // For 'listed' tab, return empty array as per requirement
  const filteredTickets = useMemo(() => {
    if (activeTab === 'listed') {
      return []; // 已上架部分数据全部置空
    }
    // For 'hold' tab, return all tickets (all from wallet are not listed)
    return ownedTickets;
  }, [activeTab, ownedTickets]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: 'easeOut' as const,
      },
    },
  };

  // Calculate totals based on filtered tickets
  const totalTickets = filteredTickets.length;
  const totalValue = filteredTickets.reduce((sum, ticket) => sum + ticket.purchasePrice, 0);

  console.log(filteredTickets);
  console.log(ownedTickets);
  console.log(totalTickets);
  console.log(totalValue);

  return (
    <section className="relative py-20 pt-32 md:py-32 md:pt-52">
      {/* Background Elements */}

      <motion.div
        className="relative z-10 max-w-7xl mx-auto px-6 md:px-8"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Section Header */}
        <motion.div variants={itemVariants} className="text-center mb-16">
          <motion.div
            className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full border border-white/15 bg-white/5 backdrop-blur-sm text-white/90 mb-6"
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.6 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-sm">{t('badge')}</span>
          </motion.div>

          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            {t('title')} <span className="bg-linear-to-r from-purple-300 via-pink-300 to-fuchsia-300 bg-clip-text text-transparent">{t('titleHighlight')}</span>
          </h2>
          <p className="text-lg md:text-xl text-white/80 max-w-3xl mx-auto leading-relaxed">
            {t('subtitle')}
          </p>
        </motion.div>

        {/* Connect Wallet Prompt */}
        {!isConnected && (
          <motion.div
            variants={itemVariants}
            className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 md:p-12 text-center mb-12"
          >
            <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">
              {t('connectTitle')}
            </h3>
            <p className="text-white/70 mb-6 max-w-md mx-auto">
              {t('connectDescription')}
            </p>
            <ConnectButton />
          </motion.div>
        )}

        {/* Filter Tabs: Hold / Listed */}
        {isConnected && (
          <motion.div
            variants={itemVariants}
            className="mb-6 md:mb-8 flex justify-center"
          >
            <div className="inline-flex items-center rounded-full bg-white/5 border border-white/10 p-1 backdrop-blur-sm">
              {(['hold', 'listed'] as FilterTab[]).map((tab) => (
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
                  {tab === 'hold' ? t('tabs.hold') : t('tabs.listed')}
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {/* Summary Cards */}
        {isConnected && (activeTab === 'hold' ? ownedTickets.length > 0 : true) && (
          <motion.div
            variants={itemVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-12"
          >
            <motion.div
              variants={itemVariants}
              initial="hidden"
              animate="visible"
              className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6"
              whileHover={{ scale: 1.02, y: -4 }}
              transition={{ duration: 0.2 }}
            >
              <div className="text-sm text-white/60 mb-2">{t('summary.totalTickets')}</div>
              <div className="text-2xl md:text-3xl font-bold text-white mb-1">
                {totalTickets}
              </div>
              <div className="text-xs text-white/50">
                {activeTab === 'hold' ? t('summary.inCollection') : t('summary.listedForSale')}
              </div>
            </motion.div>

            <motion.div
              variants={itemVariants}
              initial="hidden"
              animate="visible"
              className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6"
              whileHover={{ scale: 1.02, y: -4 }}
              transition={{ duration: 0.2 }}
            >
              <div className="text-sm text-white/60 mb-2">{t('summary.totalValue')}</div>
              <div className="text-2xl md:text-3xl font-bold text-purple-400 mb-1">
                {totalValue.toLocaleString(undefined, {
                  minimumFractionDigits: 3,
                  maximumFractionDigits: 3,
                })} CCT
              </div>
              <div className="text-xs text-white/50">{t('summary.purchasePriceTotal')}</div>
            </motion.div>
          </motion.div>
        )}

        {/* Loading State */}
        {isLoading && (
          <motion.div
            className="text-center py-20 bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
          >
            <div className="w-8 h-8 border-2 border-white/30 border-t-white rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-white/80">{tCommon('status.loading')}</p>
          </motion.div>
        )}

        {/* Error State */}
        {error && (
          <motion.div
            className="text-center py-20 bg-red-500/10 backdrop-blur-xl border border-red-500/20 rounded-3xl"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
          >
            <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">
              {tCommon('errors.failedToLoadTickets')}
            </h3>
            <p className="text-white/60">{error}</p>
          </motion.div>
        )}

        {/* Tickets Grid or Empty State */}
        {!isLoading && !error && isConnected && (
          <AnimatePresence mode="wait">
            {ownedTickets.length === 0 && activeTab === 'hold' ? (
              // Empty State - No tickets at all (only show on hold tab)
              <motion.div
                key="empty-no-tickets"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.6 }}
                className="text-center py-20 bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl"
              >
                <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="w-8 h-8 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">
                  {t('empty.noTicketsFound')}
                </h3>
                <p className="text-white/60 mb-6">
                  {t('empty.noTicketsFoundDesc')}
                </p>
                <Link
                  href="/lottery"
                  className="inline-flex items-center justify-center rounded-full bg-linear-to-r from-purple-600 to-pink-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-purple-500/30 hover:from-purple-700 hover:to-pink-700 transition-all duration-300"
                >
                  {t('empty.browseLottery')}
                </Link>
              </motion.div>
            ) : filteredTickets.length > 0 ? (
              // Tickets Grid - Show tickets
              <motion.div
                key={activeTab}
                variants={itemVariants}
                initial="hidden"
                animate="visible"
                exit="hidden"
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6"
              >
                {filteredTickets.map((ticket, index) => (
                  <OwnedLotteryCard
                    key={ticket.id}
                    ticket={ticket}
                    animationDelay={index * 0.1}
                    isListed={ticket.isListed || false}
                    onSell={handleSell}
                    onDelist={handleDelist}
                  />
                ))}
              </motion.div>
            ) : (
              // Empty State - No tickets in current tab
              <motion.div
                key={`empty-${activeTab}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="text-center py-20 bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl"
              >
                <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="w-8 h-8 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">
                  {activeTab === 'hold' ? t('empty.noTicketsHeld') : t('empty.noTicketsListed')}
                </h3>
                <p className="text-white/60">
                  {activeTab === 'hold' 
                    ? t('empty.noTicketsHeldDesc')
                    : t('empty.noTicketsListedDesc')}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        )}
      </motion.div>
    </section>
  );
};

export default MyTickets;

