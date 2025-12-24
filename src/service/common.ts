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
export interface Config {
  address: string;
  email: string;
  contact: string;
}

export const projectConfig = async () =>
  action<Config>({
    url: '/common/config',
    method: "GET",
  });