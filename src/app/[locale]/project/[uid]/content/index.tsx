"use client";
import React from "react";
import "./style.scss";
import TabContent from "../tab-content";
import Covers from "../cover";
import Fundraising from "../fundraising";
import { useRouter } from "next/navigation";
import { projectDetail, ProjectDetailData } from "@/service/project";
import PageTitle from "@/components/page-title";
import {
  useFundPoolManager,
} from "@/hooks/useFundPoolManager";
import { ProjectChainInfo } from "@/components/case-cards";
import { useAccount, useChainId } from "wagmi";

interface CaseSingleProps {
  uid: string;
}

const CaseSingle = ({ uid }: CaseSingleProps) => {
  const router = useRouter();
  const { getProject } = useFundPoolManager();
  const { isConnected } = useAccount();
  const chainId = useChainId();
  const [detail, setDetail] = React.useState<ProjectDetailData | null>(null);
  const [currentProjectInfo, setCurrentProjectFundInfo] =
    React.useState<ProjectChainInfo | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  // 使用 uid 参数获取项目数据
  console.log("Project UID:", uid);

  const getDetail = React.useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await projectDetail(uid);
      if (response.ok) {
        setDetail(response.data);
      }
    } catch (error) {
      console.error('Failed to fetch project details:', error);
    } finally {
      setIsLoading(false);
    }
  }, [uid]);

  React.useEffect(() => {
    getDetail();
  }, [getDetail]);

  const queryProjectFundStats = React.useCallback(async () => {
    const response = await getProject(uid);
    console.log(response, "response112");
    if (response) {
      setCurrentProjectFundInfo(response);
    }
  }, [getProject, uid]);

  React.useEffect(() => {
    if (uid && isConnected && chainId) {
      queryProjectFundStats();
    }
  }, [queryProjectFundStats, uid, isConnected, chainId]);

  return (
    <>
      <PageTitle
        pageTitle={"Our Project"}
        pagePrevs={[{ label: "Project", href: `/project` }]}
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
                    <Covers images={detail?.image || []} isLoading={isLoading}></Covers>
                  </div>
                  <div className="case-fundraising-container">
                    <Fundraising
                      totalRaised={detail?.donors.reduce((acc, donor) => acc + donor.amount, 0) || 0}
                      contributors={detail?.donors.length || 0}
                      projectId={uid}
                      onDonate={() => {
                        router.push(`/donate/${uid}/${detail?.name || ""}`);
                      }}
                    />
                  </div>
                </div>
                <TabContent
                  title={detail?.name || ""}
                  content={detail?.content || ""}
                  tracks={detail?.tracks || []}
                  donors={detail?.donors || []}
                  currentProjectInfo={currentProjectInfo}
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
