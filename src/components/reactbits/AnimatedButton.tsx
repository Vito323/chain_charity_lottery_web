"use client";
import { motion } from "framer-motion";
import "./AnimatedButton.scss";

interface AnimatedButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: "primary" | "secondary" | "ghost";
  size?: "sm" | "md" | "lg";
  disabled?: boolean;
  className?: string;
}

const AnimatedButton = ({ 
  children, 
  onClick, 
  variant = "primary", 
  size = "md",
  disabled = false,
  className = "" 
}: AnimatedButtonProps) => {
  return (
    <motion.button
      className={`animated-button ${variant} ${size} ${className} ${disabled ? 'disabled' : ''}`}
      onClick={onClick}
      disabled={disabled}
      whileHover={{ 
        scale: 1.05,
        boxShadow: "0 10px 30px rgba(0, 0, 0, 0.2)"
      }}
      whileTap={{ 
        scale: 0.95,
        boxShadow: "0 5px 15px rgba(0, 0, 0, 0.1)"
      }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <motion.span 
        className="button-content"
        whileHover={{ 
          background: "linear-gradient(45deg, transparent, rgba(255, 255, 255, 0.1), transparent)",
          backgroundSize: "200% 200%"
        }}
        transition={{ duration: 0.3 }}
      >
        {children}
      </motion.span>
      
      {/* Ripple effect */}
      <motion.div
        className="ripple"
        initial={{ scale: 0, opacity: 0 }}
        whileTap={{ 
          scale: 1, 
          opacity: [0, 0.3, 0] 
        }}
        transition={{ duration: 0.6 }}
      />
    </motion.button>
  );
};

export default AnimatedButton;















