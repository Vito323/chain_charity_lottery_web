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

const ECOSYSTEM_PROJECTS = [
  { name: "DeFi", icon: "💱", description: "去中心化金融协议", color: "#00D4FF" },
  { name: "NFT", icon: "🎨", description: "数字艺术品和收藏品", color: "#9945FF" },
  { name: "Gaming", icon: "🎮", description: "区块链游戏平台", color: "#14F195" },
  { name: "DAO", icon: "🏛️", description: "去中心化自治组织", color: "#FF6B6B" },
  { name: "DeFi", icon: "💱", description: "去中心化金融协议", color: "#00D4FF" },
  { name: "NFT", icon: "🎨", description: "数字艺术品和收藏品", color: "#9945FF" },
  { name: "Gaming", icon: "🎮", description: "区块链游戏平台", color: "#14F195" },
  { name: "DAO", icon: "🏛️", description: "去中心化自治组织", color: "#FF6B6B" },
];

const EcosystemSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const projectsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (sectionRef.current && titleRef.current && projectsRef.current) {
      // 标题动画
      gsap.fromTo(titleRef.current, 
        { y: 100, opacity: 0 },
        { 
          y: 0, 
          opacity: 1, 
          duration: 1.2, 
          ease: "power3.out",
          scrollTrigger: {
            trigger: titleRef.current,
            start: "top 80%",
            end: "bottom 20%",
            toggleActions: "play none none reverse"
          }
        }
      );

      // 项目卡片动画
      gsap.fromTo(projectsRef.current.children, 
        { y: 80, opacity: 0, scale: 0.8 },
        { 
          y: 0, 
          opacity: 1, 
          scale: 1,
          duration: 0.8, 
          stagger: 0.1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: projectsRef.current,
            start: "top 80%",
            end: "bottom 20%",
            toggleActions: "play none none reverse"
          }
        }
      );

      // 悬停动画
      Array.from(projectsRef.current.children).forEach((card) => {
        card.addEventListener('mouseenter', () => {
          gsap.to(card, { scale: 1.05, duration: 0.3, ease: "power2.out" });
        });
        
        card.addEventListener('mouseleave', () => {
          gsap.to(card, { scale: 1, duration: 0.3, ease: "power2.out" });
        });
      });
    }
  }, []);

  return (
    <section ref={sectionRef} className="ecosystem-section">
      <div className="container">
        <motion.div 
          ref={titleRef}
          className="section-header"
          initial={{ y: 100, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          viewport={{ once: true }}
        >
          <h2 className="section-title">
            加入增长最快的生态系统
          </h2>
          <p className="section-subtitle">
            Chainova 是世界上最快的区块链，也是加密领域增长最快的生态系统，
            拥有数千个项目，涵盖 DeFi、NFT、Web3 等领域。
          </p>
          <motion.button 
            className="explore-btn"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            探索生态系统
          </motion.button>
        </motion.div>

        <div ref={projectsRef} className="ecosystem-grid">
          {ECOSYSTEM_PROJECTS.map((project, index) => (
            <motion.div
              key={index}
              className="ecosystem-card"
              whileHover={{ y: -8 }}
              transition={{ duration: 0.3 }}
            >
              <div 
                className="card-icon"
                style={{ backgroundColor: project.color }}
              >
                <span className="icon-emoji">{project.icon}</span>
              </div>
              <h3 className="card-title">{project.name}</h3>
              <p className="card-description">{project.description}</p>
              <div className="card-glow" style={{ backgroundColor: project.color }}></div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default EcosystemSection;
