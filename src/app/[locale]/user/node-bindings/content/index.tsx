'use client';

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import {
  getBindUserList,
  normalizeBindUserList,
  type BindUserListItem,
} from '@/service/node';
import BindUserCard from './components/BindUserCard';

interface NodeBindingsContentProps {
  nodeId: string;
}

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

const NodeBindingsContent: React.FC<NodeBindingsContentProps> = ({ nodeId }) => {
  const t = useTranslations('nodeBindings');
  const tCommon = useTranslations('common');

  const [bindUsers, setBindUsers] = useState<BindUserListItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadBindUsers = useCallback(async () => {
    if (!nodeId.trim()) {
      setBindUsers([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const res = await getBindUserList(nodeId);
      if (!res.ok) {
        setError(res.msg ?? tCommon('errors.failedToLoad'));
        setBindUsers([]);
        return;
      }
      const target = normalizeBindUserList(res.data);
      setBindUsers(target);
    } catch (err) {
      setError(err instanceof Error ? err.message : tCommon('errors.failedToLoad'));
      setBindUsers([]);
    } finally {
      setIsLoading(false);
    }
  }, [nodeId, tCommon]);

  useEffect(() => {
    loadBindUsers();
  }, [loadBindUsers]);

  const cardLabels = useMemo(
    () => ({
      userWallet: t('userWallet'),
      referrerWallet: t('referrerWallet'),
      unbound: t('unbound'),
      none: t('none'),
    }),
    [t]
  );

  const skeletonUser: BindUserListItem = {
    id: '0x0000000000000000000000000000000000000000',
    referrer: '0x0000000000000000000000000000000000000000',
    referrerNodeId: '',
  };

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

        <motion.div variants={itemVariants} className="max-w-2xl mx-auto">
          {error && !isLoading && (
            <div className="mb-6 rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-center text-sm text-red-300">
              {error}
            </div>
          )}

          {isLoading ? (
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden opacity-70 transition-opacity duration-300">
              <div className="px-6 py-3 border-b border-white/10 flex items-center justify-center gap-2">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                <span className="text-sm text-white/60">{t('loading')}</span>
              </div>
              <div className="p-2 md:p-3">
                <BindUserCard user={skeletonUser} labels={cardLabels} />
              </div>
            </div>
          ) : bindUsers.length === 0 ? (
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 md:p-12 text-center">
              <p className="text-sm md:text-base text-white/60">{t('emptyBindings')}</p>
            </div>
          ) : (
            <div className="space-y-4">
              {bindUsers.map((user) => (
                <div
                  key={`${user.id}-${user.referrer}`}
                  className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden"
                >
                  <div className="p-2 md:p-3">
                    <BindUserCard user={user} labels={cardLabels} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </motion.div>
      </motion.div>
    </section>
  );
};

export default NodeBindingsContent;
