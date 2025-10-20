'use client';

import { useEffect, useState } from 'react';
import './cosmos-technology.scss';

export default function CosmosTechnology() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.3 }
    );

    const element = document.querySelector('.cosmos-technology');
    if (element) {
      observer.observe(element);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section className="cosmos-technology">
      <div className="cosmos-container">
        <div className={`cosmos-technology-content ${isVisible ? 'visible' : ''}`}>
          <div className="cosmos-technology-header">
            <div className="cosmos-technology-badge">
              <span className="cosmos-badge-text">技术</span>
            </div>
            <h2 className="cosmos-technology-title">
              构建价值的
              <span className="cosmos-highlight">最受信任方式</span>
            </h2>
            <p className="cosmos-technology-description">
              <strong>Cosmos SDK</strong> 是最先进的区块链框架，为 Cosmos Hub 及其快速扩展的主权链轨道提供动力。
              <br /><br />
              开发者可以使用 SDK 构建创新应用，通过与 Cosmos Hub 的交换创造价值。
            </p>
          </div>

          <div className="cosmos-technology-visual">
            <div className="cosmos-tech-diagram">
              <div className="cosmos-tech-layer cosmos-tech-layer-1">
                <div className="cosmos-tech-item">
                  <div className="cosmos-tech-icon">🔗</div>
                  <div className="cosmos-tech-label">Tendermint Core</div>
                </div>
              </div>
              <div className="cosmos-tech-layer cosmos-tech-layer-2">
                <div className="cosmos-tech-item">
                  <div className="cosmos-tech-icon">🌐</div>
                  <div className="cosmos-tech-label">Gaia</div>
                </div>
              </div>
              <div className="cosmos-tech-layer cosmos-tech-layer-3">
                <div className="cosmos-tech-item">
                  <div className="cosmos-tech-icon">⚙️</div>
                  <div className="cosmos-tech-label">Cosmos SDK</div>
                </div>
              </div>
            </div>
          </div>

          <div className="cosmos-technology-features">
            <div className="cosmos-tech-feature">
              <div className="cosmos-tech-feature-icon">🌱</div>
              <div className="cosmos-tech-feature-content">
                <h3 className="cosmos-tech-feature-title">权益证明</h3>
                <div className="cosmos-tech-feature-metric">99%</div>
                <p className="cosmos-tech-feature-description">更低的碳足迹</p>
              </div>
            </div>
            <div className="cosmos-tech-feature">
              <div className="cosmos-tech-feature-icon">💰</div>
              <div className="cosmos-tech-feature-content">
                <h3 className="cosmos-tech-feature-title">低费用</h3>
                <div className="cosmos-tech-feature-metric">$0.01</div>
                <p className="cosmos-tech-feature-description">享受最低费用——几乎为零</p>
              </div>
            </div>
            <div className="cosmos-tech-feature">
              <div className="cosmos-tech-feature-icon">⚡</div>
              <div className="cosmos-tech-feature-content">
                <h3 className="cosmos-tech-feature-title">快速交易</h3>
                <div className="cosmos-tech-feature-metric">7 秒</div>
                <p className="cosmos-tech-feature-description">交易在几秒钟内确认</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
