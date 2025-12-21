'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import dayjs from 'dayjs';

type PeriodType = 'day' | 'week' | 'month' | 'year';
type DisplayFormat = 'currency' | 'percentage';

type EarningsDistributionProps = Record<string, never>;

// Mock data for daily earnings in August 2025
const dailyEarningsData: Record<string, number> = {
  '2025-08-03': 139.08,
  '2025-08-04': 363.43,
  '2025-08-05': 293.68,
  '2025-08-06': -32.06,
  '2025-08-09': 338.95,
  '2025-08-10': -735.63,
  '2025-08-11': 630.08,
  '2025-08-12': -411.70,
  '2025-08-13': -331.64,
  '2025-08-16': -34.71,
  '2025-08-17': 363.39,
  '2025-08-18': 160.00,
  '2025-08-19': -515.46,
  '2025-08-20': -153.47,
  '2025-08-23': 542.25,
  '2025-08-24': 995.94,
  '2025-08-25': 1195.08,
  '2025-08-26': -57.68,
  '2025-08-27': -30.93,
  '2025-08-30': 1251.26,
};

const EarningsDistribution: React.FC<EarningsDistributionProps> = () => {
  const t = useTranslations('earningsDetails.distribution');
  const [period, setPeriod] = useState<PeriodType>('day');
  const [displayFormat, setDisplayFormat] = useState<DisplayFormat>('currency');
  const [currentMonth, setCurrentMonth] = useState(dayjs('2025-08-01'));

  // Get days in month
  const daysInMonth = currentMonth.daysInMonth();
  const firstDayOfMonth = currentMonth.startOf('month');
  const firstDayWeekday = firstDayOfMonth.day();

  // Generate calendar days
  const calendarDays: Array<{ day: number; date: string; earnings: number }> = [];
  
  // Add empty cells for days before the first day of month
  for (let i = 0; i < firstDayWeekday; i++) {
    calendarDays.push({ day: 0, date: '', earnings: 0 });
  }

  // Add actual days
  for (let day = 1; day <= daysInMonth; day++) {
    const date = currentMonth.date(day).format('YYYY-MM-DD');
    const earnings = dailyEarningsData[date] || 0;
    calendarDays.push({ day, date, earnings });
  }

  const handlePrevMonth = () => {
    setCurrentMonth(dayjs(currentMonth).subtract(1, 'month'));
  };

  const handleNextMonth = () => {
    setCurrentMonth(dayjs(currentMonth).add(1, 'month'));
  };

  const getEarningsColor = (earnings: number) => {
    if (earnings > 0) return 'bg-pink-500/20 border-pink-500/30 text-pink-400';
    if (earnings < 0) return 'bg-emerald-500/20 border-emerald-500/30 text-emerald-400';
    return 'bg-white/5 border-white/10 text-white/50';
  };

  const formatEarnings = (earnings: number) => {
    if (displayFormat === 'percentage') {
      return earnings > 0 ? `+${earnings.toFixed(2)}%` : `${earnings.toFixed(2)}%`;
    }
    return earnings > 0 ? `+${earnings.toFixed(2)}` : earnings.toFixed(2);
  };

  return (
    <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 md:p-8">
      <h3 className="text-2xl md:text-3xl font-bold text-white mb-6">{t('title')}</h3>

      {/* Period Tabs and Display Format */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-2 rounded-full bg-white/5 border border-white/10 p-1">
          {(['day', 'week', 'month', 'year'] as PeriodType[]).map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => setPeriod(p)}
              className={`px-4 py-1.5 rounded-full text-xs md:text-sm font-semibold transition-all duration-200 ${
                period === p
                  ? 'bg-white text-slate-900 shadow-md shadow-black/20'
                  : 'text-white/70 hover:text-white hover:bg-white/10'
              }`}
            >
              {t(p)}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setDisplayFormat('currency')}
            className={`px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 ${
              displayFormat === 'currency'
                ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg shadow-purple-500/30'
                : 'bg-white/5 text-white/70 hover:bg-white/10 hover:text-white border border-white/10'
            }`}
          >
            ¥
          </button>
          <button
            type="button"
            onClick={() => setDisplayFormat('percentage')}
            className={`px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 ${
              displayFormat === 'percentage'
                ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg shadow-purple-500/30'
                : 'bg-white/5 text-white/70 hover:bg-white/10 hover:text-white border border-white/10'
            }`}
          >
            %
          </button>
        </div>
      </div>

      {/* Calendar */}
      <div className="bg-white/5 rounded-2xl p-4 md:p-6 border border-white/10">
        {/* Month Navigation */}
        <div className="flex items-center justify-between mb-6">
          <button
            type="button"
            onClick={handlePrevMonth}
            className="w-8 h-8 flex items-center justify-center rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-white/70 hover:text-white transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <div className="text-lg md:text-xl font-semibold text-white">
            {currentMonth.format('MMMM YYYY')}
          </div>
          <button
            type="button"
            onClick={handleNextMonth}
            className="w-8 h-8 flex items-center justify-center rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-white/70 hover:text-white transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-2">
          {/* Weekday Headers */}
          {['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'].map((day) => (
            <div key={day} className="text-center text-sm text-white/60 font-medium py-2">
              {t(`weekdays.${day}`)}
            </div>
          ))}

          {/* Calendar Days */}
          {calendarDays.map((item, index) => {
            if (item.day === 0) {
              return <div key={`empty-${index}`} className="aspect-square" />;
            }

            return (
              <motion.div
                key={item.date}
                className={`aspect-square rounded-xl border p-2 flex flex-col items-center justify-center ${getEarningsColor(item.earnings)}`}
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.2 }}
              >
                <div className="text-sm font-semibold mb-1">{item.day}</div>
                <div className="text-xs font-medium">
                  {formatEarnings(item.earnings)}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default EarningsDistribution;

