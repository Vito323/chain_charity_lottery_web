import "./style.scss";
import { ScrollReveal, AnimatedButton } from "../reactbits";

const ImportanceSection = () => {
  const cards = [
    {
      icon: (
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M15 7H9V5C9 4.45 9.45 4 10 4H14C14.55 4 15 4.45 15 5V7ZM9 9H15V19C15 19.55 14.55 20 14 20H10C9.45 20 9 19.55 9 19V9Z" fill="currentColor"/>
          <path d="M7 9H5C4.45 9 4 9.45 4 10V18C4 18.55 4.45 19 5 19H7V9Z" fill="currentColor"/>
          <path d="M19 9H17V19H19C19.55 19 20 18.55 20 18V10C20 9.45 19.55 9 19 9Z" fill="currentColor"/>
        </svg>
      ),
      title: "True Ownership",
      description: "You don't rent digital goods—you own them. No platform can take them away."
    },
    {
      icon: (
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z" fill="currentColor"/>
        </svg>
      ),
      title: "Transparency",
      description: "Every action is recorded and publicly verifiable. No hidden edits or centralized control."
    },
    {
      icon: (
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" fill="currentColor"/>
        </svg>
      ),
      title: "Creator Empowerment",
      description: "Artists, developers, and creators can earn royalties forever—automatically."
    }
  ];

  return (
    <section className="importance-section">
      <div className="container">
        <div className="section-content">
          <ScrollReveal>
            <h2 className="section-title">Why Digital Ownership Truly Matters</h2>
          </ScrollReveal>
          
          <div className="cards-grid scroll-reveal-stagger">
            {cards.map((card, index) => (
              <ScrollReveal key={index} delay={index * 150}>
                <div className="importance-card">
                  <div className="card-icon">
                    {card.icon}
                  </div>
                  <h3 className="card-title">{card.title}</h3>
                  <p className="card-description">{card.description}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>

          <ScrollReveal delay={600}>
            <div className="cta-buttons">
              <AnimatedButton variant="primary">
                Connect Wallet
              </AnimatedButton>
              <AnimatedButton variant="secondary">
                Explore Marketplace
              </AnimatedButton>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={800}>
            <p className="section-footer">
              Web3 puts the power back in the hands of users. No gatekeepers, no boundaries.
            </p>
          </ScrollReveal>
        </div>
      </div>
      
      <div className="background-graphics">
        <div className="crypto-coin coin-1"></div>
        <div className="crypto-coin coin-2"></div>
        <div className="crypto-coin coin-3"></div>
      </div>
    </section>
  );
};

export default ImportanceSection;
