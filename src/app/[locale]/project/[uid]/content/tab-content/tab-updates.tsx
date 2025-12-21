'use client';

import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import { useTranslations } from 'next-intl';
import { ProjectDetailData, TracksData } from '@/service/project';
import { ProjectChainInfo } from '@/components/case-cards';

interface TabUpdatesProps {
  projectInfo?: ProjectDetailData;
  currentProjectInfo?: ProjectChainInfo | null;
  uid: string;
}

const TabUpdates = ({ projectInfo, currentProjectInfo, uid }: TabUpdatesProps) => {
  const t = useTranslations('projectDetail.updates');
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: 'easeOut' as const,
      },
    },
  };

  return (
    <motion.div
      ref={ref}
      variants={containerVariants}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      className="bg-white/5 backdrop-blur-sm rounded-3xl border border-white/10 p-8"
    >
      <motion.div variants={itemVariants} className="mb-8">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
          {t('title')}
        </h2>
        
        {/* 更新列表 */}
        <div className="space-y-8">
          {projectInfo?.tracks && projectInfo.tracks.length > 0 ? (
            projectInfo.tracks.map((update: TracksData, index: number) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="flex gap-6 pb-8 border-b border-white/10 last:border-b-0 last:pb-0"
              >
                {/* 日期列 */}
                <div className="flex-shrink-0 w-20 text-center">
                  {(() => {
                    const date = update.createdAt ? new Date(update.createdAt) : new Date();
                    const isValidDate = !isNaN(date.getTime());
                    const displayDate = isValidDate ? date : new Date();
                    
                    return (
                      <>
                        <div className="text-3xl font-light text-white/60 mb-1">
                          {displayDate.getDate()}
                        </div>
                        <div className="text-sm text-white/60 mb-1">
                          {displayDate.toLocaleDateString('en-US', { month: 'short' })}
                        </div>
                        <div className="text-sm text-white/60">
                          {displayDate.getFullYear()}
                        </div>
                        {index < (projectInfo?.tracks?.length || 0) - 1 && (
                          <div className="w-px h-full bg-white/10 mt-4 mx-auto"></div>
                        )}
                      </>
                    );
                  })()}
                </div>

                {/* 内容区域 */}
                <div className="flex-1 min-w-0">
                  <h3 className="text-2xl font-semibold text-white mb-3 hover:text-purple-300 transition-colors">
                    {update.name || t('untitledUpdate')}
                  </h3>
                  <div className="text-white/80 leading-relaxed">
                    {(update.description || '').split('\n').map((paragraph: string, pIndex: number) => (
                      <p key={pIndex} className="mb-4 last:mb-0">
                        {paragraph}
                      </p>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))
          ) : (
            <motion.div variants={itemVariants} className="text-center py-12">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="ti-pencil text-2xl text-purple-400"></i>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">
                {t('empty.title')}
              </h3>
              <p className="text-white/60">
                {t('empty.description')}
              </p>
            </motion.div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default TabUpdates;
