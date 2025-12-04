'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

type ChartType = 'yield' | 'amount';

interface EarningsOverviewProps {}

// Mock data for yield rate curve
const yieldRateData = [
  { month: 'Jan', value: 2.5 },
  { month: 'Feb', value: 5.2 },
  { month: 'Mar', value: 8.1 },
  { month: 'Apr', value: 12.3 },
  { month: 'May', value: 18.5 },
  { month: 'Jun', value: 22.8 },
  { month: 'Jul', value: 28.3 },
  { month: 'Aug', value: 32.1 },
  { month: 'Sep', value: 35.8 },
];

// Mock data for earnings amount curve
const earningsAmountData = [
  { month: 'Jan', value: 5000 },
  { month: 'Feb', value: 12000 },
  { month: 'Mar', value: 25000 },
  { month: 'Apr', value: 45000 },
  { month: 'May', value: 78000 },
  { month: 'Jun', value: 125000 },
  { month: 'Jul', value: 188000 },
  { month: 'Aug', value: 268000 },
  { month: 'Sep', value: 358000 },
];

const EarningsOverview: React.FC<EarningsOverviewProps> = () => {
  const [chartType, setChartType] = useState<ChartType>('yield');

  const chartData = chartType === 'yield' ? yieldRateData : earningsAmountData;
  const yAxisDomain = chartType === 'yield' ? [0, 40] : [0, 400000];
  const yAxisTicks = chartType === 'yield' 
    ? [0, 10, 20, 30, 40] 
    : [0, 100000, 200000, 300000, 400000];
  const yAxisFormatter = chartType === 'yield' 
    ? (value: number) => `${value}%`
    : (value: number) => `${(value / 1000).toFixed(0)}K`;

  return (
    <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 md:p-8">
      <h3 className="text-2xl md:text-3xl font-bold text-white mb-6">Earnings Overview</h3>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6 mb-8">
        <motion.div
          className="bg-white/5 rounded-2xl p-4 md:p-6 border border-white/10"
          whileHover={{ scale: 1.02, y: -2 }}
          transition={{ duration: 0.2 }}
        >
          <div className="text-sm md:text-base text-white/70 mb-2">Yesterday&apos;s Earnings (USDT)</div>
          <div className="text-2xl md:text-3xl font-bold text-emerald-400">+8,888.88</div>
        </motion.div>

        <motion.div
          className="bg-white/5 rounded-2xl p-4 md:p-6 border border-white/10"
          whileHover={{ scale: 1.02, y: -2 }}
          transition={{ duration: 0.2 }}
        >
          <div className="text-sm md:text-base text-white/70 mb-2">Yield Rate</div>
          <div className="text-2xl md:text-3xl font-bold text-purple-400">+38.88%</div>
        </motion.div>

        <motion.div
          className="bg-white/5 rounded-2xl p-4 md:p-6 border border-white/10"
          whileHover={{ scale: 1.02, y: -2 }}
          transition={{ duration: 0.2 }}
        >
          <div className="text-sm md:text-base text-white/70 mb-2">Year-to-date Earnings (USDT)</div>
          <div className="text-2xl md:text-3xl font-bold text-cyan-400">+668,888.88</div>
        </motion.div>
      </div>

      {/* Chart Toggles */}
      <div className="flex items-center gap-3 mb-6">
        <button
          type="button"
          onClick={() => setChartType('yield')}
          className={`px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 ${
            chartType === 'yield'
              ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg shadow-purple-500/30'
              : 'bg-white/5 text-white/70 hover:bg-white/10 hover:text-white border border-white/10'
          }`}
        >
          Yield Rate Curve
        </button>
        <button
          type="button"
          onClick={() => setChartType('amount')}
          className={`px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 ${
            chartType === 'amount'
              ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg shadow-purple-500/30'
              : 'bg-white/5 text-white/70 hover:bg-white/10 hover:text-white border border-white/10'
          }`}
        >
          Earnings Amount Curve
        </button>
      </div>

      {/* Chart */}
      <div className="h-64 md:h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" />
            <XAxis 
              dataKey="month" 
              stroke="rgba(255, 255, 255, 0.6)"
              style={{ fontSize: '12px' }}
            />
            <YAxis 
              domain={yAxisDomain}
              ticks={yAxisTicks}
              tickFormatter={yAxisFormatter}
              stroke="rgba(255, 255, 255, 0.6)"
              style={{ fontSize: '12px' }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'rgba(15, 23, 42, 0.95)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '12px',
                color: '#fff',
              }}
              formatter={(value: number) => [
                chartType === 'yield' ? `${value}%` : `${value.toLocaleString()} USDT`,
                chartType === 'yield' ? 'Yield Rate' : 'Earnings',
              ]}
            />
            <Line
              type="monotone"
              dataKey="value"
              stroke="#8b5cf6"
              strokeWidth={3}
              dot={{ fill: '#8b5cf6', r: 5 }}
              activeDot={{ r: 8 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default EarningsOverview;

