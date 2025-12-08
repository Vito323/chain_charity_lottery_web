"use client";

import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { Tabs } from "@/components/tab";
import useGlobalStore from "@/store";
import { CategoryData } from "@/service/project";
import { useFundPoolManager } from "@/hooks/useFundPoolManager";
import { useTranslations } from 'next-intl';
import ProjectList from "../project-list";
import "./projects-content.scss";

dayjs.extend(relativeTime);

// Mock 开关：在本地开发 / 服务器不可用时开启，用于 UI 调试
const MOCK_MODE = true;

// 本地 Mock 分类数据（仅用于 UI 调试）
const MOCK_CATEGORIES: CategoryData[] = [
  { id: "mock-health", name: "Health & Wellness" },
  { id: "mock-education", name: "Education & Youth" },
  { id: "mock-environment", name: "Environment & Sustainability" },
];

interface DonationActivityItem {
  address: string;
  amount: number;
  token: string;
  createdAt: string;
}

// 本地 Mock 捐赠记录（仅用于 UI / 动效调试）
const MOCK_DONATION_ACTIVITY: DonationActivityItem[] = [
  {
    address: "0x8f3a...cD12",
    amount: 120.5,
    token: "USDT",
    createdAt: dayjs().subtract(2, "hour").toISOString(),
  },
  {
    address: "0x3b91...9a4E",
    amount: 250,
    token: "USDT",
    createdAt: dayjs().subtract(5, "hour").toISOString(),
  },
  {
    address: "0xa1c4...f8B9",
    amount: 75,
    token: "USDT",
    createdAt: dayjs().subtract(1, "day").toISOString(),
  },
  {
    address: "0x4d7e...23F0",
    amount: 400,
    token: "USDT",
    createdAt: dayjs().subtract(3, "day").toISOString(),
  },
  {
    address: "0x19e0...bA32",
    amount: 60,
    token: "USDT",
    createdAt: dayjs().subtract(5, "day").toISOString(),
  },
  {
    address: "0x7c52...88De",
    amount: 980,
    token: "USDT",
    createdAt: dayjs().subtract(7, "day").toISOString(),
  },
  {
    address: "0x2fe9...19cA",
    amount: 35,
    token: "USDT",
    createdAt: dayjs().subtract(9, "day").toISOString(),
  },
  {
    address: "0x6ab0...E771",
    amount: 310,
    token: "USDT",
    createdAt: dayjs().subtract(12, "day").toISOString(),
  },
  {
    address: "0xd31c...4F90",
    amount: 42,
    token: "USDT",
    createdAt: dayjs().subtract(14, "day").toISOString(),
  },
  {
    address: "0x91ff...Aa10",
    amount: 1500,
    token: "USDT",
    createdAt: dayjs().subtract(20, "day").toISOString(),
  },
];

