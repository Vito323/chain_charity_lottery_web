"use client";
import React from "react";
import Link from "next/link";
import { TabPanel, Tabs } from "@/components/tab";
import TabAbout from "./tab-about";
import TabUpdates from "./tab-updates";
import DonationList from "./donation-list";

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

const TabContent = () => {
  const [activeTab, setActiveTab] = React.useState(0);
  return (
    <Tabs tabBar={TABS} activeTab={activeTab} onTabChange={setActiveTab}>
      <TabPanel active={activeTab === 0}>
        <TabAbout />
      </TabPanel>
      <TabPanel active={activeTab === 1}>
      <DonationList />
      </TabPanel>
      <TabPanel active={activeTab === 2}>
      <TabUpdates />
      </TabPanel>
    </Tabs>
  );
};

export default TabContent;
