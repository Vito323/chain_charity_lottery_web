'use client';
import React, { useState, useEffect, useCallback, useRef } from 'react';
import NFTCard from '../../../../components/nft-card';
import EmptyState from '../empty-state';
import './style.scss';

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
        action={
          <button className="btn btn-primary">
            Browse NFT Market
          </button>
        }
        className={className}
      />
    );
  }

  return (
    <div className={`nft-list ${className}`}>
      <div className="nft-list__grid">
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
        <div ref={loadMoreRef} className="nft-list__load-more-trigger">
          {loading && (
            <div className="nft-list__loading">
              <div className="nft-list__spinner"></div>
              <span>Loading...</span>
            </div>
          )}
        </div>
      )}

      {/* No more data notification */}
      {!hasMore && nfts.length > 0 && (
        <div className="nft-list__no-more">
          <span>All NFTs loaded</span>
        </div>
      )}
    </div>
  );
};

export default NFTList;
