import React from "react";
import { TabPanel, Tabs } from "@/components/tab";
import TabAbout from "./tab-about";
import TabUpdates from "./tab-updates";
import DonationList from "./donation-list";
import { TracksData } from "@/service/project";
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

const TabContent = ({title, content, tracks, currentProjectInfo}: {title: string, content: string, tracks: TracksData[], currentProjectInfo: ProjectChainInfo | null}) => {
  const [activeTab, setActiveTab] = React.useState(0);

  const targetTabs = React.useMemo(() => {
    return TABS.map((item) => {
      if(item.label === "Updates") {
        return {
          ...item,
          badge: tracks.length,
        }
      }
      return item;
    })
  }, [tracks])


  return (
    <Tabs tabBar={targetTabs} activeTab={activeTab} onTabChange={setActiveTab}>
      <TabPanel active={activeTab === 0}>
        <TabAbout markdownContent={content} title={title} />
      </TabPanel>
      <TabPanel active={activeTab === 1}>
        <DonationList currentProjectInfo={currentProjectInfo} />
      </TabPanel>
      <TabPanel active={activeTab === 2}>
        <TabUpdates datas={tracks} />
      </TabPanel>
    </Tabs>
  );
};

export default TabContent;
