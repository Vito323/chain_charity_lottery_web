"use client";
import "./style.scss";
import Link from 'next/link';
import { motion } from "framer-motion";

const LandingFooter = () => {
  const buildLinks = [
    { label: "文档", href: "/docs" },
    { label: "Github", href: "/github", external: true },
    { label: "Discord 聊天", href: "/discord", external: true },
    { label: "状态", href: "/status", external: true }
  ];

  const applyLinks = [
    { label: "资助", href: "/grants" },
    { label: "Collective", href: "/collective" },
    { label: "职业", href: "/careers" }
  ];

  const learnLinks = [
    { label: "博客", href: "/blog" },
    { label: "播客", href: "/podcast" },
    { label: "视频", href: "/videos" },
    { label: "网络统计", href: "/stats", external: true }
  ];

  const otherLinks = [
    { label: "Break Chainova", href: "/break" },
    { label: "免责声明", href: "/disclaimer" },
    { label: "新闻与品牌", href: "/press" }
  ];

  const linkCategories = [
    { title: "构建", links: buildLinks },
    { title: "申请", links: applyLinks },
    { title: "学习", links: learnLinks },
    { title: "其他", links: otherLinks }
  ];

  return (
    <footer className="landing-footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-main">
            <div className="footer-logo">
              <span className="logo-text">CHAINOVA.COM</span>
            </div>
            
            <div className="footer-links">
              {linkCategories.map((category, index) => (
                <div key={index} className="link-category">
                  <h4 className="category-title">{category.title}</h4>
                  <div className="category-links">
                    {category.links.map((link, linkIndex) => (
                      <Link 
                        key={linkIndex} 
                        href={link.href} 
                        className="link-item"
                        target={link.external ? "_blank" : undefined}
                        rel={link.external ? "noopener noreferrer" : undefined}
                      >
                        {link.label}
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default LandingFooter;

