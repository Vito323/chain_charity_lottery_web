"use client";

import React from "react";

interface NodeHeaderProps {
  name: string;
  title: string;
  description: string;
}

const NodeHeader: React.FC<NodeHeaderProps> = ({ name, title, description }) => {
  return (
    <div className="text-center space-y-2 sm:space-y-3 px-4">
      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/15 bg-white/5 backdrop-blur-sm text-xs text-white/80">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
        <span>{name}</span>
      </div>
      <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-extrabold text-white tracking-tight leading-tight">
        {title}
      </h1>
      <p className="text-xs sm:text-sm text-white/70 max-w-2xl mx-auto leading-relaxed">
        {description}
      </p>
    </div>
  );
};

export default NodeHeader;

