"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { useRouter } from "next/navigation";
import { ProjectData } from "@/service/project";
import { useFundPoolManager } from "@/hooks/useDonationContract";
import { useAccount, useChainId } from "wagmi";
import { formatCurrency } from "@/utils/currency";
import "./project-card.scss";

dayjs.extend(relativeTime);

interface ProjectCardProps extends ProjectData {
  /**
   * Optional animation delay when card enters.
   */
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

const ProjectCard: React.FC<ProjectCardProps> = ({
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

  const [, setCurrentProjectFundInfo] =
    React.useState<ProjectChainInfo | null>(null);
  const [isHovered, setIsHovered] = React.useState(false);

  // NOTE: 当前项目列表接口没有返回目标金额，这里用一个
  // 合理的上限做归一化，仅用于前端展示进度效果。
  const PROGRESS_BASE = 150_000;
  const rawProgress =
    PROGRESS_BASE > 0 ? (totalDonated / PROGRESS_BASE) * 100 : 0;
  const progress = Math.max(0, Math.min(100, rawProgress));

  const handleCardClick = () => {
    console.log("Card clicked:", id, name);
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
        ease: "easeOut",
      }}
      whileHover={{
        y: -10,
        transition: { duration: 0.3 },
      }}
      style={{
        cursor: "pointer",
        position: "relative",
        zIndex: 1,
      }}
    >
      {/* Cover Image */}
      <div className="stalwart-card-image-container">
        <Image
          src={image[0]}
          alt={name}
          className="stalwart-card-image"
          width={400}
          height={260}
          unoptimized
          style={{ objectFit: "cover" }}
        />
      </div>

      {/* Card Body */}
      <div className="stalwart-card-content">
        {/* Header: title + donate button */}
        <div className="stalwart-card-header">
          <div className="stalwart-card-title-wrap">
            <h3 className="stalwart-card-title">{name}</h3>
            <p className="stalwart-card-subtitle">
              {description}
            </p>
          </div>

          <motion.div
            className="stalwart-card-cta-wrap"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: isHovered ? 1 : 1, scale: 1 }}
            transition={{ duration: 0.25 }}
          >
            <Link
              href={`/project/${id}`}
              className="stalwart-donate-btn-inline"
              onClick={handleButtonClick}
            >
              <span>Donate Now</span>
            </Link>
          </motion.div>
        </div>

        {/* Meta info */}
        <div className="stalwart-card-meta">
          <span className="stalwart-meta-updated">
            Updated {dayjs(createdAt).fromNow()}
          </span>
          <span className="stalwart-meta-contributors">
            {donationCount || 0} contributors
          </span>
        </div>

        {/* Funding progress bar */}
        <div className="stalwart-card-progress">
          <div className="stalwart-progress-track">
            <div
              className="stalwart-progress-bar"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Footer: amount + progress */}
        <div className="stalwart-card-footer">
          <div className="stalwart-footer-block">
            <span className="stalwart-footer-label">Total Raised</span>
            <span className="stalwart-footer-value">
              {formatCurrency(totalDonated)} USDT
            </span>
          </div>

          <div className="stalwart-footer-block stalwart-footer-block-right">
            <span className="stalwart-footer-label">Funding Progress</span>
            <span className="stalwart-footer-value">
              {progress.toFixed(0)}%
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ProjectCard;
