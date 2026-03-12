import { RarityType } from '@/app/[locale]/nft-market/types';

export interface ColorGene {
  index: number;
  name: string;
  value: string;
  rarity: RarityType;
}

/**
 * Rank to rarity mapping
 * rank: 1=common, 2=rare, 3=epic, 4=legendary, 5=mythic
 */
export const rankToRarity = (rank: number): RarityType => {
  switch (rank) {
    case 1:
      return 'common';
    case 2:
      return 'rare';
    case 3:
      return 'epic';
    case 4:
      return 'legendary';
    case 5:
      return 'mythic';
    default:
      return 'common';
  }
};

/**
 * Rarity to rank mapping (reverse of rankToRarity)
 * rarity: common=1, rare=2, epic=3, legendary=4, mythic=5
 */
export const rarityToRank = (rarity: RarityType): number => {
  switch (rarity) {
    case 'common':
      return 1;
    case 'rare':
      return 2;
    case 'epic':
      return 3;
    case 'legendary':
      return 4;
    case 'mythic':
      return 5;
    default:
      return 1;
  }
};

/**
 * Get rarity label from rank (for display)
 * Returns the rarity key that can be used with i18n translations
 */
export const getRarityLabelFromRank = (rank: number): RarityType => {
  return rankToRarity(rank);
};

/**
 * Get rarity percentage from rank
 * Returns the percentage distribution for each rank
 * rank 1: 60%, rank 2: 25%, rank 3: 10%, rank 4: 4.5%, rank 5: 0.5%
 */
export const getRarityPercentageFromRank = (rank: number): number => {
  switch (rank) {
    case 1:
      return 60;
    case 2:
      return 25;
    case 3:
      return 10;
    case 4:
      return 4.5;
    case 5:
      return 0.5;
    default:
      return 60;
  }
};

/**
 * Rarity configuration for UI styling
 * Contains color, gradient, and border color for each rarity type
 */
export const rarityConfig: Record<RarityType, { color: string; textColor: string; bgGradient: string; borderColor: string }> = {
  common: {
    color: 'text-gray-400',
    textColor: '#9ca3af',
    bgGradient: 'from-gray-500/10 to-gray-600/5',
    borderColor: '#95a5a6',
  },
  rare: {
    color: 'text-blue-400',
    textColor: '#60a5fa',
    bgGradient: 'from-blue-500/10 to-blue-600/5',
    borderColor: '#3498db',
  },
  epic: {
    color: 'text-purple-400',
    textColor: '#c084fc',
    bgGradient: 'from-purple-500/10 to-purple-600/5',
    borderColor: '#9b59b6',
  },
  legendary: {
    color: 'text-orange-400',
    textColor: '#fb923c',
    bgGradient: 'from-orange-500/10 to-orange-600/5',
    borderColor: '#e67e22',
  },
  mythic: {
    color: 'text-yellow-400',
    textColor: '#facc15',
    bgGradient: 'from-yellow-500/10 to-yellow-600/5',
    borderColor: '#f1c40f',
  },
};

/**
 * Gold shimmer animation CSS keyframes
 * Used for mythic (rank 5) rarity items to create a golden shimmer effect
 */
export const goldShimmerStyle = `
  @keyframes goldShimmer {
    0% {
      transform: translateX(-100%) skewX(-15deg);
    }
    100% {
      transform: translateX(200%) skewX(-15deg);
    }
  }
`;



export const COLORS: ColorGene[] = [
  { index: 1, name: 'Red', value: '#e74c3c', rarity: 'common' },
  { index: 2, name: 'Blue', value: '#3498db', rarity: 'common' },
  { index: 3, name: 'Green', value: '#27ae60', rarity: 'common' },
  { index: 4, name: 'Orange', value: '#f39c12', rarity: 'common' },
  { index: 5, name: 'Yellow', value: '#f1c40f', rarity: 'common' },
  { index: 6, name: 'Purple', value: '#9b59b6', rarity: 'common' },
  { index: 7, name: 'Copper', value: '#d68910', rarity: 'rare' },
  { index: 8, name: 'Silver', value: '#95a5a6', rarity: 'rare' },
  { index: 9, name: 'Gold', value: '#f1c40f', rarity: 'rare' },
]