'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAccount, useChainId } from 'wagmi';
import { useTranslations, useLocale } from 'next-intl';
import { Link } from '@/i18n/navigation';
import ConnectButton from '@/components/custom-connect-button/ConnectButton';
import { formatCurrency } from '@/utils/currency';
import { getScanUrl } from '@/utils/chain-info';
import { isMockMode, requireRealCall } from '@/utils/mock';
import { queryUserDonationRecord, type UserDonationRecord } from '@/service/user';
import dayjs from 'dayjs';
import 'dayjs/locale/zh-cn';
import 'dayjs/locale/en';

const DonationRecords: React.FC = () => {
  const { isConnected, address } = useAccount();
  const chainId = useChainId();
  const locale = useLocale();
  const t = useTranslations('donationRecords');
  const tCommon = useTranslations('common');
  const scanUrl = getScanUrl(chainId);

  const dateLocale = locale === 'zh' ? 'zh-cn' : 'en';
  const formatDate = (ts: string) =>
    dayjs(ts).locale(dateLocale).format(locale === 'zh' ? 'YYYY年M月D日 HH:mm' : 'MMM D, YYYY HH:mm');

  const [donationRecords, setDonationRecords] = useState<UserDonationRecord[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);



  useEffect(() => {
    if (!address) {
      setDonationRecords([]);
      return;
    }
    let cancelled = false;
    setIsLoading(true);
    setError(null);
    queryUserDonationRecord(address)
      .then((res) => {
        if (!cancelled) {
          const list = res?.ok && Array.isArray(res?.data) ? res.data : [];
          setDonationRecords(list);
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err?.message ?? tCommon('errors.failedToLoadDonationRecords'));
        }
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [address, tCommon]);

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
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.3,
        ease: 'easeOut' as const,
      },
    },
  };

  const totalDonations = donationRecords.reduce(
    (sum, record) => sum + (parseFloat(record.amount) || 0),
    0
  );

  return (
    <section className="relative py-20 pt-72 md:py-32 md:pt-62">
      <motion.div
        className="relative z-10 max-w-7xl mx-auto px-6 md:px-8"
        variants={containerVariants}
        initial="visible"
        animate="visible"
      >
        {/* Section Header */}
        <motion.div variants={itemVariants} className="text-center mb-12 md:mb-16">
          <motion.div
            className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full border border-white/15 bg-white/5 backdrop-blur-sm text-white/90 mb-6"
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.6 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-sm">{t('badge')}</span>
          </motion.div>

          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            {t('title')} <span className="bg-linear-to-r from-emerald-300 via-teal-300 to-cyan-300 bg-clip-text text-transparent">{t('titleHighlight')}</span>
          </h2>
          <p className="text-lg md:text-xl text-white/80 max-w-3xl mx-auto leading-relaxed">
            {t('subtitle')}
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
              {t('connectTitle')}
            </h3>
            <p className="text-white/70 mb-6 max-w-md mx-auto">
              {t('connectDescription')}
            </p>
            <ConnectButton />
          </motion.div>
        )}

        {/* Total Donations */}
        {isConnected && donationRecords.length > 0 && (
          <motion.div
            variants={itemVariants}
            className="mb-12 md:mb-16"
          >
            <div className="bg-gradient-to-r from-emerald-500/20 via-teal-500/20 to-cyan-500/20 backdrop-blur-xl border border-emerald-500/30 rounded-3xl p-6 md:p-8">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="text-white/70 text-sm md:text-base">
                  {t('totalDonations')}
                </div>
                <div className="flex items-baseline gap-2">
                  <div className="text-3xl md:text-4xl lg:text-5xl font-bold text-white">
                    {formatCurrency(totalDonations)}
                  </div>
                </div>
              </div>
            </div>
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
            <p className="text-white/80">{tCommon('status.loading')}</p>
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
              {tCommon('errors.failedToLoadDonationRecords')}
            </h3>
            <p className="text-white/60">{error}</p>
          </motion.div>
        )}

        {/* Donation Records List - fields from API: projectId, amount, token, timestamp, txHash */}
        {!isLoading && !error && donationRecords.length > 0 && (
          <motion.div
            variants={itemVariants}
            className="space-y-3"
          >
            {/* Table header - desktop */}
            <div className="hidden sm:grid sm:grid-cols-12 gap-4 px-4 py-3 text-xs font-medium text-white/50 uppercase tracking-wider border-b border-white/10">
              <div className="sm:col-span-4">{t('list.project')}</div>
              <div className="sm:col-span-3">{t('list.amount')}</div>
              <div className="sm:col-span-3">{t('list.date')}</div>
              <div className="sm:col-span-2 text-right">{t('list.tx')}</div>
            </div>
            {donationRecords.map((record, index) => (
              <motion.div
                key={record.txHash || `${record.projectId}-${record.timestamp}-${index}`}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25, delay: index * 0.03 }}
                className="group relative bg-white/5 hover:bg-white/8 backdrop-blur-xl border border-white/10 rounded-xl overflow-hidden transition-all duration-200"
              >
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-linear-to-b from-emerald-500/80 to-teal-500/80 opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="grid grid-cols-1 sm:grid-cols-12 sm:items-center gap-3 sm:gap-4 px-4 py-4 sm:py-4 md:px-5">
                  <div className="sm:col-span-4 min-w-0">
                    {record.projectId ? (
                      <Link
                        href={`/project/${record.projectId}`}
                        className="inline-flex items-center gap-2 text-white font-medium hover:text-emerald-300 transition-colors truncate max-w-full"
                      >
                        <span className="truncate">{record.projectId}</span>
                        <svg className="w-4 h-4 shrink-0 text-white/40 group-hover:text-emerald-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                      </Link>
                    ) : (
                      <span className="text-white/50">{t('list.noValue')}</span>
                    )}
                  </div>
                  <div className="sm:col-span-3 flex items-baseline gap-2">
                    <span className="text-lg font-semibold text-white tabular-nums">
                      {formatCurrency(record.amount)}
                    </span>
                  </div>
                  <div className="sm:col-span-3 text-sm text-white/70">
                    {record.timestamp ? formatDate(record.timestamp) : record.timestamp || t('list.noValue')}
                  </div>
                  <div className="sm:col-span-2 flex sm:justify-end">
                    {record.txHash ? (
                      <a
                        href={`${scanUrl}${record.txHash}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={t('list.viewOnExplorer')}
                        className="inline-flex items-center gap-1.5 text-sm text-emerald-400 hover:text-emerald-300 font-mono transition-colors"
                      >
                        <span className="hidden sm:inline truncate max-w-[80px]">
                          {record.txHash.length > 10 ? `${record.txHash.slice(0, 6)}…${record.txHash.slice(-6)}` : record.txHash}
                        </span>
                        <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                      </a>
                    ) : (
                      <span className="text-white/40">{t('list.noValue')}</span>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Empty State */}
        {!isLoading && !error && donationRecords.length === 0 && (
          <motion.div
            className="text-center py-20 bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
          >
            <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">
              {t('empty.title')}
            </h3>
            <p className="text-white/60 mb-6">
              {t('empty.description')}
            </p>
            <Link
              href="/project"
              className="inline-flex items-center justify-center rounded-full bg-linear-to-r from-emerald-600 to-teal-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-500/30 hover:from-emerald-700 hover:to-teal-700 transition-all duration-300"
            >
              {t('empty.browseProjects')}
            </Link>
          </motion.div>
        )}
      </motion.div>
    </section>
  );
};

export default DonationRecords;

