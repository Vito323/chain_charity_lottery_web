import { create } from "zustand";
import type { StoreTypes } from "./types";
import { CategoryData } from "@/service/project";
import { Config } from "@/service/common";

const useGlobalStore = create<StoreTypes>((set) => ({
  categories: [],
  setCategories: (state: CategoryData[]) => set({ categories: [...state] }),
  config: null,
  setConfig: (state: Config) => set({ config: { ...state } }),
  withdrawAmount: '',
  setWithdrawAmount: (state: string) => set({ withdrawAmount: state }),
}));

export default useGlobalStore;
