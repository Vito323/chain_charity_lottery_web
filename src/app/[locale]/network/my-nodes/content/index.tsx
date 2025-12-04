'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAccount } from 'wagmi';
import Link from 'next/link';
import { formatCurrency } from '@/utils/currency';
import StalwartConnectButton from '@/components/custom-connect-button/StalwartConnectButton';

// Node holding data interface
interface NodeHolding {
  id: string;
  nodeType: 'genesis' | 'super' | 'standard';
  purchaseCost: {
    usd: number;
    clt: number;
  };
  yesterdayEarnings: {
    amount: number;
    percentage: number;
  };
  accumulatedEarnings: number;
}

// Default mock data based on the image
const defaultNodeHoldings: NodeHolding[] = [
  {
    id: '1',
    nodeType: 'genesis',
    purchaseCost: {
      usd: 100000,
      clt: 588235,
    },
    yesterdayEarnings: {
      amount: 888.88,
      percentage: 1.35,
    },
    accumulatedEarnings: 5888.88,
  },
  {
    id: '2',
    nodeType: 'genesis',
    purchaseCost: {
      usd: 100000,
      clt: 588235,
    },
    yesterdayEarnings: {
      amount: 888.88,
      percentage: 1.35,
    },
    accumulatedEarnings: 15888.88,
  },
  {
    id: '3',
    nodeType: 'super',
    purchaseCost: {
      usd: 50000,
      clt: 294117,
    },
    yesterdayEarnings: {
      amount: 288.88,
      percentage: 0.95,
    },
    accumulatedEarnings: 6888.88,
  },
  {
    id: '4',
    nodeType: 'super',
    purchaseCost: {
      usd: 50000,
      clt: 294117,
    },
    yesterdayEarnings: {
      amount: 288.88,
      percentage: 0.95,
    },
    accumulatedEarnings: 5888.88,
  },
  {
    id: '5',
    nodeType: 'standard',
    purchaseCost: {
      usd: 10000,
      clt: 58823,
    },
    yesterdayEarnings: {
      amount: 188.88,
      percentage: 0.45,
    },
    accumulatedEarnings: 5888.88,
  },
  {
    id: '6',
    nodeType: 'standard',
    purchaseCost: {
      usd: 10000,
      clt: 58823,
    },
    yesterdayEarnings: {
      amount: 188.88,
      percentage: 0.45,
    },
    accumulatedEarnings: 5888.88,
  },
  {
    id: '7',
    nodeType: 'standard',
    purchaseCost: {
      usd: 10000,
      clt: 29411,
    },
    yesterdayEarnings: {
      amount: 188.88,
      percentage: 0.45,
    },
    accumulatedEarnings: 5888.88,
  },
  {
    id: '8',
    nodeType: 'standard',
    purchaseCost: {
      usd: 10000,
      clt: 29411,
    },
    yesterdayEarnings: {
      amount: 188.88,
      percentage: 0.45,
    },
    accumulatedEarnings: 1888.88,
  },
];

