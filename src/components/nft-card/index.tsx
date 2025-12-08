'use client';
import React from 'react';
import Image from 'next/image';

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
    <div 
      className="bg-white dark:bg-gray-800 rounded-xl shadow-md dark:shadow-gray-900/50 overflow-hidden transition-all duration-300 cursor-pointer relative min-h-[320px] md:min-h-[280px] sm:min-h-[260px] flex flex-col hover:-translate-y-1 hover:shadow-lg dark:hover:shadow-gray-900/70" 
      onClick={handleClick}
    >
      <div className="relative w-full h-[200px] md:h-[160px] sm:h-[140px] overflow-hidden">
        <Image 
          src={image} 
          alt={name}
          width={400}
          height={200}
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = '/images/placeholder-all.png';
          }}
        />
        {price && (
          <div className="absolute top-3 right-3 bg-black/80 text-white px-2 py-1 rounded-md text-xs font-semibold">
            {price} ETH
          </div>
        )}
      </div>
      
      <div className="p-4 md:p-3 sm:p-2.5 flex-1 flex flex-col">
        {collectionName && (
          <div className="text-xs text-gray-500 dark:text-gray-400 font-medium mb-1 uppercase tracking-wider">
            {collectionName}
          </div>
        )}
        
        <h3 className="text-base md:text-sm sm:text-[13px] font-semibold text-gray-800 dark:text-gray-200 m-0 mb-2 leading-snug line-clamp-2">{name}</h3>
        
        {description && (
          <p className="text-sm sm:text-xs text-gray-600 dark:text-gray-400 m-0 mb-3 leading-relaxed line-clamp-2 flex-1">
            {description}
          </p>
        )}
        
        <div className="mt-auto">
          {tokenId && (
            <div className="flex justify-between items-center mb-1 text-xs last:mb-0">
              <span className="text-gray-500 dark:text-gray-400 font-medium">Token ID:</span>
              <span className="text-gray-800 dark:text-gray-200 font-semibold">{tokenId}</span>
            </div>
          )}
          
          {owner && (
            <div className="flex justify-between items-center mb-1 text-xs last:mb-0">
              <span className="text-gray-500 dark:text-gray-400 font-medium">Owner:</span>
              <span className="text-gray-800 dark:text-gray-200 font-semibold font-mono bg-gray-100 dark:bg-gray-700 px-1.5 py-0.5 rounded">
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
