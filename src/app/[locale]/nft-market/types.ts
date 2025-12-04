export type RarityType = 'common' | 'rare' | 'epic' | 'legendary' | 'mythic';

export interface LotteryTicket {
  id: string;
  image: string;
  rarity: RarityType;
  rarityLabel: string;
  // New lottery fields
  basicWinRate?: string;
  maxPrize?: string;
  // Market fields
  salePrice?: string;
  // Common fields
  redemptionCost: string;
  currency: string;
}

