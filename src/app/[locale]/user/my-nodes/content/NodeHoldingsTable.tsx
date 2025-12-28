'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { formatCurrency } from '@/utils/currency';
import { NodeHolding } from './types';
import { useNodeTypeName, getNodeTypeBadge } from './utils';

interface NodeHoldingsTableProps {
  variants: any;
  nodeHoldings: NodeHolding[];
}

const NodeHoldingsTable: React.FC<NodeHoldingsTableProps> = ({ variants, nodeHoldings }) => {
  const t = useTranslations('network.myNodes');
  const getNodeTypeName = useNodeTypeName();

  return (
    <motion.div
      variants={variants}
      initial="hidden"
      animate="visible"
      className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden"
    >
      {/* Desktop Table */}
      <div className="hidden md:block overflow-x-hidden">
        <table className="w-full">
          <thead className="bg-white/5 border-b border-white/10">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-semibold text-white/80 uppercase tracking-wider">
                {t('table.node')}
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-white/80 uppercase tracking-wider">
                {t('table.purchaseCost')}
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-white/80 uppercase tracking-wider">
                {t('table.yesterdayEarnings')}
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-white/80 uppercase tracking-wider">
                {t('table.accumulatedEarnings')}
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/10">
            {nodeHoldings.map((node, index) => (
              <motion.tr
                key={node.id}
                className="hover:bg-white/5 transition-all duration-200"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ scale: 1.01 }}
                style={{ transformOrigin: 'center' }}
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-3">
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r ${getNodeTypeBadge(node.nodeType)} text-white`}
                    >
                      {getNodeTypeName(node.nodeType)}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm font-medium text-white">
                    {formatCurrency(node.purchaseCost.usd)}
                  </div>
                  <div className="text-xs text-white/60">
                    {node.purchaseCost.clt.toLocaleString()} CCT
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm font-medium text-emerald-400">
                    +{formatCurrency(node.yesterdayEarnings.amount)}
                  </div>
                  <div className="text-xs text-white/60">
                    +{node.yesterdayEarnings.percentage.toFixed(2)}%
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-bold text-white">
                    +{formatCurrency(node.accumulatedEarnings)}
                  </div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden divide-y divide-white/10">
        {nodeHoldings.map((node, index) => (
          <motion.div
            key={node.id}
            className="p-4 space-y-3"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <div className="flex items-center justify-between">
              <span
                className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r ${getNodeTypeBadge(node.nodeType)} text-white`}
              >
                {getNodeTypeName(node.nodeType)}
              </span>
            </div>
            
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <div className="text-white/60 text-xs mb-1">{t('table.purchaseCost')}</div>
                <div className="text-white font-medium">
                  {formatCurrency(node.purchaseCost.usd)}
                </div>
                <div className="text-white/60 text-xs">
                  {node.purchaseCost.clt.toLocaleString()} CCT
                </div>
              </div>
              
              <div>
                <div className="text-white/60 text-xs mb-1">{t('table.yesterdayEarnings')}</div>
                <div className="text-emerald-400 font-medium">
                  +{formatCurrency(node.yesterdayEarnings.amount)}
                </div>
                <div className="text-white/60 text-xs">
                  +{node.yesterdayEarnings.percentage.toFixed(2)}%
                </div>
              </div>
            </div>
            
            <div>
              <div className="text-white/60 text-xs mb-1">{t('table.accumulatedEarnings')}</div>
              <div className="text-white font-bold">
                +{formatCurrency(node.accumulatedEarnings)}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default NodeHoldingsTable;

