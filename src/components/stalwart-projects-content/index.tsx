"use client";

import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Tabs } from "@/components/tab";
import useGlobalStore from "@/store";
import { useFundPoolManager } from "@/hooks/useFundPoolManager";
import StalwartProjectList from "../stalwart-project-list";
import "./stalwart-projects-content.scss";

const StalwartProjectsContent = () => {
  const {
    isLoading,
    error,
    contractAddress,
    getVersion,
    getOwner,
    getDonationCount,
    getProject,
    getProjectFundStats,
  } = useFundPoolManager();

  const categories = useGlobalStore((state) => state.categories);
  const [activeTab, setActiveTab] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const CategorySkeleton = () => (
    <div className="stalwart-skeleton-container">
      <div className="stalwart-skeleton-tabs">
        {[1, 2, 3].map((_, index) => (
          <div key={index} className="stalwart-skeleton-tab">
            <div className="stalwart-skeleton-text" style={{ width: '80px', height: '20px' }}></div>
          </div>
        ))}
      </div>
      <div className="stalwart-skeleton-grid">
        {[1, 2, 3, 4, 5, 6].map((_, index) => (
          <div key={index} className="stalwart-skeleton-card"></div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="stalwart-projects" ref={sectionRef}>
      <div className="stalwart-container">
        <motion.div
          className={`stalwart-projects-content ${isVisible ? 'visible' : ''}`}
          initial={{ opacity: 0, y: 30 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          {/* Header Section */}
          <div className="stalwart-projects-header">
            <motion.div
              className="stalwart-projects-badge"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={isVisible ? { opacity: 1, scale: 1 } : {}}
              transition={{ delay: 0.2, duration: 0.6 }}
            >
              <span>Our Projects</span>
            </motion.div>
            
            <motion.h2
              className="stalwart-projects-title"
              initial={{ opacity: 0, y: 20 }}
              animate={isVisible ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.3, duration: 0.8 }}
            >
              Discover Our <span className="stalwart-highlight">Impactful</span> Initiatives
            </motion.h2>
            
            <motion.p
              className="stalwart-projects-description"
              initial={{ opacity: 0, y: 20 }}
              animate={isVisible ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.4, duration: 0.8 }}
            >
              Explore our diverse range of charitable projects and initiatives that are making a real difference in communities around the world. Each project is carefully selected and verified to ensure maximum impact and transparency.
            </motion.p>
          </div>

          {/* Projects Content */}
          <motion.div
            className="stalwart-projects-main"
            initial={{ opacity: 0, y: 30 }}
            animate={isVisible ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.5, duration: 0.8 }}
          >
            {categories.length === 0 ? (
              <CategorySkeleton />
            ) : (
              <Tabs
                activeTab={activeTab}
                onTabChange={setActiveTab}
                tabBar={categories.map((item) => ({ label: item.name }))}
              >
                {categories.map((_, index) => (
                  <StalwartProjectList
                    key={index}
                    activeTab={activeTab}
                    index={index}
                    categoryId={_.id}
                  />
                ))}
              </Tabs>
            )}
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default StalwartProjectsContent;
