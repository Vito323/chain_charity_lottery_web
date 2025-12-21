'use client';

import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';

interface FundraisingProps {
  totalRaised?: number;
  contributors?: number;
  onDonate?: () => void;
  projectId?: string;
}

const Fundraising: React.FC<FundraisingProps> = ({
  totalRaised = 0,
  contributors = 0,
  projectId = '',
  onDonate,
}) => {
  const t = useTranslations('projectDetail.fundraising');
  // 安全的数值转换
  const safeTotalRaised = typeof totalRaised === 'number' ? totalRaised : parseFloat(String(totalRaised || '0')) || 0;
  const safeContributors = typeof contributors === 'number' ? contributors : parseInt(String(contributors || '0')) || 0;
  return (
    <motion.div 
      className="bg-white/5 backdrop-blur-sm rounded-3xl border border-white/10 p-8 h-full flex flex-col"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
    >
      {/* 筹款摘要部分 */}
      <div className="text-center mb-6">
        <div className="text-sm text-white/60 mb-2">{t('totalAmountRaised')}</div>
        <div className="text-4xl font-bold text-white mb-2">
          ${safeTotalRaised.toLocaleString()}
        </div>
        <div className="text-white/70">
          {t('raisedFrom', { contributors: safeContributors.toLocaleString() })}
        </div>
      </div>

      {/* 项目信息部分 */}
      <div className="mb-6">
        <div className="bg-white/5 rounded-xl p-3 border border-white/10">
          <div className="flex items-start gap-2 text-sm text-white/70">
            <span className="flex-shrink-0">{t('projectId')}:</span>
            <span className="font-mono text-xs break-all">{projectId}</span>
          </div>
        </div>
      </div>

      {/* 操作按钮部分 */}
      <div className="mt-auto pt-6">
        <button
          className="w-full px-8 py-4 bg-gradient-to-r from-purple-600 via-pink-600 to-fuchsia-600 text-white font-semibold rounded-full text-lg hover:from-purple-700 hover:via-pink-700 hover:to-fuchsia-700 transition-all duration-300 shadow-lg hover:shadow-purple-500/25 hover:scale-105 text-center block cursor-pointer"
          onClick={onDonate}
        >
          {t('donate')}
        </button>
      </div>
    </motion.div>
  );
};

export default Fundraising;
