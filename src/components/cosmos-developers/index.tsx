'use client';

import { useEffect, useState } from 'react';
import './cosmos-developers.scss';

export default function CosmosDevelopers() {
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

    const element = document.querySelector('.cosmos-developers');
    if (element) {
      observer.observe(element);
    }

    return () => observer.disconnect();
  }, []);

  const developerFeatures = [
    {
      icon: '🏦',
      title: '去中心化金融应用',
      description: '创建交易所和市场，让世界各地的任何人都能购买、交易、投资和借贷——即使没有银行账户。'
    },
    {
      icon: '🏛️',
      title: '弹性、自治组织',
      description: '让您的社区能够组织起来，为其成员分配资源。对具有影响力的治理决策进行投票。'
    },
    {
      icon: '🎮',
      title: '玩家拥有的游戏经济',
      description: '创建永远可用的游戏内资产。通过让玩家将战利品带到另一个游戏或现实世界中，为游戏玩家带来持久价值。'
    }
  ];

  const developerTools = [
    {
      title: 'Starport',
      description: '在几分钟内构建链',
      action: '开始使用 →',
      icon: '🚀'
    },
    {
      title: '获取资助',
      description: '申请资助来构建',
      action: '申请 →',
      icon: '💰'
    }
  ];

  return (
    <section className="cosmos-developers">
      <div className="cosmos-container">
        <div className={`cosmos-developers-content ${isVisible ? 'visible' : ''}`}>
          <div className="cosmos-developers-header">
            <h2 className="cosmos-developers-title">
              开发者
            </h2>
            <h3 className="cosmos-developers-subtitle">
              您将构建什么？
            </h3>
            <p className="cosmos-developers-description">
              Cosmos 中的开发者是新区块链技术时代的先驱。加入快速增长的代币经济，
              在安全稳定的基础上构建。
            </p>
          </div>

          <div className="cosmos-developer-features">
            {developerFeatures.map((feature, index) => (
              <div 
                key={index} 
                className={`cosmos-developer-feature ${isVisible ? 'visible' : ''}`}
                style={{ animationDelay: `${index * 0.2}s` }}
              >
                <div className="cosmos-developer-icon">
                  <span className="cosmos-developer-emoji">{feature.icon}</span>
                </div>
                <div className="cosmos-developer-content">
                  <h4 className="cosmos-developer-title">{feature.title}</h4>
                  <p className="cosmos-developer-description">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="cosmos-developer-tools">
            <div className="cosmos-tools-grid">
              {developerTools.map((tool, index) => (
                <div 
                  key={index} 
                  className={`cosmos-tool-card ${isVisible ? 'visible' : ''}`}
                  style={{ animationDelay: `${(index + 3) * 0.2}s` }}
                >
                  <div className="cosmos-tool-icon">
                    <span className="cosmos-tool-emoji">{tool.icon}</span>
                  </div>
                  <div className="cosmos-tool-content">
                    <h4 className="cosmos-tool-title">{tool.title}</h4>
                    <p className="cosmos-tool-description">{tool.description}</p>
                    <button className="cosmos-tool-action">
                      {tool.action}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
