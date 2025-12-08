'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useAccount } from 'wagmi';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';

import StalwartHeader from '@/components/stalwart-header';
import StalwartFooter from '@/components/stalwart-footer';
import ScrollToTop from '@/components/scroll-to-top';
import StalwartConnectButton from '@/components/custom-connect-button/StalwartConnectButton';

type NodeTierId = 'genesis' | 'super' | 'standard';

interface NodeTier {
  id: NodeTierId;
  name: string;
  price: number;
  currency: string;
  aprRange: [number, number];
  globalLimit: number;
  description: string;
  highlight?: string;
  accentFrom: string;
  accentTo: string;
}

const NODE_TIERS: NodeTier[] = [
  {
    id: 'genesis',
    name: 'Genesis Node',
    price: 100_000,
    currency: 'USDT',
    aprRange: [25, 35],
    globalLimit: 50,
    description: 'High yield node for early supporters.',
    highlight: '3-year projected return',
    accentFrom: 'from-purple-500',
    accentTo: 'to-pink-500',
  },
  {
    id: 'super',
    name: 'Super Node',
    price: 50_000,
    currency: 'USDT',
    aprRange: [20, 30],
    globalLimit: 600,
    description: 'Designed for experienced investors.',
    accentFrom: 'from-blue-500',
    accentTo: 'to-cyan-500',
  },
  {
    id: 'standard',
    name: 'Standard Node',
    price: 10_000,
    currency: 'USDT',
    aprRange: [15, 25],
    globalLimit: 5_000,
    description: 'Accessible entry for everyday investors.',
    accentFrom: 'from-emerald-500',
    accentTo: 'to-teal-500',
  },
];

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

const formatCurrency = (value: number) =>
  value.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