const StalwartMyNodesList: React.FC = () => {
  const { isConnected } = useAccount();
  const [nodeHoldings] = useState<NodeHolding[]>(defaultNodeHoldings);
  const [isLoading] = useState(false);
  const [error] = useState<string | null>(null);

  // Get node type display name
  const getNodeTypeName = (type: 'genesis' | 'super' | 'standard'): string => {
    switch (type) {
      case 'genesis':
        return 'Genesis Node';
      case 'super':
        return 'Super Node';
      case 'standard':
        return 'Standard Node';
      default:
        return 'Node';
    }
  };

  // Get node type badge color
  const getNodeTypeBadge = (type: 'genesis' | 'super' | 'standard') => {
    switch (type) {
      case 'genesis':
        return 'from-purple-500 to-pink-500';
      case 'super':
        return 'from-blue-500 to-cyan-500';
      case 'standard':
        return 'from-emerald-500 to-teal-500';
      default:
        return 'from-gray-500 to-gray-600';
    }
  };

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

  // Calculate totals
  const totalPurchaseCost = nodeHoldings.reduce((sum, node) => sum + node.purchaseCost.usd, 0);
  const totalYesterdayEarnings = nodeHoldings.reduce((sum, node) => sum + node.yesterdayEarnings.amount, 0);
  const totalAccumulatedEarnings = nodeHoldings.reduce((sum, node) => sum + node.accumulatedEarnings, 0);

  return (
    <section className="relative py-20 md:py-32">
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
            <span className="text-sm">My Node Holdings</span>
          </motion.div>

          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Node <span className="bg-gradient-to-r from-purple-300 via-pink-300 to-fuchsia-300 bg-clip-text text-transparent">Portfolio</span>
          </h2>
          <p className="text-lg md:text-xl text-white/80 max-w-3xl mx-auto leading-relaxed">
            Track your node investments, daily earnings, and accumulated returns in one place.
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
              Connect Your Wallet
            </h3>
            <p className="text-white/70 mb-6 max-w-md mx-auto">
              Connect your wallet to view your node holdings and track your earnings.
            </p>
            <StalwartConnectButton />
          </motion.div>
        )}

        {/* Summary Cards */}
        {isConnected && nodeHoldings.length > 0 && (
          <motion.div
            variants={itemVariants}
            className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-12"
          >
            <motion.div
              className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6"
              whileHover={{ scale: 1.02, y: -4 }}
              transition={{ duration: 0.2 }}
            >
              <div className="text-sm text-white/60 mb-2">Total Purchase Cost</div>
              <div className="text-2xl md:text-3xl font-bold text-white mb-1">
                {formatCurrency(totalPurchaseCost)}
              </div>
              <div className="text-xs text-white/50">Across all nodes</div>
            </motion.div>

            <motion.div
              className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6"
              whileHover={{ scale: 1.02, y: -4 }}
              transition={{ duration: 0.2 }}
            >
              <div className="text-sm text-white/60 mb-2">Yesterday&apos;s Earnings</div>
              <div className="text-2xl md:text-3xl font-bold text-emerald-400 mb-1">
                +{formatCurrency(totalYesterdayEarnings)}
              </div>
              <div className="text-xs text-white/50">Total daily return</div>
            </motion.div>

            <motion.div
              className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6"
              whileHover={{ scale: 1.02, y: -4 }}
              transition={{ duration: 0.2 }}
            >
              <div className="text-sm text-white/60 mb-2">Accumulated Earnings</div>
              <div className="text-2xl md:text-3xl font-bold text-purple-400 mb-1">
                +{formatCurrency(totalAccumulatedEarnings)}
              </div>
              <div className="text-xs text-white/50">Total returns to date</div>
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
            <p className="text-white/80">Loading node holdings...</p>
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
              Failed to Load Node Holdings
            </h3>
            <p className="text-white/60">{error}</p>
          </motion.div>
        )}

        {/* Node Holdings Table */}
        {!isLoading && !error && isConnected && nodeHoldings.length > 0 && (
          <motion.div
            variants={itemVariants}
            className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden"
          >
            {/* Desktop Table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full">
                <thead className="bg-white/5 border-b border-white/10">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-white/80 uppercase tracking-wider">
                      Node
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-white/80 uppercase tracking-wider">
                      Purchase Cost
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-white/80 uppercase tracking-wider">
                      Yesterday&apos;s Earnings
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-white/80 uppercase tracking-wider">
                      Accumulated Earnings
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10">
                  {nodeHoldings.map((node, index) => (
                    <motion.tr
                      key={node.id}
                      className="hover:bg-white/5 transition-all duration-200"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      whileHover={{ scale: 1.01 }}
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <span
                            className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r ${getNodeTypeBadge(node.nodeType)} text-white`}
                          >
                            {getNodeTypeName(node.nodeType)}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-white">
                          {formatCurrency(node.purchaseCost.usd)}
                        </div>
                        <div className="text-xs text-white/60">
                          {node.purchaseCost.clt.toLocaleString()} CLT
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-emerald-400">
                          +{formatCurrency(node.yesterdayEarnings.amount)}
                        </div>
                        <div className="text-xs text-white/60">
                          +{node.yesterdayEarnings.percentage.toFixed(2)}%
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-bold text-white">
                          +{formatCurrency(node.accumulatedEarnings)}
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards */}
            <div className="md:hidden divide-y divide-white/10">
              {nodeHoldings.map((node, index) => (
                <motion.div
                  key={node.id}
                  className="p-4 space-y-3"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <div className="flex items-center justify-between">
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r ${getNodeTypeBadge(node.nodeType)} text-white`}
                    >
                      {getNodeTypeName(node.nodeType)}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <div className="text-white/60 text-xs mb-1">Purchase Cost</div>
                      <div className="text-white font-medium">
                        {formatCurrency(node.purchaseCost.usd)}
                      </div>
                      <div className="text-white/60 text-xs">
                        {node.purchaseCost.clt.toLocaleString()} CLT
                      </div>
                    </div>
                    
                    <div>
                      <div className="text-white/60 text-xs mb-1">Yesterday&apos;s Earnings</div>
                      <div className="text-emerald-400 font-medium">
                        +{formatCurrency(node.yesterdayEarnings.amount)}
                      </div>
                      <div className="text-white/60 text-xs">
                        +{node.yesterdayEarnings.percentage.toFixed(2)}%
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="text-white/60 text-xs mb-1">Accumulated Earnings</div>
                    <div className="text-white font-bold">
                      +{formatCurrency(node.accumulatedEarnings)}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Empty State */}
        {!isLoading && !error && isConnected && nodeHoldings.length === 0 && (
          <motion.div
            className="text-center py-20 bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
          >
            <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">
              No Node Holdings Found
            </h3>
            <p className="text-white/60 mb-6">
              You don&apos;t have any nodes yet. Start by purchasing a node to begin earning rewards.
            </p>
            <Link
              href="/network"
              className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-purple-600 to-pink-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-purple-500/30 hover:from-purple-700 hover:to-pink-700 transition-all duration-300"
            >
              Browse Node Tiers
            </Link>
          </motion.div>
        )}
      </motion.div>
    </section>
  );
};

export default StalwartMyNodesList;

