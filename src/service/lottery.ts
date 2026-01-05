import { action } from "./provider";


export interface LotterySeries {
  id: number;
  seriesName: string;
  title: string;
  description: string;
  cooperation: string;
  template: string;
  rank: number;
  rate: number;
  highest: number;
  price: number;
  priority: number;
  status: number;
  createdAt: string;
  updatedAt: string;
  src: string;
}

export interface LotteryConfig {
  nextDrawTime: number;
  nextDrawTimestring: string;
  total: string;
}


export interface PreMintInfo {
  dna: string;
  uri: string;
  amount: string;
  nonce: number;
  timestamp: number;
  signature: string;
}

export const getLotteryConfig = () => action<LotteryConfig>({
  url: `/lottery`,
  method: "GET",
});


export const getLotteryTickets = () => action<LotterySeries[]>({
  url: `/lottery/series`,
  method: "GET",
});


export const preMintLotteryTicket = (seriesId: number, to: string) => action<PreMintInfo>({
  url: `/lottery/pre-mint`,
  method: "POST",
  data: {
    seriesId,
    to,
  },
});