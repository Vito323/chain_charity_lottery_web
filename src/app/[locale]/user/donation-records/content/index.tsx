'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAccount } from 'wagmi';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import ConnectButton from '@/components/custom-connect-button/ConnectButton';
import { formatCurrency } from '@/utils/currency';
import { isMockMode, requireRealCall } from '@/utils/mock';

// Donation record interface
interface DonationRecord {
  id: string;
  donorAddress: string;
  amount: number;
  currency: string;
  relativeTime: string;
  timestamp: string;
  projectId?: string;
}

// Format wallet address
const formatAddress = (address: string) => {
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
};

// Mock data
const defaultDonationRecords: DonationRecord[] = [
  // {
  //   id: '1',
  //   donorAddress: '0x1234567890123456789012345678901234567890',
  //   amount: 200,
  //   currency: 'USDT',
  //   relativeTime: '20 seconds ago',
  //   timestamp: '2025-08-08 18:18:18',
  // },
  // {
  //   id: '2',
  //   donorAddress: '0xabcdefabcdefabcdefabcdefabcdefabcdefabcd',
  //   amount: 200,
  //   currency: 'USDT',
  //   relativeTime: '58 seconds ago',
  //   timestamp: '2025-08-08 18:18:00',
  // },
  // {
  //   id: '3',
  //   donorAddress: '0x9876543210987654321098765432109876543210',
  //   amount: 200,
  //   currency: 'USDT',
  //   relativeTime: '1 minute ago',
  //   timestamp: '2025-08-08 18:17:00',
  // },
  // {
  //   id: '4',
  //   donorAddress: '0x1111111111111111111111111111111111111111',
  //   amount: 200,
  //   currency: 'USDT',
  //   relativeTime: '28 minutes ago',
  //   timestamp: '2025-08-08 17:50:00',
  // },
  // {
  //   id: '5',
  //   donorAddress: '0x2222222222222222222222222222222222222222',
  //   amount: 200,
  //   currency: 'USDT',
  //   relativeTime: '1 hour ago',
  //   timestamp: '2025-08-08 17:18:00',
  // },
  // {
  //   id: '6',
  //   donorAddress: '0x3333333333333333333333333333333333333333',
  //   amount: 200,
  //   currency: 'USDT',
  //   relativeTime: '18 hours ago',
  //   timestamp: '2025-08-08 00:18:00',
  // },
  // {
  //   id: '7',
  //   donorAddress: '0x4444444444444444444444444444444444444444',
  //   amount: 200,
  //   currency: 'USDT',
  //   relativeTime: '1 day ago',
  //   timestamp: '2025-08-07 18:18:00',
  // },
  // {
  //   id: '8',
  //   donorAddress: '0x5555555555555555555555555555555555555555',
  //   amount: 200,
  //   currency: 'USDT',
  //   relativeTime: '18 days ago',
  //   timestamp: '2025-07-21 18:18:00',
  // },
  // {
  //   id: '9',
  //   donorAddress: '0x6666666666666666666666666666666666666666',
  //   amount: 200,
  //   currency: 'USDT',
  //   relativeTime: '188 days ago',
  //   timestamp: '2025-02-01 18:18:00',
  // },
  // {
  //   id: '10',
  //   donorAddress: '0x7777777777777777777777777777777777777777',
  //   amount: 200,
  //   currency: 'USDT',
  //   relativeTime: '388 days ago',
  //   timestamp: '2024-07-16 18:18:00',
  // },
];

const DonationRecords: React.FC = () => {
  const { isConnected } = useAccount();
  const t = useTranslations('donationRecords');
  const tCommon = useTranslations('common');
  
  // In mock mode, require real API call to fetch donation records
  useEffect(() => {
    if (isMockMode()) {
      requireRealCall('Fetch donation records', 'network');
    }
  }, []);
  
  const [donationRecords] = useState<DonationRecord[]>(defaultDonationRecords);
  const [isLoading] = useState(false);
  const [error] = useState<string | null>(null);

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

  // Calculate total donations
  const totalDonations = donationRecords.reduce((sum, record) => sum + record.amount, 0);

  return (
    <section className="relative py-20 pt-32 md:py-32 md:pt-52">
      <motion.div
        className="relative z-10 max-w-7xl mx-auto px-6 md:px-8"
        variants={containerVariants}
        initial="hidden"
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
            {t('title')} <span className="bg-gradient-to-r from-emerald-300 via-teal-300 to-cyan-300 bg-clip-text text-transparent">{t('titleHighlight')}</span>
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
                  <div className="text-white/60 text-sm md:text-base">
                    USDT
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

        {/* Donation Records List */}
        {!isLoading && !error && donationRecords.length > 0 && (
          <motion.div
            variants={itemVariants}
            className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden"
          >
            {donationRecords.map((record) => (
              <Link
                key={record.id}
                href={record.projectId ? `/project/${record.projectId}` : '#'}
                className="group block relative px-6 py-4 md:px-8 md:py-5 border-b border-white/10 last:border-b-0 hover:bg-white/[0.08] active:bg-white/[0.12] transition-colors duration-150 ease-out cursor-pointer"
              >
                <div className="flex items-center justify-between gap-4">
                  {/* Left: Avatar and Donation Text */}
                  <div className="flex items-center gap-4 flex-1 min-w-0">
                    {/* Avatar Placeholder */}
                    <div className="w-10 h-10 md:w-12 md:h-12 bg-white/20 rounded-full flex-shrink-0" />
                    {/* Donation Text */}
                    <div className="flex-1 min-w-0">
                      <div className="text-base md:text-lg font-semibold text-white truncate">
                        <span className="font-mono">{formatAddress(record.donorAddress)}</span> {t('donated')} {record.amount.toLocaleString()} {record.currency}
                      </div>
                    </div>
                  </div>
                  {/* Right: Relative Time and Arrow */}
                  <div className="flex items-center gap-3 md:gap-4 flex-shrink-0">
                    <span className="text-sm md:text-base text-white/70 whitespace-nowrap">
                      {record.relativeTime}
                    </span>
                    <svg 
                      className="w-5 h-5 md:w-6 md:h-6 text-white/40 flex-shrink-0 transition-transform duration-150 ease-out group-hover:translate-x-1" 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </Link>
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
              className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-emerald-600 to-teal-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-500/30 hover:from-emerald-700 hover:to-teal-700 transition-all duration-300"
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

