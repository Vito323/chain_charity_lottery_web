import { action } from "./provider";



export const queryWhiteTokenList = async () => action<string[]>({
  url: '/contract/token',
})
