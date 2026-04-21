import { action } from "./provider";



export interface UserToken {
  balance: string;
  symbol: string;
  decimals: number;
}


/** 节点元信息（与用户节点接口嵌套 `node` 对齐） */
export interface UserNodeMeta {
  name?: string;
  rank?: string;
  description?: string;
  stake?: string | number;
  supply?: number;
  price?: string | number;
  reward?: string | number;
  createdAt?: string | null;
}

export interface UserNode {
  id: string;
  level?: number;
  /** 节点收益（与 App 列表一致） */
  earnings?: string | number;
  staked?: string | number;
  /** 质押时间（秒） */
  timestamp?: number;
  status?: number;
  txHash?: string | null;
  createdAt?: string | null;
  updatedAt?: string | null;
  node?: UserNodeMeta;
  /** 兼容旧接口：顶层 rank / 文案 */
  name?: string;
  rank?: string;
  description?: string;
}


export interface UserProfile {
  referrer?: string;
  node?: UserNode[]
}




export interface UserReferrerPending {
  timestamp: number,
  nonce: string,
  address: string,
  referrer: string,
  message: string,
}


export interface UserDonationRecord {
  projectId: string;
  amount: string;
  token: string;
  timestamp: string;
  txHash: string;
}


export interface UserLotteryRecord {
  id: number;
  lotteryDrawId: number;
  lotteryDraw: {
    id: number;
    dna: string;
    threshold: string;
    total: string;
    winnerCount: number;
    createdAt: string;
  };
  ticket: {
    id: number;
    dna: string;
    colors: string;
    numbers: string;
    series: {
      rank: number;
    }
  };
  score: number;
  reward: string;
}

export const userConnect = async (address: string) =>
  action<boolean>({
    url: `/user/connect/${address}`,
    method: 'GET',
  });


  export const userNodes = async (address: string) =>
    action<UserNode[]>({
      url: `/user/node/${address}`,
      method: 'GET',
    });



export const userToken = async (address: string, token: string) =>
  action<UserToken>({
    url: `/user/token/${address}`,
    method: 'GET',
    params: {
      token,
    },
  });



export const queryUserReferrer = async (address: string) =>
  action<string>({
    url: `/user/referrer/${address}`,
    method: 'GET',
  });


export const bindUserReferrer = async (data: {
  nonce: string;
  address: string;
  referrer: string;
  signature: string;
  timestamp: number;
}) =>
  action<void>({
    url: `/user/bind-referrer`,
    method: 'PUT',
    data,
  });


export const bindUserReferrerPending = async (address: string, referrer: string) =>
  action<UserReferrerPending>({
    url: `/user/bind-referrer-pending`,
    method: 'POST',
    data: {
      address,
      referrer,
    },
  });


  export const queryUserDonationRecord = async (address: string) =>
    action<UserDonationRecord[]>({
      url: `/user/donation/${address}`,
      method: 'GET',
    });


    export const queryUserLotteryRecord = async (address: string, page?: number, pageSize?: number) =>
      action<{
        records: UserLotteryRecord[];
        count: number;
        page: number;
      }>({
        url: `/user/lottery-record/${address}`,
        method: 'GET',
        params: {
          page,
          pageSize,
        },
      });