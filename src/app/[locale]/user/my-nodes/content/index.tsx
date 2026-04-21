'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useAccount } from 'wagmi';
import { NodeHolding } from './types';
import ConnectWalletPrompt from './ConnectWalletPrompt';
import SummaryCards from './SummaryCards';
import LoadingErrorState from './LoadingErrorState';
import NodeHoldingsTable from './NodeHoldingsTable';
import EmptyState from './EmptyState';
import { userNodes } from '@/service/user';
import { queryNodeList } from '@/service/node';
import { useTranslations } from 'next-intl';

const MyNodesList: React.FC = () => {
  const { isConnected, address } = useAccount();
  const tCommon = useTranslations('common');

  const [nodeHoldings, setNodeHoldings] = useState<NodeHolding[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: 'easeOut' as const,
      },
    },
  };

  const buildNodeHoldings = useCallback(
    async (walletAddress: string): Promise<NodeHolding[]> => {
      const [userNodesRes, nodeListRes] = await Promise.all([
        userNodes(walletAddress),
        queryNodeList(),
      ]);

      const userNodeList = userNodesRes.ok && userNodesRes.data ? userNodesRes.data : [];
      const nodeList = nodeListRes.ok && nodeListRes.data ? nodeListRes.data : [];

      const priceByRank = new Map<string, number>();
      nodeList.forEach((n) => {
        priceByRank.set(String(n.rank), Number(n.price) || 0);
      });

      const rankToNodeType = (rank: string): NodeHolding['nodeType'] => {
        switch (String(rank)) {
          case '0':
            return 'genesis';
          case '1':
            return 'super';
          case '2':
          default:
            return 'standard';
        }
      };

      const parseNum = (v: unknown): number => {
        if (v == null) return 0;
        if (typeof v === 'number' && !Number.isNaN(v)) return v;
        const x = parseFloat(String(v));
        return Number.isFinite(x) ? x : 0;
      };

      return userNodeList.map((n) => {
        const rank = String(n.node?.rank ?? n.rank ?? '2');
        const metaPrice = parseNum(n.node?.price);
        const fallbackPrice = priceByRank.get(rank) ?? 0;
        const purchaseUsd = metaPrice > 0 ? metaPrice : fallbackPrice;
        const status =
          typeof n.status === 'number' && !Number.isNaN(n.status)
            ? n.status
            : parseInt(String(n.status ?? 0), 10) || 0;
        const timestampSec =
          typeof n.timestamp === 'number' && !Number.isNaN(n.timestamp)
            ? n.timestamp
            : parseInt(String(n.timestamp ?? 0), 10) || 0;

        return {
          id: String(n.id),
          nodeType: rankToNodeType(rank),
          status,
          purchaseCost: {
            usdt: purchaseUsd,
          },
          accumulatedEarnings: parseNum(n.earnings),
          timestampSec,
          stake: parseNum(n.node?.stake),
          reward: parseNum(n.node?.reward),
        };
      });
    },
    []
  );

  const fetchHoldings = useCallback(async () => {
    if (!address) return;
    setIsLoading(true);
    setError(null);
    try {
      const holdings = await buildNodeHoldings(address);
      setNodeHoldings(holdings);
    } catch (e) {
      console.error('Failed to fetch node holdings:', e);
      setError(tCommon('errors.failedToLoad'));
      setNodeHoldings([]);
    } finally {
      setIsLoading(false);
    }
  }, [address, buildNodeHoldings, tCommon]);

  useEffect(() => {
    if (isConnected && address) {
      fetchHoldings();
    } else {
      setNodeHoldings([]);
      setError(null);
      setIsLoading(false);
    }
  }, [isConnected, address, fetchHoldings]);

  // Show content based on connection status and data
  // Ensure isConnected is explicitly boolean to avoid undefined issues
  const connected = Boolean(isConnected);
  const hasNodes = nodeHoldings.length > 0;

  return (
    <section className="relative py-20 md:py-32">
      <motion.div
        className="relative z-10 max-w-7xl mx-auto px-6 md:px-8"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        transition={{ duration: 0.3 }}
      >
        {/* Loading/Error State - Show first if loading or error */}
        {isLoading || error ? (
          <LoadingErrorState isLoading={isLoading} error={error} />
        ) : (
          <>
            {/* Connect Wallet Prompt - Show when not connected */}
            {!connected && (
              <ConnectWalletPrompt variants={itemVariants} />
            )}

            {/* Connected State - Show when connected */}
            {connected && (
              <>
                {/* Summary Cards */}
                {hasNodes && (
                  <SummaryCards variants={itemVariants} nodeHoldings={nodeHoldings} />
                )}

                {/* Node Holdings Table */}
                {hasNodes && (
                  <NodeHoldingsTable variants={itemVariants} nodeHoldings={nodeHoldings} />
                )}

                {/* Empty State */}
                {!hasNodes && (
                  <EmptyState />
                )}
              </>
            )}
          </>
        )}
      </motion.div>
    </section>
  );
};

export default MyNodesList;

