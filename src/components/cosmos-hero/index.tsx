'use client';

import { useEffect, useState } from 'react';
import './cosmos-hero.scss';

export default function CosmosHero() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <section className="cosmos-hero">
      <div className="cosmos-bg-elements">
        <div className="cosmos-bg-element"></div>
        <div className="cosmos-bg-element"></div>
        <div className="cosmos-bg-element"></div>
      </div>
      
      <div className="cosmos-container">
        <div className={`cosmos-hero-content ${isVisible ? 'visible' : ''}`}>
          <div className="cosmos-hero-badge">
            <span className="cosmos-badge-text">社区拥有和运营</span>
          </div>
          
          <h1 className="cosmos-hero-title">
            欢迎来到 Cosmos
            <br />
            <span className="cosmos-hero-subtitle">
              区块链的
              <span className="cosmos-highlight">互联网</span>
            </span>
          </h1>
          
          <p className="cosmos-hero-description">
            Cosmos 是一个不断扩展的互联应用和服务生态系统，为去中心化的未来而构建。
          </p>
          
          <div className="cosmos-hero-cta">
            <button className="cosmos-cta-button cosmos-cta-primary">
              开始探索 →
            </button>
            <button className="cosmos-cta-button cosmos-cta-secondary">
              了解质押
            </button>
          </div>
          
          <div className="cosmos-hero-stats">
            <div className="cosmos-stat-item">
              <div className="cosmos-stat-number">261+</div>
              <div className="cosmos-stat-label">应用和服务，持续增长</div>
            </div>
            <div className="cosmos-stat-item">
              <div className="cosmos-stat-number">$171B+</div>
              <div className="cosmos-stat-label">管理的数字资产</div>
            </div>
          </div>
        </div>
        
        <div className="cosmos-hero-visual">
          <div className="cosmos-planet-system">
            <div className="cosmos-planet cosmos-planet-main">
              <div className="cosmos-planet-core"></div>
              <div className="cosmos-planet-ring"></div>
            </div>
            <div className="cosmos-planet cosmos-planet-orbit-1">
              <div className="cosmos-planet-core"></div>
            </div>
            <div className="cosmos-planet cosmos-planet-orbit-2">
              <div className="cosmos-planet-core"></div>
            </div>
            <div className="cosmos-planet cosmos-planet-orbit-3">
              <div className="cosmos-planet-core"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
