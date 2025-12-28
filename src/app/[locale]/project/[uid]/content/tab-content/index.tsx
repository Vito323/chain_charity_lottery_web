"use client";

import React from "react";
import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { useTranslations } from "next-intl";
import { TabPanel, Tabs } from "@/components/tab";
import TabAbout from "./tab-about";
import TabDonations from "./tab-donations";
import TabUpdates from "./tab-updates";
import { ProjectDetailData } from "@/service/project";

const TabContent = ({
  projectInfo,
  uid,
}: {
  projectInfo?: ProjectDetailData;
  uid: string;
}) => {
  const t = useTranslations("projectDetail.tabs");
  const [activeTab, setActiveTab] = React.useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

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
        ease: "easeOut" as const,
      },
    },
  };

  // 计算带 badge 的标签数据
  const targetTabs = React.useMemo(() => {
    const TABS = [
      {
        label: t("about"),
      },
      {
        label: t("donations"),
        badge: 0,
      },
      {
        label: t("updates"),
        badge: 0,
      },
    ];

    return TABS.map((item) => {
      if (item.label === t("updates")) {
        return {
          ...item,
          badge: projectInfo?.tracks?.length || 0,
        };
      }
      if (item.label === t("donations")) {
        return {
          ...item,
          badge: projectInfo?.donors?.length || 0,
        };
      }
      return item;
    });
  }, [projectInfo?.tracks, projectInfo?.donors, t]);

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
        <Tabs
          tabBar={targetTabs}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        >
          <TabPanel active={activeTab === 0}>
            <TabAbout projectInfo={projectInfo} uid={uid} />
          </TabPanel>
          <TabPanel active={activeTab === 1}>
            <TabDonations projectInfo={projectInfo} uid={uid} />
          </TabPanel>
          <TabPanel active={activeTab === 2}>
            <TabUpdates projectInfo={projectInfo} uid={uid} />
          </TabPanel>
        </Tabs>
      </motion.div>
    </motion.div>
  );
};

export default TabContent;
