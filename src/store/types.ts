import { Config } from "@/service/common";
import { CategoryData } from "@/service/project";

export interface StoreTypes {
  categories:  CategoryData[];
  setCategories: (state: CategoryData[]) => void;
  config: Config | null;
  setConfig: (state: Config) => void;
}

