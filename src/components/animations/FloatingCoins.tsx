"use client";
import { useEffect, useRef } from "react";
import "./FloatingCoins.scss";

const FloatingCoins = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const coins = container.querySelectorAll('.crypto-coin');
    
    coins.forEach((coin) => {
      const element = coin as HTMLElement;
      
      // Random initial positions and animations
      const randomX = Math.random() * 100;
      const randomY = Math.random() * 100;
      const randomDelay = Math.random() * 5;
      const randomDuration = 8 + Math.random() * 4; // 8-12 seconds
      
      element.style.setProperty('--random-x', `${randomX}%`);
      element.style.setProperty('--random-y', `${randomY}%`);
      element.style.setProperty('--animation-delay', `${randomDelay}s`);
      element.style.setProperty('--animation-duration', `${randomDuration}s`);
      
      // Add floating animation
      element.classList.add('floating');
    });

    return () => {
      coins.forEach(coin => {
        coin.classList.remove('floating');
      });
    };
  }, []);

  return (
    <div ref={containerRef} className="floating-coins-container">
      <div className="crypto-coin coin-1">
        <div className="coin-inner">
          <span className="coin-symbol">₿</span>
        </div>
      </div>
      <div className="crypto-coin coin-2">
        <div className="coin-inner">
          <span className="coin-symbol">Ξ</span>
        </div>
      </div>
      <div className="crypto-coin coin-3">
        <div className="coin-inner">
          <span className="coin-symbol">Ł</span>
        </div>
      </div>
      <div className="crypto-coin coin-4">
        <div className="coin-inner">
          <span className="coin-symbol">$</span>
        </div>
      </div>
      <div className="crypto-coin coin-5">
        <div className="coin-inner">
          <span className="coin-symbol">◊</span>
        </div>
      </div>
    </div>
  );
};

export default FloatingCoins;
