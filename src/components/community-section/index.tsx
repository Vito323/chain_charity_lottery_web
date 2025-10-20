"use client";
import "./style.scss";
import { motion } from "framer-motion";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// 注册 GSAP 插件
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const COMMUNITY_FEATURES = [
  {
    title: "成为验证者",
    description: "通过运行去中心化基础设施来帮助保护网络。了解如何操作验证者节点。",
    buttonText: "开始使用",
    icon: "🔐",
    color: "#9945FF"
  },
  {
    title: "开发者资源",
    description: "查看入门指南、视频、教程、SDK、参考实现等。",
    buttonText: "开始构建",
    icon: "🛠️",
    color: "#14F195"
  },
  {
    title: "社区",
    description: "每个人都有适合的东西。关注我们，在 Discord 上聊天，或阅读我们的动态。",
    buttonText: "了解更多",
    icon: "👥",
    color: "#00D4FF"
  }
];

const COMMUNITY_LINKS = [
  { label: "构建", links: ["文档", "Github", "Discord 聊天", "状态"] },
  { label: "申请", links: ["资助", "Collective", "职业"] },
  { label: "学习", links: ["博客", "播客", "视频", "网络统计"] },
  { label: "其他", links: ["Break Chainova", "免责声明", "新闻与品牌"] }
];

const CommunitySection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const featuresRef = useRef<HTMLDivElement>(null);
  const linksRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (sectionRef.current && featuresRef.current && linksRef.current) {
      // 特性卡片动画
      gsap.fromTo(featuresRef.current.children, 
        { y: 80, opacity: 0, scale: 0.9 },
        { 
          y: 0, 
          opacity: 1, 
          scale: 1,
          duration: 0.8, 
          stagger: 0.2,
          ease: "power3.out",
          scrollTrigger: {
            trigger: featuresRef.current,
            start: "top 80%",
            end: "bottom 20%",
            toggleActions: "play none none reverse"
          }
        }
      );

      // 链接区域动画
      gsap.fromTo(linksRef.current.children, 
        { y: 50, opacity: 0 },
        { 
          y: 0, 
          opacity: 1, 
          duration: 0.6, 
          stagger: 0.1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: linksRef.current,
            start: "top 80%",
            end: "bottom 20%",
            toggleActions: "play none none reverse"
          }
        }
      );

      // 悬停动画
      Array.from(featuresRef.current.children).forEach((card) => {
        card.addEventListener('mouseenter', () => {
          gsap.to(card, { y: -10, scale: 1.02, duration: 0.3, ease: "power2.out" });
        });
        
        card.addEventListener('mouseleave', () => {
          gsap.to(card, { y: 0, scale: 1, duration: 0.3, ease: "power2.out" });
        });
      });
    }
  }, []);

  return (
    <section ref={sectionRef} className="community-section">
      <div className="container">
        {/* 特性卡片 */}
        <div ref={featuresRef} className="community-features">
          {COMMUNITY_FEATURES.map((feature, index) => (
            <motion.div
              key={index}
              className="feature-card"
              whileHover={{ y: -10, scale: 1.02 }}
              transition={{ duration: 0.3 }}
            >
              <div className="card-icon" style={{ backgroundColor: feature.color }}>
                <span className="icon-emoji">{feature.icon}</span>
              </div>
              <h3 className="card-title">{feature.title}</h3>
              <p className="card-description">{feature.description}</p>
              <motion.button 
                className="card-button"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                style={{ borderColor: feature.color, color: feature.color }}
              >
                {feature.buttonText}
              </motion.button>
              <div className="card-glow" style={{ backgroundColor: feature.color }}></div>
            </motion.div>
          ))}
        </div>

        {/* 社区链接 */}
        <div ref={linksRef} className="community-links">
          <div className="links-grid">
            {COMMUNITY_LINKS.map((category, index) => (
              <div key={index} className="link-category">
                <h4 className="category-title">{category.label}</h4>
                <div className="category-links">
                  {category.links.map((link, linkIndex) => (
                    <a key={linkIndex} href="#" className="link-item">
                      {link}
                    </a>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 页脚信息 */}
        <motion.div 
          className="community-footer"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
        >
          <div className="footer-logo">
            <span className="logo-text">CHAINOVA.COM</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default CommunitySection;
