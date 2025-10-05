import { action } from "./provider";




export interface LotteryConfig {
  nextDrawTime: number;
  nextDrawTimestring: string;
  total: string;
}


export const getLotteryConfig = () => action<LotteryConfig>({
  url: `/lottery`,
  method: "GET",
});