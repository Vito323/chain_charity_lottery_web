"use client";
import React from "react";
import "./style.scss";
import TabContent from "../tab-content";
import Covers from "../cover";
import Fundraising from "../fundraising";
import { useRouter } from "next/navigation";

interface CaseSingleProps {
  uid: string;
}

const CaseSingle = ({ uid }: CaseSingleProps) => {
  const router = useRouter();
  
  // 使用 uid 参数获取项目数据
  console.log('Project UID:', uid);
  
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
                    onDonate={() => {
                      router.push(`/donate/${uid}`);
                    }}
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
