import { CategoryData } from "@/service/project";

export interface StoreTypes {
  categories:  CategoryData[];
  setCategories: (state: CategoryData[]) => void;
}

