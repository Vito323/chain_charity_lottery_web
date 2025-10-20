'use client';

import { useEffect, useState } from 'react';
import './cosmos-community.scss';

export default function CosmosCommunity() {
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

    const element = document.querySelector('.cosmos-community');
    if (element) {
      observer.observe(element);
    }

    return () => observer.disconnect();
  }, []);

  const communityActions = [
    {
      icon: '🔗',
      title: '连接',
      subtitle: '连接链',
      description: '通过使用 IBC 协议连接到 Cosmos Hub 服务，发展您的链经济。',
      action: '连接链 ↗'
    },
    {
      icon: '🔧',
      title: '集成',
      subtitle: '提供服务',
      description: '通过提供交易所、钱包等服务，获得支持将用户带到 Cosmos。',
      action: '提供服务 ↗'
    },
    {
      icon: '✅',
      title: '验证',
      subtitle: '成为验证者',
      description: '加入网络中值得信赖的去中心化验证者运营商行列，帮助保护互联链。',
      action: '成为验证者 ↗'
    }
  ];

  const communityLinks = [
    {
      icon: '💬',
      title: '社区聊天',
      description: '在 Telegram 上与世界各地的社区提问和聊天。',
      action: '社区聊天 ↗'
    },
    {
      icon: '🐦',
      title: 'Twitter',
      description: '关注 @cosmos 获取整个生态系统的最新新闻和更新。',
      action: 'Twitter ↗'
    },
    {
      icon: '💻',
      title: '开发者聊天',
      description: '对 Cosmos 工具有技术问题？在社区 Discord 上询问开发者。',
      action: '开发者聊天 ↗'
    },
    {
      icon: '🏛️',
      title: 'Cosmos 论坛',
      description: '考虑成为验证者或对网络事务感兴趣？加入讨论。',
      action: 'Cosmos 论坛 ↗'
    }
  ];

  return (
    <section className="cosmos-community">
      <div className="cosmos-container">
        <div className={`cosmos-community-content ${isVisible ? 'visible' : ''}`}>
          <div className="cosmos-community-header">
            <h2 className="cosmos-community-title">
              加入网络
            </h2>
            <p className="cosmos-community-description">
              连接、集成、验证——选择您的参与方式
            </p>
          </div>

          <div className="cosmos-community-actions">
            {communityActions.map((action, index) => (
              <div 
                key={index} 
                className={`cosmos-community-action ${isVisible ? 'visible' : ''}`}
                style={{ animationDelay: `${index * 0.2}s` }}
              >
                <div className="cosmos-action-icon">
                  <span className="cosmos-action-emoji">{action.icon}</span>
                </div>
                <div className="cosmos-action-content">
                  <h3 className="cosmos-action-title">{action.title}</h3>
                  <h4 className="cosmos-action-subtitle">{action.subtitle}</h4>
                  <p className="cosmos-action-description">{action.description}</p>
                  <button className="cosmos-action-button">
                    {action.action}
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="cosmos-community-section">
            <h3 className="cosmos-community-section-title">
              认识全球社区
            </h3>
            <p className="cosmos-community-section-description">
              加入遍布世界各地的快速增长的开发者和创新者社区，构建互联网的新时代。
            </p>
            
            <div className="cosmos-community-links">
              {communityLinks.map((link, index) => (
                <div 
                  key={index} 
                  className={`cosmos-community-link ${isVisible ? 'visible' : ''}`}
                  style={{ animationDelay: `${(index + 3) * 0.2}s` }}
                >
                  <div className="cosmos-link-icon">
                    <span className="cosmos-link-emoji">{link.icon}</span>
                  </div>
                  <div className="cosmos-link-content">
                    <h4 className="cosmos-link-title">{link.title}</h4>
                    <p className="cosmos-link-description">{link.description}</p>
                    <button className="cosmos-link-button">
                      {link.action}
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
