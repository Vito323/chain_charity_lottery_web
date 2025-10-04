"use client";
import { Tabs } from "@/components/tab";
import React from "react";
import useGlobalStore from "@/store";
import ListContent from "../list-content";
import "./style.css";

const Casesection = () => {
  const categories = useGlobalStore((state) => state.categories);


  const [activeTab, setActiveTab] = React.useState(0);





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
        <Tabs activeTab={activeTab} onTabChange={setActiveTab} tabBar={categories.map((item) => ({ label: item.name }))}>
          {categories.map((_, index) => (
            <ListContent key={index} activeTab={activeTab} index={index} categoryId={_.id}></ListContent>
          ))}
        </Tabs>
      </div>
    </div>
  );
};

export default Casesection;
