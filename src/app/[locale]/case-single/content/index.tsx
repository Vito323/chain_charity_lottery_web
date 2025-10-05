"use client";
import React from "react";
import "./style.scss";
import TabContent from "../tab-content";
import Covers from "../cover";
import Fundraising from "../fundraising";
import { useRouter } from "next/navigation";
import { projectDetail, ProjectDetailData } from "@/service/project";
import PageTitle from "@/components/page-title";
import { ProjectFundStats, useFundPoolManager } from "@/hooks/useFundPoolManager";

interface CaseSingleProps {
  uid: string;
}

const CaseSingle = ({ uid }: CaseSingleProps) => {
  const router = useRouter();
  const { getProjectFundStats } = useFundPoolManager();
  const [currentProjectFundStats, setCurrentProjectFundStats] = React.useState<ProjectFundStats | null>(null);
  const [detail, setDetail] = React.useState<ProjectDetailData | null>(null);

  // 使用 uid 参数获取项目数据
  console.log("Project UID:", uid);

  const getDetail = React.useCallback(async () => {
    const response = await projectDetail(uid);
    if (response) {
      setDetail(response as unknown as ProjectDetailData);
    }
  }, [uid]);

  React.useEffect(() => {
    getDetail();
  }, [getDetail]);

  const queryProjectFundStats = React.useCallback(async () => {
    const response = await getProjectFundStats(uid);
    console.log(response, 'response');
    if (response) {
      setCurrentProjectFundStats(response);
    }
  }, [getProjectFundStats, uid]);


  React.useEffect(() => {
    if(uid) {
    queryProjectFundStats();
    }
  }, [queryProjectFundStats, uid]);


  return (
    <>
      <PageTitle
        pageTitle={"Our Project"}
        pagePrevs={[{label: "Project", href: `/project`}]}
        pagesub={detail?.name || "--"}
      />
      <div className="wpo-case-details-area section-padding">
        <div className="container">
          <div className="row">
            <div className="col col-12">
              <div className="wpo-case-details-wrap">
                {/* 图片轮播和筹款组件并排布局 */}
                <div className="case-hero-layout">
                  <div className="case-swiper-container">
                    <Covers images={detail?.image || []}></Covers>
                  </div>
                  <div className="case-fundraising-container">
                    <Fundraising
                      totalRaised="$0.00"
                      contributors={0}
                      projectId={uid}
                      onDonate={() => {
                        router.push(`/donate/${uid}/${detail?.name || ''}`);
                      }}
                    />
                  </div>
                </div>
                <TabContent
                  title={detail?.name || ""}
                  content={detail?.content || ""}
                  tracks={detail?.tracks || []}
                ></TabContent>
              </div>
            </div>
            {/* <SidebarWrap /> */}
          </div>
        </div>
      </div>
    </>
  );
};

export default CaseSingle;
