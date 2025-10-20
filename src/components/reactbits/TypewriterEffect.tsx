"use client";
import { motion, useAnimation } from "framer-motion";
import { useEffect, useState } from "react";
import "./TypewriterEffect.scss";

interface TypewriterEffectProps {
  text: string;
  speed?: number;
  delay?: number;
  className?: string;
}

const TypewriterEffect = ({ text, speed = 100, delay = 0, className = "" }: TypewriterEffectProps) => {
  const [displayText, setDisplayText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const controls = useAnimation();

  useEffect(() => {
    const timer = setTimeout(() => {
      if (currentIndex < text.length) {
        setDisplayText(prev => prev + text[currentIndex]);
        setCurrentIndex(prev => prev + 1);
      } else {
        setIsComplete(true);
        controls.start({
          scale: [1, 1.02, 1],
          transition: { duration: 0.3 }
        });
      }
    }, currentIndex === 0 ? delay : speed);

    return () => clearTimeout(timer);
  }, [currentIndex, text, speed, delay, controls]);

  return (
    <motion.span 
      className={`typewriter-effect ${className} ${isComplete ? 'complete' : ''}`}
      animate={controls}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {displayText}
      {!isComplete && (
        <motion.span 
          className="cursor"
          animate={{ opacity: [1, 0] }}
          transition={{ duration: 0.8, repeat: Infinity, repeatType: "reverse" }}
        >
          |
        </motion.span>
      )}
    </motion.span>
  );
};

export default TypewriterEffect;



