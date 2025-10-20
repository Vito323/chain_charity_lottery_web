import "./style.scss";
import { ScrollReveal } from "../reactbits";

const DigitalOwnershipSection = () => {
  const cards = [
    {
      icon: (
        <div className="icon-grid">
          <div className="grid-item"></div>
          <div className="grid-item"></div>
          <div className="grid-item"></div>
          <div className="grid-item"></div>
        </div>
      ),
      title: "Own Your Identity",
      description: "With decentralized identities, you control how and where your personal information is used—no more data harvesting."
    },
    {
      icon: (
        <div className="icon-crypto">
          <div className="crypto-symbol btc">₿</div>
          <div className="crypto-symbol eth">Ξ</div>
          <div className="crypto-symbol ltc">Ł</div>
          <div className="crypto-symbol other">$</div>
        </div>
      ),
      title: "Own Rare Digital Assets",
      description: "From Bitcoin to altcoins, stablecoins to tokens—crypto makes financial ownership borderless and decentralized."
    },
    {
      icon: (
        <div className="icon-chart">
          <div className="chart-line"></div>
          <div className="chart-bars">
            <div className="bar"></div>
            <div className="bar"></div>
            <div className="bar"></div>
          </div>
        </div>
      ),
      title: "Own Your Financial Future",
      description: "DeFi (Decentralized Finance) gives you access to borderless financial systems, from earning interest to lending assets—all powered by smart contracts."
    },
    {
      icon: (
        <div className="icon-dao">
          <div className="dao-text">DAO</div>
          <div className="dao-network">
            <div className="node"></div>
            <div className="node"></div>
            <div className="node"></div>
            <div className="node"></div>
          </div>
        </div>
      ),
      title: "Own Your Role in the New Web",
      description: "Participate in DAOs, support open protocols, and help build a transparent digital economy."
    }
  ];

  return (
    <section className="digital-ownership-section">
      <div className="container">
        <ScrollReveal>
          <div className="section-header">
            <h2 className="section-title">What Does Digital Ownership Mean in Web3?</h2>
            <p className="section-description">
              Powered by blockchain, every crypto asset and smart contract is secure, decentralized.
            </p>
          </div>
        </ScrollReveal>
        
        <div className="cards-grid scroll-reveal-stagger">
          {cards.map((card, index) => (
            <ScrollReveal key={index} delay={index * 100}>
              <div className="ownership-card">
                <div className="card-icon">
                  {card.icon}
                </div>
                <h3 className="card-title">{card.title}</h3>
                <p className="card-description">{card.description}</p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
};

export default DigitalOwnershipSection;
