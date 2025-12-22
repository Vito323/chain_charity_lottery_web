'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAccount } from 'wagmi';
import { defaultNodeHoldings } from './constants';
import { NodeHolding } from './types';
import SectionHeader from './SectionHeader';
import ConnectWalletPrompt from './ConnectWalletPrompt';
import SummaryCards from './SummaryCards';
import LoadingErrorState from './LoadingErrorState';
import NodeHoldingsTable from './NodeHoldingsTable';
import EmptyState from './EmptyState';

const MyNodesList: React.FC = () => {
  const { isConnected } = useAccount();
  const [nodeHoldings] = useState<NodeHolding[]>(defaultNodeHoldings);
  const [isLoading] = useState(false);
  const [error] = useState<string | null>(null);

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
        {/* Section Header */}
        <SectionHeader variants={itemVariants} />

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

