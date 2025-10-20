'use client';

import { useEffect, useState } from 'react';
import './cosmos-stats.scss';

export default function CosmosStats() {
  const [isVisible, setIsVisible] = useState(false);
  const [counts, setCounts] = useState({
    apps: 0,
    assets: 0,
    validators: 0,
    chains: 0
  });

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          animateCounts();
        }
      },
      { threshold: 0.3 }
    );

    const element = document.querySelector('.cosmos-stats');
    if (element) {
      observer.observe(element);
    }

    return () => observer.disconnect();
  }, []);

  const animateCounts = () => {
    const targets = {
      apps: 261,
      assets: 171,
      validators: 175,
      chains: 50
    };

    const duration = 2000;
    const steps = 60;
    const stepDuration = duration / steps;

    let step = 0;
    const timer = setInterval(() => {
      step++;
      const progress = step / steps;
      const easeOut = 1 - Math.pow(1 - progress, 3);

      setCounts({
        apps: Math.floor(targets.apps * easeOut),
        assets: Math.floor(targets.assets * easeOut),
        validators: Math.floor(targets.validators * easeOut),
        chains: Math.floor(targets.chains * easeOut)
      });

      if (step >= steps) {
        clearInterval(timer);
        setCounts(targets);
      }
    }, stepDuration);
  };

  return (
    <section className="cosmos-stats">
      <div className="cosmos-container">
        <div className={`cosmos-stats-content ${isVisible ? 'visible' : ''}`}>
          <h2 className="cosmos-stats-title">
            进入互联服务的新宇宙
          </h2>
          <p className="cosmos-stats-description">
            想象一下没有央行的电子货币，没有中央运营证券交易所的数字资产交易，
            或者没有中央管理员的社交网络平台。
            <br /><br />
            Cosmos 应用和服务使用 IBC（区块链间通信协议）连接。
            这项创新使您能够在主权、去中心化的区块链之间自由交换资产和数据。
          </p>
          
          <div className="cosmos-stats-grid">
            <div className="cosmos-stat-card">
              <div className="cosmos-stat-number">{counts.apps}+</div>
              <div className="cosmos-stat-label">应用和服务，持续增长</div>
            </div>
            <div className="cosmos-stat-card">
              <div className="cosmos-stat-number">${counts.assets}B+</div>
              <div className="cosmos-stat-label">管理的数字资产</div>
            </div>
            <div className="cosmos-stat-card">
              <div className="cosmos-stat-number">{counts.validators}+</div>
              <div className="cosmos-stat-label">活跃验证者</div>
            </div>
            <div className="cosmos-stat-card">
              <div className="cosmos-stat-number">{counts.chains}+</div>
              <div className="cosmos-stat-label">连接的区块链</div>
            </div>
          </div>
          
          <div className="cosmos-stats-cta">
            <button className="cosmos-cta-button cosmos-cta-primary">
              了解更多 →
            </button>
            <button className="cosmos-cta-button cosmos-cta-secondary">
              探索代币
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
