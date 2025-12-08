'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import NFTList from '@/components/nft-list';
import { useWalletNFTs } from '@/hooks/useWalletNFTs';
import { NFT } from '@/components/nft-list';
import { useAccount } from 'wagmi';
import StalwartConnectButton from '@/components/custom-connect-button/StalwartConnectButton';

const StalwartUserDashboard = () => {
  const { address, isConnected } = useAccount();
  const { nfts, loading, hasMore, error, loadMore, refresh, totalCount } = useWalletNFTs({
    pageSize: 20,
    initialPage: 1
  });
  const [isLoaded, setIsLoaded] = useState(false);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const handleNFTClick = (nft: NFT) => {
    console.log('NFT clicked:', nft);
    // Add NFT detail page navigation logic here
  };

  const handleRefresh = () => {
    refresh();
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: 'easeOut' as const,
      },
    },
  };

  // 用户统计数据
  const userStats = [
    {
      label: 'Total NFTs',
      value: isConnected ? totalCount : '--',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
      color: 'from-purple-500 to-pink-500',
      description: 'Digital assets in your wallet'
    },
    {
      label: 'Collections',
      value: isConnected ? Math.ceil(totalCount / 10) : '--',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
      ),
      color: 'from-blue-500 to-cyan-500',
      description: 'Unique collections owned'
    },
    {
      label: 'Wallet Address',
      value: isConnected ? `${address?.slice(0, 6)}...${address?.slice(-4)}` : 'Not Connected',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
      color: 'from-emerald-500 to-teal-500',
      description: 'Your wallet identifier'
    },
    {
      label: 'Status',
      value: isConnected ? 'Active' : 'Disconnected',
      icon: isConnected ? (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ) : (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      color: isConnected ? 'from-green-500 to-emerald-500' : 'from-red-500 to-pink-500',
      description: 'Connection status'
    }
  ];


  return (
    <div className="min-h-screen pt-32 md:pt-40">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-b from-slate-900/50 via-slate-950/80 to-slate-950" />
          
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

        <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-8">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate={isLoaded ? "visible" : "hidden"}
            className="text-center mb-16"
          >
            <motion.div
              variants={itemVariants}
              className="inline-flex items-center gap-2.5 px-3 py-2 rounded-full border border-white/15 bg-white/5 backdrop-blur-sm text-white/90 mb-6"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs md:text-sm">User Dashboard</span>
            </motion.div>
            
            <motion.h1
              variants={itemVariants}
              className="text-4xl md:text-6xl lg:text-7xl font-extrabold text-white leading-tight tracking-tight mb-6"
            >
              Your Digital
              <br />
              <span className="bg-gradient-to-r from-purple-300 via-pink-300 to-fuchsia-300 bg-clip-text text-transparent">
                Collection
              </span>
            </motion.h1>
            
            <motion.p
              variants={itemVariants}
              className="text-lg md:text-xl text-white/80 max-w-2xl mx-auto leading-relaxed"
            >
              Manage your NFT collection, track your digital assets, and explore the blockchain ecosystem
            </motion.p>
          </motion.div>

          {/* User Stats */}
          <motion.div
            ref={ref}
            variants={containerVariants}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16"
          >
            {userStats.map((stat, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="group relative p-6 rounded-2xl border border-white/10 bg-white/[0.04] hover:bg-white/[0.06] backdrop-blur-md transition-all duration-300"
                whileHover={{ y: -4 }}
              >
                <div className="text-center">
                  <div className="flex justify-center mb-2 text-white/60">
                    {stat.icon}
                  </div>
                  <div className={`text-2xl md:text-3xl font-bold bg-gradient-to-r ${stat.color} bg-clip-text text-transparent mb-2`}>
                    {stat.value}
                  </div>
                  <div className="text-white/70 text-sm font-medium mb-1">{stat.label}</div>
                  <div className="text-white/50 text-xs">{stat.description}</div>
                </div>
                
                {/* Glow effect */}
                <div className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-md bg-gradient-to-r from-purple-600/20 via-pink-600/20 to-fuchsia-600/20" />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Dashboard Content */}
      <section className="py-16 bg-gradient-to-b from-slate-950 to-slate-900">
        <div className="max-w-7xl mx-auto px-6 md:px-8">
          {/* NFT Collection Section */}
          <div className="max-w-5xl mx-auto">
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate={isInView ? "visible" : "hidden"}
                className="mb-12"
              >
                <motion.div
                  variants={itemVariants}
                  className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/10 bg-white/5 backdrop-blur-sm text-white/80 text-xs mb-4"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-fuchsia-400" />
                  Your Collection
                </motion.div>
                
                <motion.h2
                  variants={itemVariants}
                  className="text-3xl md:text-5xl font-extrabold text-white tracking-tight mb-4"
                >
                  NFT Collection
                </motion.h2>
                
                <motion.p
                  variants={itemVariants}
                  className="text-lg text-white/70 max-w-2xl mb-8"
                >
                  Explore and manage your digital assets with ease
                </motion.p>
              </motion.div>

              {/* NFT Actions */}
              <motion.div
                variants={itemVariants}
                initial="hidden"
                animate={isInView ? "visible" : "hidden"}
                className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between mb-8"
              >
                <div className="flex items-center gap-4">
                  <div className="text-white/80">
                    {isConnected ? `Total ${totalCount} NFTs` : 'Connect wallet to view NFTs'}
                  </div>
                  {isConnected && address && (
                    <div className="px-3 py-1 rounded-full bg-white/10 border border-white/20 text-white/80 text-sm">
                      {address.slice(0, 6)}...{address.slice(-4)}
                    </div>
                  )}
                </div>
                
                <div className="flex gap-3">
                  {isConnected && (
                    <motion.button
                      onClick={handleRefresh}
                      disabled={loading}
                      className="px-4 py-2 rounded-full border border-white/20 bg-white/10 text-white/80 hover:bg-white/20 transition-all duration-300 flex items-center gap-2"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <svg 
                        className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`}
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                      {loading ? 'Refreshing...' : 'Refresh'}
                    </motion.button>
                  )}
                </div>
              </motion.div>

              {/* Error Display */}
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-6 p-4 rounded-2xl border border-red-500/20 bg-red-500/10 backdrop-blur-sm"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-red-500/20 flex items-center justify-center">
                      <span className="text-red-400 text-sm">!</span>
                    </div>
                    <div className="text-red-400">
                      <strong>Load failed:</strong> {error}
                    </div>
                    <motion.button
                      onClick={handleRefresh}
                      className="ml-auto px-3 py-1 rounded-full border border-red-500/30 bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-all duration-300"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Retry
                    </motion.button>
                  </div>
                </motion.div>
              )}

              {/* NFT Content */}
              {!isConnected ? (
                <motion.div
                  variants={itemVariants}
                  initial="hidden"
                  animate={isInView ? "visible" : "hidden"}
                  className="text-center py-16"
                >
                  <div className="max-w-md mx-auto">
                    <div className="w-24 h-24 mx-auto mb-6 rounded-2xl bg-gradient-to-r from-purple-500/20 to-pink-500/20 flex items-center justify-center">
                      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-white/60">
                        <path d="M21 12V7H5a2 2 0 0 1 0-4h14v4"/>
                        <path d="M3 5v14a2 2 0 0 0 2 2h14v-5"/>
                        <path d="M18 12a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2v-4z"/>
                      </svg>
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-4">Connect Your Wallet</h3>
                    <p className="text-white/70 mb-8 leading-relaxed">
                      Connect your wallet to view and manage your NFT collection
                    </p>
                    <StalwartConnectButton />
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  variants={itemVariants}
                  initial="hidden"
                  animate={isInView ? "visible" : "hidden"}
                >
                  <NFTList
                    nfts={nfts}
                    loading={loading}
                    hasMore={hasMore}
                    onLoadMore={loadMore}
                    onNFTClick={handleNFTClick}
                    className="mt-4"
                  />
                </motion.div>
              )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default StalwartUserDashboard;
