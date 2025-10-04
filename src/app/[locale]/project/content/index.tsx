"use client";
import { Tabs } from "@/components/tab";
import React from "react";
import useGlobalStore from "@/store";
import ListContent from "../list-content";
import "./style.css";

const Casesection = () => {
  const categories = useGlobalStore((state) => state.categories);
  const [activeTab, setActiveTab] = React.useState(0);

  const CategorySkeleton = () => (
    <div className="s-gallery page-gallery">
      <div className="tab-wrap">
        <ul className="tab-nav gallery-tabs">
          {[1, 2, 3].map((_, index) => (
            <li key={index} className="item">
              <div className="skeleton-text" style={{ width: '80px', height: '20px' }}></div>
            </li>
          ))}
        </ul>
        <div className="tabs-content">
          <div className="tab visible-content">
            <div className="row">
              {[1, 2, 3, 4, 5, 6].map((_, index) => (
                <div key={index} className="col-lg-4 col-md-6 col-12 mb-5">
                  <div className="skeleton-card" style={{ height: '300px' }}></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="wpo-case-area-2 section-padding">
      <div className="container">
        <div className="row">
          <div className="col-12">
            <div className="wpo-section-title">
              <h2>Popular Causes What You Should Know</h2>
            </div>
          </div>
        </div>
        {
          categories.length === 0 ? (
            <CategorySkeleton />
          ) : (
            <Tabs
              activeTab={activeTab}
              onTabChange={setActiveTab}
              tabBar={categories.map((item) => ({ label: item.name }))}
            >
              {categories.map((_, index) => (
                <ListContent
                  key={index}
                  activeTab={activeTab}
                  index={index}
                  categoryId={_.id}
                ></ListContent>
              ))}
            </Tabs>
          )
        }
      </div>
    </div>
  );
};

export default Casesection;
