"use client";
import { useState } from "react";
import { useTranslations } from 'next-intl';
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
    <section className="py-24 md:py-20 sm:py-16 bg-white dark:bg-gray-900">
      <div className="max-w-[800px] mx-auto px-5 md:px-4 sm:px-3">
        <FadeInUp>
          <div className="text-center mb-15 md:mb-12 sm:mb-10">
            <h2 className="text-5xl md:text-4xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-4 md:mb-3 sm:mb-2 leading-tight">
              {t('title')}
            </h2>
            <p className="text-xl md:text-lg sm:text-base text-gray-600 dark:text-gray-400 mb-10 md:mb-8 sm:mb-6 leading-relaxed">
              {t('subtitle')}
            </p>
            
            <form 
              className="flex max-w-[400px] mx-auto bg-white dark:bg-gray-800 rounded-xl border-2 border-gray-200 dark:border-gray-700 overflow-hidden transition-all duration-300 focus-within:border-blue-500 dark:focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500/10" 
              onSubmit={handleSearch}
            >
              <input
                type="text"
                placeholder={t('searchPlaceholder')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 px-5 md:px-4 py-4 md:py-3 border-none outline-none text-base text-gray-900 dark:text-white bg-transparent placeholder:text-gray-400 dark:placeholder:text-gray-500"
              />
              <button 
                type="submit" 
                className="bg-green-500 hover:bg-green-600 text-white border-none px-5 md:px-4 py-4 md:py-3 cursor-pointer transition-all duration-300 flex items-center justify-center"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M22 2L11 13M22 2L15 22L11 13M22 2L2 9L11 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </form>
          </div>
        </FadeInUp>

        <div className="flex flex-col gap-4">
          {faqItems.map((item, index) => (
            <FadeInUp key={index} delay={index * 100}>
              <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden transition-all duration-300 hover:border-gray-300 dark:hover:border-gray-600 hover:shadow-md">
                <button
                  className="w-full px-6 md:px-5 py-6 md:py-5 bg-transparent border-none text-left cursor-pointer flex justify-between items-center gap-5 transition-all duration-300 hover:bg-gray-50 dark:hover:bg-gray-700/50"
                  onClick={() => toggleExpanded(index)}
                >
                  <span className="text-lg md:text-base font-semibold text-gray-900 dark:text-white leading-relaxed flex-1">
                    {item.question}
                  </span>
                  <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-gray-600 dark:text-gray-400 transition-all duration-300 ${
                    expandedItem === index 
                      ? 'bg-blue-500 text-white rotate-180' 
                      : 'bg-gray-100 dark:bg-gray-700'
                  }`}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 5V19M12 19L5 12M12 19L19 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                </button>
                
                <div className={`overflow-hidden transition-all duration-300 ${
                  expandedItem === index ? 'max-h-[200px]' : 'max-h-0'
                }`}>
                  <div className="px-6 md:px-5 pb-6 md:pb-5 text-gray-600 dark:text-gray-400 leading-relaxed text-base">
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
