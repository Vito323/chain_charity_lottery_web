"use client";

import React from "react";
import "./style.scss";

export interface TabsProps {
  tabBar: {
    label: string;
  }[];
  activeTab: number;
  onTabChange: (tab: number) => void;
  children: React.ReactNode;
}

export interface TabPanelProps {
  children: React.ReactNode;
  active: boolean;
}

const Tabs = ({ tabBar, children, activeTab, onTabChange }: TabsProps) => {
  const contentWrapperRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    function updateHeight() {
      if (!contentWrapperRef.current) return;
      const activeContent =
        contentWrapperRef.current.querySelector<HTMLElement>(
          ".tab.visible-content"
        );
      if (activeContent) {
        contentWrapperRef.current.style.height =
          activeContent.offsetHeight + "px";
      }
    }

    updateHeight();
    window.addEventListener("resize", updateHeight);
    return () => window.removeEventListener("resize", updateHeight);
  }, [activeTab]);

  return (
    <section className="s-gallery page-gallery">
      <div className="tab-wrap">
        <ul className="tab-nav gallery-tabs">
          {tabBar.map((item, _i) => (
            <li
              key={_i}
              onClick={() => onTabChange?.(_i)}
              className={`item ${_i === activeTab ? "active" : ""}`}
            >
              {item.label}
            </li>
          ))}
        </ul>
        <div className="tabs-content" ref={contentWrapperRef}>
          {children}
        </div>
      </div>
    </section>
  );
};

const TabPanel = ({ children, active }: TabPanelProps) => {
  return (
    <div className={`tab ${active ? "visible-content" : ""}`}>{children}</div>
  );
};

export { Tabs, TabPanel };
