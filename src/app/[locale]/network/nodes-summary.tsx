'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useAccount } from 'wagmi';
import { useTranslations } from 'next-intl';
import ConnectButton from '@/components/custom-connect-button/ConnectButton';
import { userNodes, type UserNode } from '@/service/user';
import { formatCurrency } from '@/utils/currency';

const containerVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: 'easeOut' as const },
  },
};


const nodeRank = (n: UserNode) => String(n.node?.rank ?? n.rank ?? '2');

/** rank "0"=genesis, "1"=super, "2"=standard */
const countByRank = (nodes: UserNode[], rank: string) =>
  nodes.filter((n) => nodeRank(n) === rank).length;

/** Sum yesterday earnings from all nodes (earnings from API) */
const sumEarnings = (nodes: UserNode[]): number =>
  nodes.reduce((acc, n) => acc + (parseFloat(String(n.earnings ?? '0')) || 0), 0);

export interface MyNodesSummaryProps {
  /** Optional override: when provided, skip fetching and use this for hasNodes (e.g. for testing) */
  hasNodes?: boolean;
}

const MyNodesSummary: React.FC<MyNodesSummaryProps> = ({ hasNodes: hasNodesProp }) => {
  const { isConnected, address } = useAccount();
  const t = useTranslations('network');
  const tCommon = useTranslations('common');

  const [nodes, setNodes] = useState<UserNode[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProfile = useCallback(async () => {
    if (!address) return;
    setLoading(true);
    setError(null);
    try {
      const res = await userNodes(address);
      if (res.ok && res.data) {
        setNodes(res.data ?? []);
      } else {
        setNodes([]);
      }
    } catch (err) {
      console.error('Failed to fetch user profile:', err);
      setError(tCommon('errors.failedToLoad'));
      setNodes([]);
    } finally {
      setLoading(false);
    }
  }, [address, tCommon]);

  useEffect(() => {
    if (isConnected && address) {
      fetchProfile();
    } else {
      setNodes(null);
      setError(null);
    }
  }, [isConnected, address, fetchProfile]);

  const hasNodes =
    hasNodesProp !== undefined
      ? hasNodesProp
      : (nodes?.length ?? 0) > 0;
  const genesisCount = nodes ? countByRank(nodes, '0') : 0;
  const superCount = nodes ? countByRank(nodes, '1') : 0;
  const standardCount = nodes ? countByRank(nodes, '2') : 0;
  const cumulativeEarnings = nodes ? sumEarnings(nodes) : 0;

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="relative rounded-3xl border border-white/10 bg-linear-to-br from-slate-900/90 via-slate-950/95 to-slate-900/90 px-5 py-6 sm:px-7 sm:py-7 md:px-10 md:py-8 shadow-xl shadow-black/40 overflow-hidden"
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
          <div className="shrink-0">
            <ConnectButton />
          </div>
        </div>
      ) : loading ? (
        <div className="relative grid gap-6 md:grid-cols-[minmax(0,2fr)_minmax(0,1.4fr)] items-center">
          <div className="space-y-4">
            <h2 className="text-xl sm:text-2xl font-semibold text-white">
              {t('noNodes.title')}
            </h2>
            <p className="text-sm sm:text-base text-white/70">
              {t('noNodes.description')}
            </p>
          </div>
          <div className="relative rounded-2xl border border-dashed border-white/25 bg-white/5 px-5 py-10 sm:px-6 sm:py-12 flex flex-col items-center justify-center text-center">
            <div className="w-8 h-8 border-2 border-white/30 border-t-white rounded-full animate-spin mb-4" />
            <p className="text-sm text-white/80">{tCommon('status.loading')}</p>
          </div>
        </div>
      ) : error ? (
        <div className="relative flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <p className="text-white/80">{error}</p>
          <button
            type="button"
            onClick={fetchProfile}
            className="shrink-0 rounded-full bg-white/10 hover:bg-white/20 px-4 py-2 text-sm font-medium text-white transition-colors"
          >
            {tCommon('actions.refresh')}
          </button>
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
              <span className="text-xs uppercase tracking-wide text-white/60">
                {t('noNodes.cumulativeEarnings')}
              </span>
              <div className="text-3xl sm:text-4xl font-bold text-white/80">
                --
              </div>
              <div className="mt-4 grid grid-cols-3 gap-2 text-xs sm:text-sm text-white/70">
                <div className="flex flex-col">
                  <span className="text-white/50">{t('noNodes.genesisNodes')}</span>
                  <span className="font-semibold">{genesisCount}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-white/50">{t('noNodes.superNodes')}</span>
                  <span className="font-semibold">{superCount}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-white/50">{t('noNodes.standardNodes')}</span>
                  <span className="font-semibold">{standardCount}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="relative grid gap-6 md:grid-cols-[minmax(0,2fr)_minmax(0,1.4fr)] items-center">
          <div className="space-y-3">
            <h2 className="text-xl sm:text-2xl font-semibold text-white">
              {t('portfolio.title')}
            </h2>
            <p className="text-sm sm:text-base text-white/70">
              {t('portfolio.description')}
            </p>
          </div>
          <div className="relative rounded-2xl border border-white/20 bg-white/10 px-5 py-4 sm:px-6 sm:py-5">
            <span className="text-xs uppercase tracking-wide text-white/60">
              {t('portfolio.cumulativeEarnings')}
            </span>
            <div className="mt-3 text-3xl sm:text-4xl font-bold text-white">
              {formatCurrency(cumulativeEarnings, '', 4)}
            </div>
            <div className="mt-4 grid grid-cols-3 gap-2 text-xs sm:text-sm text-white/80">
              <div className="flex flex-col">
                <span className="text-white/60">{t('noNodes.genesisNodes')}</span>
                <span className="font-semibold">{genesisCount}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-white/60">{t('noNodes.superNodes')}</span>
                <span className="font-semibold">{superCount}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-white/60">{t('noNodes.standardNodes')}</span>
                <span className="font-semibold">{standardCount}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default MyNodesSummary;
