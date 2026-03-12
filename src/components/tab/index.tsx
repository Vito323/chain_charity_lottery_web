"use client";

import React from "react";

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
    <section className="w-full">
      <style jsx>{`
        .tab-scroll-container::-webkit-scrollbar {
          display: none;
        }
      `}</style>
      <div className="mt-8">
        {/* Tab Navigation */}
        <div className="relative">
          {/* Desktop Tabs */}
          <div className="hidden md:block">
            <div 
              className="tab-scroll-container flex items-center gap-3 mb-8 overflow-x-auto pb-2 px-2"
              style={{
                scrollbarWidth: 'none',
                msOverflowStyle: 'none'
              } as React.CSSProperties}
            >
              {tabBar.map((item, _i) => (
                <button
                  key={_i}
                  onClick={() => onTabChange?.(_i)}
                  className={`
                    relative px-5 py-3 rounded-full font-medium text-sm uppercase tracking-wide
                    transition-all duration-300 ease-out overflow-hidden group cursor-pointer
                    flex items-center gap-2.5 whitespace-nowrap shrink-0
                    ${
                      _i === activeTab
                        ? "text-white bg-linear-to-r from-indigo-500 to-purple-600 shadow-lg shadow-indigo-500/25 scale-105"
                        : "text-gray-300 hover:text-white bg-white/5 hover:bg-white/10 backdrop-blur-sm border border-white/10 hover:border-white/20"
                    }
                  `}
                >
                  {/* Active Tab Indicator */}
                  {_i === activeTab && (
                    <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full animate-pulse opacity-20" />
                  )}
                  
                  {/* Hover Background Effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 to-purple-600/10 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 ease-out" />
                  
                  {/* Content */}
                  <span className="relative z-10 font-semibold">{item.label}</span>
                  {typeof item.badge === 'number' && (
                    <span className={`
                      relative z-10 inline-flex items-center justify-center min-w-[18px] h-[18px] px-1.5 text-xs font-bold
                      rounded-full transition-all duration-300
                      ${
                        _i === activeTab
                          ? "bg-white/25 text-white shadow-sm"
                          : "bg-indigo-500/80 text-white group-hover:bg-indigo-400/90"
                      }
                    `}>
                      {item.badge}
                    </span>
                  )}
                  
                  {/* Ripple Effect */}
                  <div className="absolute inset-0 rounded-full bg-white/10 scale-0 group-active:scale-100 transition-transform duration-150 ease-out" />
                </button>
              ))}
            </div>
          </div>

          {/* Mobile Tabs */}
          <div className="md:hidden">
            <div 
              className="tab-scroll-container flex items-center gap-2 mb-8 overflow-x-auto pb-2 px-2"
              style={{
                scrollbarWidth: 'none',
                msOverflowStyle: 'none'
              } as React.CSSProperties}
            >
              {tabBar.map((item, _i) => (
                <button
                  key={_i}
                  onClick={() => onTabChange?.(_i)}
                  className={`
                    relative px-4 py-2.5 rounded-full font-medium text-xs uppercase tracking-wide
                    transition-all duration-300 ease-out overflow-hidden group cursor-pointer
                    flex items-center gap-2 whitespace-nowrap flex-shrink-0 min-w-fit
                    ${
                      _i === activeTab
                        ? "text-white bg-gradient-to-r from-indigo-500 to-purple-600 shadow-md scale-105"
                        : "text-gray-400 hover:text-white bg-white/5 hover:bg-white/10 backdrop-blur-sm border border-white/10 hover:border-white/20"
                    }
                  `}
                >
                  {/* Active Tab Indicator */}
                  {_i === activeTab && (
                    <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full animate-pulse opacity-20" />
                  )}
                  
                  {/* Hover Background Effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 to-purple-600/10 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 ease-out" />
                  
                  {/* Content */}
                  <span className="relative z-10 truncate max-w-[100px] font-semibold">{item.label}</span>
                  {typeof item.badge === 'number' && (
                    <span className={`
                      relative z-10 inline-flex items-center justify-center min-w-[16px] h-[16px] px-1 text-xs font-bold
                      rounded-full transition-all duration-300
                      ${
                        _i === activeTab
                          ? "bg-white/25 text-white shadow-sm"
                          : "bg-indigo-500/80 text-white group-hover:bg-indigo-400/90"
                      }
                    `}>
                      {item.badge}
                    </span>
                  )}
                  
                  {/* Ripple Effect */}
                  <div className="absolute inset-0 rounded-full bg-white/10 scale-0 group-active:scale-100 transition-transform duration-150 ease-out" />
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Tab Content - pan-x pan-y allows vertical scroll + horizontal swipe for tab switch */}
        <div 
          className="relative min-h-[400px] select-none [touch-action:pan-x_pan-y]"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {children}
        </div>

        {/* Mobile Swipe Indicator */}
        <div className="flex justify-center mt-6 md:hidden">
          <div className="relative w-10 h-1 bg-indigo-500/30 rounded-full overflow-hidden">
            <div 
              className="absolute left-0 top-0 w-2 h-1 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full transition-transform duration-300 ease-out"
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
  if (!active) return null;
  
  return (
    <div className="w-full min-h-[400px] animate-in fade-in-0 slide-in-from-bottom-4 duration-300">
      {children}
    </div>
  );
};

export { Tabs, TabPanel };
