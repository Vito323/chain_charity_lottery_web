import "./style.scss";
import FadeInUp from "../animations/FadeInUp";

const StepsSection = () => {
  const steps = [
    {
      number: "01",
      title: "Connect Your Wallet",
      description: "Easily link your crypto wallet to access your assets and identity—securely and instantly."
    },
    {
      number: "02", 
      title: "Mint or Purchase Digital Items",
      description: "From art and music to access passes and digital cards—every item is verifiably yours on the blockchain."
    },
    {
      number: "03",
      title: "Trade, Sell, or Hold",
      description: "You can transfer ownership, sell your items on marketplaces, or keep them as digital collectibles."
    }
  ];

  const wallets = [
    {
      icon: "🦊",
      name: "Metamask",
      description: "Secure Ethereum Wallet",
      badge: "Recommended",
      badgeType: "recommended"
    },
    {
      icon: "🔷",
      name: "Trust",
      description: "Multi-chain Crypto Wallet", 
      badge: "Recent",
      badgeType: "recent"
    },
    {
      icon: "🔗",
      name: "Wallet Connect",
      description: "Scan & Connect Easily",
      badge: "Detect",
      badgeType: "detect"
    },
    {
      icon: "📱",
      name: "Coinbase Wallet",
      description: "Coinbase Account Integration",
      badge: "Detect", 
      badgeType: "detect"
    }
  ];

  return (
    <section className="steps-section">
      <div className="container">
        <FadeInUp>
          <div className="section-header">
            <h2 className="section-title">The Simple Steps to Owning Digital Assets</h2>
            <p className="section-description">
              Digital ownership is powered by blockchain technology, a secure, transparent, and decentralized system.
            </p>
          </div>
        </FadeInUp>

        <div className="steps-content">
          <div className="steps-list">
            {steps.map((step, index) => (
              <FadeInUp key={index} delay={index * 200}>
                <div className="step-item">
                  <div className="step-number">{step.number}</div>
                  <div className="step-content">
                    <h3 className="step-title">{step.title}</h3>
                    <p className="step-description">{step.description}</p>
                  </div>
                </div>
              </FadeInUp>
            ))}
          </div>

          <FadeInUp delay={400}>
            <div className="wallet-connect-card">
              <h3 className="card-title">Connect Wallet</h3>
              <div className="wallet-list">
                {wallets.map((wallet, index) => (
                  <div key={index} className="wallet-item">
                    <div className="wallet-icon">{wallet.icon}</div>
                    <div className="wallet-info">
                      <div className="wallet-name">{wallet.name}</div>
                      <div className="wallet-description">{wallet.description}</div>
                    </div>
                    <div className={`wallet-badge ${wallet.badgeType}`}>
                      {wallet.badge}
                    </div>
                  </div>
                ))}
              </div>
              <p className="disclaimer">
                By connecting your wallet, you agree to our Terms of Use.
              </p>
            </div>
          </FadeInUp>
        </div>
      </div>
    </section>
  );
};

export default StepsSection;
