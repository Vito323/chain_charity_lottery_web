"use client";
import React from "react";
import { useTranslations } from 'next-intl';

interface ProjectInfoProps {
  uid: string;
  name: string;
}

export const ProjectInfo: React.FC<ProjectInfoProps> = ({ uid, name }) => {
  const t = useTranslations('donate');

  return (
    <div className="mb-6 space-y-4">
      {/* Project Name */}
      <div className="flex items-center gap-4 p-5 bg-white/5 rounded-xl border border-white/10 hover:bg-white/10 transition-colors">
        <div className="w-14 h-14 bg-linear-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center flex-shrink-0 shadow-lg">
          <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2H4zm2 6a2 2 0 114 0 2 2 0 01-4 0zm8 0a2 2 0 114 0 2 2 0 01-4 0z" clipRule="evenodd" />
          </svg>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
            <p className="text-sm! font-semibold! text-white! uppercase! tracking-wide!">{t('projectName')}</p>
          </div>
          <p className="text-white font-semibold text-lg wrap-break-word leading-relaxed">{decodeURIComponent(name)}</p>
        </div>
      </div>
      
      {/* Project ID */}
      <div className="flex items-center gap-4 p-5 bg-white/5 rounded-xl border border-white/10 hover:bg-white/10 transition-colors">
        <div className="w-14 h-14 bg-linear-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center flex-shrink-0 shadow-lg">
          <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
          </svg>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
            <p className="text-sm! font-semibold! text-white! uppercase! tracking-wide!">{t('projectId')}</p>
          </div>
          <p className="text-white font-mono text-base break-all bg-white/5 px-3 py-2 rounded-lg border border-white/10">{uid}</p>
        </div>
      </div>
    </div>
  );
};

