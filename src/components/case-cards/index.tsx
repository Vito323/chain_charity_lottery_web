"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { useRouter } from "next/navigation";
import "./style.css";
import { ProjectData } from "@/service/project";
import { formatCurrency } from "@/utils/currency";
dayjs.extend(relativeTime);
interface FundraisingCardProps extends ProjectData {
  raised?: string;
  contributors?: number;
}

export interface ProjectChainInfo {
  id: string;
  owner: string;
  beneficiary: string;
  isActive: boolean;
  version: number;
  createdAt: number;
  totalDonated: number;
  withdrawableAmount: number;
  withdrawnAmount: number;
}

const FundraisingCard: React.FC<FundraisingCardProps> = ({
  name,
  createdAt,
  description,
  image,
  id,
  totalDonated,
  donationCount,
}) => {
  const router = useRouter();

  const handleCardClick = () => {
    router.push(`/project/${id}`);
  };

  const [, setCurrentProjectFundInfo] =
    React.useState<ProjectChainInfo | null>(null);

  const handleButtonClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

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
          <span className="update-label">
            Last Updated: {dayjs(createdAt).fromNow()}
          </span>
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
              Raised from <strong>{donationCount || 0}</strong> contributors
            </div>
            <div className="raised-amount">{formatCurrency(totalDonated)}</div>
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
