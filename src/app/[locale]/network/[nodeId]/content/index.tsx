'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef, useState } from 'react';
import { useAccount } from 'wagmi';
import { useTranslations } from 'next-intl';
import { useConnectModal } from '@rainbow-me/rainbowkit';
import NodePurchaseModal from '@/components/node-purchase-modal';
import NodePurchaseSuccessModal from '@/components/node-purchase-success-modal';

interface NodeDetailProps {
  nodeId: string;
}

const NodeDetail: React.FC<NodeDetailProps> = ({ nodeId }) => {
  const t = useTranslations('nodeDetail');
  const tNetwork = useTranslations('network');
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
    name: isGenesis ? tNetwork('nodeTiers.genesis.name') : isStandard ? tNetwork('nodeTiers.standard.name') : isSuper ? tNetwork('nodeTiers.super.name') : 'Node',
    title: isGenesis 
      ? t('certificates.genesisNodeCertificate')
      : isStandard 
      ? t('certificates.certificateOfOwnership')
      : isSuper
      ? t('certificates.certificateOfOwnership')
      : t('certificates.certificateOfOwnership'),
    description: isGenesis
      ? tNetwork('nodeTiers.genesis.description')
      : isStandard
      ? tNetwork('nodeTiers.standard.description')
      : tNetwork('nodeTiers.super.description'),
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
      title: t('certificates.certificateOfOwnership'),
      subtitle: t('certificates.ownerName'),
      gradient: 'from-gray-800 to-gray-900',
      borderColor: 'border-gray-700',
    },
    {
      id: 2,
      title: t('certificates.certificateOfOwnership'),
      subtitle: t('certificates.ownerName'),
      gradient: 'from-amber-700 via-yellow-800 to-amber-900',
      borderColor: 'border-amber-600',
    },
    {
      id: 3,
      title: t('certificates.genesisCertificate'),
      subtitle: '',
      gradient: 'from-slate-400 to-slate-600',
      borderColor: 'border-slate-500',
    },
    {
      id: 4,
      title: t('certificates.genesisNodeCertificate'),
      subtitle: '100,000 CHAINCHARITY',
      gradient: 'from-blue-900 to-indigo-900',
      borderColor: 'border-blue-700',
    },
  ];

  // 安全保障措施数据
  const securityMeasures = [
    {
      id: 1,
      title: t('security.protection.title'),
      icon: 'ti-pulse',
      items: [
        t('security.protection.item1'),
        t('security.protection.item2'),
        t('security.protection.item3'),
        t('security.protection.item4'),
      ],
    },
    {
      id: 2,
      title: t('security.technical.title'),
      icon: 'ti-lock',
      items: [
        t('security.technical.item1'),
        t('security.technical.item2'),
        t('security.technical.item3'),
        t('security.technical.item4'),
      ],
    },
    {
      id: 3,
      title: t('security.transparency.title'),
      icon: 'ti-bar-chart',
      items: [
        t('security.transparency.item1'),
        t('security.transparency.item2'),
        t('security.transparency.item3'),
        t('security.transparency.item4'),
      ],
    },
    {
      id: 4,
      title: t('security.insurance.title'),
      icon: 'ti-shield',
      items: [
        t('security.insurance.item1'),
        t('security.insurance.item2'),
        t('security.insurance.item3'),
        t('security.insurance.item4'),
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      <main className="pt-20 sm:pt-24 md:pt-28 lg:pt-36 pb-12 sm:pb-16 md:pb-20" ref={ref}>
        <motion.div
          className="max-w-7xl mx-auto px-4 sm:px-5 md:px-6 lg:px-8 space-y-8 sm:space-y-10 md:space-y-12 lg:space-y-16"
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
        >
          {/* Page Header */}
          <motion.div variants={itemVariants} className="text-center space-y-2 sm:space-y-3 px-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/15 bg-white/5 backdrop-blur-sm text-xs text-white/80">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>{nodeInfo.name}</span>
            </div>
            <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-extrabold text-white tracking-tight leading-tight">
              {nodeInfo.title}
            </h1>
            <p className="text-xs sm:text-sm text-white/70 max-w-2xl mx-auto leading-relaxed">
              {nodeInfo.description}
            </p>
          </motion.div>

          {/* Investment Limit & Total Stats */}
          <motion.section variants={itemVariants} className="relative">
            <div className="relative rounded-xl sm:rounded-2xl border border-white/10 bg-gradient-to-br from-slate-900/90 via-slate-950/95 to-slate-900/90 p-3 sm:p-4 md:p-5 shadow-xl overflow-hidden">
              {/* Background gradient effects */}
              <div className={`pointer-events-none absolute -top-20 -right-16 sm:-top-32 sm:-right-24 w-48 h-48 sm:w-72 sm:h-72 blur-3xl opacity-40 ${
                isStandard ? 'bg-emerald-500/20' : 'bg-purple-500/20'
              }`} />
              <div className={`pointer-events-none absolute -bottom-20 -left-16 sm:-bottom-32 sm:-left-24 w-56 h-56 sm:w-80 sm:h-80 blur-3xl opacity-40 ${
                isStandard ? 'bg-teal-500/20' : 'bg-pink-500/20'
              }`} />
              
              <div className="relative z-10">
                {/* Standard Node - Simplified Header Format */}
                {isStandard ? (
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-3 mb-3 sm:mb-4">
                    <h2 className="text-base sm:text-lg md:text-xl font-bold text-white">{nodeInfo.name}</h2>
                    <div className="inline-flex items-center gap-2 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full bg-white/5 border border-white/10">
                      <span className="text-sm sm:text-base font-semibold text-white">
                        {nodeStats.sold.toLocaleString()}/{nodeStats.totalLimit.toLocaleString()}
                      </span>
                      <span className="text-xs text-white/60 hidden sm:inline">{t('stats.total')}</span>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3 md:gap-4">
                    {/* Total Investment Limit */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={isInView ? { opacity: 1, y: 0 } : {}}
                      transition={{ delay: 0.2 }}
                      className="rounded-lg sm:rounded-xl border border-white/10 bg-white/5 p-2.5 sm:p-3 md:p-4 text-center"
                    >
                      <div className="text-xs text-white/60 mb-1">Limit</div>
                      <div className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-white">
                        {nodeStats.totalLimit.toLocaleString()}
                      </div>
                    </motion.div>

                    {/* Sold Count */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={isInView ? { opacity: 1, y: 0 } : {}}
                      transition={{ delay: 0.3 }}
                      className="rounded-lg sm:rounded-xl border border-white/10 bg-white/5 p-2.5 sm:p-3 md:p-4 text-center"
                    >
                      <div className="text-xs text-white/60 mb-1">Sold</div>
                      <div className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-emerald-400">
                        {nodeStats.sold.toLocaleString()}
                      </div>
                    </motion.div>

                    {/* Remaining Count */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={isInView ? { opacity: 1, y: 0 } : {}}
                      transition={{ delay: 0.4 }}
                      className="rounded-lg sm:rounded-xl border border-white/10 bg-white/5 p-2.5 sm:p-3 md:p-4 text-center"
                    >
                      <div className="text-xs text-white/60 mb-1">Remaining</div>
                      <div className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-purple-400">
                        {nodeStats.remaining.toLocaleString()}
                      </div>
                    </motion.div>
                  </div>
                )}

                {/* Progress Bar */}
                {isStandard ? (
                  <motion.div
                    initial={{ opacity: 0, scaleX: 0 }}
                    animate={isInView ? { opacity: 1, scaleX: 1 } : {}}
                    transition={{ delay: 0.5, duration: 0.8 }}
                    className="mt-3 sm:mt-0"
                  >
                    <div className="relative h-2 rounded-full bg-white/10 overflow-hidden">
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
                    className="mt-3 sm:mt-4"
                  >
                    <div className="flex items-center justify-between text-xs text-white/70 mb-1">
                      <span>Progress</span>
                      <span className="font-semibold">{progressPercentage.toFixed(1)}%</span>
                    </div>
                    <div className="relative h-2 rounded-full bg-white/10 overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={isInView ? { width: `${progressPercentage}%` } : {}}
                        transition={{ delay: 0.6, duration: 1, ease: 'easeOut' }}
                        className="absolute inset-y-0 left-0 bg-gradient-to-r from-purple-500 via-pink-500 to-purple-500 rounded-full"
                      />
                    </div>
                    {nodeStats.remaining > 0 && (
                      <p className="text-xs text-white/60 text-center mt-1.5">
                        {nodeStats.remaining} remaining
                      </p>
                    )}
                  </motion.div>
                )}
              </div>
            </div>
          </motion.section>

          {/* NFT Certificates Section */}
          {isGenesis && (
            <motion.section variants={itemVariants} className="space-y-3 sm:space-y-4">
              <h2 className="text-base sm:text-lg md:text-xl font-semibold text-white text-center px-4">
                {t('certificates.title')}
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3 md:gap-4">
                {certificates.map((cert, index) => (
                  <motion.div
                    key={cert.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ delay: index * 0.1 }}
                    className={`relative rounded-xl sm:rounded-2xl border-2 ${cert.borderColor} bg-gradient-to-br ${cert.gradient} p-3 sm:p-4 md:p-6 aspect-[3/4] flex flex-col justify-between shadow-xl hover:scale-105 transition-transform duration-300 cursor-pointer`}
                  >
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/20 rounded-xl sm:rounded-2xl" />
                    <div className="relative z-10">
                      <h3 className="text-[10px] xs:text-xs sm:text-sm font-bold text-white/90 mb-2 leading-tight break-words">
                        {cert.title}
                      </h3>
                      {cert.subtitle && (
                        <p className="text-[10px] xs:text-xs text-white/70 break-words">{cert.subtitle}</p>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.section>
          )}

          {/* Investment Returns & Price Advantage Section - Combined for PC */}
          {(isGenesis || isStandard || isSuper) && (
            <motion.section variants={itemVariants} className="relative">
              <div className="relative rounded-xl sm:rounded-2xl border border-white/10 bg-gradient-to-br from-slate-900/90 via-slate-950/95 to-slate-900/90 p-4 sm:p-5 md:p-6 shadow-xl overflow-hidden">
                {/* Background gradient effects */}
                <div className="pointer-events-none absolute -top-20 -right-20 w-64 h-64 blur-3xl opacity-30 bg-purple-500/20" />
                <div className="pointer-events-none absolute -bottom-20 -left-20 w-64 h-64 blur-3xl opacity-30 bg-emerald-500/20" />
                
                <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                  {/* Investment Returns Section */}
                  <div className="space-y-3 sm:space-y-4">
                    <h2 className="text-base sm:text-lg md:text-xl font-semibold text-white mb-3 sm:mb-4">
                      {t('purchase.investmentReturns')}
                    </h2>
                    <div className="grid grid-cols-2 gap-2 sm:gap-3">
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={isInView ? { opacity: 1, scale: 1 } : {}}
                        transition={{ delay: 0.2 }}
                        className="rounded-lg border border-white/10 bg-white/5 p-3 sm:p-4"
                      >
                        <div className="text-xs text-white/60 mb-1">{t('purchase.initial')}</div>
                        <div className="text-lg sm:text-xl md:text-2xl font-bold text-white">
                          {isGenesis ? '$100K' : isStandard ? '100K USDT' : '$50K'}
                        </div>
                      </motion.div>
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={isInView ? { opacity: 1, scale: 1 } : {}}
                        transition={{ delay: 0.3 }}
                        className="rounded-lg border border-white/10 bg-white/5 p-3 sm:p-4"
                      >
                        <div className="text-xs text-white/60 mb-1">{t('purchase.threeYearReturn')}</div>
                        <div className="text-lg sm:text-xl md:text-2xl font-bold text-emerald-400">
                          {isGenesis ? '$2.4M' : isStandard ? '200K USDT' : '$1.2M'}
                        </div>
                      </motion.div>
                    </div>

                    <div className="grid grid-cols-3 gap-2">
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={isInView ? { opacity: 1, y: 0 } : {}}
                        transition={{ delay: 0.4 }}
                        className="rounded-lg border border-white/10 bg-white/5 p-2.5 sm:p-3 text-center"
                      >
                        <div className="text-xs text-white/60 mb-1">{t('purchase.year1')}</div>
                        <div className="text-sm sm:text-base font-bold text-white">
                          {isGenesis ? '$350K' : isStandard ? '2K USDT' : '$175K'}
                        </div>
                      </motion.div>
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={isInView ? { opacity: 1, y: 0 } : {}}
                        transition={{ delay: 0.5 }}
                        className="rounded-lg border border-white/10 bg-white/5 p-2.5 sm:p-3 text-center"
                      >
                        <div className="text-xs text-white/60 mb-1">{t('purchase.year2')}</div>
                        <div className="text-sm sm:text-base font-bold text-white">
                          {isGenesis ? '$520K' : isStandard ? '6K USDT' : '$260K'}
                        </div>
                      </motion.div>
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={isInView ? { opacity: 1, y: 0 } : {}}
                        transition={{ delay: 0.6 }}
                        className="rounded-lg border border-white/10 bg-white/5 p-2.5 sm:p-3 text-center"
                      >
                        <div className="text-xs text-white/60 mb-1">{t('purchase.year3')}</div>
                        <div className="text-sm sm:text-base font-bold text-white">
                          {isGenesis ? '$630K' : isStandard ? '10K USDT' : '$315K'}
                        </div>
                      </motion.div>
                    </div>

                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={isInView ? { opacity: 1, scale: 1 } : {}}
                      transition={{ delay: 0.7 }}
                      className={`rounded-lg border-2 ${
                        isStandard 
                          ? 'border-emerald-500/50 bg-gradient-to-r from-emerald-900/30 via-teal-900/30 to-emerald-900/30'
                          : 'border-purple-500/50 bg-gradient-to-r from-purple-900/30 via-pink-900/30 to-purple-900/30'
                      } p-3 sm:p-4`}
                    >
                      <div className="flex items-baseline justify-between gap-2 mb-1.5">
                        <div className="text-xs text-white/70">{t('purchase.totalReturnRate')}</div>
                        <div className={`text-xl sm:text-2xl md:text-3xl font-extrabold ${
                          isStandard ? 'text-emerald-300' : 'text-purple-300'
                        }`}>
                          {isGenesis ? '2408%' : isStandard ? '100%' : '1200%'}
                        </div>
                      </div>
                      <p className="text-xs text-white/80 leading-relaxed">
                        {isGenesis
                          ? 'Genesis Nodes: $100K → $2.4M in 3 years'
                          : isStandard
                          ? 'Standard Node: 100K USDT → 200K USDT in 3 years'
                          : 'Super Node: $50K → $600K in 3 years'}
                      </p>
                    </motion.div>
                  </div>

                  {/* Price Advantage Section */}
                  <div className="space-y-3 sm:space-y-4 md:flex md:flex-col">
                    <h2 className="text-base sm:text-lg md:text-xl font-semibold text-white mb-3 sm:mb-4">
                      {t('purchase.priceAdvantage')}
                    </h2>
                    <div className="grid grid-cols-2 gap-2 sm:gap-3">
                      <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={isInView ? { opacity: 1, x: 0 } : {}}
                        transition={{ delay: 0.2 }}
                        className="rounded-lg border border-white/10 bg-white/5 p-3 sm:p-4"
                      >
                        <div className="text-xs text-white/60 mb-1">{t('purchase.nodePrice')}</div>
                        <div className="text-lg sm:text-xl md:text-2xl font-bold text-emerald-400">$0.17/CLT</div>
                        <p className="text-xs text-white/60 mt-1">{t('purchase.exclusivePrice')}</p>
                      </motion.div>
                      <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={isInView ? { opacity: 1, x: 0 } : {}}
                        transition={{ delay: 0.3 }}
                        className="rounded-lg border border-white/10 bg-white/5 p-3 sm:p-4"
                      >
                        <div className="text-xs text-white/60 mb-1">{t('purchase.publicPrice')}</div>
                        <div className="text-lg sm:text-xl md:text-2xl font-bold text-white">$2.5/CLT</div>
                        <p className="text-xs text-white/60 mt-1">{t('purchase.publicOffering')}</p>
                      </motion.div>
                    </div>
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={isInView ? { opacity: 1, scale: 1 } : {}}
                      transition={{ delay: 0.4 }}
                      className="rounded-lg border-2 border-emerald-500/50 bg-gradient-to-r from-emerald-900/30 to-teal-900/30 p-3 sm:p-4 md:mt-auto"
                    >
                      <div className="flex items-center justify-between gap-2 mb-1.5">
                        <div className="text-xs text-white/70">{t('purchase.advantage')}</div>
                        <div className="text-xl sm:text-2xl md:text-3xl font-extrabold text-emerald-400">14.6x</div>
                      </div>
                      <p className="text-xs text-white/80">
                        {t('purchase.advantageDescription')}
                      </p>
                    </motion.div>
                  </div>
                </div>
              </div>
            </motion.section>
          )}

          {/* Security Measures Section */}
          <motion.section variants={itemVariants} className="space-y-3 sm:space-y-4">
            <h2 className="text-base sm:text-lg md:text-xl font-semibold text-white text-center px-4">
              {t('security.title')}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
              {securityMeasures.map((measure, index) => (
                <motion.div
                  key={measure.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: index * 0.1 }}
                  className="rounded-xl sm:rounded-2xl border border-white/10 bg-gradient-to-br from-slate-900/90 via-slate-950/95 to-slate-900/90 p-3 sm:p-4 md:p-5 shadow-xl hover:border-white/20 transition-all duration-300"
                >
                  <div className="flex items-start gap-2 sm:gap-3">
                    <div className="flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-lg bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-white/10 flex items-center justify-center">
                      <i className={`${measure.icon} text-lg sm:text-xl md:text-2xl text-purple-400`}></i>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm sm:text-base font-semibold text-white mb-1.5 sm:mb-2">{measure.title}</h3>
                      <ul className="space-y-1 sm:space-y-1.5">
                        {measure.items.map((item, itemIndex) => (
                          <li key={itemIndex} className="flex items-start gap-1.5 text-xs sm:text-sm text-white/70 leading-relaxed">
                            <span className="text-emerald-400 mt-0.5 flex-shrink-0 text-xs">•</span>
                            <span className="break-words">{item}</span>
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
          <motion.section variants={itemVariants} className="flex justify-center pt-4 sm:pt-5 px-4">
            <motion.button
              onClick={handlePurchaseNode}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-full sm:w-auto inline-flex items-center justify-center rounded-full bg-gradient-to-r from-purple-600 to-pink-600 px-5 sm:px-6 md:px-8 py-2.5 sm:py-3 md:py-4 text-sm sm:text-base font-semibold text-white shadow-lg shadow-purple-500/30 hover:from-purple-700 hover:to-pink-700 transition-all duration-300"
            >
              {isConnected ? t('purchase.title') : t('purchase.connectWallet')}
            </motion.button>
          </motion.section>

          {/* Footer Note */}
          <motion.div
            variants={itemVariants}
            className="text-center pt-4 sm:pt-5 border-t border-white/10 px-4"
          >
            <p className="text-xs text-white/70 leading-relaxed">
              {t('purchase.footerNote')}
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

export default NodeDetail;

