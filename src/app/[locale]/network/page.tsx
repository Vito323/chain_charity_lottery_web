'use client';

import React, { useMemo, useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useTranslations, useLocale } from 'next-intl';
import { Link } from '@/i18n/navigation';
import dayjs from 'dayjs';
import 'dayjs/locale/zh-cn';
import 'dayjs/locale/en';

import Header from '@/components/header';
import Footer from '@/components/footer';
import ScrollToTop from '@/components/scroll-to-top';
import MyNodesSummary from './nodes-summary';
import { getNodeTiers, type NodeTier, NODES_DATA } from '@/constants/nodes';
import { queryNodeList, type NodeData as ApiNodeData } from '@/service/node';

const DEFAULT_NODE_TIERS = getNodeTiers();

const containerVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: 'easeOut' as const },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: (index: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: 'easeOut' as const,
      delay: index * 0.08,
    },
  }),
};

/**
 * Map rank to node tier ID
 * rank 0 = Genesis, 1 = Super, 2 = Normal
 */
const getNodeTierIdByRank = (rank: string | number): NodeTier['id'] => {
  const rankNum = typeof rank === 'string' ? parseInt(rank, 10) : rank;
  if (rankNum === 0) return 'genesis';
  if (rankNum === 1) return 'super';
  if (rankNum === 2) return 'standard';
  return 'standard'; // default fallback
};

/**
 * Get node tier name by rank
 * rank 0 = Genesis（创世节点）, 1 = Super（超级节点）, 2 = Normal（普通节点）
 */
const getNodeTierNameByRank = (rank: string | number, locale: string): string => {
  const rankNum = typeof rank === 'string' ? parseInt(rank, 10) : rank;
  if (locale === 'zh') {
    if (rankNum === 0) return '创世节点';
    if (rankNum === 1) return '超级节点';
    if (rankNum === 2) return '普通节点';
  } else {
    if (rankNum === 0) return 'Genesis Node';
    if (rankNum === 1) return 'Super Node';
    if (rankNum === 2) return 'Normal Node';
  }
  return locale === 'zh' ? '普通节点' : 'Normal Node';
};

/**
 * Convert API NodeData to NodeTier, merging with default data
 * Priority: API data first, then default data
 */
const convertApiNodeToTier = (apiNode: ApiNodeData, locale: string): NodeTier => {
  const tierId = getNodeTierIdByRank(apiNode.rank);
  const defaultNode = NODES_DATA.find((node) => node.id === tierId);

  // Use API name if provided, otherwise use rank-based name, then fallback to default
  const nodeName = apiNode.name?.trim() 
    ? apiNode.name 
    : getNodeTierNameByRank(apiNode.rank, locale) || defaultNode?.name || '';

  return {
    id: tierId,
    name: nodeName,
    rank: apiNode.rank,
    price: apiNode.price ?? defaultNode?.price ?? 0,
    currency: defaultNode?.currency || 'USDT',
    aprRange: defaultNode?.aprRange || [15, 25],
    globalLimit: apiNode.maxSupply ?? defaultNode?.globalLimit ?? 0,
    description: apiNode.description?.trim() || defaultNode?.description || '',
    highlight: defaultNode?.highlight,
    accentFrom: defaultNode?.accentFrom || 'from-slate-500',
    accentTo: defaultNode?.accentTo || 'to-slate-600',
  };
};

