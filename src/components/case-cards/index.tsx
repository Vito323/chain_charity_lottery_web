"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import "./style.css";

interface FundraisingCardProps {
  id: number;
  title: string;
  organizer: string;
  description: string;
  image: string;
  raised: string;
  contributors: number;
  isVerified: boolean;
  lastUpdated: string;
  goal?: string;
  progress?: number;
}

const FundraisingCard: React.FC<FundraisingCardProps> = ({
  title,
  organizer,
  description,
  image,
  raised,
  contributors,
  lastUpdated,
}) => {
  const router = useRouter();

  const handleCardClick = () => {
    router.push("/case-single");
  };

  const handleButtonClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <div className="fundraising-card" onClick={handleCardClick}>
      <div className="card-image-container">
        <Image
          src={image}
          alt={title}
          className="card-image"
          width={400}
          height={250}
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
          <span className="update-label">Last Updated: {lastUpdated}</span>
        </div>

        <h3 className="card-title">{title}</h3>

        <div className="card-organizer">
          <span className="organizer-name">{organizer}</span>
        </div>

        <p className="card-description">{description}</p>

        <div className="card-funding-info">
          <div className="funding-label">
            <span>Total amount raised</span>
          </div>
          <div className="funding-details">
            <div className="contributors-info">
              Raised from <strong>{contributors}</strong> contributors
            </div>
            <div className="raised-amount">{raised}</div>
          </div>
        </div>

        <div className="card-verification">
          <i className="fa fa-check-circle verification-icon"></i>
          <span className="verification-text">Verified</span>
        </div>

        <div className="card-actions">
          <Link
            href="/donate"
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

const CaseCards = () => {
  const fundraisingData: FundraisingCardProps[] = [
    {
      id: 1,
      title: "Help Nina compete at The Adaptive CrossFit Games",
      organizer: "Anastassis Oikonomopoulos",
      description:
        "We invite you to make history with us. Konstantina Alexandridou (Nina) is the first disabled CrossFitter in Greece. Alongside her dedicated team, she's training to compete at the Adaptive CrossFit Games, representing not just herself but an entire community of athletes who refuse to let limitations define their potential.",
      image: "/images/case/img-1.png",
      raised: "$1,004.27",
      contributors: 6,
      isVerified: true,
      lastUpdated: "Just now",
      goal: "$5,000",
      progress: 20,
    },
    {
      id: 2,
      title: "Support Local Community Garden Initiative",
      organizer: "Green Earth Foundation",
      description:
        "Help us create a sustainable community garden that will provide fresh vegetables to local families in need. This project will not only address food insecurity but also bring our community together through shared gardening activities.",
      image: "/images/case/img-2.png",
      raised: "$2,350.00",
      contributors: 15,
      isVerified: true,
      lastUpdated: "2 hours ago",
      goal: "$3,000",
      progress: 78,
    },
    {
      id: 3,
      title: "Emergency Relief for Flood Victims",
      organizer: "Disaster Relief Network",
      description:
        "Urgent support needed for families affected by recent flooding. Your donation will provide immediate shelter, food, and medical supplies to those who have lost everything in this natural disaster.",
      image: "/images/case/img-3.png",
      raised: "$8,750.50",
      contributors: 42,
      isVerified: true,
      lastUpdated: "1 day ago",
      goal: "$10,000",
      progress: 88,
    },
    {
      id: 4,
      title: "Scholarship Fund for Underprivileged Students",
      organizer: "Education First Foundation",
      description:
        "Breaking barriers to education by providing scholarships for bright students from low-income families. Every donation helps a student pursue their dreams and build a better future for themselves and their communities.",
      image: "/images/case/img-4.png",
      raised: "$4,200.00",
      contributors: 28,
      isVerified: true,
      lastUpdated: "3 days ago",
      goal: "$6,000",
      progress: 70,
    },
    {
      id: 5,
      title: "Clean Water Project for Rural Village",
      organizer: "Water for Life Organization",
      description:
        "Installing a sustainable water filtration system in a remote village that currently lacks access to clean drinking water. This project will improve health outcomes and quality of life for over 500 residents.",
      image: "/images/case/img-5.png",
      raised: "$6,800.25",
      contributors: 35,
      isVerified: true,
      lastUpdated: "1 week ago",
      goal: "$8,500",
      progress: 80,
    },
    {
      id: 6,
      title: "Animal Shelter Renovation Project",
      organizer: "Paws and Hearts Rescue",
      description:
        "Renovating our aging animal shelter to provide better care for rescued animals. The improvements will include new kennels, medical facilities, and play areas to ensure our furry friends have a comfortable place to stay while waiting for their forever homes.",
      image: "/images/case/img-6.png",
      raised: "$3,150.75",
      contributors: 22,
      isVerified: true,
      lastUpdated: "2 weeks ago",
      goal: "$5,000",
      progress: 63,
    },
  ];

  return (
    <div className="row">
      {fundraisingData.map((card) => (
        <div key={card.id} className="col-lg-4 col-md-6 col-12 mb-5">
          <FundraisingCard {...card} />
        </div>
      ))}
    </div>
  );
};

export default CaseCards;
