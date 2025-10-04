'use client';
import { FundraisingCard } from "@/components/case-cards";
import { TabPanel } from "@/components/tab";
import { ProjectData, queryProjects } from "@/service/project";
import React from "react";

interface ListContentProps {
  activeTab: number;
  index: number;
  categoryId: string;
}

const ListContent = ({activeTab, index, categoryId}: ListContentProps) => {
  const [loading, setLoading] = React.useState(false);
  const [list, setList] = React.useState<ProjectData[]>([]);
  const [error, setError] = React.useState<string | null>(null);
  const [, setRetryCount] = React.useState(0);

  const getList = React.useCallback(async() => { 
    setLoading(true);
    setError(null);
    try{
      const response = await queryProjects(categoryId);
      if(response){
        setList(response as unknown as ProjectData[]);
      }
    }catch(error){
      console.error(error);
      setError('Failed to load data, please try again later');
    }finally{
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
    <div className="row">
      {[1, 2, 3, 4, 5, 6].map((_, index) => (
        <div key={index} className="col-lg-4 col-md-6 col-12 mb-5">
          <div className="skeleton-card" style={{ height: '300px' }}></div>
        </div>
      ))}
    </div>
  );

  // Error state
  const ErrorState = () => (
    <div className="row">
      <div className="col-12">
        <div className="text-center py-5">
          <div className="error-icon mb-3">
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10"/>
              <line x1="15" y1="9" x2="9" y2="15"/>
              <line x1="9" y1="9" x2="15" y2="15"/>
            </svg>
          </div>
          <h4 className="text-muted mb-3">Load Failed</h4>
          <p className="text-muted mb-4">{error}</p>
          <button 
            className="btn btn-primary"
            onClick={handleRetry}
            disabled={loading}
          >
            {loading ? 'Retrying...' : 'Reload'}
          </button>
        </div>
      </div>
    </div>
  );

  // Empty state
  const EmptyState = () => (
    <div className="row">
      <div className="col-12">
        <div className="text-center py-5">
          <div className="empty-icon mb-3">
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
              <polyline points="3.27,6.96 12,12.01 20.73,6.96"/>
              <line x1="12" y1="22.08" x2="12" y2="12"/>
            </svg>
          </div>
          <h4 className="text-muted mb-3">No Data</h4>
          <p className="text-muted">No projects available in this category</p>
        </div>
      </div>
    </div>
  );

  return (
    <TabPanel loading={loading} active={activeTab === index}>
      {loading && <ContentSkeleton />}
      {!loading && error && <ErrorState />}
      {!loading && !error && list.length === 0 && <EmptyState />}
      {!loading && !error && list.length > 0 && (
        <div className="row">
          {list.map((card, index) => (
            <div key={index} className="col-lg-4 col-md-6 col-12 mb-5">
              <FundraisingCard {...card}/>
            </div>
          ))}
        </div>
      )}
    </TabPanel>
  )
}


export default ListContent;