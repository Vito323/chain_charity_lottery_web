"use client";
import { useState } from "react";
import "./PulseButton.scss";

interface PulseButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
}

const PulseButton = ({ children, onClick, className = "", disabled = false }: PulseButtonProps) => {
  const [isPulsing, setIsPulsing] = useState(false);

  const handleClick = () => {
    if (!disabled) {
      setIsPulsing(true);
      setTimeout(() => setIsPulsing(false), 600);
      onClick?.();
    }
  };

  return (
    <button
      className={`pulse-button ${isPulsing ? 'pulsing' : ''} ${className} ${disabled ? 'disabled' : ''}`}
      onClick={handleClick}
      disabled={disabled}
    >
      <span className="button-content">{children}</span>
      <span className="pulse-ring"></span>
    </button>
  );
};

export default PulseButton;



