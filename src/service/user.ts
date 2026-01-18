import { action } from "./provider";



export interface UserToken {
  balance: string;
  symbol: string;
  decimals: number;
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