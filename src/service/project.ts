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
  txHash: string;
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

//   {
//     "projectId": "5ee81d4e-00c3-46e9-8d99-ca2ddfd60f7a",
//     "address": "0x22C7e194DaC75b0532FfBA5b66f8D23D5044D99A",
//     "amount": "10.00",
//     "txHash": "0x4abbbf9bf8ca72b431e2d622ae81e13383d9b6c66d66a1557342fe10184ade80"
// }

  export const projectDonateCompleted = async (projectId: string, address: string, amount: string, txHash: string) =>
    action<void>({
      url: `/project/donate-completed`,
      method: "POST",
      data: {
        projectId,
        address,
        amount,
        txHash,
      },
    });