const NetworkPage: React.FC = () => {
  const t = useTranslations('network');
  const locale = useLocale();
  const tCommon = useTranslations('common');

  const [nodeTiers, setNodeTiers] = useState<NodeTier[]>(DEFAULT_NODE_TIERS);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch node list from API
  const fetchNodeList = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await queryNodeList();
      if (response.ok && response.data && response.data.length > 0) {
        // Convert API nodes to NodeTier format
        const convertedTiers = response.data.map((apiNode) =>
          convertApiNodeToTier(apiNode, locale)
        );
        setNodeTiers(convertedTiers);
      } else {
        // Fallback to default data if API fails or returns empty
        setNodeTiers(DEFAULT_NODE_TIERS);
      }
    } catch (err) {
      console.error('Failed to fetch node list:', err);
      setError(tCommon('errors.failedToLoad'));
      // Fallback to default data on error
      setNodeTiers(DEFAULT_NODE_TIERS);
    } finally {
      setIsLoading(false);
    }
  }, [locale, tCommon]);

  useEffect(() => {
    fetchNodeList();
  }, [fetchNodeList]);

  // Format date based on locale using dayjs
  const formattedDate = useMemo(() => {
    const targetDate = dayjs('2026-01-18');
    if (locale === 'zh') {
      return targetDate.locale('zh-cn').format('YYYY年M月D日');
    }
    return targetDate.locale('en').format('MMMM D, YYYY');
  }, [locale]);

  return (
    <div className="min-h-screen bg-linear-to-b from-slate-950 via-slate-900 to-slate-950">
      <Header />

      <main className="pt-28 md:pt-36 pb-20 relative">
        <section className="max-w-6xl mx-auto px-5 sm:px-6 lg:px-8 space-y-10 md:space-y-14">
          {/* Page Title */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="flex flex-col md:flex-row md:items-end md:justify-between gap-4"
          >
            <div className="flex-1">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/15 bg-white/5 backdrop-blur-sm text-xs text-white/80">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>{t('badge')}</span>
              </div>
              <div className="mt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight">
                  {t('title')}
                </h1>
                <Link href="/user/network?tab=nodes">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="inline-flex items-center cursor-pointer gap-2 rounded-full bg-linear-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 px-4 sm:px-5 md:px-6 py-2 sm:py-2.5 md:py-3 text-xs sm:text-sm font-semibold text-white shadow-lg shadow-indigo-500/30 transition-all duration-300 whitespace-nowrap self-start sm:self-center"
                  >
                    <span>{t('nodeDetail')}</span>
                    <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </motion.button>
                </Link>
              </div>
              <p className="mt-3 text-sm sm:text-base text-white/70 max-w-xl">
                {t('subtitle')}
              </p>
            </div>
          </motion.div>

          {/* My Nodes Summary */}
          <MyNodesSummary />

          {/* Purchase Nodes Section */}
          <motion.section
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-6"
          >
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold text-white">
                  {t('buyNodes.title')}
                </h2>
                <p className="mt-2 text-sm sm:text-base text-white/70 max-w-2xl">
                  {t('buyNodes.description')}
                </p>
              </div>
              <button className="inline-flex items-center justify-center self-start rounded-full border border-white/20 bg-white/5 px-4 py-2 text-xs sm:text-sm font-medium text-white/80 hover:bg-white/10 hover:text-white transition-all duration-200 cursor-pointer">
                {t('buyNodes.guide')}
              </button>
            </div>

            {isLoading ? (
              <div className="text-center py-20 bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl">
                <div className="w-8 h-8 border-2 border-white/30 border-t-white rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-white/80">{tCommon('status.loading')}</p>
              </div>
            ) : error ? (
              <div className="text-center py-20 bg-red-500/10 backdrop-blur-xl border border-red-500/20 rounded-3xl">
                <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">
                  {tCommon('errors.failedToLoad')}
                </h3>
                <p className="text-white/60 mb-4">{error}</p>
                <button
                  onClick={fetchNodeList}
                  className="inline-flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 px-4 py-2 text-sm font-medium text-white transition-colors duration-200"
                >
                  {tCommon('actions.refresh')}
                </button>
              </div>
            ) : (
              <>
                <GenesisTierCard nodeTiers={nodeTiers} />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {nodeTiers.filter((tier) => tier.id !== 'genesis').map((tier, index) => (
                <motion.div
                  key={tier.id}
                  custom={index}
                  variants={cardVariants}
                  initial="hidden"
                  animate="visible"
                  className="group relative overflow-hidden rounded-3xl border border-white/12 bg-linear-to-b from-slate-900/90 via-slate-950/95 to-slate-950/95 p-5 sm:p-6 shadow-lg shadow-black/40"
                  whileHover={{ y: -4 }}
                >
                  <div
                    className={`pointer-events-none absolute inset-x-[-40%] top-[-40%] h-40 bg-linear-to-r ${tier.accentFrom} ${tier.accentTo} opacity-20 blur-3xl transition-opacity duration-300 group-hover:opacity-40`}
                  />

                  <div className="relative space-y-4">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <h3 className="text-lg sm:text-xl font-semibold text-white">
                          {t(`nodeTiers.${tier.id}.name`)}
                        </h3>
                        <p className="mt-1 text-xs text-white/60">
                          {t('nodeTiers.annualizedYield')}: {tier.aprRange[0]}-{tier.aprRange[1]}%
                        </p>
                        <p className="mt-1 text-xs text-white/50">
                          {t('nodeTiers.globalLimit')}: {tier.globalLimit.toLocaleString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="text-xl font-bold text-white">
                          {tier.price.toLocaleString()} {tier.currency}
                        </div>
                      </div>
                    </div>

                    <p className="text-xs sm:text-sm text-white/70">
                      {t(`nodeTiers.${tier.id}.description`)}
                    </p>

                    <div className="flex items-center justify-between gap-3 pt-1">
                      <Link
                        href={`/network/detail?rank=${tier.rank}`}
                        className="inline-flex flex-1 items-center justify-center rounded-full bg-white/12 px-4 py-2 text-xs sm:text-sm font-medium text-white hover:bg-white/20 transition-colors duration-200 cursor-pointer"
                      >
                        {t('nodeTiers.viewDetails')}
                      </Link>
                    </div>
                  </div>
                </motion.div>
                  ))}
                </div>
              </>
            )}
          </motion.section>
        </section>
      </main>

      <Footer />
      <ScrollToTop />
    </div>
  );
};

const GenesisTierCard: React.FC<{ nodeTiers: NodeTier[] }> = ({ nodeTiers }) => {
  const t = useTranslations('network');
  const genesis = nodeTiers.find((tier) => tier.id === 'genesis');

  if (!genesis) return null;

  return (
    <motion.div
      custom={0}
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      className="group relative overflow-hidden rounded-3xl border border-white/15 bg-linear-to-r from-slate-950 via-slate-900 to-slate-950 px-5 py-6 sm:px-7 sm:py-7 shadow-2xl shadow-black/50"
      whileHover={{ y: -4 }}
    >
      <div
        className={`pointer-events-none absolute -inset-x-20 -top-32 h-40 bg-linear-to-r ${genesis.accentFrom} ${genesis.accentTo} opacity-30 blur-3xl transition-opacity duration-300 group-hover:opacity-60`}
      />
      <div className="relative flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        <div className="space-y-3 max-w-xl">
          <h3 className="text-xl sm:text-2xl font-semibold text-white">
            {t('nodeTiers.genesis.name')}
          </h3>
          <p className="text-sm sm:text-base text-white/70">
            {t('nodeTiers.genesis.description')}
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs sm:text-sm text-white/80">
            <div className="flex flex-col">
              <span className="text-white/60">{t('nodeTiers.annualizedYield')}</span>
              <span className="font-semibold">
                {genesis.aprRange[0]}-{genesis.aprRange[1]}%
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-white/60">{t('nodeTiers.globalLimit')}</span>
              <span className="font-semibold">
                {genesis.globalLimit.toLocaleString()} 
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-white/60">{t('nodeTiers.nodePrice')}</span>
              <span className="font-semibold">
                {genesis.price.toLocaleString()} {genesis.currency}
              </span>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-stretch gap-3 min-w-[230px] sm:min-w-[260px]">
          <div className="rounded-2xl border border-white/20 bg-white/10 px-5 py-4 text-center">
            <div className="text-xs font-medium uppercase tracking-wide text-white/70">
              {t('nodeTiers.genesis.highlight')}
            </div>
            <div className="mt-2 text-2xl sm:text-3xl font-extrabold text-white">
              2408%
            </div>
          </div>
          <Link
            href="/network/detail?rank=0"
            className="inline-flex items-center justify-center rounded-full bg-linear-to-r from-purple-500 to-pink-500 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-purple-500/30 hover:from-purple-600 hover:to-pink-600 transition-colors duration-200 cursor-pointer"
          >
            {t('nodeTiers.viewDetails')}
          </Link>
        </div>
      </div>
    </motion.div>
  );
};

export default NetworkPage;


