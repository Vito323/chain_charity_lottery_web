"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { formatCurrency } from '@/utils/currency';

// 历史开奖结果数据类型
interface LotteryHistoryItem {
  id: string;
  drawDate: string;
  txHash: string;
  winningDNA: string;
  prizeAmount: string;
}

// 缺省数据
const defaultHistoryData: LotteryHistoryItem[] = [
  {
    id: '1',
    drawDate: '2025-10-03T20:30:00Z',
    txHash: '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef',
    winningDNA: '05 12 23 31 45 50',
    prizeAmount: formatCurrency(1050200)
  },
  {
    id: '2',
    drawDate: '2025-09-29T15:45:00Z',
    txHash: '0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890',
    winningDNA: '11 19 28 33 41 49',
    prizeAmount: formatCurrency(980500)
  },
  {
    id: '3',
    drawDate: '2025-09-24T22:15:00Z',
    txHash: '0x567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234',
    winningDNA: '02 08 15 29 38 44',
    prizeAmount: formatCurrency(1530000)
  },
  {
    id: '4',
    drawDate: '2025-09-22T18:00:00Z',
    txHash: '0xdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890abc',
    winningDNA: '07 14 21 35 42 48',
    prizeAmount: formatCurrency(2100000)
  },
  {
    id: '5',
    drawDate: '2025-09-18T14:20:00Z',
    txHash: '0x7890abcdef1234567890abcdef1234567890abcdef1234567890abcdef123456',
    winningDNA: '03 16 24 37 43 46',
    prizeAmount: formatCurrency(850750)
  }
];

const StalwartLotteryHistory = () => {
  const [historyData] = useState<LotteryHistoryItem[]>(defaultHistoryData);
  const [isLoading] = useState(false);
  const [error] = useState<string | null>(null);
  const [copiedHash, setCopiedHash] = useState<string | null>(null);

  // 截断交易哈希显示
  const truncateTxHash = (hash: string) => {
    if (hash.length <= 20) return hash;
    return `${hash.slice(0, 10)}...${hash.slice(-10)}`;
  };

  // 复制交易哈希到剪贴板
  const copyTxHash = async (txHash: string) => {
    try {
      await navigator.clipboard.writeText(txHash);
      setCopiedHash(txHash);
      setTimeout(() => {
        setCopiedHash(null);
      }, 2000);
    } catch (err) {
      console.error('Copy failed:', err);
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

  return (
    <section className="relative py-20 md:py-32">
      {/* Background Elements */}
      <div className="absolute inset-0 z-0">
        <motion.div
          className="absolute top-20 right-10 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      </div>

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
            <span className="text-sm">Historical Results</span>
          </motion.div>

          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Lottery <span className="bg-gradient-to-r from-purple-300 via-pink-300 to-fuchsia-300 bg-clip-text text-transparent">History</span>
          </h2>
          <p className="text-lg md:text-xl text-white/80 max-w-3xl mx-auto leading-relaxed">
            Track all previous lottery draws and winning numbers. Verify results on the blockchain.
          </p>
        </motion.div>

        {/* Loading State */}
        {isLoading && (
          <motion.div
            className="text-center py-20 bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
          >
            <div className="w-8 h-8 border-2 border-white/30 border-t-white rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-white/80">Loading lottery history...</p>
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
              Failed to Load History
            </h3>
            <p className="text-white/60">{error}</p>
          </motion.div>
        )}

        {/* History Table */}
        {!isLoading && !error && historyData.length > 0 && (
          <motion.div
            variants={itemVariants}
            className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden"
          >
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-white/5 border-b border-white/10">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-white/80 uppercase tracking-wider">
                      Draw Date
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-white/80 uppercase tracking-wider">
                      Transaction Hash
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-white/80 uppercase tracking-wider">
                      Winning DNA
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-white/80 uppercase tracking-wider">
                      Prize Pool
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10">
                  {historyData.map((item, index) => (
                    <motion.tr
                      key={item.id}
                      className="hover:bg-white/5 transition-all duration-200"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      whileHover={{ scale: 1.01 }}
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-white">
                          {new Date(item.drawDate).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          })}
                        </div>
                        <div className="text-xs text-white/60">
                          {new Date(item.drawDate).toLocaleTimeString('en-US', {
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </div>
                      </td>
                      <td 
                        className="px-6 py-4 whitespace-nowrap cursor-pointer group"
                        onClick={() => copyTxHash(item.txHash)}
                        title={item.txHash}
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-mono text-white/80 group-hover:text-white transition-colors">
                            {truncateTxHash(item.txHash)}
                          </span>
                          {copiedHash === item.txHash ? (
                            <motion.svg
                              className="w-4 h-4 text-emerald-400"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              transition={{ duration: 0.2 }}
                            >
                              <path d="M20 6L9 17l-5-5"/>
                            </motion.svg>
                          ) : (
                            <svg
                              className="w-4 h-4 text-white/40 group-hover:text-white/60 transition-colors"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                            >
                              <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
                              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
                            </svg>
                          )}
                        </div>
                        {copiedHash === item.txHash && (
                          <motion.div
                            className="text-xs text-emerald-400 mt-1"
                            initial={{ opacity: 0, y: -5 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.2 }}
                          >
                            Copied!
                          </motion.div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex gap-2">
                          {item.winningDNA.split(' ').map((number, idx) => (
                            <span
                              key={idx}
                              className="w-8 h-8 bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-white/20 rounded-full flex items-center justify-center text-sm font-bold text-white"
                            >
                              {number}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-lg font-bold text-white">
                          {item.prizeAmount}
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}

        {/* Empty State */}
        {!isLoading && !error && historyData.length === 0 && (
          <motion.div
            className="text-center py-20 bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
          >
            <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="10"/>
                <circle cx="12" cy="12" r="6"/>
                <circle cx="12" cy="12" r="2"/>
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">
              No Lottery History Available
            </h3>
            <p className="text-white/60">
              Check back later for the latest draw results
            </p>
          </motion.div>
        )}

        {/* Additional Info */}
        <motion.div
          variants={itemVariants}
          className="mt-16 text-center"
        >
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8">
            <h3 className="text-xl font-semibold text-white mb-4">
              How to Verify Results
            </h3>
            <p className="text-white/70 mb-6 max-w-2xl mx-auto">
              All lottery results are recorded on the blockchain. Click on any transaction hash to copy it and verify the results on a blockchain explorer.
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-sm text-white/60">
              <span className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-400"></div>
                Transparent & Verifiable
              </span>
              <span className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-blue-400"></div>
                Blockchain Secured
              </span>
              <span className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-purple-400"></div>
                Fair & Random
              </span>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default StalwartLotteryHistory;
