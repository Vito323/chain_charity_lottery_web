'use client';

import React from "react";
import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef, useState, useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import TabContent from "./tab-content/index";
import Covers from "./cover/index";
import Fundraising from "./fundraising/index";
import { projectDetail, ProjectDetailData } from "@/service/project";
import { useFundPoolManager } from "@/hooks/useDonationContract";
import { ProjectChainInfo } from "@/components/case-cards";
import { useAccount, useChainId } from "wagmi";

interface ShowcaseProps {
  uid: string;
}

const Showcase = ({ uid }: ShowcaseProps) => {
  const router = useRouter();
  const t = useTranslations('projectDetail');
  const { getProject } = useFundPoolManager();
  const { isConnected } = useAccount();
  const chainId = useChainId();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  
  // 状态管理 - 延用原有逻辑
  const [detail, setDetail] = useState<ProjectDetailData>();
  const [currentProjectInfo, setCurrentProjectFundInfo] = useState<ProjectChainInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // 获取项目详情 - 延用原有逻辑
  const getDetail = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await projectDetail(uid);
      if (response.ok) {
        setDetail(response.data);
      }
    } catch (error) {
      console.error('Failed to fetch project details:', error);
    } finally {
      setIsLoading(false);
    }
  }, [uid]);

  useEffect(() => {
    getDetail();
  }, [getDetail]);

  // 获取项目筹款统计 - 延用原有逻辑
  const queryProjectFundStats = useCallback(async () => {
    const response = await getProject(uid);
    console.log(response, "response112");
    if (response) {
      setCurrentProjectFundInfo(response);
    }
  }, [getProject, uid]);

  useEffect(() => {
    if (uid && isConnected && chainId) {
      queryProjectFundStats();
    }
  }, [queryProjectFundStats, uid, isConnected, chainId]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: 'easeOut' as const,
      },
    },
  };

  return (
    <>
      {/* Page Title Section - Stalwart 风格 */}
      <section className="relative py-32 bg-linear-to-b from-slate-950 via-slate-900 to-slate-950 overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 z-0">
          {/* Animated Background Shapes */}
          <motion.div
            className="absolute top-20 left-10 w-72 h-72 bg-purple-500/20 rounded-full blur-3xl"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.6, 0.3],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
          <motion.div
            className="absolute bottom-20 right-10 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl"
            animate={{
              scale: [1.2, 1, 1.2],
              opacity: [0.4, 0.7, 0.4],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-8">
          <motion.div
            ref={ref}
            variants={containerVariants}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            className="text-center"
          >
            <motion.div variants={itemVariants}>
              {/* Status Badge */}
              <motion.div
                className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full border border-white/15 bg-white/5 backdrop-blur-sm text-white/90 drop-shadow-[0_2px_8px_rgba(0,0,0,0.6)] mb-8"
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.6 }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
              >
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-sm">{t('badge')}</span>
              </motion.div>
              
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold text-white leading-[1.05] tracking-tight drop-shadow-[0_3px_16px_rgba(0,0,0,0.6)] mb-6">
                <motion.span
                  initial={{ opacity: 0, y: 14 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.6 }}
                  transition={{ duration: 0.7, ease: 'easeOut' }}
                >
                  {t('title')}
                </motion.span>
              </h1>
              
              <motion.p
                className="text-xl md:text-2xl text-white/90 max-w-4xl mx-auto leading-relaxed drop-shadow-[0_2px_10px_rgba(0,0,0,0.6)]"
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.6 }}
                transition={{ duration: 0.6, ease: 'easeOut', delay: 0.1 }}
              >
                {detail?.name || "--"}
              </motion.p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Main Content Section - 延用 case-hero-layout 的布局逻辑 */}
      <section className="py-20 bg-linear-to-b from-slate-950 to-slate-900">
        <div className="max-w-7xl mx-auto px-6 md:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-16 items-stretch">
            {/* 图片轮播容器 - 延用 case-swiper-container 逻辑 */}
            <motion.div
              variants={itemVariants}
              initial="hidden"
              animate={isInView ? "visible" : "hidden"}
              className="relative order-1 lg:order-1 lg:col-span-2"
            >
              <div className="relative group">
                {/* 图片轮播容器 - 延用原有 Covers 组件逻辑 */}
                <Covers images={detail?.image || []} isLoading={isLoading} />

                {/* Floating decorative elements */}
                <motion.div
                  className="absolute -top-4 -right-4 w-20 h-20 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full blur-xl"
                  animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.3, 0.6, 0.3],
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                />
                <motion.div
                  className="absolute -bottom-6 -left-6 w-32 h-32 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-full blur-xl"
                  animate={{
                    scale: [1.2, 1, 1.2],
                    opacity: [0.4, 0.7, 0.4],
                  }}
                  transition={{
                    duration: 6,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                />

                {/* Glow effect */}
                <div className="pointer-events-none absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-md bg-gradient-to-r from-purple-600/20 via-pink-600/20 to-fuchsia-600/20" />
              </div>
            </motion.div>

            {/* 筹款信息容器 - 延用 case-fundraising-container 逻辑 */}
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate={isInView ? "visible" : "hidden"}
              className="order-2 lg:order-2 lg:col-span-1 flex flex-col"
            >
              {/* 筹款信息容器 - 延用 Fundraising 组件的逻辑 */}
              <Fundraising
                totalRaised={detail?.totalDonated}
                contributors={detail?.donationCount || 0}
                projectId={uid}
                onDonate={() => {
                  router.push(`/donate/${uid}/${detail?.name || ""}`);
                }}
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* 标签页内容 - 延用 TabContent 的布局逻辑 */}
      <section className="py-20 bg-linear-to-b from-slate-900 to-slate-950">
        <div className="max-w-7xl mx-auto px-6 md:px-8">
          <TabContent 
            projectInfo={detail} 
            currentProjectInfo={currentProjectInfo}
            uid={uid} 
          />
        </div>
      </section>
    </>
  );
};

export default Showcase;
