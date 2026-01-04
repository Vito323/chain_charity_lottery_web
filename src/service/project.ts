import { action } from "./provider";


export interface CategoryData {
  id: string;
  name: string;
}


export interface ProjectData {
  id: string;
  name: string;
  description: string;
  image: string[];
  createdAt: string;
  donationCount: number;
  totalDonated: number;
}


export interface ProjectDetailData extends ProjectData {
  content: string;
  categoryId: string;
  ownerId: string;
  beneficiary: string;
  status: number;
  updatedAt: string;
  tracks: TracksData[];
  donors: DonorData[];
  goal: number;
}

export interface DonorData {
  address: string;
  available: string;
  createdAt: string;
  hash: string;
  timestamp: number;
  token: string;
  total: string;
}

export interface TracksData {
  createdAt: string;
  description: string;
  name: string;
  projectId: string;
  updatedAt: string;
}

export interface ProjectProportionData {
  surpassedCount: number;
  totalDonors: number;
  userRank: number;
}


export const queryCategories = async () =>
  action<CategoryData[]>({
    url: `/category`,
    method: "GET",
  });


  export const queryProjects = async (categoryId: string) =>
    action<ProjectData[]>({
      url: `/project/${categoryId}`,
      method: "GET",
    });


    export const projectDetail = async (id: string) =>
      action<ProjectDetailData>({
        url: `/project/view/${id}`,
        method: "GET",
      });


export const queryProjectProportion = async (id: string, amount: string) =>
  action<ProjectProportionData>({
    url: `/project/calculate-donation-proportion/${id}`,
    method: "GET",
    params: {
      amount,
    },
  });