import { create } from "zustand";
import type { StoreTypes } from "./types"
import { CategoryData } from "@/service/project";

const useGlobalStore = create<StoreTypes>((set) => ({
  categories: [],
  setCategories: (state: CategoryData[]) =>
    set({ categories: [...state] }),

}));

export default useGlobalStore;
