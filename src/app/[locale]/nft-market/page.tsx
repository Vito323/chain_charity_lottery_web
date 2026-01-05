'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import Header from '@/components/header';
import Footer from '@/components/footer';
import ScrollToTop from '@/components/scroll-to-top';
import LotteryCard from './components/LotteryCard';
import { getLotteryTickets, LotterySeries } from '@/service/lottery';

type TabType = 'new' | 'market';

const NFTMarketPage = () => {
  const t = useTranslations('nftMarket');
  const tCommon = useTranslations('common');
  const [activeTab, setActiveTab] = useState<TabType>('new');
  const [sortBy, setSortBy] = useState<'latest' | 'price' | 'rarity' | 'follow'>('latest');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  
  // Data state - 拆分两个 tab 的数据源，严格按照 LotterySeries 类型
  const [newLotteryTickets, setNewLotteryTickets] = useState<LotterySeries[]>([]);
  const [marketLotteryTickets, setMarketLotteryTickets] = useState<LotterySeries[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  
  // Fetch data for new tab
  const fetchNewLotteryTickets = useCallback(async () => {
    try {
      setLoading(true);
      const response = await getLotteryTickets();
      if (response.ok) {
        setNewLotteryTickets(response.data);
      }
    } catch (error) {
      console.error('Failed to fetch new lottery tickets:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch data for market tab
  const fetchMarketLotteryTickets = useCallback(async () => {
    try {
      setLoading(true);
      const response = await getLotteryTickets();
      if (response.ok) {
        setMarketLotteryTickets(response.data);
      }
    } catch (error) {
      console.error('Failed to fetch market lottery tickets:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch data when tab changes
  useEffect(() => {
    if (activeTab === 'new') {
      if (newLotteryTickets.length === 0) {
        fetchNewLotteryTickets();
      }
    } else {
      if (marketLotteryTickets.length === 0) {
        fetchMarketLotteryTickets();
      }
    }
  }, [activeTab, fetchNewLotteryTickets, fetchMarketLotteryTickets, newLotteryTickets.length, marketLotteryTickets.length]);

  // Sort function - 严格按照 LotterySeries 类型
  const sortTickets = useCallback((tickets: LotterySeries[]) => {
    const sorted = [...tickets];
    
    switch (sortBy) {
      case 'latest':
        sorted.sort((a, b) => {
          // Sort by createdAt (newest first) or id as fallback
          if (a.createdAt && b.createdAt) {
            const dateA = new Date(a.createdAt).getTime();
            const dateB = new Date(b.createdAt).getTime();
            return sortOrder === 'desc' ? dateB - dateA : dateA - dateB;
          }
          // Fallback to id
          return sortOrder === 'desc' ? b.id - a.id : a.id - b.id;
        });
        break;
      case 'price':
        sorted.sort((a, b) => {
          const priceA = a.price || 0;
          const priceB = b.price || 0;
          return sortOrder === 'desc' ? priceB - priceA : priceA - priceB;
        });
        break;
      case 'rarity':
        // Sort by rank (higher rank = higher rarity)
        sorted.sort((a, b) => {
          const rankA = a.rank || 0;
          const rankB = b.rank || 0;
          return sortOrder === 'desc' ? rankB - rankA : rankA - rankB;
        });
        break;
      default:
        break;
    }
    
    return sorted;
  }, [sortBy, sortOrder]);

  // Get current tickets and apply sorting
  const currentTickets = useMemo(() => {
    const tickets = activeTab === 'new' ? newLotteryTickets : marketLotteryTickets;
    return sortTickets(tickets);
  }, [activeTab, newLotteryTickets, marketLotteryTickets, sortTickets]);

  const handleSort = (type: 'latest' | 'price' | 'rarity' | 'follow') => {
    if (sortBy === type) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(type);
      setSortOrder('desc');
    }
  };

  const tabs = [
    { id: 'new' as TabType, label: t('tabs.new') },
    { id: 'market' as TabType, label: t('tabs.market') },
  ];

  return (
    <div className="min-h-screen bg-linear-to-b from-slate-950 via-slate-900 to-slate-950">
      <Header />
      {/* Hero Section */}
      <section className="relative pt-32 md:pt-52 pb-12 md:pb-20 overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-linear-to-b from-slate-900/50 via-slate-950/80 to-slate-950" />
          
          {/* Animated Background Shapes */}
          <motion.div
            className="absolute top-20 left-10 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.6, 0.3],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
          <motion.div
            className="absolute bottom-20 right-10 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"
            animate={{
              scale: [1.2, 1, 1.2],
              opacity: [0.4, 0.7, 0.4],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <motion.div
              className="inline-flex items-center gap-2.5 px-3 py-2 rounded-full border border-white/15 bg-white/5 backdrop-blur-sm text-white/90 mb-6"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs md:text-sm">{t('badge')}</span>
            </motion.div>
            
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold text-white leading-tight tracking-tight mb-6">
              {t('title')}{' '}
              <span className="bg-linear-to-r from-purple-300 via-pink-300 to-fuchsia-300 bg-clip-text text-transparent">
                {t('titleHighlight')}
              </span>
            </h1>
            
            <p className="text-lg md:text-xl text-white/80 max-w-2xl mx-auto leading-relaxed">
              {t('subtitle')}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-8 md:py-16 bg-linear-to-b from-slate-950 to-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
          {/* Tab Navigation */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mb-6 md:mb-8"
          >
            {/* Tabs */}
            <div className="flex gap-2 p-1 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md mb-4 md:mb-6 w-full md:w-auto">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 md:flex-none px-4 md:px-6 py-2 md:py-2.5 rounded-xl font-semibold text-xs md:text-sm lg:text-base transition-all duration-300 ${
                    activeTab === tab.id
                      ? 'bg-linear-to-r from-purple-500 to-pink-500 text-white shadow-lg shadow-purple-500/30'
                      : 'text-white/70 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Sort Options */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
              <button
                onClick={() => handleSort('latest')}
                className={`shrink-0 px-3 cursor-pointer md:px-4 py-1.5 md:py-2 rounded-lg text-xs md:text-sm font-medium transition-all duration-300 whitespace-nowrap ${
                  sortBy === 'latest'
                    ? 'bg-white/10 text-white border border-white/20'
                    : 'text-white/60 hover:text-white hover:bg-white/5 border border-transparent'
                }`}
              >
                {t('sort.latest')}
              </button>
              <button
                onClick={() => handleSort('price')}
                className={`shrink-0 px-3 cursor-pointer md:px-4 py-1.5 md:py-2 rounded-lg text-xs md:text-sm font-medium transition-all duration-300 flex items-center gap-1 whitespace-nowrap ${
                  sortBy === 'price'
                    ? 'bg-white/10 text-white border border-white/20'
                    : 'text-white/60 hover:text-white hover:bg-white/5 border border-transparent'
                }`}
              >
                {t('sort.price')}
                {sortBy === 'price' && (
                  <svg
                    className={`w-3 h-3 transition-transform ${sortOrder === 'desc' ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                  </svg>
                )}
              </button>
              <button
                onClick={() => handleSort('rarity')}
                className={`shrink-0 px-3 cursor-pointer md:px-4 py-1.5 md:py-2 rounded-lg text-xs md:text-sm font-medium transition-all duration-300 flex items-center gap-1 whitespace-nowrap ${
                  sortBy === 'rarity'
                    ? 'bg-white/10 text-white border border-white/20'
                    : 'text-white/60 hover:text-white hover:bg-white/5 border border-transparent'
                }`}
              >
                {t('sort.rarity')}
                {sortBy === 'rarity' && (
                  <svg
                    className={`w-3 h-3 transition-transform ${sortOrder === 'desc' ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                  </svg>
                )}
              </button>
            </div>
          </motion.div>

          {/* Cards Grid, Loading, or Empty State */}
          {loading ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="text-center py-20 bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl"
            >
              <div className="w-20 h-20 md:w-16 md:h-16 bg-linear-to-br from-purple-500/20 to-pink-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg 
                  className="w-10 h-10 md:w-8 md:h-8 text-white/60 animate-spin" 
                  fill="none" 
                  viewBox="0 0 24 24"
                >
                  <circle 
                    className="opacity-25" 
                    cx="12" 
                    cy="12" 
                    r="10" 
                    stroke="currentColor" 
                    strokeWidth="4"
                  />
                  <path 
                    className="opacity-75" 
                    fill="currentColor" 
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
              </div>
              <h3 className="text-2xl md:text-xl font-semibold text-white mb-3">
                {tCommon('status.loading')}
              </h3>
            </motion.div>
          ) : currentTickets.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
              className="text-center py-20 bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl"
            >
              <div className="w-20 h-20 md:w-16 md:h-16 bg-linear-to-br from-purple-500/20 to-pink-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg 
                  className="w-10 h-10 md:w-8 md:h-8 text-white/60" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" 
                  />
                </svg>
              </div>
              <h3 className="text-2xl md:text-xl font-semibold text-white mb-3">
                {activeTab === 'new' ? t('empty.new.title') : t('empty.market.title')}
              </h3>
              <p className="text-white/60 text-base md:text-sm max-w-md mx-auto">
                {activeTab === 'new' ? t('empty.new.description') : t('empty.market.description')}
              </p>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
            >
              {currentTickets.map((ticket, index) => (
                <LotteryCard
                  key={ticket.id}
                  ticket={ticket}
                  type={activeTab}
                  animationDelay={index * 0.1}
                />
              ))}
            </motion.div>
          )}
        </div>
      </section>

      {/* Footer */}
      <Footer />

      {/* Scroll to Top Button */}
      <ScrollToTop />
    </div>
  );
};

export default NFTMarketPage;
