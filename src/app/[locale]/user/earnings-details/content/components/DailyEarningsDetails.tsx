'use client';

import React from 'react';
import { motion } from 'framer-motion';
import dayjs from 'dayjs';

interface DailyEarningsDetailsProps {}

interface NodeEarnings {
  type: string;
  count: number;
  earnings: number;
}

const DailyEarningsDetails: React.FC<DailyEarningsDetailsProps> = () => {
  const selectedDate = dayjs('2028-08-30');
  
  const nodeEarnings: NodeEarnings[] = [
    { type: 'Genesis Nodes', count: 2, earnings: 888.88 },
    { type: 'Super Nodes', count: 2, earnings: 288.88 },
    { type: 'Regular Nodes', count: 12, earnings: 188.88 },
  ];

  return (
    <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 md:p-8">
      <h3 className="text-2xl md:text-3xl font-bold text-white mb-2">
        Daily Earnings Details
      </h3>
      <p className="text-sm md:text-base text-white/60 mb-6">
        {selectedDate.format('YYYY-MM-DD')}
      </p>

      <div className="space-y-4">
        {nodeEarnings.map((node, index) => (
          <motion.div
            key={node.type}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            whileHover={{ scale: 1.02, y: -2 }}
            className="bg-white/5 rounded-2xl p-4 md:p-6 border border-white/10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/30 flex items-center justify-center">
                <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01" />
                </svg>
              </div>
              <div>
                <div className="text-base md:text-lg font-semibold text-white">
                  {node.type}
                </div>
                <div className="text-sm text-white/60">
                  ({node.count} nodes)
                </div>
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl md:text-3xl font-bold text-emerald-400">
                +{node.earnings.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
              <span className="text-sm text-white/60">USDT</span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default DailyEarningsDetails;

