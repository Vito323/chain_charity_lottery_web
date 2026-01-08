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


export interface mintPending {
  dna: string;
  uri: string;
  amount: string;
  nonce: number;
  deadline: number;
  signature: string;
}

export interface LotteryHistory {
  id: number;
  dna: string;
  numbers: string;
  colors: string;
  total: number;
  createdAt: string;
  lotteryDrawTickets: LotterySeries[];
}

export const getLotteryConfig = () => action<LotteryConfig>({
  url: `/lottery`,
  method: "GET",
});


export const getLotteryTickets = () => action<LotterySeries[]>({
  url: `/lottery/series`,
  method: "GET",
});


export const mintPending = (seriesId: number, to: string) => action<mintPending>({
  url: `/lottery/mint-pending`,
  method: "POST",
  data: {
    seriesId,
    to,
  },
});


export const mintLotteryTicket = (dna: string, txHash: string) => action<void>({
  url: `/lottery/mint`,
  method: "POST",
  data: {
    dna,
    txHash,
  },
});


export const getLotteryHistory = () => action<LotteryHistory[]>({
  url: `/lottery/history`,
  method: "GET",
});