const ProjectsContent = () => {
  const {
    isLoading,
    error,
    contractAddress,
    getVersion,
    getOwner,
    getDonationCount,
    getProject,
    getProjectFundStats,
  } = useFundPoolManager();

  const t = useTranslations('projects');
  const categories = useGlobalStore((state) => state.categories);
  const [activeTab, setActiveTab] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);
  const [donationActivity] = useState<DonationActivityItem[]>(
    MOCK_MODE ? MOCK_DONATION_ACTIVITY.slice(0, 10) : []
  );

  // 计算最终用于展示的分类：
  // - 优先使用全局状态中的真实数据
  // - 当无数据且处于 MOCK_MODE 时，回退到本地 mock 分类
  const displayCategories: CategoryData[] =
    categories.length === 0 && MOCK_MODE ? MOCK_CATEGORIES : categories;

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const CategorySkeleton = () => (
    <div className="stalwart-skeleton-container">
      <div className="stalwart-skeleton-tabs">
        {[1, 2, 3].map((_, index) => (
          <div key={index} className="stalwart-skeleton-tab">
            <div className="stalwart-skeleton-text" style={{ width: '80px', height: '20px' }}></div>
          </div>
        ))}
      </div>
      <div className="stalwart-skeleton-grid">
        {[1, 2, 3, 4, 5, 6].map((_, index) => (
          <div key={index} className="stalwart-skeleton-card"></div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="stalwart-projects" ref={sectionRef}>
      <div className="stalwart-container">
        <motion.div
          className={`stalwart-projects-content ${isVisible ? 'visible' : ''}`}
          initial={{ opacity: 0, y: 30 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          {/* Header Section */}
          <div className="stalwart-projects-header">
            <motion.div
              className="stalwart-projects-badge"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={isVisible ? { opacity: 1, scale: 1 } : {}}
              transition={{ delay: 0.2, duration: 0.6 }}
            >
              <span>{t('badge')}</span>
            </motion.div>
            
            <motion.h2
              className="stalwart-projects-title"
              initial={{ opacity: 0, y: 20 }}
              animate={isVisible ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.3, duration: 0.8 }}
            >
              {t('title')} <span className="stalwart-highlight">{t('titleHighlight')}</span> {t('titleSuffix')}
            </motion.h2>
            
            <motion.p
              className="stalwart-projects-description"
              initial={{ opacity: 0, y: 20 }}
              animate={isVisible ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.4, duration: 0.8 }}
            >
              {t('description')}
            </motion.p>
          </div>

          {/* Projects Content */}
          <motion.div
            className="stalwart-projects-main"
            initial={{ opacity: 0, y: 30 }}
            animate={isVisible ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.5, duration: 0.8 }}
          >
            {displayCategories.length === 0 ? (
              <CategorySkeleton />
            ) : (
              <Tabs
                activeTab={activeTab}
                onTabChange={setActiveTab}
                tabBar={displayCategories.map((item) => ({ label: item.name }))}
              >
                {displayCategories.map((category, index) => (
                  <ProjectList
                    key={index}
                    activeTab={activeTab}
                    index={index}
                    categoryId={category.id}
                  />
                ))}
              </Tabs>
            )}
          </motion.div>

          {/* Global Donation Activity */}
          {donationActivity.length > 0 && (
            <motion.div
              className="stalwart-donation-activity"
              initial={{ opacity: 0, y: 40 }}
              animate={isVisible ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.7, duration: 0.8 }}
            >
              <div className="stalwart-donation-activity-header">
                <div className="stalwart-donation-activity-title-wrap">
                  <p className="stalwart-donation-activity-title">
                    <span className="stalwart-donation-activity-number">
                      {new Intl.NumberFormat("en-US").format(56789)}
                    </span>{" "}
                    {t('donationActivity.title')}
                  </p>
                  <p className="stalwart-donation-activity-subtitle">
                    {t('donationActivity.subtitle')}
                  </p>
                </div>
              </div>

              <div className="stalwart-donation-activity-list">
                {donationActivity.slice(0, 10).map((item, index) => {
                  const isLast = index === donationActivity.length - 1;
                  return (
                    <div
                      key={`${item.address}-${item.createdAt}-${index}`}
                      className={`stalwart-donation-activity-item${
                        isLast ? " is-last" : ""
                      }`}
                    >
                      <div className="stalwart-donation-activity-address">
                        <span className="stalwart-donation-activity-avatar" />
                        <span className="stalwart-donation-activity-hash">
                          {item.address}
                        </span>
                      </div>

                      <div className="stalwart-donation-activity-amount">
                        <span className="stalwart-donation-activity-amount-label">
                          {t('donationActivity.donated')}
                        </span>
                        <span className="stalwart-donation-activity-amount-value">
                          {item.amount.toLocaleString("en-US", {
                            minimumFractionDigits: 0,
                            maximumFractionDigits: 2,
                          })}{" "}
                          {item.token}
                        </span>
                      </div>

                      <div className="stalwart-donation-activity-time">
                        {dayjs(item.createdAt).fromNow()}
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default ProjectsContent;
