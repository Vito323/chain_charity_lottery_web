'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef, useState } from 'react';
import { useAccount } from 'wagmi';
import { useConnectModal } from '@rainbow-me/rainbowkit';
import NodePurchaseModal from '@/components/node-purchase-modal';
import NodePurchaseSuccessModal from '@/components/node-purchase-success-modal';

interface StalwartNodeDetailProps {
  nodeId: string;
}

const StalwartNodeDetail: React.FC<StalwartNodeDetailProps> = ({ nodeId }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const { isConnected } = useAccount();
  const { openConnectModal } = useConnectModal();
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [purchaseData, setPurchaseData] = useState<{
    nodeType: 'genesis' | 'super' | 'standard';
    certificateId?: number;
    nodeCount?: number;
  } | null>(null);

  // 判断节点类型
  const nodeIdLower = nodeId.toLowerCase();
  const isGenesis = nodeIdLower === 'genesis' || nodeIdLower.includes('genesis');
  const isStandard = nodeIdLower === 'standard' || nodeIdLower.includes('standard') || nodeIdLower.includes('normal');
  const isSuper = nodeIdLower === 'super' || nodeIdLower.includes('super');

  // 节点统计数据（TODO: 从后端获取实际数据）
  const nodeStats = {
    totalLimit: isGenesis ? 50 : isSuper ? 600 : 50000,
    sold: isGenesis ? 12 : isSuper ? 245 : 18678, // 示例数据
    remaining: 0,
  };
  nodeStats.remaining = nodeStats.totalLimit - nodeStats.sold;
  const progressPercentage = (nodeStats.sold / nodeStats.totalLimit) * 100;

  // 节点基本信息
  const nodeInfo = {
    name: isGenesis ? 'Genesis Node' : isStandard ? 'Standard Node' : isSuper ? 'Super Node' : 'Node',
    title: isGenesis 
      ? 'Genesis Node Investment NFT Certificate' 
      : isStandard 
      ? 'Standard Node Investment Certificate'
      : isSuper
      ? 'Super Node Investment Certificate'
      : 'Node Investment Certificate',
    description: isGenesis
      ? 'Exclusive investment opportunity for early supporters with exceptional returns'
      : isStandard
      ? 'Accessible entry for everyday investors with stable returns'
      : 'Designed for experienced investors with competitive yields',
  };

  // 处理购买节点
  const handlePurchaseNode = () => {
    if (!isConnected) {
      openConnectModal?.();
      return;
    }
    setShowPurchaseModal(true);
  };

  // 节点价格配置
  const nodePriceConfig = {
    price: isGenesis ? 100_000 : isSuper ? 50_000 : 10_000,
    exclusivePrice: 0.17, // 美元/CLT
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
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
        duration: 0.6,
        ease: 'easeOut' as const,
      },
    },
  };

  // NFT证书数据
  const certificates = [
    {
      id: 1,
      title: 'CERTIFICATE OF OWNERSHIP',
      subtitle: 'OWNER NAME',
      gradient: 'from-gray-800 to-gray-900',
      borderColor: 'border-gray-700',
    },
    {
      id: 2,
      title: 'CERTIFICATE OF OWNERSHIP',
      subtitle: 'OWNER NAME',
      gradient: 'from-amber-700 via-yellow-800 to-amber-900',
      borderColor: 'border-amber-600',
    },
    {
      id: 3,
      title: 'CHAINCHARITY LOTTERY GENESIS NODE OWNER CERTIFICATE',
      subtitle: '',
      gradient: 'from-slate-400 to-slate-600',
      borderColor: 'border-slate-500',
    },
    {
      id: 4,
      title: 'GENESIS NODE OWNER CERTIFICATE',
      subtitle: '100,000 CHAINCHARITY',
      gradient: 'from-blue-900 to-indigo-900',
      borderColor: 'border-blue-700',
    },
  ];

  // 安全保障措施数据
  const securityMeasures = [
    {
      id: 1,
      title: 'Four-fold Protection Mechanism',
      icon: '🌊',
      items: [
        '$45 million protection funds (46% of total financing)',
        'Four-level price protection barrier',
        'Ensure long-term stable growth of token prices',
        'Automatically intervene to protect investor rights during market fluctuations',
      ],
    },
    {
      id: 2,
      title: 'Technical Security Assurance',
      icon: '🔒',
      items: [
        'Based on Ethereum mainnet, decentralized management',
        'Multi-signature wallet, segregated fund custody',
        '8 third-party security audits ensure code security',
        'Chainlink VRF verified random numbers ensure fair lottery draws',
      ],
    },
    {
      id: 3,
      title: '100% Transparency',
      icon: '📊',
      items: [
        'All transactions are traceable on-chain, permanently recorded',
        'Platform monthly financial reports are publicly transparent',
        'DAO community supervision, user co-governance',
        'Third-party independent audit, authoritative certification',
      ],
    },
    {
      id: 4,
      title: 'Insurance Fund Escort',
      icon: '🛡️',
      items: [
        'Three-level risk buffering mechanism fully covered',
        'Professional insurance company fund custody',
        'User fund security is always paramount',
        'Blockchain technology ensures every transaction is secure and reliable',
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      <main className="pt-28 md:pt-36 pb-20" ref={ref}>
        <motion.div
          className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 space-y-10 md:space-y-16"
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
        >
          {/* Page Header */}
          <motion.div variants={itemVariants} className="text-center space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/15 bg-white/5 backdrop-blur-sm text-xs text-white/80">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>{nodeInfo.name}</span>
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight">
              {nodeInfo.title}
            </h1>
            <p className="text-sm sm:text-base text-white/70 max-w-2xl mx-auto">
              {nodeInfo.description}
            </p>
          </motion.div>

          {/* Investment Limit & Total Stats */}
          <motion.section variants={itemVariants} className="relative">
            <div className="relative rounded-3xl border border-white/10 bg-gradient-to-br from-slate-900/90 via-slate-950/95 to-slate-900/90 p-5 sm:p-6 md:p-8 shadow-xl overflow-hidden">
              {/* Background gradient effects */}
              <div className={`pointer-events-none absolute -top-32 -right-24 w-72 h-72 blur-3xl opacity-40 ${
                isStandard ? 'bg-emerald-500/20' : 'bg-purple-500/20'
              }`} />
              <div className={`pointer-events-none absolute -bottom-32 -left-24 w-80 h-80 blur-3xl opacity-40 ${
                isStandard ? 'bg-teal-500/20' : 'bg-pink-500/20'
              }`} />
              
              <div className="relative z-10">
                {/* Standard Node - Simplified Header Format */}
                {isStandard ? (
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                    <h2 className="text-xl sm:text-2xl font-bold text-white">{nodeInfo.name}</h2>
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10">
                      <span className="text-base sm:text-lg font-semibold text-white">
                        {nodeStats.sold.toLocaleString()}/{nodeStats.totalLimit.toLocaleString()}
                      </span>
                      <span className="text-xs sm:text-sm text-white/60">Total Quantity</span>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
                    {/* Total Investment Limit */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={isInView ? { opacity: 1, y: 0 } : {}}
                      transition={{ delay: 0.2 }}
                      className="rounded-2xl border border-white/10 bg-white/5 p-4 sm:p-5 text-center"
                    >
                      <div className="text-xs sm:text-sm text-white/60 mb-2">Investment Limit</div>
                      <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-1">
                        {nodeStats.totalLimit.toLocaleString()}
                      </div>
                      <div className="text-xs text-white/50">Total Nodes</div>
                    </motion.div>

                    {/* Sold Count */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={isInView ? { opacity: 1, y: 0 } : {}}
                      transition={{ delay: 0.3 }}
                      className="rounded-2xl border border-white/10 bg-white/5 p-4 sm:p-5 text-center"
                    >
                      <div className="text-xs sm:text-sm text-white/60 mb-2">Total Invested</div>
                      <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-emerald-400 mb-1">
                        {nodeStats.sold.toLocaleString()}
                      </div>
                      <div className="text-xs text-white/50">Nodes Sold</div>
                    </motion.div>

                    {/* Remaining Count */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={isInView ? { opacity: 1, y: 0 } : {}}
                      transition={{ delay: 0.4 }}
                      className="rounded-2xl border border-white/10 bg-white/5 p-4 sm:p-5 text-center"
                    >
                      <div className="text-xs sm:text-sm text-white/60 mb-2">Remaining</div>
                      <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-purple-400 mb-1">
                        {nodeStats.remaining.toLocaleString()}
                      </div>
                      <div className="text-xs text-white/50">Available Now</div>
                    </motion.div>
                  </div>
                )}

                {/* Progress Bar */}
                {isStandard ? (
                  <motion.div
                    initial={{ opacity: 0, scaleX: 0 }}
                    animate={isInView ? { opacity: 1, scaleX: 1 } : {}}
                    transition={{ delay: 0.5, duration: 0.8 }}
                    className="space-y-2"
                  >
                    <div className="relative h-2 sm:h-3 rounded-full bg-white/10 overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={isInView ? { width: `${progressPercentage}%` } : {}}
                        transition={{ delay: 0.6, duration: 1, ease: 'easeOut' }}
                        className="absolute inset-y-0 left-0 bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-500 rounded-full"
                      />
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, scaleX: 0 }}
                    animate={isInView ? { opacity: 1, scaleX: 1 } : {}}
                    transition={{ delay: 0.5, duration: 0.8 }}
                    className="mt-6 space-y-2"
                  >
                    <div className="flex items-center justify-between text-xs sm:text-sm text-white/70">
                      <span>Progress</span>
                      <span className="font-semibold">{progressPercentage.toFixed(1)}%</span>
                    </div>
                    <div className="relative h-2 sm:h-3 rounded-full bg-white/10 overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={isInView ? { width: `${progressPercentage}%` } : {}}
                        transition={{ delay: 0.6, duration: 1, ease: 'easeOut' }}
                        className="absolute inset-y-0 left-0 bg-gradient-to-r from-purple-500 via-pink-500 to-purple-500 rounded-full"
                      />
                    </div>
                    <p className="text-xs text-white/60 text-center mt-2">
                      {nodeStats.remaining > 0 
                        ? `${nodeStats.remaining} nodes remaining - Limited supply, first come first served`
                        : 'All nodes have been sold out'}
                    </p>
                  </motion.div>
                )}
              </div>
            </div>
          </motion.section>

          {/* NFT Certificates Section */}
          {isGenesis && (
            <motion.section variants={itemVariants} className="space-y-6">
              <h2 className="text-xl sm:text-2xl font-semibold text-white text-center">
                NFT Certificates
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                {certificates.map((cert, index) => (
                  <motion.div
                    key={cert.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ delay: index * 0.1 }}
                    className={`relative rounded-2xl border-2 ${cert.borderColor} bg-gradient-to-br ${cert.gradient} p-4 sm:p-6 aspect-[3/4] flex flex-col justify-between shadow-xl hover:scale-105 transition-transform duration-300 cursor-pointer`}
                  >
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/20 rounded-2xl" />
                    <div className="relative z-10">
                      <h3 className="text-[10px] xs:text-xs sm:text-sm font-bold text-white/90 mb-2 leading-tight">
                        {cert.title}
                      </h3>
                      {cert.subtitle && (
                        <p className="text-[10px] xs:text-xs text-white/70">{cert.subtitle}</p>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.section>
          )}

          {/* Investment Returns Section */}
          {(isGenesis || isStandard || isSuper) && (
            <motion.section variants={itemVariants} className="space-y-6">
              <h2 className="text-xl sm:text-2xl font-semibold text-white text-center">
                {nodeInfo.name} Investment Returns
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={isInView ? { opacity: 1, scale: 1 } : {}}
                  transition={{ delay: 0.2 }}
                  className="rounded-3xl border border-white/10 bg-gradient-to-br from-slate-900/90 via-slate-950/95 to-slate-900/90 p-5 sm:p-6 shadow-xl"
                >
                  <div className="text-xs sm:text-sm text-white/70 mb-2">Initial Investment</div>
                  <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-white">
                    {isGenesis ? '$100,000' : isStandard ? '100,000 USDT' : '$50,000'}
                  </div>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={isInView ? { opacity: 1, scale: 1 } : {}}
                  transition={{ delay: 0.3 }}
                  className="rounded-3xl border border-white/10 bg-gradient-to-br from-slate-900/90 via-slate-950/95 to-slate-900/90 p-5 sm:p-6 shadow-xl"
                >
                  <div className="text-xs sm:text-sm text-white/70 mb-2">Three-Year Return</div>
                  <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-emerald-400">
                    {isGenesis ? '$2,400,000' : isStandard ? '200,000 USDT' : '$1,200,000'}
                  </div>
                </motion.div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: 0.4 }}
                  className="rounded-2xl border border-white/10 bg-white/5 p-4 sm:p-5"
                >
                  <div className="text-xs text-white/60 mb-1">First Year Income</div>
                  <div className="text-lg sm:text-xl font-bold text-white">
                    {isGenesis ? '$350,000' : isStandard ? '2,000 USDT' : '$175,000'}
                  </div>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: 0.5 }}
                  className="rounded-2xl border border-white/10 bg-white/5 p-4 sm:p-5"
                >
                  <div className="text-xs text-white/60 mb-1">Second Year Income</div>
                  <div className="text-lg sm:text-xl font-bold text-white">
                    {isGenesis ? '$520,000' : isStandard ? '6,000 USDT' : '$260,000'}
                  </div>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: 0.6 }}
                  className="rounded-2xl border border-white/10 bg-white/5 p-4 sm:p-5"
                >
                  <div className="text-xs text-white/60 mb-1">Third Year Income</div>
                  <div className="text-lg sm:text-xl font-bold text-white">
                    {isGenesis ? '$630,000' : isStandard ? '10,000 USDT' : '$315,000'}
                  </div>
                </motion.div>
              </div>

              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={isInView ? { opacity: 1, scale: 1 } : {}}
                transition={{ delay: 0.7 }}
                className={`rounded-3xl border-2 ${
                  isStandard 
                    ? 'border-emerald-500/50 bg-gradient-to-r from-emerald-900/30 via-teal-900/30 to-emerald-900/30'
                    : 'border-purple-500/50 bg-gradient-to-r from-purple-900/30 via-pink-900/30 to-purple-900/30'
                } p-5 sm:p-6 shadow-2xl`}
              >
                <div className="text-xs sm:text-sm text-white/70 mb-2">Three-Year Total Investment Return Rate</div>
                <div className={`text-3xl sm:text-4xl md:text-5xl font-extrabold bg-clip-text text-transparent ${
                  isStandard
                    ? 'bg-gradient-to-r from-emerald-300 to-teal-300'
                    : 'bg-gradient-to-r from-purple-300 to-pink-300'
                }`}>
                  {isGenesis ? '2408%' : isStandard ? '100%' : '1200%'}
                </div>
                <p className="mt-3 sm:mt-4 text-xs sm:text-sm text-white/80">
                  {isGenesis
                    ? 'The three-year total return rate of Genesis Nodes is as high as 2408% | An investment of $100,000 is expected to become $2.4 million'
                    : isStandard
                    ? 'Standard Node three-year total return rate is as high as 100% | An investment of 100,000 USDT is expected to become 200,000 USDT'
                    : 'Super Node three-year total return rate is as high as 1200% | An investment of $50,000 is expected to become $600,000'}
                </p>
              </motion.div>
            </motion.section>
          )}

          {/* Node Price Advantage Section */}
          {(isGenesis || isStandard || isSuper) && (
            <motion.section variants={itemVariants} className="space-y-6">
              <h2 className="text-xl sm:text-2xl font-semibold text-white text-center">
                Node Price Advantage Highlighted
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ delay: 0.2 }}
                  className="rounded-3xl border border-white/10 bg-gradient-to-br from-slate-900/90 via-slate-950/95 to-slate-900/90 p-5 sm:p-6 shadow-xl"
                >
                  <div className="text-xs sm:text-sm text-white/70 mb-2">Node Investment Cost</div>
                  <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-emerald-400 mb-2">$0.17 / CLT</div>
                  <p className="text-xs text-white/60">Node investor exclusive price, limited supply, first come, first served</p>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ delay: 0.3 }}
                  className="rounded-3xl border border-white/10 bg-gradient-to-br from-slate-900/90 via-slate-950/95 to-slate-900/90 p-5 sm:p-6 shadow-xl"
                >
                  <div className="text-xs sm:text-sm text-white/70 mb-2">Public Offering Price</div>
                  <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-2">$2.5 / CLT</div>
                  <p className="text-xs text-white/60">Public offering price for ordinary investors, public offering price confirmed</p>
                </motion.div>
              </div>
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={isInView ? { opacity: 1, scale: 1 } : {}}
                transition={{ delay: 0.4 }}
                className="rounded-3xl border-2 border-emerald-500/50 bg-gradient-to-r from-emerald-900/30 to-teal-900/30 p-5 sm:p-6 shadow-2xl text-center"
              >
                <div className="text-xs sm:text-sm text-white/70 mb-2">Price Advantage</div>
                <div className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-emerald-400 mb-2">14.6x</div>
                <p className="text-xs sm:text-sm text-white/80">
                  Node investors gain a 14.6 times price advantage over ordinary investors
                </p>
              </motion.div>
            </motion.section>
          )}

          {/* Security Measures Section */}
          <motion.section variants={itemVariants} className="space-y-6">
            <h2 className="text-xl sm:text-2xl font-semibold text-white text-center">
              Security Assurance Measures
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {securityMeasures.map((measure, index) => (
                <motion.div
                  key={measure.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: index * 0.1 }}
                  className="rounded-3xl border border-white/10 bg-gradient-to-br from-slate-900/90 via-slate-950/95 to-slate-900/90 p-5 sm:p-6 shadow-xl hover:border-white/20 transition-all duration-300"
                >
                  <div className="flex items-start gap-3 sm:gap-4">
                    <div className="text-3xl sm:text-4xl flex-shrink-0">{measure.icon}</div>
                    <div className="flex-1">
                      <h3 className="text-base sm:text-lg font-semibold text-white mb-3 sm:mb-4">{measure.title}</h3>
                      <ul className="space-y-2">
                        {measure.items.map((item, itemIndex) => (
                          <li key={itemIndex} className="flex items-start gap-2 text-xs sm:text-sm text-white/70">
                            <span className="text-emerald-400 mt-1 flex-shrink-0">•</span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.section>

          {/* Purchase Button Section */}
          <motion.section variants={itemVariants} className="flex justify-center pt-8">
            <motion.button
              onClick={handlePurchaseNode}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-purple-600 to-pink-600 px-8 py-4 text-base sm:text-lg font-semibold text-white shadow-lg shadow-purple-500/30 hover:from-purple-700 hover:to-pink-700 transition-all duration-300"
            >
              {isConnected ? 'Purchase Node' : 'Connect Wallet to Purchase'}
            </motion.button>
          </motion.section>

          {/* Footer Note */}
          <motion.div
            variants={itemVariants}
            className="text-center pt-8 border-t border-white/10"
          >
            <p className="text-sm text-white/70">
              All nodes are sold until exhausted, never to be reissued | Node holders enjoy permanent platform dividend rights
            </p>
          </motion.div>
        </motion.div>
      </main>

      {/* Purchase Modal */}
      <NodePurchaseModal
        isOpen={showPurchaseModal}
        onClose={() => setShowPurchaseModal(false)}
        nodeType={isGenesis ? 'genesis' : isSuper ? 'super' : 'standard'}
        nodePrice={nodePriceConfig.price}
        exclusivePrice={nodePriceConfig.exclusivePrice}
        remaining={isStandard ? nodeStats.remaining : undefined}
        onPurchaseSuccess={(nodeType, certificateId) => {
          // Mock: 假设用户已有一些节点
          const mockNodeCount = Math.floor(Math.random() * 5) + 1;
          setPurchaseData({
            nodeType,
            certificateId,
            nodeCount: mockNodeCount,
          });
          setShowSuccessModal(true);
        }}
      />

      {/* Purchase Success Modal */}
      {purchaseData && (
        <NodePurchaseSuccessModal
          isOpen={showSuccessModal}
          onClose={() => {
            setShowSuccessModal(false);
            setPurchaseData(null);
          }}
          nodeType={purchaseData.nodeType}
          nodeCount={purchaseData.nodeCount}
          certificateId={purchaseData.certificateId}
        />
      )}
    </div>
  );
};

export default StalwartNodeDetail;

