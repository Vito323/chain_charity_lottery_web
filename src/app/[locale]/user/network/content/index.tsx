'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { useSearchParams } from 'next/navigation';
import { Tabs, TabPanel } from '@/components/tab';
import MyNodesList from '@/app/[locale]/user/my-nodes/content';
import EarningsDetails from '@/app/[locale]/user/earnings-details/content';
import PurchaseHistory from '@/app/[locale]/user/purchase-history/content';

const NetworkDetail: React.FC = () => {
  const t = useTranslations('network.detail');
  const tCommon = useTranslations('common');
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState(0);

  // 支持 URL 参数直接跳转到指定 TAB
  useEffect(() => {
    const tabParam = searchParams.get('tab');
    if (tabParam) {
      const tabIndex = ['nodes', 'earnings', 'history'].indexOf(tabParam);
      if (tabIndex !== -1) {
        setActiveTab(tabIndex);
      }
    }
  }, [searchParams]);

  const tabBar = [
    { label: t('tabs.myNodes') || tCommon('wallet.holdNodes') || 'My Nodes' },
    // { label: t('tabs.earningsDetails') || 'Earnings Details' },
    // { label: t('tabs.purchaseHistory') || tCommon('wallet.nodePurchaseRecords') || 'Purchase History' },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
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

  return (
    <section className="relative py-12 pt-62 md:py-20 md:pt-52">
      <motion.div
        className="relative z-10 max-w-7xl mx-auto px-6 md:px-8"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        transition={{ duration: 0.3 }}
      >
        {/* Section Header */}
        <motion.div variants={itemVariants} className="text-center mb-8 md:mb-12">
          <motion.div
            className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full border border-white/15 bg-white/5 backdrop-blur-sm text-white/90 mb-6"
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.6 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
          >
            <span className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse" />
            <span className="text-sm">{t('badge') || 'Node Management'}</span>
          </motion.div>

          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 md:mb-6">
            {t('title') || 'Node Details'} <span className="bg-linear-to-r from-indigo-300 via-purple-300 to-pink-300 bg-clip-text text-transparent">{t('titleHighlight') || ''}</span>
          </h2>
          <p className="text-base md:text-lg lg:text-xl text-white/80 max-w-3xl mx-auto leading-relaxed px-4">
            {t('subtitle') || 'Manage your nodes, view earnings, and track purchase history'}
          </p>
        </motion.div>

        {/* Tabs Section */}
        <motion.div variants={itemVariants}>
          <Tabs
            activeTab={activeTab}
            onTabChange={(index) => {
              setActiveTab(index);
              // 更新 URL 参数（不刷新页面）
              const tabNames = ['nodes', 'earnings', 'history'];
              const newUrl = `/user/network?tab=${tabNames[index]}`;
              window.history.pushState({}, '', newUrl);
            }}
            tabBar={tabBar}
          >
            {/* My Nodes Tab */}
            <TabPanel active={activeTab === 0}>
              <div className="-mt-8 md:-mt-12">
                <MyNodesList />
              </div>
            </TabPanel>

            {/* Earnings Details Tab */}
            <TabPanel active={activeTab === 1}>
              <div className="-mt-8 md:-mt-12">
                <EarningsDetails />
              </div>
            </TabPanel>

            {/* Purchase History Tab */}
            <TabPanel active={activeTab === 2}>
              <div className="-mt-8 md:-mt-12">
                <PurchaseHistory />
              </div>
            </TabPanel>
          </Tabs>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default NetworkDetail;

