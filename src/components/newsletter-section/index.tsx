"use client";
import { useState } from "react";
import "./style.scss";
import FadeInUp from "../animations/FadeInUp";

const NewsletterSection = () => {
  const [email, setEmail] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);

  const benefits = [
    "Early access to marketplace launches",
    "Weekly insights from our research team", 
    "Airdrop & whitelist alerts"
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      // Handle email subscription here
      console.log("Subscribing email:", email);
      setIsSubscribed(true);
      setEmail("");
      
      // Reset subscription status after 3 seconds
      setTimeout(() => setIsSubscribed(false), 3000);
    }
  };

  return (
    <section className="newsletter-section">
      <div className="container">
        <div className="newsletter-content">
          <FadeInUp>
            <div className="section-header">
              <h2 className="section-title">Stay Ahead in Web3</h2>
              <p className="section-subtitle">
                Subscribe to our newsletter and get the latest updates, alpha drops, and crypto trends—straight to your inbox.
              </p>
            </div>
          </FadeInUp>

          <div className="benefits-list fade-in-up-stagger">
            {benefits.map((benefit, index) => (
              <FadeInUp key={index} delay={index * 150}>
                <div className="benefit-item">
                  <div className="check-icon">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <span className="benefit-text">{benefit}</span>
                </div>
              </FadeInUp>
            ))}
          </div>

          <FadeInUp delay={600}>
            <form className="subscription-form" onSubmit={handleSubmit}>
              <div className="email-input-group">
                <input
                  type="email"
                  placeholder="Enter your email..."
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="email-input"
                  required
                />
                <button type="submit" className="subscribe-button">
                  Subscribe
                </button>
              </div>
              
              {isSubscribed && (
                <div className="success-message">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  Successfully subscribed!
                </div>
              )}
            </form>
          </FadeInUp>
        </div>
      </div>
    </section>
  );
};

export default NewsletterSection;
