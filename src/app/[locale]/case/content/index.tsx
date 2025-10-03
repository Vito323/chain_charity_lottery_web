"use client";
import Link from "next/link";
import "./style.css";
import TabContent from "../../case-single/tab-content";
import { TabPanel, Tabs } from "@/components/tab";
import React from "react";
import CaseCards from "@/components/case-cards";

const TABS = [
  {
    label: "Education",
  },
  {
    label: "Medical",
  },
  {
    label: "Environmental",
  },
  {
    label: "Natural disaster",
  },
];

const Casesection = () => {
  const ClickHandler = () => {
    window.scrollTo(10, 0);
  };

  const [activeTab, setActiveTab] = React.useState(0);

  return (
    <div className="wpo-case-area-2 section-padding">
      <div className="container">
        <div className="row">
          <div className="col-12">
            <div className="wpo-section-title">
              <span>Our Causes</span>
              <h2>Popular Causes What You Should Know</h2>
            </div>
          </div>
        </div>
        <Tabs activeTab={activeTab} onTabChange={setActiveTab} tabBar={TABS}>
          {[0, 1, 2, 3].map((item) => (
            <TabPanel key={item} active={activeTab === item}>
            <CaseCards />
            </TabPanel>
          ))}
        </Tabs>
        {/* <TabContent></TabContent> */}
      </div>
    </div>
  );
};

export default Casesection;
