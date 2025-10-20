'use client';

import { useEffect, useState } from 'react';
import './cosmos-features.scss';

export default function CosmosFeatures() {
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

    const element = document.querySelector('.cosmos-features');
    if (element) {
      observer.observe(element);
    }

    return () => observer.disconnect();
  }, []);

  const features = [
    {
      icon: '🌱',
      title: '环保',
      description: '99% 更低的碳足迹',
      subtitle: '真正可扩展的区块链技术'
    },
    {
      icon: '💰',
      title: '低费用',
      description: '$0.01',
      subtitle: '享受最低费用——几乎为零'
    },
    {
      icon: '⚡',
      title: '快速交易',
      description: '7 秒',
      subtitle: '交易在几秒钟内确认'
    }
  ];

  const upcomingFeatures = [
    {
      icon: '🔐',
      title: '互联账户',
      description: '一个安全账户管理所有数字资产',
      status: '即将推出'
    },
    {
      icon: '🔄',
      title: '去中心化交易所',
      description: '交换代币和收藏品',
      status: '即将推出'
    },
    {
      icon: '💧',
      title: '流动性池',
      description: '提供流动性，获得奖励',
      status: '即将推出'
    },
    {
      icon: '🔗',
      title: '包装的 ETH / BTC',
      description: '+ 以太坊 + 比特币',
      status: '即将推出'
    }
  ];

  return (
    <section className="cosmos-features">
      <div className="cosmos-container">
        <div className={`cosmos-features-content ${isVisible ? 'visible' : ''}`}>
          <div className="cosmos-features-header">
            <h2 className="cosmos-features-title">
              由 <span className="cosmos-highlight">ATOM</span> 保护
            </h2>
            <p className="cosmos-features-description">
              作为保护 Cosmos Hub 服务的回报，交易费用和质押奖励将分配给 ATOM 质押者。
            </p>
          </div>

          <div className="cosmos-features-grid">
            {features.map((feature, index) => (
              <div 
                key={index} 
                className={`cosmos-feature-card ${isVisible ? 'visible' : ''}`}
                style={{ animationDelay: `${index * 0.2}s` }}
              >
                <div className="cosmos-feature-icon">
                  <span className="cosmos-feature-emoji">{feature.icon}</span>
                </div>
                <div className="cosmos-feature-content">
                  <h3 className="cosmos-feature-title">{feature.title}</h3>
                  <div className="cosmos-feature-metric">{feature.description}</div>
                  <p className="cosmos-feature-subtitle">{feature.subtitle}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="cosmos-features-cta">
            <button className="cosmos-cta-button cosmos-cta-primary">
              开始质押 →
            </button>
            <button className="cosmos-cta-button cosmos-cta-secondary">
              了解更多
            </button>
          </div>
        </div>

        <div className="cosmos-upcoming-features">
          <h3 className="cosmos-upcoming-title">
            成为开放经济未来的一部分
          </h3>
          <div className="cosmos-upcoming-grid">
            {upcomingFeatures.map((feature, index) => (
              <div 
                key={index} 
                className={`cosmos-upcoming-card ${isVisible ? 'visible' : ''}`}
                style={{ animationDelay: `${(index + 3) * 0.2}s` }}
              >
                <div className="cosmos-upcoming-icon">
                  <span className="cosmos-upcoming-emoji">{feature.icon}</span>
                </div>
                <div className="cosmos-upcoming-content">
                  <div className="cosmos-upcoming-header">
                    <h4 className="cosmos-upcoming-title">{feature.title}</h4>
                    <span className="cosmos-upcoming-status">{feature.status}</span>
                  </div>
                  <p className="cosmos-upcoming-description">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
