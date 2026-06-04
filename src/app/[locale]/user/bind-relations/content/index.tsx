'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useAccount } from 'wagmi';
import { useTranslations } from 'next-intl';
import ConnectButton from '@/components/custom-connect-button/ConnectButton';
import { parseReferrerField } from '@/lib/bindDisplay';
import {
  queryUserReferrer,
  queryUserReferrerNode,
} from '@/service/user';
import BindInfoCard from './components/BindInfoCard';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: 'easeOut' as const,
    },
  },
};

const BindRelationsContent: React.FC = () => {
  const t = useTranslations('userBindRelations');
  const tCommon = useTranslations('common');
  const { address, status } = useAccount();

  const [referrer, setReferrer] = useState<string | null>(null);
  const [referrerNode, setReferrerNode] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const labels = {
    referrer: t('referrer'),
    referrerNode: t('referrerNode'),
    unbound: t('unbound'),
    none: t('none'),
  };

  // 刷新时 wagmi 会经历 reconnecting；仅用 address 判断并拉数，避免 isConnected 抖动清空数据
  const walletAddress = address ?? undefined;
  const showWalletUi =
    Boolean(walletAddress) &&
    (status === 'connected' || status === 'reconnecting');

  useEffect(() => {
    if (!walletAddress) {
      setReferrer(null);
      setReferrerNode(null);
      setError(null);
      setIsLoading(false);
      return;
    }

    let cancelled = false;
    setIsLoading(true);
    setError(null);

    Promise.all([
      queryUserReferrer(walletAddress),
      queryUserReferrerNode(walletAddress),
    ])
      .then(([referrerRes, nodeRes]) => {
        if (cancelled) return;

        if (!referrerRes.ok || !nodeRes.ok) {
          setError(referrerRes.msg ?? nodeRes.msg ?? tCommon('errors.failedToLoad'));
          return;
        }

        setReferrer(parseReferrerField(referrerRes.data));
        setReferrerNode(parseReferrerField(nodeRes.data));
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : tCommon('errors.failedToLoad'));
        }
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [walletAddress, tCommon]);

  const skeletonReferrer = '0x0000000000000000000000000000000000000000';
  const skeletonNode = '363d454e-fdd8-43fe-9c91-da7196883432';

  return (
    <section className="relative py-20 pt-42 md:py-32 md:pt-62">
      <motion.div
        className="relative z-10 max-w-7xl mx-auto px-6 md:px-8"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={itemVariants} className="text-center mb-12 md:mb-16">
          <motion.div
            className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full border border-white/15 bg-white/5 backdrop-blur-sm text-white/90 mb-6"
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.6 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
          >
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            <span className="text-sm">{t('badge')}</span>
          </motion.div>

          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            {t('title')}{' '}
            <span className="bg-linear-to-r from-cyan-300 via-teal-300 to-emerald-300 bg-clip-text text-transparent">
              {t('titleHighlight')}
            </span>
          </h2>
          <p className="text-lg md:text-xl text-white/80 max-w-3xl mx-auto leading-relaxed">
            {t('subtitle')}
          </p>
        </motion.div>

        {!showWalletUi && (
          <motion.div
            variants={itemVariants}
            className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 md:p-12 text-center max-w-2xl mx-auto"
          >
            <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg
                className="w-8 h-8 text-white/60"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">{t('connectTitle')}</h3>
            <p className="text-white/70 mb-6 max-w-md mx-auto">{t('connectDescription')}</p>
            <ConnectButton />
          </motion.div>
        )}

        {showWalletUi && (
          <motion.div variants={itemVariants} className="max-w-2xl mx-auto">
            {error && !isLoading && (
              <div className="mb-6 rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-center text-sm text-red-300">
                {error}
              </div>
            )}

            <div
              className={`bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden transition-opacity duration-300 ${
                isLoading ? 'opacity-70' : 'opacity-100'
              }`}
            >
              {isLoading && (
                <div className="px-6 py-3 border-b border-white/10 flex items-center justify-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                  <span className="text-sm text-white/60">{t('loading')}</span>
                </div>
              )}

              <div className="p-2 md:p-3">
                <BindInfoCard
                  referrer={isLoading ? skeletonReferrer : referrer}
                  referrerNode={isLoading ? skeletonNode : referrerNode}
                  labels={labels}
                />
              </div>
            </div>
          </motion.div>
        )}
      </motion.div>
    </section>
  );
};

export default BindRelationsContent;
