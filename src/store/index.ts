import { create } from "zustand";
import type { StoreTypes } from "./types";
import { CategoryData } from "@/service/project";
import { Config } from "@/service/common";

const useGlobalStore = create<StoreTypes>((set) => ({
  categories: [],
  setCategories: (state: CategoryData[]) => set({ categories: [...state] }),
  config: null,
  setConfig: (state: Config) => set({ config: { ...state } }),
}));

export default useGlobalStore;
