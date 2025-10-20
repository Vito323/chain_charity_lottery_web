"use client";
import { useState } from "react";
import "./style.scss";
import FadeInUp from "../animations/FadeInUp";

const FaqSection = () => {
  const [expandedItem, setExpandedItem] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const faqItems = [
    {
      question: "What is Web3?",
      answer: "Web3 is the next evolution of the internet, built on blockchain technology. It enables decentralized applications, digital ownership, and peer-to-peer interactions without intermediaries."
    },
    {
      question: "What can I own in Web3?",
      answer: "You can own digital assets like NFTs (art, music, collectibles), cryptocurrency, virtual land, in-game items, and even your digital identity. Everything is verifiable and truly yours."
    },
    {
      question: "How do I get started?",
      answer: "Getting started is easy! First, set up a crypto wallet like MetaMask, then connect it to our platform. You can then browse, purchase, or create digital assets."
    },
    {
      question: "Do I need technical knowledge?",
      answer: "No technical knowledge required! Our platform is designed to be user-friendly. We provide guides and support to help you navigate the Web3 space easily."
    },
    {
      question: "Are my assets safe?",
      answer: "Yes! Your assets are secured by blockchain technology and smart contracts. Only you have access to your wallet and assets through your private keys."
    },
    {
      question: "Can I use my assets outside this site?",
      answer: "Absolutely! Your digital assets are yours and can be used across different platforms, marketplaces, and applications that support the same blockchain standards."
    }
  ];

  const toggleExpanded = (index: number) => {
    setExpandedItem(expandedItem === index ? null : index);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle search functionality here
    console.log("Searching for:", searchQuery);
  };

  return (
    <section className="faq-section">
      <div className="container">
        <FadeInUp>
          <div className="section-header">
            <h2 className="section-title">Got Questions? We've Got Answers</h2>
            <p className="section-subtitle">Crypto FAQ, AI-Powered for Speed & Clarity</p>
            
            <form className="search-form" onSubmit={handleSearch}>
              <input
                type="text"
                placeholder="Ask anything"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-input"
              />
              <button type="submit" className="search-button">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M22 2L11 13M22 2L15 22L11 13M22 2L2 9L11 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </form>
          </div>
        </FadeInUp>

        <div className="faq-list fade-in-up-stagger">
          {faqItems.map((item, index) => (
            <FadeInUp key={index} delay={index * 100}>
              <div className="faq-item">
                <button
                  className="faq-question"
                  onClick={() => toggleExpanded(index)}
                >
                  <span className="question-text">{item.question}</span>
                  <div className={`expand-icon ${expandedItem === index ? 'expanded' : ''}`}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 5V19M12 19L5 12M12 19L19 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                </button>
                
                <div className={`faq-answer ${expandedItem === index ? 'expanded' : ''}`}>
                  <div className="answer-content">
                    {item.answer}
                  </div>
                </div>
              </div>
            </FadeInUp>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FaqSection;
