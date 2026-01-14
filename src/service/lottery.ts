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
  nextDrawTimeString: string;
  nextDrawLotteryTotal: string;
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
  threshold: string;
  total: string;
  winnerCount: number;
  createdAt: string;
  drawLotteryTxHash: string;
  batchUpdateUserWithdrawableAmountTxHash: string;
  isWinner: boolean;
}

export interface LotteryHistoryTicket {
  id: number;
  ticket: {
    id: number;
    dna: string;
    ownerId: string;
    colors: string;
    numbers: string;
    series: {
      rank: number;
    }
  };
  reward: string;
  score: number;
}

export interface LotteryHistoryDetail extends LotteryHistory {
  lotteryDrawTickets: LotteryHistoryTicket[];
}

export const getLotteryConfig = () =>
  action<LotteryConfig>({
    url: `/lottery`,
    method: "GET",
  });

export const getLotteryTickets = () =>
  action<LotterySeries[]>({
    url: `/lottery/series`,
    method: "GET",
  });

export const mintPending = (seriesId: number, to: string) =>
  action<mintPending>({
    url: `/lottery/mint-pending`,
    method: "POST",
    data: {
      seriesId,
      to,
    },
  });

export const mintLotteryTicket = (dna: string, txHash: string) =>
  action<void>({
    url: `/lottery/mint`,
    method: "POST",
    data: {
      dna,
      txHash,
    },
  });

export const getLotteryHistory = (address: string, page: number, pageSize: number) =>
  action<LotteryHistory[]>({
    url: `/lottery/history/${address}`,
    method: "GET",
    params: {
      page,
      pageSize,
    },
  });


  export const queryWithdrawableAmount = (address: string) =>
    action<string>({
      url: `/lottery/drawable-amount/${address}`,
      method: "GET",
    });

    export const queryDrawHistoryDetail = (drawId: number) =>
    action<LotteryHistoryDetail>({
      url: `/lottery/history/detail/${drawId}`,
      method: "GET",
    });