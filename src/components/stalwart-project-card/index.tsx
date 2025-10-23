"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { useRouter } from "next/navigation";
import { ProjectData } from "@/service/project";
import { useFundPoolManager } from "@/hooks/useFundPoolManager";
import { useAccount, useChainId } from "wagmi";
import { formatCurrency } from "@/utils/currency";
import "./stalwart-project-card.scss";

dayjs.extend(relativeTime);

interface StalwartProjectCardProps extends ProjectData {
  raised?: string;
  contributors?: number;
  animationDelay?: number;
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

const StalwartProjectCard: React.FC<StalwartProjectCardProps> = ({
  name,
  createdAt,
  description,
  image,
  id,
  totalDonated,
  donationCount,
  animationDelay = 0,
}) => {
  const router = useRouter();
  const { isConnected } = useAccount();
  const chainId = useChainId();
  const { getProject } = useFundPoolManager();

  const [, setCurrentProjectFundInfo] = React.useState<ProjectChainInfo | null>(null);
  const [isHovered, setIsHovered] = React.useState(false);

  const handleCardClick = () => {
    console.log('Card clicked:', id, name);
    router.push(`/project/${id}`);
  };

  const handleButtonClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  const queryProjectFundStats = React.useCallback(async () => {
    try {
      const res = await getProject(id);
      if (res) {
        setCurrentProjectFundInfo(res);
      }
    } catch (error) {
      console.log(error);
    }
  }, [getProject, id]);

  React.useEffect(() => {
    if (isConnected) {
      queryProjectFundStats();
    }
  }, [isConnected, queryProjectFundStats, chainId]);

  return (
    <motion.div
      className="stalwart-project-card"
      onClick={handleCardClick}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        duration: 0.6, 
        delay: animationDelay,
        ease: "easeOut"
      }}
      whileHover={{ 
        y: -10,
        transition: { duration: 0.3 }
      }}
      style={{ 
        cursor: 'pointer',
        position: 'relative',
        zIndex: 1
      }}
    >
      {/* Card Image */}
      <div className="stalwart-card-image-container">
        <Image
          src={image[0]}
          alt={name}
          className="stalwart-card-image"
          width={400}
          height={250}
          unoptimized
          style={{ objectFit: "cover" }}
        />
        
        {/* Overlay Icons */}
        <motion.div 
          className="stalwart-card-overlay-icons"
          initial={{ opacity: 0 }}
          animate={{ opacity: isHovered ? 1 : 0 }}
          transition={{ duration: 0.3 }}
        >
          <motion.div 
            className="stalwart-overlay-icon"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <i className="fa fa-rocket"></i>
          </motion.div>
          <motion.div 
            className="stalwart-overlay-icon"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <i className="fa fa-share-alt"></i>
          </motion.div>
        </motion.div>

        {/* Gradient Overlay */}
        <div className="stalwart-card-gradient-overlay"></div>
      </div>

      {/* Card Content */}
      <div className="stalwart-card-content">
        {/* Update Time */}
        <div className="stalwart-card-update-time">
          <span className="stalwart-update-label">
            Last Updated: {dayjs(createdAt).fromNow()}
          </span>
        </div>

        {/* Title */}
        <h3 className="stalwart-card-title">{name}</h3>

        {/* Organizer */}
        <div className="stalwart-card-organizer">
          <span className="stalwart-organizer-name">ChainCharity</span>
        </div>

        {/* Description */}
        <p className="stalwart-card-description">{description}</p>

        {/* Funding Info */}
        <div className="stalwart-card-funding-info">
          <div className="stalwart-funding-label">
            <span>Total amount raised</span>
          </div>
          <div className="stalwart-funding-details">
            <div className="stalwart-contributors-info">
              Raised from <strong>{donationCount || 0}</strong> contributors
            </div>
            <div className="stalwart-raised-amount">{formatCurrency(totalDonated)}</div>
          </div>
        </div>

        {/* Verification */}
        <div className="stalwart-card-verification">
          <i className="fa fa-check-circle stalwart-verification-icon"></i>
          <span className="stalwart-verification-text">Verified</span>
        </div>

        {/* Actions */}
        <motion.div 
          className="stalwart-card-actions"
          initial={{ opacity: 0, y: 20 }}
          animate={{ 
            opacity: isHovered ? 1 : 0, 
            y: isHovered ? 0 : 20 
          }}
          transition={{ duration: 0.3 }}
        >
          <Link
            href={`/stalwart-donate/${id}/${name}`}
            className="stalwart-donate-btn"
            onClick={handleButtonClick}
          >
            <span>Donate Now</span>
            <i className="fa fa-arrow-right"></i>
          </Link>
        </motion.div>
      </div>

      {/* Hover Effect Border */}
      <motion.div
        className="stalwart-card-hover-border"
        initial={{ scale: 0 }}
        animate={{ scale: isHovered ? 1 : 0 }}
        transition={{ duration: 0.3 }}
      />
    </motion.div>
  );
};

export default StalwartProjectCard;
