"use client";
import { useState } from "react";
import { useTranslations } from 'next-intl';
import "./style.scss";
import FadeInUp from "../animations/FadeInUp";

const FaqSection = () => {
  const t = useTranslations('faq');
  const [expandedItem, setExpandedItem] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const faqItems = [
    {
      question: t('items.0.question'),
      answer: t('items.0.answer')
    },
    {
      question: t('items.1.question'),
      answer: t('items.1.answer')
    },
    {
      question: t('items.2.question'),
      answer: t('items.2.answer')
    },
    {
      question: t('items.3.question'),
      answer: t('items.3.answer')
    },
    {
      question: t('items.4.question'),
      answer: t('items.4.answer')
    },
    {
      question: t('items.5.question'),
      answer: t('items.5.answer')
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
            <h2 className="section-title">{t('title')}</h2>
            <p className="section-subtitle">{t('subtitle')}</p>
            
            <form className="search-form" onSubmit={handleSearch}>
              <input
                type="text"
                placeholder={t('searchPlaceholder')}
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
