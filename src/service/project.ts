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
}


export interface ProjectDetailData extends ProjectData {
  content: string;
  tracks: TracksData[];
}

export interface TracksData {
  createdAt: string;
  description: string;
  name: string;
  projectId: string;
  updatedAt: string;
}


export const queryCategories = async () =>
  action({
    url: `/categories`,
    method: "GET",
  });


  export const queryProjects = async (categoryId: string) =>
    action({
      url: `/project/${categoryId}`,
      method: "GET",
    });


    export const projectDetail = async (id: string) =>
      action({
        url: `/project/view/${id}`,
        method: "GET",
      });