"use client";
import React from "react";
import "./style.css";
import TabContent from "../tab-content";
import Covers from "../cover";
import Fundraising from "../fundraising";

const CaseSingle = () => {

  return (
    <div className="wpo-case-details-area section-padding">
      <div className="container">
        <div className="row">
          <div className="col col-12">
            <div className="wpo-case-details-wrap">
              {/* 图片轮播和筹款组件并排布局 */}
              <div className="case-hero-layout">
                <div className="case-swiper-container">
                  <Covers></Covers>
                </div>
                <div className="case-fundraising-container">
                  <Fundraising 
                    totalRaised="$425,323.75"
                    contributors={3635}
                    onDonate={() => console.log('Donate clicked')}
                    onShare={() => console.log('Share clicked')}
                    onBookmark={() => console.log('Bookmark clicked')}
                  />
                </div>
              </div>
              <TabContent></TabContent>
            </div>
          </div>
          {/* <SidebarWrap /> */}
        </div>
      </div>
    </div>
  );
};

export default CaseSingle;
