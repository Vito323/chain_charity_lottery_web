import React from "react";
import "./style.css";
import { TracksData } from "@/service/project";
import dayjs from "dayjs";

const TabUpdates = ({ datas = [] }: { datas?: TracksData[] }) => {
  return (
    <div className="row">
      <div className="col-12">
        <div className="wpo-case-content">
          <div className="updates-container">
            {datas.map((update, index) => (
              <div key={index} className="update-item">
                <div className="update-date">
                  <div className="date-day">
                    {dayjs(update.createdAt).format("DD")}
                  </div>
                  <div className="date-month">
                    {dayjs(update.createdAt).format("MMM")}
                  </div>
                  <div className="date-year">
                    {dayjs(update.createdAt).format("YYYY")}
                  </div>
                  <div className="date-line"></div>
                </div>
                <div className="update-content">
                  <h2 className="update-title">{update.name}</h2>
                  <p className="update-paragraph">{update.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TabUpdates;
