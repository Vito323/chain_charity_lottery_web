"use client";
import React from "react";
import "./style.scss";
import TabContent from "../tab-content";
import Covers from "../cover";
import Fundraising from "../fundraising";
import { useRouter } from "next/navigation";
import { projectDetail, ProjectDetailData } from "@/service/project";

interface CaseSingleProps {
  uid: string;
}

const CaseSingle = ({ uid }: CaseSingleProps) => {
  const router = useRouter();

  const [detail, setDetail] = React.useState<ProjectDetailData | null>(null);
  
  // 使用 uid 参数获取项目数据
  console.log('Project UID:', uid);



  const getDetail = async () => {
    const response = await projectDetail(uid);
    if(response){
      setDetail(response as unknown as ProjectDetailData);
    }
  }

  React.useEffect(() => {
    getDetail();
  }, []);
  
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
                    totalRaised="$0.00"
                    contributors={0}
                    onDonate={() => {
                      router.push(`/donate/${uid}`);
                    }}
                    onShare={() => console.log('Share clicked')}
                    onBookmark={() => console.log('Bookmark clicked')}
                  />
                </div>
              </div>
              <TabContent title={detail?.name || ''} content={detail?.content || ''} tracks={detail?.tracks || []}></TabContent>
            </div>
          </div>
          {/* <SidebarWrap /> */}
        </div>
      </div>
    </div>
  );
};

export default CaseSingle;
