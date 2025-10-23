'use client';
import React from 'react';
import NFTList from '@/app/[locale]/user-backup/nft-list';
import { useWalletNFTs } from '@/hooks/useWalletNFTs';
import { NFT } from '@/app/[locale]/user-backup/nft-list';
import { useAccount } from 'wagmi';
import './styles.scss';

const UserContent = () => {
  const { address, isConnected } = useAccount();
  const { nfts, loading, hasMore, error, loadMore, refresh, totalCount } = useWalletNFTs({
    pageSize: 20,
    initialPage: 1
  });

  const handleNFTClick = (nft: NFT) => {
    console.log('NFT clicked:', nft);
    // Add NFT detail page navigation logic here
  };

  const handleRefresh = () => {
    refresh();
  };

  return (
    <div className="wpo-case-area-2 section-padding">
      <div className="container">
        {/* <div className="row">
          <div className="col-12">
            <div className="wpo-section-title">
              <span>User Center</span>
              <h2>NFT</h2>        
            </div>
          </div>
        </div> */}
        
        <div className="row">
          <div className="col-12">
            <div className="nft-section">
              <div className="nft-section__header">
                <div className="nft-section__stats">
                  <span className="nft-section__count">
                    {isConnected ? `Total ${totalCount} NFTs` : 'Connect wallet to view NFTs'}
                  </span>
                  {isConnected && address && (
                    <span className="nft-section__wallet">
                      {address.slice(0, 6)}...{address.slice(-4)}
                    </span>
                  )}
                </div>
                <div className="nft-section__actions">
                  <button 
                    className="nft-refresh-btn"
                    onClick={handleRefresh}
                    disabled={loading}
                  >
                    <svg 
                      className={`nft-refresh-btn__icon ${loading ? 'nft-refresh-btn__icon--spinning' : ''}`}
                      width="16" 
                      height="16" 
                      viewBox="0 0 24 24" 
                      fill="none" 
                      stroke="currentColor" 
                      strokeWidth="2"
                    >
                      <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/>
                      <path d="M21 3v5h-5"/>
                      <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/>
                      <path d="M3 21v-5h5"/>
                    </svg>
                    <span>{loading ? 'Refreshing...' : 'Refresh'}</span>
                  </button>
                </div>
              </div>

              {error && (
                <div className="alert alert-danger" role="alert">
                  <strong>Load failed:</strong>{error}
                  <button 
                    className="btn btn-sm btn-outline-danger ms-2"
                    onClick={handleRefresh}
                  >
                    Retry
                  </button>
                </div>
              )}

              {!isConnected ? (
                <div className="nft-connect-wallet">
                  <div className="nft-connect-wallet__content">
                    <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M21 12V7H5a2 2 0 0 1 0-4h14v4"/>
                      <path d="M3 5v14a2 2 0 0 0 2 2h14v-5"/>
                      <path d="M18 12a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2v-4z"/>
                    </svg>
                    <h3>Connect Your Wallet</h3>
                    <p>Connect your wallet to view your NFT collection</p>
                  </div>
                </div>
              ) : (
                <NFTList
                  nfts={nfts}
                  loading={loading}
                  hasMore={hasMore}
                  onLoadMore={loadMore}
                  onNFTClick={handleNFTClick}
                  className="mt-4"
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserContent;
