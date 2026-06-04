'use client';

import React, { useCallback, useState } from 'react';
import { motion, type Variants } from 'framer-motion';
import { useLocale, useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { nodeBindingsHref } from '@/constants/userRoutes';
import dayjs from 'dayjs';
import 'dayjs/locale/zh-cn';
import 'dayjs/locale/en';
import { NodeHolding } from './types';
import { useNodeTypeName, getNodeTypeBadge } from './utils';
import {
  accruedReleasedTokenDouble,
  accruedUsdDouble,
  nextReleaseAt,
} from '@/lib/nodeStakeAccrual';
import { NodeTermHint } from './NodeTermHint';

interface NodeHoldingsTableProps {
  variants: Variants;
  nodeHoldings: NodeHolding[];
}

const PRIMARY_BUTTON_CLASS =
  'w-full py-3 rounded-xl text-sm font-semibold bg-linear-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700 shadow-lg shadow-purple-500/30 transition-all duration-300 cursor-pointer';

const fmt2 = (n: number) => n.toFixed(2);

const NodeHoldingsTable: React.FC<NodeHoldingsTableProps> = ({ variants, nodeHoldings }) => {
  const t = useTranslations('network.myNodes');
  const getNodeTypeName = useNodeTypeName();
  const locale = useLocale();
  const [expandedIds, setExpandedIds] = useState<Set<string>>(() => new Set());

  const isZh = locale === 'zh' || locale.startsWith('zh');
  const dateTimePattern = isZh ? 'YYYY/M/D HH:mm:ss' : 'MMM D, YYYY, HH:mm:ss';

  const formatTs = useCallback(
    (timestampSec: number) => {
      if (timestampSec <= 0) return '—';
      return dayjs(timestampSec * 1000)
        .locale(isZh ? 'zh-cn' : 'en')
        .format(dateTimePattern);
    },
    [dateTimePattern, isZh]
  );

  const renderNodeIdBlock = (nodeId: string) => (
    <div className="mt-2">
      <div className="text-white/60 text-xs mb-1">{t('card.nodeId')}</div>
      <div className="text-white font-medium text-sm tabular-nums break-all">{nodeId}</div>
    </div>
  );

  const toggleExpanded = (id: string) => {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const renderExpandedBody = (node: NodeHolding) => {
    const active = node.status === 1;
    if (!active) return null;

    const now = new Date();
    const accruedUsd = accruedUsdDouble(node.timestampSec, node.reward, now);
    const releasedCct = accruedReleasedTokenDouble(node.timestampSec, node.stake, now);
    const nextRel = nextReleaseAt(node.timestampSec, now);
    const nextReleaseText = nextRel ? formatTs(Math.floor(nextRel.getTime() / 1000)) : '—';

    const row = (label: React.ReactNode, value: string) => (
      <div className="flex justify-between gap-3 text-sm">
        <span className="text-white/60 shrink-0">{label}</span>
        <span className="text-white font-semibold text-right tabular-nums">{value}</span>
      </div>
    );

    const rowWithHint = (labelKey: string, value: string, hintKey: string) =>
      row(
        <span className="inline-flex items-center gap-0.5 min-w-0">
          <span className="truncate">{t(`card.${labelKey}`)}</span>
          <NodeTermHint
            title={t('card.hintPopoverTitle')}
            hint={t(`card.hints.${hintKey}`)}
            ariaLabel={t('card.hintButtonAria')}
          />
        </span>,
        value
      );

    return (
      <div className="space-y-3 pt-3 border-t border-white/10">
        {row(
          <span className="inline-flex items-center gap-0.5 min-w-0">
            <span className="truncate">{t('card.stakeTime')}</span>
            <NodeTermHint
              title={t('card.hintPopoverTitle')}
              hint={t('card.hints.stakeTime')}
              ariaLabel={t('card.hintButtonAria')}
            />
          </span>,
          formatTs(node.timestampSec)
        )}
        {rowWithHint('stakeAmount', `${fmt2(node.stake)} ${t('currency.cct')}`, 'stakeAmount')}
        {rowWithHint('currentReward', `${fmt2(accruedUsd)} ${t('currency.usdt')}`, 'currentReward')}
        {rowWithHint('currentRelease', `${fmt2(releasedCct)} ${t('currency.cct')}`, 'currentRelease')}
        {rowWithHint('nextUnlock', nextReleaseText, 'nextUnlock')}
        <Link
          href={nodeBindingsHref(node.id)}
          className={`${PRIMARY_BUTTON_CLASS} mt-2 block text-center`}
          onClick={(e) => e.stopPropagation()}
        >
          {t('card.viewBindings')}
        </Link>
        <button
          type="button"
          disabled
          className="w-full py-3 rounded-xl text-sm font-semibold bg-white/10 text-white/35 cursor-not-allowed border border-white/10"
        >
          {t('card.withdraw')}
        </button>
      </div>
    );
  };

  return (
    <motion.div
      variants={variants}
      initial="visible"
      animate="visible"
      className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden"
    >
      {/* Desktop */}
      <div className="hidden md:block overflow-x-hidden">
        <table className="w-full">
          <thead className="bg-white/5 border-b border-white/10">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-semibold text-white/80 uppercase tracking-wider">
                {t('table.node')}
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-white/80 uppercase tracking-wider">
                {t('table.nodeCost')}
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-white/80 uppercase tracking-wider">
                {t('table.nodeEarnings')}
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-white/80 uppercase tracking-wider">
                {t('table.nodeId')}
              </th>
              <th className="px-6 py-4 w-10" aria-hidden />
            </tr>
          </thead>
          <tbody className="divide-y divide-white/10">
            {nodeHoldings.map((node, index) => {
              const active = node.status === 1;
              const expanded = expandedIds.has(node.id);
              return (
                <React.Fragment key={node.id}>
                  <motion.tr
                    className={`transition-colors duration-200 ${active ? 'hover:bg-white/5 cursor-pointer' : ''}`}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    onClick={() => active && toggleExpanded(node.id)}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3 flex-wrap">
                        <span
                          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-linear-to-r ${getNodeTypeBadge(node.nodeType)} text-white`}
                        >
                          {getNodeTypeName(node.nodeType)}
                        </span>
                        {!active && (
                          <span className="text-xs text-white/50 font-medium">{t('card.pendingActivation')}</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-white tabular-nums">
                        {fmt2(node.purchaseCost.usdt)} {t('currency.usdt')}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-bold text-white tabular-nums">
                        {fmt2(node.accumulatedEarnings)} {t('currency.usdt')}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-white tabular-nums break-all">
                        {node.id}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-white/50">
                      {active ? (
                        <span className="text-lg leading-none" aria-hidden>
                          {expanded ? '▾' : '▸'}
                        </span>
                      ) : null}
                    </td>
                  </motion.tr>
                  {active && expanded && (
                    <tr className="bg-white/3">
                      <td colSpan={5} className="px-6 py-4">
                        {renderExpandedBody(node)}
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile */}
      <div className="md:hidden divide-y divide-white/10">
        {nodeHoldings.map((node, index) => {
          const active = node.status === 1;
          const expanded = expandedIds.has(node.id);
          return (
            <motion.div
              key={node.id}
              className="p-4 space-y-3"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <button
                type="button"
                className={`w-full text-left ${active ? '' : 'cursor-default'}`}
                onClick={() => active && toggleExpanded(node.id)}
                disabled={!active}
              >
                <div className="flex items-center justify-between gap-2">
                  <span
                    className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-linear-to-r ${getNodeTypeBadge(node.nodeType)} text-white`}
                  >
                    {getNodeTypeName(node.nodeType)}
                  </span>
                  <div className="flex items-center gap-2 shrink-0">
                    {!active && (
                      <span className="text-xs text-white/50 font-medium">{t('card.pendingActivation')}</span>
                    )}
                    {active && (
                      <span className="text-white/50 text-lg leading-none" aria-hidden>
                        {expanded ? '▾' : '▸'}
                      </span>
                    )}
                  </div>
                </div>
                <div className="text-sm mt-3 space-y-2">
                  <div>
                    <div className="text-white/60 text-xs mb-1">{t('card.nodeCost')}</div>
                    <div className="text-white font-medium tabular-nums">
                      {fmt2(node.purchaseCost.usdt)} {t('currency.usdt')}
                    </div>
                  </div>
                  <div>
                    <div className="text-white/60 text-xs mb-1">{t('card.nodeEarnings')}</div>
                    <div className="text-white font-bold tabular-nums">
                      {fmt2(node.accumulatedEarnings)} {t('currency.usdt')}
                    </div>
                  </div>
                  {renderNodeIdBlock(node.id)}
                </div>
              </button>
              {active && expanded && renderExpandedBody(node)}
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
};

export default NodeHoldingsTable;
