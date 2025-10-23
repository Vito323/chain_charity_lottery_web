'use client';

import React from "react";
import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import { TabPanel, Tabs } from "@/components/tab";
import TabAbout from "./tab-about";
import TabDonations from "./tab-donations";
import TabUpdates from "./tab-updates";
import { ProjectDetailData } from "@/service/project";
import { ProjectChainInfo } from "@/components/case-cards";

const TABS = [
  {
    label: "About",
  },
  {
    label: "Donations",
    badge: 0,
  },
  {
    label: "Updates",
    badge: 0,
  },
];

const TabContent = ({ projectInfo, currentProjectInfo, uid }: { projectInfo?: ProjectDetailData; currentProjectInfo?: ProjectChainInfo | null; uid: string }) => {
  const [activeTab, setActiveTab] = React.useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

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
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: 'easeOut' as const,
      },
    },
  };

  // 计算带 badge 的标签数据
  const targetTabs = React.useMemo(() => {
    return TABS.map((item) => {
      if(item.label === "Updates") {
        return {
          ...item,
          badge: projectInfo?.tracks?.length || 0,
        }
      }
      if(item.label === "Donations") {
        return {
          ...item,
          badge: projectInfo?.donors?.length || 0,
        }
      }
      return item;
    })
  }, [projectInfo?.tracks, projectInfo?.donors])

  return (
    <motion.div
      ref={ref}
      variants={containerVariants}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      className="max-w-6xl mx-auto"
    >
      {/* 使用现有的 Tabs 组件，支持 badge 统计 */}
      <motion.div variants={itemVariants} className="mb-12">
        <Tabs tabBar={targetTabs} activeTab={activeTab} onTabChange={setActiveTab}>
          <TabPanel active={activeTab === 0}>
            <TabAbout projectInfo={projectInfo} currentProjectInfo={currentProjectInfo} uid={uid} />
          </TabPanel>
          <TabPanel active={activeTab === 1}>
            <TabDonations projectInfo={projectInfo} currentProjectInfo={currentProjectInfo} uid={uid} />
          </TabPanel>
          <TabPanel active={activeTab === 2}>
            <TabUpdates projectInfo={projectInfo} currentProjectInfo={currentProjectInfo} uid={uid} />
          </TabPanel>
        </Tabs>
      </motion.div>
    </motion.div>
  );
};

export default TabContent;
