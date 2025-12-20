"use client";
import { motion } from "framer-motion";
import "./FloatingElements.scss";

const FloatingElements = () => {
  const floatingItems = [
    {
      id: 1,
      icon: "₿",
      color: "#f7931a",
      position: { x: "10%", y: "20%" },
      size: 80,
      delay: 0
    },
    {
      id: 2,
      icon: "Ξ",
      color: "#627eea",
      position: { x: "85%", y: "30%" },
      size: 60,
      delay: 1
    },
    {
      id: 3,
      icon: "Ł",
      color: "#bfbbbb",
      position: { x: "20%", y: "70%" },
      size: 100,
      delay: 2
    },
    {
      id: 4,
      icon: "◊",
      color: "#00d4aa",
      position: { x: "75%", y: "65%" },
      size: 70,
      delay: 3
    },
    {
      id: 5,
      icon: "★",
      color: "#8b5cf6",
      position: { x: "50%", y: "15%" },
      size: 50,
      delay: 4
    }
  ];

  return (
    <div className="floating-elements">
      {floatingItems.map((item) => (
        <motion.div
          key={item.id}
          className="floating-item"
          style={{
            left: item.position.x,
            top: item.position.y,
            width: item.size,
            height: item.size,
            backgroundColor: item.color
          }}
          initial={{ 
            opacity: 0, 
            scale: 0.8,
            y: 50
          }}
          animate={{ 
            opacity: [0, 1, 0.8, 1],
            scale: [0.8, 1.1, 0.9, 1],
            y: [-20, 20, -10, 0],
            rotate: [0, 180, 360]
          }}
          transition={{
            duration: 8,
            delay: item.delay,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "easeInOut"
          }}
        >
          <span className="floating-icon">{item.icon}</span>
        </motion.div>
      ))}
    </div>
  );
};

export default FloatingElements;














