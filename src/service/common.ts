import { action } from "./provider";

export const currencyInfo = async () =>
  action<{
    address: string;
    symbol: string;
    value: number;
  }>({
    url: '/common/currency',
    method: "GET",
  });


