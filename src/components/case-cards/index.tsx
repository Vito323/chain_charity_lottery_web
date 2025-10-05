"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import dayjs from "dayjs";
import relativeTime from 'dayjs/plugin/relativeTime'
import { useRouter } from "next/navigation";
import "./style.css";
import { ProjectData } from "@/service/project";
import { ProjectFundStats, useFundPoolManager } from "@/hooks/useFundPoolManager";
import logger from "@/utils/logger";
dayjs.extend(relativeTime)
interface FundraisingCardProps extends ProjectData {
  raised?: string;
  contributors?: number;
}

const FundraisingCard: React.FC<FundraisingCardProps> = ({
  name,
  createdAt,
  description,
  image,
  raised,
  contributors,
  id
}) => {
  const router = useRouter();
  const {getProjectFundStats} = useFundPoolManager();
  const handleCardClick = () => {
    router.push(`/case-single/${id}`);
  };

  const [currentProjectFundStats, setCurrentProjectFundStats] = React.useState<ProjectFundStats | null>(null);

  const handleButtonClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };


  const queryProjectFundStats = async () => {
    try {
      const res = await getProjectFundStats(id);
      setCurrentProjectFundStats(res);
    } catch (error) {
      console.log(error);
    }
  };

  React.useEffect(() => {
    queryProjectFundStats();
  }, []);

  console.log(currentProjectFundStats);


  return (
    <div className="fundraising-card" onClick={handleCardClick}>
      <div className="card-image-container">
        <Image
          src={image[0]}
          alt={name}
          className="card-image"
          width={400}
          height={250}
          unoptimized
          style={{ objectFit: "cover" }}
        />
        <div className="card-overlay-icons">
          <div className="overlay-icon">
            <i className="fa fa-rocket"></i>
          </div>
          <div className="overlay-icon">
            <i className="fa fa-share-alt"></i>
          </div>
        </div>
      </div>

      <div className="card-content">
        <div className="card-update-time">
          <span className="update-label">Last Updated: {dayjs(createdAt).fromNow()}</span>
        </div>

        <h3 className="card-title">{name}</h3>

        <div className="card-organizer">
          <span className="organizer-name">ChainCharity</span>
        </div>

        <p className="card-description">{description}</p>

        <div className="card-funding-info">
          <div className="funding-label">
            <span>Total amount raised</span>
          </div>
          <div className="funding-details">
            <div className="contributors-info">
              Raised from <strong>{contributors || 0}</strong> contributors
            </div>
            <div className="raised-amount">{raised || '$0'}</div>
          </div>
        </div>

        <div className="card-verification">
          <i className="fa fa-check-circle verification-icon"></i>
          <span className="verification-text">Verified</span>
        </div>

        <div className="card-actions">
          <Link
            href={`/donate/${id}/${name}`}
            className="donate-btn"
            onClick={handleButtonClick}
          >
            Donate
          </Link>
        </div>
      </div>
    </div>
  );
};

export { FundraisingCard };
