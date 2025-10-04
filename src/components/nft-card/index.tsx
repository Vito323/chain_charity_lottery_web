'use client';
import React from 'react';
import Image from 'next/image';
import './style.scss';

interface NFTCardProps {
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
  onClick?: (nft: NFTCardProps) => void;
}

const NFTCard: React.FC<NFTCardProps> = ({
  id,
  name,
  description,
  image,
  price,
  owner,
  tokenId,
  contractAddress,
  collectionName,
  collectionSymbol,
  tokenType,
  metadata,
  onClick
}) => {
  const handleClick = () => {
    if (onClick) {
      onClick({ 
        id, 
        name, 
        description, 
        image, 
        price, 
        owner, 
        tokenId, 
        contractAddress,
        collectionName,
        collectionSymbol,
        tokenType,
        metadata
      });
    }
  };

  return (
    <div className="nft-card" onClick={handleClick}>
      <div className="nft-card__image-container">
        <Image 
          src={image} 
          alt={name}
          width={400}
          height={200}
          className="nft-card__image"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = '/images/placeholder-all.png';
          }}
        />
        {price && (
          <div className="nft-card__price-badge">
            {price} ETH
          </div>
        )}
      </div>
      
      <div className="nft-card__content">
        {collectionName && (
          <div className="nft-card__collection">
            {collectionName}
          </div>
        )}
        
        <h3 className="nft-card__title">{name}</h3>
        
        {description && (
          <p className="nft-card__description">{description}</p>
        )}
        
        <div className="nft-card__details">
          {tokenId && (
            <div className="nft-card__detail">
              <span className="nft-card__label">Token ID:</span>
              <span className="nft-card__value">{tokenId}</span>
            </div>
          )}
          
          {owner && (
            <div className="nft-card__detail">
              <span className="nft-card__label">Owner:</span>
              <span className="nft-card__value nft-card__address">
                {owner.slice(0, 6)}...{owner.slice(-4)}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NFTCard;
