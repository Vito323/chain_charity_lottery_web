'use client';

import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import MarkdownRenderer from "@/components/markdown-renderer";
import "@/components/markdown-renderer/case-bb-styles.scss";
import { ProjectDetailData } from "@/service/project";
import { ProjectChainInfo } from "@/components/case-cards";

interface TabAboutProps {
  projectInfo?: ProjectDetailData;
  currentProjectInfo?: ProjectChainInfo | null;
  uid: string;
}

const TabAbout = ({ projectInfo, currentProjectInfo, uid }: TabAboutProps) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  // 安全的数值转换函数
  const safeParseFloat = (value: any): number => {
    if (typeof value === 'number') return value;
    if (typeof value === 'string') {
      const parsed = parseFloat(value);
      return isNaN(parsed) ? 0 : parsed;
    }
    return 0;
  };

  // 确保数值类型转换
  const totalDonated = safeParseFloat(projectInfo?.totalDonated);
  const goal = safeParseFloat(projectInfo?.goal);
  const progress = goal > 0 ? (totalDonated / goal) * 100 : 0;
  
  // 使用 uid 参数（可以在未来用于数据获取）
  console.log('Project UID:', uid);
  console.log('Current Project Info:', currentProjectInfo);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
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
          {projectInfo?.name}
        </h2>
        
        {/* 进度条 - 延用原有进度条逻辑 */}
        <div className="mb-8">
          <div className="flex justify-between text-sm text-white/70 mb-4">
            <span>Progress</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className="w-full bg-white/10 rounded-full h-3 mb-4">
            <motion.div 
              className="bg-gradient-to-r from-purple-600 to-pink-600 h-3 rounded-full transition-all duration-1000"
              style={{ width: `${progress}%` }}
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 1.5, ease: "easeOut" }}
            />
          </div>
          
          {/* 筹款统计 - 延用原有统计信息布局 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
            <div className="bg-white/5 rounded-2xl p-4 border border-white/10">
              <div className="text-2xl font-bold text-white mb-1">
                ${totalDonated.toFixed(2)}
              </div>
              <div className="text-white/70 text-sm">Raised</div>
            </div>
            <div className="bg-white/5 rounded-2xl p-4 border border-white/10">
              <div className="text-2xl font-bold text-white mb-1">
                ${goal.toFixed(2)}
              </div>
              <div className="text-white/70 text-sm">Goal</div>
            </div>
            <div className="bg-white/5 rounded-2xl p-4 border border-white/10">
              <div className="text-2xl font-bold text-white mb-1">
                {projectInfo?.donationCount || 0}
              </div>
              <div className="text-white/70 text-sm">Donors</div>
            </div>
          </div>
        </div>

        {/* Markdown 内容 - 延用原有 MarkdownRenderer 逻辑 */}
        <div className="case-bb-text">
          <MarkdownRenderer 
            content={projectInfo?.content || ''}
            className="case-bb-markdown"
          />
        </div>
      </motion.div>
    </motion.div>
  );
};

export default TabAbout;
