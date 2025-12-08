'use client';
import React from 'react';

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
    <div className={`flex items-center justify-center min-h-[400px] md:min-h-[300px] sm:min-h-[250px] py-10 md:py-8 sm:py-5 px-5 md:px-4 sm:px-3 text-center ${className}`}>
      <div className="max-w-[400px] w-full">
        {icon && (
          <div className="mb-6 md:mb-5 sm:mb-4 flex justify-center items-center">
            <div className="w-20 h-20 md:w-15 md:h-15 sm:w-12 sm:h-12 text-gray-400">
              {icon}
            </div>
          </div>
        )}
        
        <h3 className="text-2xl md:text-xl sm:text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4 md:mb-3 sm:mb-2 m-0 leading-tight">{title}</h3>
        
        <p className="text-base md:text-sm sm:text-[13px] text-gray-600 dark:text-gray-400 mb-8 md:mb-6 sm:mb-4 m-0 leading-relaxed">{description}</p>
        
        {action && (
          <div className="flex justify-center items-center gap-3 flex-wrap">
            {action}
          </div>
        )}
      </div>
    </div>
  );
};

export default EmptyState;

