"use client";

import React from "react";
import { TabPanel } from "@/components/tab";
import { ProjectData, queryProjects } from "@/service/project";
import ProjectCard from "../project-card";

interface ProjectListProps {
  activeTab: number;
  index: number;
  categoryId: string;
}

// Mock 开关：在本地开发 / 服务器不可用时开启，用于 UI 调试
const MOCK_MODE = true;

// 本地 Mock 项目数据（仅用于 UI 调试）
const MOCK_PROJECTS: ProjectData[] = [
  {
    id: "mock-project-1",
    name: "Clean Water Initiative",
    description: "Providing safe and clean drinking water to remote communities.",
    image: [
      "/images/mock/projects/water-1.jpg",
      "/images/mock/projects/water-2.jpg",
    ],
    createdAt: "2024-01-10T00:00:00Z",
    donationCount: 128,
    totalDonated: 25000,
  },
  {
    id: "mock-project-2",
    name: "Future of Education",
    description: "Supporting digital learning tools for children in underserved regions.",
    image: [
      "/images/mock/projects/education-1.jpg",
      "/images/mock/projects/education-2.jpg",
    ],
    createdAt: "2024-02-05T00:00:00Z",
    donationCount: 96,
    totalDonated: 18000,
  },
  {
    id: "mock-project-3",
    name: "Green Earth Campaign",
    description: "Reforestation and environmental protection across urban areas.",
    image: [
      "/images/mock/projects/green-1.jpg",
      "/images/mock/projects/green-2.jpg",
    ],
    createdAt: "2024-03-18T00:00:00Z",
    donationCount: 72,
    totalDonated: 32000,
  },
];

const ProjectList = ({ activeTab, index, categoryId }: ProjectListProps) => {
  const [loading, setLoading] = React.useState(false);
  const [list, setList] = React.useState<ProjectData[]>([]);
  const [error, setError] = React.useState<string | null>(null);
  const [, setRetryCount] = React.useState(0);

  const getList = React.useCallback(async () => {
    setLoading(true);
    setError(null);

    // 当处于 MOCK_MODE 时，直接使用本地 mock 数据，不发起真实请求
    if (MOCK_MODE) {
      setList(MOCK_PROJECTS);
      setLoading(false);
      return;
    }

    try {
      const response = await queryProjects(categoryId);
      if (response.ok) {
        setList(response.data);
      }
    } catch (error) {
      console.error(error);
      setError('Failed to load data, please try again later');
    } finally {
      setLoading(false);
    }
  }, [categoryId]);

  const handleRetry = React.useCallback(() => {
    setRetryCount(prev => prev + 1);
    getList();
  }, [getList]);

  React.useEffect(() => {
    getList();
  }, [getList]);

  // Content skeleton screen
  const ContentSkeleton = () => (
    <div className="stalwart-projects-grid">
      {[1, 2, 3, 4, 5, 6].map((_, index) => (
        <div key={index} className="stalwart-skeleton-card"></div>
      ))}
    </div>
  );

  // Error state
  const ErrorState = () => (
    <div className="stalwart-error-state">
      <div className="stalwart-error-icon">
        <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="10"/>
          <line x1="15" y1="9" x2="9" y2="15"/>
          <line x1="9" y1="9" x2="15" y2="15"/>
        </svg>
      </div>
      <h4 className="stalwart-error-title">Load Failed</h4>
      <p className="stalwart-error-message">{error}</p>
      <button 
        className="stalwart-retry-btn"
        onClick={handleRetry}
        disabled={loading}
      >
        {loading ? 'Retrying...' : 'Reload'}
      </button>
    </div>
  );

  // Empty state
  const EmptyState = () => (
    <div className="stalwart-empty-state">
      <div className="stalwart-empty-icon">
        <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
          <polyline points="3.27,6.96 12,12.01 20.73,6.96"/>
          <line x1="12" y1="22.08" x2="12" y2="12"/>
        </svg>
      </div>
      <h4 className="stalwart-empty-title">No Projects Found</h4>
      <p className="stalwart-empty-message">There are no projects in this category yet.</p>
    </div>
  );

  return (
    <TabPanel loading={loading} active={activeTab === index}>
      {loading && <ContentSkeleton />}
      {!loading && error && <ErrorState />}
      {!loading && !error && list.length === 0 && <EmptyState />}
      {!loading && !error && list.length > 0 && (
        <div className="stalwart-projects-grid">
          {list.map((project, index) => (
            <ProjectCard
              key={project.id}
              {...project}
              animationDelay={index * 0.1}
            />
          ))}
        </div>
      )}
    </TabPanel>
  );
};

export default ProjectList;
