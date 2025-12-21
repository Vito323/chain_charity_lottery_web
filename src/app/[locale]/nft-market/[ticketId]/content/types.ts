export interface LotteryTicket {
  id: string;
  series: string;
  level: string;
  title: string;
  image: string;
  rarity: string;
  rarityLabel: string;
  rarityPercentage: string;
  maxPrize: string;
  basicWinRate: string;
  redemptionCost: string;
  currency: string;
  salePrice?: string;
  validUntil?: string;
  holderAddress?: string;
  educationPercentage: string;
  educationPartner: string;
  educationDescription: string;
  educationPartnerFull: string;
  dnaId: string;
  dnaAddress: string;
  rareLevel: string;
  opds: string;
  prize: string;
  rights: string;
  date: string;
  icons: string[];
}

export interface PurchaseRecord {
  buyerAddress: string;
  priceUsdt: string;
  priceClt: string;
  time: string;
}

export interface WinningRecord {
  winnerAddress: string;
  prizeUsdt: string;
  time: string;
}

export type DetailTab = 'basic' | 'history';

