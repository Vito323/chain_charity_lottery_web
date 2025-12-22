"use client";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import "./ParallaxBackground.scss";

const ParallaxBackground = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const y1 = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const y2 = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.5, 1], [0.3, 0.8, 0.3]);

  return (
    <div ref={containerRef} className="parallax-background">
      <motion.div 
        className="parallax-layer layer-1"
        style={{ y: y1, opacity }}
      >
        <div className="gradient-orb orb-1"></div>
        <div className="gradient-orb orb-2"></div>
      </motion.div>
      
      <motion.div 
        className="parallax-layer layer-2"
        style={{ y: y2, opacity }}
      >
        <div className="gradient-orb orb-3"></div>
        <div className="gradient-orb orb-4"></div>
      </motion.div>
      
      <motion.div 
        className="parallax-layer layer-3"
        style={{ opacity: useTransform(scrollYProgress, [0, 1], [0.2, 0.6]) }}
      >
        <div className="mesh-gradient"></div>
      </motion.div>
    </div>
  );
};

export default ParallaxBackground;

















