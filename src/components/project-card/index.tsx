"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/zh-cn";
import "dayjs/locale/en";
import { useTranslations, useLocale } from "next-intl";
import { Link } from "@/i18n/navigation";
import { ProjectData } from "@/service/project";
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
  goal: number;
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
  goal = 0,
}) => {
  const locale = useLocale();
  const t = useTranslations('projects.card');

  const [, setCurrentProjectFundInfo] =
    React.useState<ProjectChainInfo | null>(null);
  const [isHovered, setIsHovered] = React.useState(false);
  const [canHover, setCanHover] = React.useState(false);

  // Configure dayjs locale based on current locale
  React.useEffect(() => {
    if (locale === 'zh') {
      dayjs.locale('zh-cn');
    } else {
      dayjs.locale('en');
    }
  }, [locale]);

  // Disable hover effects on touch devices to prevent scroll blocking
  React.useEffect(() => {
    setCanHover(window.matchMedia('(hover: hover)').matches);
  }, []);

  // Cache project data to localStorage before navigation
  const cacheProjectData = React.useCallback(() => {
    try {
      const projectData: ProjectData = {
        id,
        name,
        description,
        image,
        createdAt,
        donationCount,
        totalDonated,
        goal,
      };
      localStorage.setItem(`project_${id}`, JSON.stringify(projectData));
    } catch (error) {
      console.error('Failed to cache project data:', error);
    }
  }, [id, name, description, image, createdAt, donationCount, totalDonated]);

  // NOTE: 当前项目列表接口没有返回目标金额，这里用一个
  // 合理的上限做归一化，仅用于前端展示进度效果。
  const PROGRESS_BASE = goal || 500;
  const rawProgress =
    PROGRESS_BASE > 0 ? (totalDonated / PROGRESS_BASE) * 100 : 0;
  const progress = Math.max(0, Math.min(100, rawProgress));

  const handleLinkClick = () => {
    cacheProjectData();
  };

  return (
    <Link
      href={`/project/${id}`}
      onClick={handleLinkClick}
      className="stalwart-project-card-link"
      style={{ touchAction: "pan-y" }}
    >
    <motion.div
      className="stalwart-project-card"
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.6,
        delay: animationDelay,
        ease: "easeOut",
      }}
      whileHover={canHover ? {
        y: -10,
        transition: { duration: 0.3 },
      } : undefined}
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
            <span className="stalwart-donate-btn-inline">
              {t('donateNow')}
            </span>
          </motion.div>
        </div>

        {/* Meta info */}
        <div className="stalwart-card-meta">
          <span className="stalwart-meta-updated">
            {t('updated')} {dayjs(createdAt).fromNow()}
          </span>
          <span className="stalwart-meta-contributors">
            {donationCount || 0} {t('contributors')}
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
            <span className="stalwart-footer-label">{t('totalRaised')}</span>
            <span className="stalwart-footer-value">
              {formatCurrency(totalDonated)} USDT
            </span>
          </div>

          <div className="stalwart-footer-block stalwart-footer-block-right">
            <span className="stalwart-footer-label">{t('fundingProgress')}</span>
            <span className="stalwart-footer-value">
              {progress.toFixed(2)}%
            </span>
          </div>
        </div>
      </div>
    </motion.div>
    </Link>
  );
};

export default ProjectCard;
