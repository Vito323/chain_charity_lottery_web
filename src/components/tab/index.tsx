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
  loading?: boolean;
}

const Tabs = ({ tabBar, children, activeTab, onTabChange }: TabsProps) => {
  const contentWrapperRef = React.useRef<HTMLDivElement>(null);
  const observerRef = React.useRef<MutationObserver | null>(null);
  const [touchStart, setTouchStart] = React.useState<number | null>(null);
  const [touchEnd, setTouchEnd] = React.useState<number | null>(null);

  // 最小滑动距离
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

  // 更新高度的函数
  const updateHeight = React.useCallback(() => {
    if (!contentWrapperRef.current) return;
    
    const activeContent = contentWrapperRef.current.querySelector<HTMLElement>(
      ".tab.visible-content"
    );
    
    if (activeContent) {
      // 临时移除绝对定位来获取真实高度
      const originalPosition = activeContent.style.position;
      const originalTop = activeContent.style.top;
      const originalLeft = activeContent.style.left;
      const originalZIndex = activeContent.style.zIndex;
      
      activeContent.style.position = 'relative';
      activeContent.style.top = 'auto';
      activeContent.style.left = 'auto';
      activeContent.style.zIndex = 'auto';
      
      // 获取真实高度
      const height = activeContent.offsetHeight;
      
      // 恢复原始样式
      activeContent.style.position = originalPosition;
      activeContent.style.top = originalTop;
      activeContent.style.left = originalLeft;
      activeContent.style.zIndex = originalZIndex;
      
      // 设置容器高度
      contentWrapperRef.current.style.height = height + "px";
    }
  }, []);

  // 主要的高度更新效果
  React.useEffect(() => {
    updateHeight();
    window.addEventListener("resize", updateHeight);
    
    return () => {
      window.removeEventListener("resize", updateHeight);
    };
  }, [activeTab, updateHeight]);

  // 监听内容变化
  React.useEffect(() => {
    if (!contentWrapperRef.current) return;

    // 创建 MutationObserver 来监听内容变化
    observerRef.current = new MutationObserver((mutations) => {
      let shouldUpdate = false;
      
      mutations.forEach((mutation) => {
        // 监听子节点变化、属性变化、文本内容变化
        if (
          mutation.type === 'childList' ||
          mutation.type === 'attributes' ||
          mutation.type === 'characterData'
        ) {
          shouldUpdate = true;
        }
      });
      
      if (shouldUpdate) {
        // 使用 setTimeout 确保 DOM 更新完成后再计算高度
        setTimeout(updateHeight, 0);
      }
    });

    // 开始观察
    observerRef.current.observe(contentWrapperRef.current, {
      childList: true,
      subtree: true,
      attributes: true,
      characterData: true,
      attributeFilter: ['style', 'class']
    });

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [updateHeight]);

  // 监听图片加载完成
  React.useEffect(() => {
    if (!contentWrapperRef.current) return;

    const images = contentWrapperRef.current.querySelectorAll('img');
    
    const handleImageLoad = () => {
      setTimeout(updateHeight, 100); 
    };

    images.forEach(img => {
      if (img.complete) {
        handleImageLoad();
      } else {
        img.addEventListener('load', handleImageLoad);
        img.addEventListener('error', handleImageLoad);
      }
    });

    return () => {
      images.forEach(img => {
        img.removeEventListener('load', handleImageLoad);
        img.removeEventListener('error', handleImageLoad);
      });
    };
  }, [activeTab, updateHeight]);

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
        <div 
          className="tabs-content" 
          ref={contentWrapperRef}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {children}
        </div>
        {/* 移动端滑动指示器 */}
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
