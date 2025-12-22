'use client';

import { useTranslations } from 'next-intl';

// Get node type display name
export const useNodeTypeName = () => {
  const tCommon = useTranslations('common');
  
  return (type: 'genesis' | 'super' | 'standard'): string => {
    switch (type) {
      case 'genesis':
        return tCommon('nodeTypes.genesis');
      case 'super':
        return tCommon('nodeTypes.super');
      case 'standard':
        return tCommon('nodeTypes.standard');
      default:
        return tCommon('nodeTypes.node');
    }
  };
};

// Get node type badge color
export const getNodeTypeBadge = (type: 'genesis' | 'super' | 'standard'): string => {
  switch (type) {
    case 'genesis':
      return 'from-purple-500 to-pink-500';
    case 'super':
      return 'from-blue-500 to-cyan-500';
    case 'standard':
      return 'from-emerald-500 to-teal-500';
    default:
      return 'from-gray-500 to-gray-600';
  }
};

