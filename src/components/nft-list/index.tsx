'use client';
import React, { useState, useEffect, useCallback, useRef } from 'react';
import NFTCard from '../nft-card';
import EmptyState from '../empty-state';

export interface NFT {
  id: string;
  name: string;
  description?: string;
  image: string;
  price?: string;
  owner?: string;
  tokenId?: string;
  contractAddress?: string;
  collectionName?: string;
  collectionSymbol?: string;
  tokenType?: string;
  metadata?: Record<string, unknown>;
}

interface NFTListProps {
  nfts: NFT[];
  loading?: boolean;
  hasMore?: boolean;
  onLoadMore?: () => void;
  onNFTClick?: (nft: NFT) => void;
  className?: string;
}

const NFTList: React.FC<NFTListProps> = ({
  nfts,
  loading = false,
  hasMore = false,
  onLoadMore,
  onNFTClick,
  className = ""
}) => {
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  // Infinite scroll logic
  const handleObserver = useCallback((entries: IntersectionObserverEntry[]) => {
    const target = entries[0];
    if (target.isIntersecting && hasMore && !loading && !isLoadingMore && onLoadMore) {
      setIsLoadingMore(true);
      onLoadMore();
    }
  }, [hasMore, loading, isLoadingMore, onLoadMore]);

  useEffect(() => {
    if (loadMoreRef.current) {
      observerRef.current = new IntersectionObserver(handleObserver, {
        threshold: 0.1,
        rootMargin: '100px'
      });
      observerRef.current.observe(loadMoreRef.current);
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [handleObserver]);

  useEffect(() => {
    if (!loading) {
      setIsLoadingMore(false);
    }
  }, [loading]);

  // Show empty state if no NFT data
  if (!loading && nfts.length === 0) {
    return (
      <EmptyState
        title="No NFT Collection"
        description="You don't have any NFT collections yet. Start exploring the digital art world!"
        icon={
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
          </svg>
        }
        // action={
        //   <button className="btn btn-primary">
        //     Browse NFT Market
        //   </button>
        // }
        className={className}
      />
    );
  }

  return (
    <div className={`w-full ${className}`}>
      <div className="grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] xl:grid-cols-[repeat(auto-fill,minmax(260px,1fr))] md:grid-cols-[repeat(auto-fill,minmax(240px,1fr))] sm:grid-cols-[repeat(auto-fill,minmax(200px,1fr))] max-[360px]:grid-cols-1 gap-6 xl:gap-5 md:gap-4 sm:gap-3 mb-8 md:mb-6 sm:mb-5">
        {nfts.map((nft) => (
          <NFTCard
            key={nft.id}
            {...nft}
            onClick={onNFTClick}
          />
        ))}
      </div>

      {/* Load more trigger */}
      {hasMore && (
        <div ref={loadMoreRef} className="flex justify-center items-center min-h-[60px] my-5">
          {loading && (
            <div className="flex items-center gap-3 text-gray-600 dark:text-gray-400 text-sm">
              <div className="w-5 h-5 border-2 border-gray-200 dark:border-gray-700 border-t-blue-500 rounded-full animate-spin"></div>
              <span>Loading...</span>
            </div>
          )}
        </div>
      )}

      {/* No more data notification */}
      {!hasMore && nfts.length > 0 && (
        <div className="text-center text-gray-500 dark:text-gray-500 text-sm py-5 border-t border-gray-200 dark:border-gray-700 mt-5">
          <span>All NFTs loaded</span>
        </div>
      )}
    </div>
  );
};

export default NFTList;

