'use client';

import './cosmos-footer.scss';

export default function CosmosFooter() {
  const footerLinks = {
    learn: [
      { name: '介绍', href: '#' },
      { name: '功能', href: '#' },
      { name: '质押', href: '#' },
      { name: '获取 ATOM', href: '#' },
      { name: '常见问题', href: '#' }
    ],
    build: [
      { name: '教程', href: '#' },
      { name: '文档', href: '#' },
      { name: 'Starport', href: '#' },
      { name: 'Cosmos SDK', href: '#' },
      { name: 'IBC', href: '#' }
    ],
    explore: [
      { name: '代币', href: '#' },
      { name: '生态系统', href: '#' },
      { name: '钱包', href: '#' },
      { name: 'Gravity DEX', href: '#' }
    ],
    participate: [
      { name: '社区', href: '#' },
      { name: '贡献者', href: '#' },
      { name: '活动', href: '#' },
      { name: '新闻通讯', href: '#' }
    ]
  };

  const socialLinks = [
    { name: 'Medium', icon: '📝', href: '#' },
    { name: 'Twitter', icon: '🐦', href: '#' },
    { name: 'Reddit', icon: '🔴', href: '#' },
    { name: 'Telegram', icon: '💬', href: '#' },
    { name: 'Discord', icon: '💻', href: '#' },
    { name: 'YouTube', icon: '📺', href: '#' }
  ];

  return (
    <footer className="cosmos-footer">
      <div className="cosmos-container">
        <div className="cosmos-footer-content">
          <div className="cosmos-footer-main">
            <div className="cosmos-footer-brand">
              <div className="cosmos-footer-logo">
                <div className="cosmos-logo-icon">🌌</div>
                <span className="cosmos-logo-text">COSMOS</span>
              </div>
              <p className="cosmos-footer-description">
                区块链的互联网。构建去中心化未来的互联应用和服务生态系统。
              </p>
              <div className="cosmos-footer-social">
                {socialLinks.map((social, index) => (
                  <a 
                    key={index} 
                    href={social.href} 
                    className="cosmos-social-link"
                    aria-label={social.name}
                  >
                    <span className="cosmos-social-icon">{social.icon}</span>
                  </a>
                ))}
              </div>
            </div>

            <div className="cosmos-footer-links">
              <div className="cosmos-footer-column">
                <h4 className="cosmos-footer-title">学习</h4>
                <ul className="cosmos-footer-list">
                  {footerLinks.learn.map((link, index) => (
                    <li key={index}>
                      <a href={link.href} className="cosmos-footer-link">
                        {link.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="cosmos-footer-column">
                <h4 className="cosmos-footer-title">构建</h4>
                <ul className="cosmos-footer-list">
                  {footerLinks.build.map((link, index) => (
                    <li key={index}>
                      <a href={link.href} className="cosmos-footer-link">
                        {link.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="cosmos-footer-column">
                <h4 className="cosmos-footer-title">探索</h4>
                <ul className="cosmos-footer-list">
                  {footerLinks.explore.map((link, index) => (
                    <li key={index}>
                      <a href={link.href} className="cosmos-footer-link">
                        {link.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="cosmos-footer-column">
                <h4 className="cosmos-footer-title">参与</h4>
                <ul className="cosmos-footer-list">
                  {footerLinks.participate.map((link, index) => (
                    <li key={index}>
                      <a href={link.href} className="cosmos-footer-link">
                        {link.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          <div className="cosmos-footer-bottom">
            <div className="cosmos-footer-newsletter">
              <h4 className="cosmos-newsletter-title">接收传输</h4>
              <p className="cosmos-newsletter-description">
                随时取消订阅。隐私政策 ↗
              </p>
              <div className="cosmos-newsletter-form">
                <input 
                  type="email" 
                  placeholder="输入您的邮箱地址"
                  className="cosmos-newsletter-input"
                />
                <button className="cosmos-newsletter-button">
                  订阅
                </button>
              </div>
            </div>
          </div>

          <div className="cosmos-footer-legal">
            <p className="cosmos-footer-copyright">
              © 2024 Cosmos Network. 本网站由 Tendermint 维护。
            </p>
            <p className="cosmos-footer-disclaimer">
              Cosmos 是 Interchain Foundation 的注册商标。
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
