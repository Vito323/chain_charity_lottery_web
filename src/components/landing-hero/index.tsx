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

const LandingHero = () => {
  const heroRef = useRef<HTMLElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (heroRef.current && statsRef.current) {
      // 主标题动画
      gsap.fromTo(".hero-title", 
        { y: 100, opacity: 0 },
        { y: 0, opacity: 1, duration: 1.2, ease: "power3.out" }
      );

      // 副标题动画
      gsap.fromTo(".hero-subtitle", 
        { y: 50, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, delay: 0.3, ease: "power3.out" }
      );

      // 按钮动画
      gsap.fromTo(".hero-cta", 
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, delay: 0.6, ease: "power3.out" }
      );

      // 统计数据动画
      gsap.fromTo(".stat-item", 
        { y: 50, opacity: 0 },
        { 
          y: 0, 
          opacity: 1, 
          duration: 0.8, 
          stagger: 0.2, 
          delay: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: statsRef.current,
            start: "top 80%",
            end: "bottom 20%",
            toggleActions: "play none none reverse"
          }
        }
      );

      // 数字计数动画
      const statNumbers = document.querySelectorAll('.stat-number');
      statNumbers.forEach((number) => {
        const target = parseInt(number.textContent || '0');
        gsap.fromTo(number, 
          { textContent: 0 },
          { 
            textContent: target, 
            duration: 2, 
            delay: 1.5,
            ease: "power2.out",
            snap: { textContent: 1 },
            onUpdate: function() {
              const current = Math.round(parseInt(this.targets()[0].textContent) || 0);
              this.targets()[0].textContent = current.toLocaleString();
            }
          }
        );
      });
    }
  }, []);

  return (
    <section ref={heroRef} className="landing-hero">
      <div className="hero-background">
        <div className="gradient-orb gradient-orb-1"></div>
        <div className="gradient-orb gradient-orb-2"></div>
        <div className="gradient-orb gradient-orb-3"></div>
      </div>
      
      <div className="container">
        <div className="hero-content">
          <motion.div 
            className="hero-badge"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <span>🚀 为开发者而生，为所有人而快</span>
          </motion.div>
          
          <h1 className="hero-title">
            <motion.span
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 1.2, ease: "easeOut" }}
            >
              强大的开发者工具。
            </motion.span>
            <br />
            <motion.span
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 1.2, delay: 0.2, ease: "easeOut" }}
              className="gradient-text"
            >
              为所有人而快。
            </motion.span>
          </h1>
          
          <motion.p 
            className="hero-subtitle"
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 1, delay: 0.4 }}
          >
            Chainova 是一个去中心化区块链，旨在为世界构建可扩展、用户友好的应用程序。
          </motion.p>
          
          <motion.div 
            className="hero-cta"
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <button className="cta-button primary">
              开始构建
            </button>
            <button className="cta-button secondary">
              阅读文档
            </button>
          </motion.div>
        </div>
        
        {/* 统计数据展示 */}
        <div ref={statsRef} className="hero-stats">
          <div className="stat-item">
            <div className="stat-number">2,365</div>
            <div className="stat-label">每秒交易数</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">71,078,986,058</div>
            <div className="stat-label">总交易数</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">$0.00025</div>
            <div className="stat-label">平均交易成本</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">1,732</div>
            <div className="stat-label">验证节点</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LandingHero;
