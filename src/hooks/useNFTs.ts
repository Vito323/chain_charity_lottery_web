// mock 
'use client';
import { useState, useEffect, useCallback } from 'react';
import { NFT } from '../app/[locale]/user/nft-list';

interface UseNFTsOptions {
  pageSize?: number;
  initialPage?: number;
}

interface UseNFTsReturn {
  nfts: NFT[];
  loading: boolean;
  hasMore: boolean;
  error: string | null;
  loadMore: () => void;
  refresh: () => void;
}


const generateMockNFTs = (page: number, pageSize: number): NFT[] => {
  const startId = (page - 1) * pageSize + 1;
  
  // Common NFT collections and their properties
  const collections = [
    { name: 'Bored Ape Yacht Club', symbol: 'BAYC', hasPrice: true },
    { name: 'CryptoPunks', symbol: 'PUNK', hasPrice: true },
    { name: 'Azuki', symbol: 'AZUKI', hasPrice: true },
    { name: 'Doodles', symbol: 'DOODLE', hasPrice: false },
    { name: 'CloneX', symbol: 'CLONEX', hasPrice: true },
    { name: 'Moonbirds', symbol: 'MOONBIRD', hasPrice: false },
    { name: 'World of Women', symbol: 'WOW', hasPrice: true },
    { name: 'Cool Cats', symbol: 'COOL', hasPrice: false },
  ];
  
  const descriptions = [
    'A unique digital collectible from the blockchain.',
    'This NFT represents ownership of a digital asset.',
    'Part of an exclusive collection with rare attributes.',
    'A one-of-a-kind digital artwork with unique properties.',
    'This token grants access to exclusive community benefits.',
  ];
  
  return Array.from({ length: pageSize }, (_, index) => {
    const collection = collections[Math.floor(Math.random() * collections.length)];
    const hasPrice = Math.random() > 0.3 && collection.hasPrice; // 70% chance of having price
    const hasDescription = Math.random() > 0.2; // 80% chance of having description
    
    return {
      id: `${collection.symbol.toLowerCase()}-${startId + index}`,
      name: `${collection.name} #${startId + index}`,
      description: hasDescription ? descriptions[Math.floor(Math.random() * descriptions.length)] : undefined,
      image: `https://picsum.photos/400/400?random=${startId + index}`,
      price: hasPrice ? (Math.random() * 50 + 0.1).toFixed(2) : undefined,
      owner: `0x${Math.random().toString(16).substr(2, 40)}`,
      tokenId: (startId + index).toString(),
      contractAddress: `0x${Math.random().toString(16).substr(2, 40)}`
    };
  });
};


const fetchNFTs = async (page: number, pageSize: number): Promise<NFT[]> => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Simulate random failure
  if (Math.random() < 0.1) {
    throw new Error('Network error, please try again later');
  }
  
  return generateMockNFTs(page, pageSize);
};

export const useNFTs = (options: UseNFTsOptions = {}): UseNFTsReturn => {
  const { pageSize = 12, initialPage = 1 } = options;
  
  const [nfts, setNfts] = useState<NFT[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(initialPage);

  const loadNFTs = useCallback(async (page: number, append: boolean = false) => {
    try {
      setLoading(true);
      setError(null);
      
      const newNFTs = await fetchNFTs(page, pageSize);
      if (append) {
        setNfts(prev => [...prev, ...newNFTs]);
      } else {
        setNfts(newNFTs);
      }
      
      // Simulate no more data scenario (after page 5)
      setHasMore(page < 5);
      setCurrentPage(page);
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Load failed');
    } finally {
      setLoading(false);
    }
  }, [pageSize]);

  const loadMore = useCallback(() => {
    if (!loading && hasMore) {
      loadNFTs(currentPage + 1, true);
    }
  }, [loading, hasMore, currentPage, loadNFTs]);

  const refresh = useCallback(() => {
    setNfts([]);
    setCurrentPage(initialPage);
    setHasMore(true);
    setError(null);
    loadNFTs(initialPage, false);
  }, [initialPage, loadNFTs]);

  // Initial load
  useEffect(() => {
    loadNFTs(initialPage, false);
  }, [loadNFTs, initialPage]);

  return {
    nfts,
    loading,
    hasMore,
    error,
    loadMore,
    refresh
  };
};
