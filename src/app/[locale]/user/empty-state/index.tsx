'use client';
import React from 'react';
import './style.scss';

interface EmptyStateProps {
  title?: string;
  description?: string;
  icon?: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
}

const EmptyState: React.FC<EmptyStateProps> = ({
  title = "No NFTs",
  description = "You don't have any NFT collections yet. Start exploring!",
  icon,
  action,
  className = ""
}) => {
  return (
    <div className={`empty-state ${className}`}>
      <div className="empty-state__content">
        {icon && (
          <div className="empty-state__icon">
            {icon}
          </div>
        )}
        
        <h3 className="empty-state__title">{title}</h3>
        
        <p className="empty-state__description">{description}</p>
        
        {action && (
          <div className="empty-state__action">
            {action}
          </div>
        )}
      </div>
    </div>
  );
};

export default EmptyState;
