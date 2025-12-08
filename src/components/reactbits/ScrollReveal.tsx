"use client";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import "./ScrollReveal.scss";

interface ScrollRevealProps {
  children: React.ReactNode;
  delay?: number;
  duration?: number;
  direction?: "up" | "down" | "left" | "right";
  distance?: number;
  className?: string;
}

const ScrollReveal = ({ 
  children, 
  delay = 0, 
  duration = 0.6, 
  direction = "up",
  distance = 50,
  className = "" 
}: ScrollRevealProps) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { 
    once: true, 
    margin: "-100px 0px" 
  });

  const directionVariants = {
    up: { y: distance, x: 0 },
    down: { y: -distance, x: 0 },
    left: { x: distance, y: 0 },
    right: { x: -distance, y: 0 }
  };

  return (
    <motion.div
      ref={ref}
      className={`scroll-reveal ${className}`}
      initial={{ 
        opacity: 0, 
        ...directionVariants[direction]
      }}
      animate={isInView ? { 
        opacity: 1, 
        y: 0, 
        x: 0 
      } : { 
        opacity: 0, 
        ...directionVariants[direction]
      }}
      transition={{ 
        duration, 
        delay, 
        ease: [0.25, 0.1, 0.25, 1] // Custom easing
      }}
    >
      {children}
    </motion.div>
  );
};

export default ScrollReveal;











