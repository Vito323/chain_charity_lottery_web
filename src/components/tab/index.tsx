"use client";

import React from "react";
import "./style.scss";

export interface TabsProps {
  tabBar: {
    label: string;
    badge?: number;
  }[];
  activeTab: number;
  onTabChange: (tab: number) => void;
  children: React.ReactNode;
}

export interface TabPanelProps {
  children: React.ReactNode;
  active: boolean;
  loading?: boolean;
}

const Tabs = ({ tabBar, children, activeTab, onTabChange }: TabsProps) => {
  const [touchStart, setTouchStart] = React.useState<number | null>(null);
  const [touchEnd, setTouchEnd] = React.useState<number | null>(null);

  // Minimum swipe distance
  const minSwipeDistance = 50;

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe && activeTab < tabBar.length - 1) {
      onTabChange(activeTab + 1);
    }
    if (isRightSwipe && activeTab > 0) {
      onTabChange(activeTab - 1);
    }
  };

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
              {typeof item.badge === 'number' && (
                <span className="tab-badge">
                  {item.badge}
                </span>
              )}
            </li>
          ))}
        </ul>
        <div 
          className="tabs-content" 
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {children}
        </div>
        {/* Mobile swipe indicator */}
        <div className="swipe-indicator">
          <div className="swipe-indicator-track">
            <div 
              className="swipe-indicator-dot"
              style={{
                transform: `translateX(${(activeTab / (tabBar.length - 1)) * 32}px)`
              }}
            />
          </div>
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
