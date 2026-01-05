import { action } from "./provider";



export const userConnect = async (address: string) =>
  action({
    url: `/user/connect/${address}`,
    method: 'GET',
  });