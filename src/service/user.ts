import { action } from "./provider";



export interface UserToken {
  balance: string;
  symbol: string;
  decimals: number;
}




export interface UserReferrerPending {
  timestamp: number,
  nonce: string,
  address: string,
  referrer: string,
  message: string,
}

export const userConnect = async (address: string) =>
  action<boolean>({
    url: `/user/connect/${address}`,
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


export const bindUserReferrer = async (address: string, referrer: string, signature: string) =>
  action<void>({
    url: `/user/bind-referrer`,
    method: 'PUT',
    data: {
      address,
      referrer,
      signature,
    },
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