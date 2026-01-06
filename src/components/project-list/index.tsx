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

const ProjectList = ({ activeTab, index, categoryId }: ProjectListProps) => {
  const [loading, setLoading] = React.useState(false);
  const [list, setList] = React.useState<ProjectData[]>([]);
  const [error, setError] = React.useState<string | null>(null);
  const [, setRetryCount] = React.useState(0);

  const getList = React.useCallback(async () => {
    setLoading(true);
    setError(null);

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
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 mt-8">
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 mt-8">
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
