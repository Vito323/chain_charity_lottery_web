"use client";
import "./style.scss";
import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// 注册 GSAP 插件
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const VideoShowcase = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLDivElement>(null);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);

  useEffect(() => {
    if (sectionRef.current && videoRef.current) {
      // 标题动画
      gsap.fromTo(".video-title", 
        { y: 100, opacity: 0 },
        { 
          y: 0, 
          opacity: 1, 
          duration: 1.2, 
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 80%",
            end: "bottom 20%",
            toggleActions: "play none none reverse"
          }
        }
      );

      // 视频容器动画
      gsap.fromTo(videoRef.current, 
        { scale: 0.8, opacity: 0 },
        { 
          scale: 1, 
          opacity: 1, 
          duration: 1, 
          delay: 0.3,
          ease: "power3.out",
          scrollTrigger: {
            trigger: videoRef.current,
            start: "top 80%",
            end: "bottom 20%",
            toggleActions: "play none none reverse"
          }
        }
      );

      // 播放按钮动画
      gsap.fromTo(".play-button", 
        { scale: 0, opacity: 0 },
        { 
          scale: 1, 
          opacity: 1, 
          duration: 0.6, 
          delay: 0.8,
          ease: "back.out(1.7)",
          scrollTrigger: {
            trigger: videoRef.current,
            start: "top 80%",
            end: "bottom 20%",
            toggleActions: "play none none reverse"
          }
        }
      );
    }
  }, []);

  const handlePlayVideo = () => {
    setIsVideoPlaying(true);
    // 这里可以添加实际的视频播放逻辑
    console.log("播放视频");
  };

  return (
    <section ref={sectionRef} className="video-showcase">
      <div className="container">
        <motion.div 
          className="video-header"
          initial={{ y: 100, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          viewport={{ once: true }}
        >
          <h2 className="video-title">打个招呼</h2>
          <p className="video-subtitle">
            了解更多关于 Chainova 的信息，看看它为什么如此出色。
          </p>
        </motion.div>

        <div ref={videoRef} className="video-container">
          <div className="video-wrapper">
            <div className="video-placeholder">
              <div className="video-background">
                <div className="gradient-overlay"></div>
                <div className="video-pattern">
                  <div className="pattern-circle pattern-circle-1"></div>
                  <div className="pattern-circle pattern-circle-2"></div>
                  <div className="pattern-circle pattern-circle-3"></div>
                  <div className="pattern-circle pattern-circle-4"></div>
                </div>
              </div>
              
              {!isVideoPlaying ? (
                <motion.button
                  className="play-button"
                  onClick={handlePlayVideo}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.8, duration: 0.6, ease: "back.out(1.7)" }}
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path d="M8 5V19L19 12L8 5Z" fill="currentColor"/>
                  </svg>
                </motion.button>
              ) : (
                <div className="video-player">
                  <iframe
                    width="100%"
                    height="100%"
                    src="https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1"
                    title="Chainova 介绍视频"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default VideoShowcase;
