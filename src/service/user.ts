import { action } from "./provider";


export const userConnect = async (address: string) =>
  action<boolean>({
    url: `/user/connect/${address}`,
    method: "GET",
  });

