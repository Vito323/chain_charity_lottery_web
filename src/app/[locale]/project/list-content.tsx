'use client';
import { FundraisingCard } from "@/components/case-cards";
import { TabPanel } from "@/components/tab";
import { ProjectData, queryProjects } from "@/service/project";
import React from "react";

interface ListContentProps {
  activeTab: number;
  index: number;
  categoryId: string;
}

const ListContent = ({activeTab, index, categoryId}: ListContentProps) => {
  const [loading, setLoading] = React.useState(false);
  const [list, setList] = React.useState<ProjectData[]>([]);
  React.useEffect(() => {
    getList();
  }, []);

  const getList = async() => { 
    setLoading(true);
    try{
    const response = await queryProjects(categoryId);
    if(response){
      setList(response as unknown as ProjectData[]);
    }
    }catch(error){
      console.error(error);
    }finally{
      setLoading(false);
    }
  }


  return (
    <TabPanel loading={loading}  active={activeTab === index}>
      <div className="row">
      {list.map((card, index) => (
        <div key={index} className="col-lg-4 col-md-6 col-12 mb-5">
          <FundraisingCard  {...card}/>
        </div>
      ))}
    </div>
  </TabPanel>
  )
}


export default ListContent;