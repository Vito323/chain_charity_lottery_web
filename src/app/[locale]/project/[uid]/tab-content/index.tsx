import React from "react";
import { TabPanel, Tabs } from "@/components/tab";
import TabAbout from "./tab-about";
import TabUpdates from "./tab-updates";
import DonationList from "./donation-list";
import { DonorData, ProjectDetailData, TracksData } from "@/service/project";
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

const TabContent = ({projectInfo, currentProjectInfo}: {projectInfo?: ProjectDetailData, currentProjectInfo: ProjectChainInfo | null}) => {
  const [activeTab, setActiveTab] = React.useState(0);

  const targetTabs = React.useMemo(() => {
    return TABS.map((item) => {
      if(item.label === "Updates") {
        return {
          ...item,
          badge: projectInfo?.tracks.length,
        }
      }
      if(item.label === "Donations") {
        return {
          ...item,
          badge: projectInfo?.donors.length,
        }
      }
      return item;
    })
  }, [projectInfo?.tracks, projectInfo?.donors])


  return (
    <Tabs tabBar={targetTabs} activeTab={activeTab} onTabChange={setActiveTab}>
      <TabPanel active={activeTab === 0}>
        <TabAbout projectInfo={projectInfo} />
      </TabPanel>
      <TabPanel active={activeTab === 1}>
        <DonationList projectInfo={projectInfo} currentProjectInfo={currentProjectInfo} />
      </TabPanel>
      <TabPanel active={activeTab === 2}>
        <TabUpdates datas={projectInfo?.tracks} />
      </TabPanel>
    </Tabs>
  );
};

export default TabContent;