const StalwartNetworkPage: React.FC = () => {
  const { isConnected } = useAccount();
  const t = useTranslations('network');

  // TODO: integrate real node data here
  const hasNodes = false;

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      <StalwartHeader />

      <main className="pt-28 md:pt-36 pb-20">
        <section className="max-w-6xl mx-auto px-5 sm:px-6 lg:px-8 space-y-10 md:space-y-14">
          {/* Page Title */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="flex flex-col md:flex-row md:items-end md:justify-between gap-4"
          >
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/15 bg-white/5 backdrop-blur-sm text-xs text-white/80">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>{t('badge')}</span>
              </div>
              <h1 className="mt-4 text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight">
                {t('title')}
              </h1>
              <p className="mt-3 text-sm sm:text-base text-white/70 max-w-xl">
                {t('subtitle')}
              </p>
            </div>
          </motion.div>

          {/* My Nodes Summary */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="relative rounded-3xl border border-white/10 bg-gradient-to-br from-slate-900/90 via-slate-950/95 to-slate-900/90 px-5 py-6 sm:px-7 sm:py-7 md:px-10 md:py-8 shadow-xl shadow-black/40 overflow-hidden"
          >
            <div className="pointer-events-none absolute -top-32 -right-24 w-72 h-72 bg-purple-500/30 blur-3xl opacity-40" />
            <div className="pointer-events-none absolute -bottom-32 -left-24 w-80 h-80 bg-pink-500/20 blur-3xl opacity-40" />

            {!isConnected ? (
              <div className="relative flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                <div className="space-y-3 max-w-xl">
                  <h2 className="text-xl sm:text-2xl font-semibold text-white">
                    {t('connect.title')}
                  </h2>
                  <p className="text-sm sm:text-base text-white/70">
                    {t('connect.description')}
                  </p>
                </div>
                <div className="flex-shrink-0">
                  <StalwartConnectButton />
                </div>
              </div>
            ) : !hasNodes ? (
              <div className="relative grid gap-6 md:grid-cols-[minmax(0,2fr)_minmax(0,1.4fr)] items-center">
                <div className="space-y-4">
                  <h2 className="text-xl sm:text-2xl font-semibold text-white">
                    {t('noNodes.title')}
                  </h2>
                  <p className="text-sm sm:text-base text-white/70">
                    {t('noNodes.description')}
                  </p>
                  <div className="flex flex-wrap gap-3 text-sm">
                    <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/20 text-white/80">
                      <span className="w-1.5 h-1.5 rounded-full bg-purple-400" />
                      {t('noNodes.features.multiTier')}
                    </span>
                    <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-white/70">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                      {t('noNodes.features.transparent')}
                    </span>
                  </div>
                </div>
                <div className="relative rounded-2xl border border-dashed border-white/25 bg-white/5 px-5 py-4 sm:px-6 sm:py-5">
                  <div className="flex flex-col gap-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs uppercase tracking-wide text-white/60">
                        {t('noNodes.totalAssets')}
                      </span>
                      <span className="text-xs text-white/50">{t('noNodes.yesterdayRewards')}</span>
                    </div>
                    <div className="flex items-end justify-between gap-6">
                      <div className="text-3xl sm:text-4xl font-bold text-white/80">
                        --
                      </div>
                      <div className="text-right">
                        <div className="text-lg sm:text-2xl font-semibold text-white/80">
                          --
                        </div>
                        <div className="mt-1 inline-flex items-center gap-1 text-xs text-white/60">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                          {t('noNodes.rewardsDetail')}
                        </div>
                      </div>
                    </div>
                    <div className="mt-4 grid grid-cols-3 gap-2 text-xs sm:text-sm text-white/70">
                      <div className="flex flex-col">
                        <span className="text-white/50">{t('noNodes.genesisNodes')}</span>
                        <span className="font-semibold">0</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-white/50">{t('noNodes.superNodes')}</span>
                        <span className="font-semibold">0</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-white/50">{t('noNodes.standardNodes')}</span>
                        <span className="font-semibold">0</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="relative grid gap-6 md:grid-cols-[minmax(0,2fr)_minmax(0,1.4fr)] items-center">
                {/* Placeholder for future real node summary */}
                <div className="space-y-3">
                  <h2 className="text-xl sm:text-2xl font-semibold text-white">
                    {t('portfolio.title')}
                  </h2>
                  <p className="text-sm sm:text-base text-white/70">
                    {t('portfolio.description')}
                  </p>
                </div>
                <div className="relative rounded-2xl border border-white/20 bg-white/10 px-5 py-4 sm:px-6 sm:py-5">
                  <div className="flex justify-between text-xs text-white/60">
                    <span>{t('portfolio.totalAssets')}</span>
                    <span>{t('portfolio.yesterdayRewards')}</span>
                  </div>
                  <div className="mt-3 flex items-end justify-between gap-6">
                    <div className="text-3xl sm:text-4xl font-bold text-white">
                      {formatCurrency(666_666.66)}
                    </div>
                    <div className="text-right">
                      <div className="text-lg sm:text-2xl font-semibold text-emerald-300">
                        {formatCurrency(8_888.88)}
                      </div>
                      <button className="mt-2 inline-flex items-center gap-1 text-xs text-white/80 hover:text-white cursor-pointer">
                        <span>{t('portfolio.rewardsDetails')}</span>
                        <span aria-hidden>›</span>
                      </button>
                    </div>
                  </div>
                  <div className="mt-4 grid grid-cols-3 gap-2 text-xs sm:text-sm text-white/80">
                    <div className="flex flex-col">
                      <span className="text-white/60">{t('noNodes.genesisNodes')}</span>
                      <span className="font-semibold">1</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-white/60">{t('noNodes.superNodes')}</span>
                      <span className="font-semibold">2</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-white/60">{t('noNodes.standardNodes')}</span>
                      <span className="font-semibold">12</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </motion.div>

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

            {/* Genesis Node - primary card */}
            <GenesisTierCard />

            {/* Remaining tiers as grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {NODE_TIERS.filter((tier) => tier.id !== 'genesis').map((tier, index) => (
                <motion.div
                  key={tier.id}
                  custom={index}
                  variants={cardVariants}
                  initial="hidden"
                  animate="visible"
                  className="group relative overflow-hidden rounded-3xl border border-white/12 bg-gradient-to-b from-slate-900/90 via-slate-950/95 to-slate-950/95 p-5 sm:p-6 shadow-lg shadow-black/40"
                  whileHover={{ y: -4 }}
                >
                  <div
                    className={`pointer-events-none absolute inset-x-[-40%] top-[-40%] h-40 bg-gradient-to-r ${tier.accentFrom} ${tier.accentTo} opacity-20 blur-3xl transition-opacity duration-300 group-hover:opacity-40`}
                  />

                  <div className="relative space-y-4">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <h3 className="text-lg sm:text-xl font-semibold text-white">
                          {tier.name}
                        </h3>
                        <p className="mt-1 text-xs text-white/60">
                          {t('nodeTiers.annualizedYield')}: {tier.aprRange[0]}–{tier.aprRange[1]}%
                        </p>
                        <p className="mt-1 text-xs text-white/50">
                          {t('nodeTiers.globalLimit')}: {tier.globalLimit.toLocaleString()} nodes
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
                        href={`/network/${tier.id}`}
                        className="inline-flex flex-1 items-center justify-center rounded-full bg-white/12 px-4 py-2 text-xs sm:text-sm font-medium text-white hover:bg-white/20 transition-colors duration-200 cursor-pointer"
                      >
                        {t('nodeTiers.viewDetails')}
                      </Link>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.section>
        </section>
      </main>

      <StalwartFooter />
      <ScrollToTop />
    </div>
  );
};

const GenesisTierCard: React.FC = () => {
  const t = useTranslations('network');
  const genesis = NODE_TIERS.find((tier) => tier.id === 'genesis');

  if (!genesis) return null;

  return (
    <motion.div
      custom={0}
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      className="group relative overflow-hidden rounded-3xl border border-white/15 bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 px-5 py-6 sm:px-7 sm:py-7 shadow-2xl shadow-black/50"
      whileHover={{ y: -4 }}
    >
      <div
        className={`pointer-events-none absolute -inset-x-20 -top-32 h-40 bg-gradient-to-r ${genesis.accentFrom} ${genesis.accentTo} opacity-30 blur-3xl transition-opacity duration-300 group-hover:opacity-60`}
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
                {genesis.aprRange[0]}–{genesis.aprRange[1]}%
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-white/60">{t('nodeTiers.globalLimit')}</span>
              <span className="font-semibold">
                {genesis.globalLimit.toLocaleString()} nodes
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
            href="/network/genesis"
            className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-purple-500 to-pink-500 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-purple-500/30 hover:from-purple-600 hover:to-pink-600 transition-colors duration-200 cursor-pointer"
          >
            {t('nodeTiers.viewDetails')}
          </Link>
        </div>
      </div>
    </motion.div>
  );
};

export default StalwartNetworkPage;


