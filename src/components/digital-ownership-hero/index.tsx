"use client";

import React, { useEffect, useRef } from "react";
import Link from "next/link";
import "./style.scss";
import {
  useScrollAnimation,
  useStaggeredAnimation,
} from "@/hooks/useScrollAnimation";
import GridDistortion from "../grid-distortion";

const DigitalOwnershipHero = () => {
  const coinsRef = useRef<HTMLDivElement>(null);
  const scrollIndicatorRef = useRef<HTMLDivElement>(null);

  const { elementRef: heroRef } = useScrollAnimation({
    y: 50,
    opacity: 0,
    duration: 1,
    delay: 0.2,
  });

  const { containerRef: contentRef } = useStaggeredAnimation(
    ".top-info-bar, .main-heading, .sub-heading, .cta-section",
    {
      y: 40,
      opacity: 0,
      duration: 0.8,
      stagger: 0.15,
      delay: 0.3,
    }
  );

  const { elementRef: coinsAnimationRef } = useScrollAnimation({
    scale: 0.8,
    opacity: 0,
    duration: 1.2,
    delay: 0.8,
    ease: "power3.out",
  });

  const { elementRef: scrollIndicatorAnimationRef } = useScrollAnimation({
    y: 30,
    opacity: 0,
    duration: 0.8,
    delay: 1.2,
  });

  useEffect(() => {
    // 为硬币添加额外的浮动动画
    if (coinsRef.current) {
      const coins = coinsRef.current.querySelectorAll(".coin");
      coins.forEach((coin, index) => {
        coin.style.animationDelay = `${index * 0.2}s`;
      });
    }
  }, []);

  return (
    <section ref={heroRef} className="digital-ownership-hero">
      <div className="hero-container">
        {/* 顶部信息栏 */}
        <div ref={contentRef}>
          <div className="top-info-bar">
            <div className="hot-tag">
              <span className="flame-icon">🔥</span>
              <span>Hot</span>
            </div>
            <span className="info-text">
              Connecting the world with Kindness
            </span>
            <span className="chevron-icon">›</span>
          </div>

          {/* 主标题 */}
          <div className="main-heading">
            <h1>
              Connecting the world with <span>Kindness</span>
            </h1>
          </div>

          {/* 副标题 */}
          <div className="sub-heading">
            <p>Protecting our home with action.</p>
          </div>

          {/* 行动按钮 */}
          <div className="cta-section">
            <Link href="/project" className="theme-btn">
              View project
            </Link>
          </div>
        </div>

        {/* 浮动硬币 */}
        <div
          className="floating-coins"
          ref={(el) => {
            coinsRef.current = el;
            if (coinsAnimationRef.current) {
              coinsAnimationRef.current = el;
            }
          }}
        >
          <div className="coin coin-1">
            <div className="coin-inner"></div>
          </div>
          <div className="coin coin-2">
            <div className="coin-inner">
              <span className="chevron-symbol">▲</span>
            </div>
          </div>
          <div className="coin coin-3">
            <div className="coin-inner">
              <span className="bitcoin-symbol">B</span>
            </div>
          </div>
          <div className="coin coin-4">
            <div className="coin-inner">
              <div className="dots">
                <div className="dot"></div>
                <div className="dot"></div>
                <div className="dot"></div>
              </div>
            </div>
          </div>
          <div className="coin coin-5">
            <div className="coin-inner"></div>
          </div>
        </div>

        {/* 背景网格 */}
        <div className="background-grid"></div>

        {/* 底部滚动指示器 */}
        {/* <div className="scroll-indicator" ref={scrollIndicatorRef}>
          <div className="scroll-icon">
            <div className="clock-icon">⏰</div>
          </div>
          <span className="scroll-text">Scroll down for more</span>
        </div> */}
      </div>
    </section>
  );
};

export default DigitalOwnershipHero;
