'use client';

import { useEffect, useState } from 'react';
import './cosmos-hub.scss';

export default function CosmosHub() {
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

    const element = document.querySelector('.cosmos-hub');
    if (element) {
      observer.observe(element);
    }

    return () => observer.disconnect();
  }, []);

  const hubFeatures = [
    {
      icon: '🏪',
      title: '市场',
      description: '运营下一代去中心化交易所，交换来自整个互联链的数字资产，费用极低，交易确认即时。',
      status: '即将推出'
    },
    {
      icon: '🛡️',
      title: '安全提供商',
      description: '通过即将推出的互联安全功能，ATOM 将很快保护许多链，以换取额外的质押奖励。',
      status: '即将推出'
    },
    {
      icon: '🌐',
      title: '路由器',
      description: 'Hub 的核心使命——通过建立与兼容链的 IBC 连接，并与以太坊和比特币等链运营去中心化桥接。',
      status: '活跃'
    },
    {
      icon: '🔐',
      title: '托管人',
      description: '位于互联链的十字路口，Hub 极其安全，是持有数字资产和管理跨多个链账户的最佳场所。',
      status: '活跃'
    }
  ];

  return (
    <section className="cosmos-hub">
      <div className="cosmos-container">
        <div className={`cosmos-hub-content ${isVisible ? 'visible' : ''}`}>
          <div className="cosmos-hub-header">
            <div className="cosmos-hub-badge">
              <span className="cosmos-badge-text">进入 Cosmos Hub</span>
            </div>
            <h2 className="cosmos-hub-title">
              互联链的
              <span className="cosmos-highlight">心脏</span>
            </h2>
            <p className="cosmos-hub-description">
              作为 Cosmos 的经济中心，Cosmos Hub 是一个为互联链提供重要服务的区块链。
              <br /><br />
              互联链本质上是一个新的互联网，由相互连接的区块链扩展网络组成。
            </p>
          </div>

          <div className="cosmos-hub-features">
            {hubFeatures.map((feature, index) => (
              <div 
                key={index} 
                className={`cosmos-hub-feature ${isVisible ? 'visible' : ''}`}
                style={{ animationDelay: `${index * 0.2}s` }}
              >
                <div className="cosmos-feature-icon">
                  <span className="cosmos-feature-emoji">{feature.icon}</span>
                </div>
                <div className="cosmos-feature-content">
                  <div className="cosmos-feature-header">
                    <h3 className="cosmos-feature-title">{feature.title}</h3>
                    <span className={`cosmos-feature-status ${feature.status === '活跃' ? 'active' : 'coming'}`}>
                      {feature.status}
                    </span>
                  </div>
                  <p className="cosmos-feature-description">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="cosmos-hub-cta">
            <button className="cosmos-cta-button cosmos-cta-primary">
              探索 Cosmos Hub →
            </button>
          </div>
        </div>

        <div className="cosmos-hub-visual">
          <div className="cosmos-hub-center">
            <div className="cosmos-hub-core">
              <div className="cosmos-hub-logo">COSMOS</div>
              <div className="cosmos-hub-rings">
                <div className="cosmos-hub-ring cosmos-hub-ring-1"></div>
                <div className="cosmos-hub-ring cosmos-hub-ring-2"></div>
                <div className="cosmos-hub-ring cosmos-hub-ring-3"></div>
              </div>
            </div>
            <div className="cosmos-hub-connections">
              <div className="cosmos-connection cosmos-connection-1"></div>
              <div className="cosmos-connection cosmos-connection-2"></div>
              <div className="cosmos-connection cosmos-connection-3"></div>
              <div className="cosmos-connection cosmos-connection-4"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
