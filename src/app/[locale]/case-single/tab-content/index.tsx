import React from "react";
import { TabPanel, Tabs } from "@/components/tab";
import TabAbout from "./tab-about";
import TabUpdates from "./tab-updates";
import DonationList from "./donation-list";
import { TracksData } from "@/service/project";

const TABS = [
  {
    label: "About",
  },
  {
    label: "Donations",
  },
  {
    label: "Updates",
  },
];

const TabContent = ({title, content, tracks}: {title: string, content: string, tracks: TracksData[]}) => {
  const [activeTab, setActiveTab] = React.useState(0);
  return (
    <Tabs tabBar={TABS} activeTab={activeTab} onTabChange={setActiveTab}>
      <TabPanel active={activeTab === 0}>
        <TabAbout markdownContent={content} title={title} />
      </TabPanel>
      <TabPanel active={activeTab === 1}>
        <DonationList />
      </TabPanel>
      <TabPanel active={activeTab === 2}>
        <TabUpdates datas={tracks} />
      </TabPanel>
    </Tabs>
  );
};

export default TabContent;
