import { action } from "./provider";



export interface UserToken {
  balance: string;
  symbol: string;
  decimals: number;
}


export interface UserNode {
id: string;
level: number;
earnings: string; // 昨日收益
name: string;
rank: string; // 0/1/2分别对应创世/超级/普通
description: string;
status: number;
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