'use client';

import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';

const StalwartRoadmap = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -50 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.8,
        ease: 'easeOut',
      },
    },
  };

  const roadmapItems = [
    {
      quarter: 'Q1 2024',
      title: 'Foundation & Core AI',
      description: 'Launched our core AI platform with basic machine learning capabilities.',
      status: 'completed',
      features: [
        'Core AI Engine Development',
        'Basic ML Model Training',
        'API Infrastructure',
        'Initial User Interface',
      ],
    },
    {
      quarter: 'Q2 2024',
      title: 'Advanced Features',
      description: 'Enhanced platform with advanced AI capabilities and improved performance.',
      status: 'completed',
      features: [
        'Natural Language Processing',
        'Computer Vision Integration',
        'Real-time Processing',
        'Enhanced Security',
      ],
    },
    {
      quarter: 'Q3 2024',
      title: 'Enterprise Solutions',
      description: 'Introduced enterprise-grade features and scalability improvements.',
      status: 'completed',
      features: [
        'Enterprise Dashboard',
        'Advanced Analytics',
        'Custom Model Training',
        '24/7 Support',
      ],
    },
    {
      quarter: 'Q4 2024',
      title: 'AI Ecosystem',
      description: 'Building a comprehensive AI ecosystem with third-party integrations.',
      status: 'current',
      features: [
        'Third-party Integrations',
        'Marketplace Launch',
        'Community Features',
        'Mobile Applications',
      ],
    },
    {
      quarter: 'Q1 2025',
      title: 'Global Expansion',
      description: 'Expanding globally with multi-language support and regional data centers.',
      status: 'upcoming',
      features: [
        'Multi-language Support',
        'Regional Data Centers',
        'Global Compliance',
        'Local Partnerships',
      ],
    },
    {
      quarter: 'Q2 2025',
      title: 'Next-Gen AI',
      description: 'Introducing next-generation AI capabilities with quantum computing integration.',
      status: 'upcoming',
      features: [
        'Quantum AI Integration',
        'Advanced Neural Networks',
        'Predictive Analytics',
        'Autonomous Systems',
      ],
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'from-green-500 to-emerald-500';
      case 'current':
        return 'from-purple-500 to-pink-500';
      case 'upcoming':
        return 'from-gray-500 to-gray-600';
      default:
        return 'from-gray-500 to-gray-600';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed':
        return 'Completed';
      case 'current':
        return 'In Progress';
      case 'upcoming':
        return 'Upcoming';
      default:
        return 'Upcoming';
    }
  };

  return (
    <section ref={ref} className="py-20 bg-gradient-to-b from-slate-900 to-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="text-center mb-16"
        >
          <motion.h2
            variants={itemVariants}
            className="text-4xl md:text-5xl font-bold text-white mb-6"
          >
            Our Roadmap
          </motion.h2>
          <motion.p
            variants={itemVariants}
            className="text-xl text-gray-300 max-w-3xl mx-auto"
          >
            Follow our journey as we build the future of artificial intelligence, one milestone at a time.
          </motion.p>
        </motion.div>

        {/* Roadmap Timeline */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="relative"
        >
          {/* Timeline Line */}
          <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-purple-500 via-pink-500 to-gray-500 transform md:-translate-x-0.5" />

          {/* Roadmap Items */}
          <div className="space-y-12">
            {roadmapItems.map((item, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className={`relative flex items-center ${
                  index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                }`}
              >
                {/* Timeline Dot */}
                <div className="absolute left-6 md:left-1/2 w-4 h-4 bg-white rounded-full border-4 border-purple-500 transform md:-translate-x-2 z-10" />

                {/* Content Card */}
                <div className={`ml-16 md:ml-0 md:w-1/2 ${
                  index % 2 === 0 ? 'md:pr-8' : 'md:pl-8'
                }`}>
                  <motion.div
                    className="group relative p-8 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 hover:border-white/20 transition-all duration-300"
                    whileHover={{ y: -5 }}
                  >
                    {/* Status Badge */}
                    <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold mb-4 bg-gradient-to-r ${getStatusColor(item.status)} text-white`}>
                      {getStatusText(item.status)}
                    </div>

                    {/* Quarter */}
                    <div className="text-purple-400 font-semibold text-lg mb-2">
                      {item.quarter}
                    </div>

                    {/* Title */}
                    <h3 className="text-xl font-bold text-white mb-4 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-purple-400 group-hover:to-pink-400 group-hover:bg-clip-text transition-all duration-300">
                      {item.title}
                    </h3>

                    {/* Description */}
                    <p className="text-gray-300 mb-6 leading-relaxed">
                      {item.description}
                    </p>

                    {/* Features */}
                    <ul className="space-y-2">
                      {item.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-center text-gray-300 text-sm">
                          <svg className="w-4 h-4 text-green-400 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                          {feature}
                        </li>
                      ))}
                    </ul>

                    {/* Hover Effect */}
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-purple-500/0 via-pink-500/0 to-purple-500/0 group-hover:from-purple-500/5 group-hover:via-pink-500/5 group-hover:to-purple-500/5 transition-all duration-500" />
                  </motion.div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* CTA Section */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="text-center mt-16"
        >
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-8 max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold text-white mb-4">
              Stay Updated
            </h3>
            <p className="text-gray-300 mb-6">
              Get notified about our latest updates, new features, and roadmap progress.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.button
                className="px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-full hover:from-purple-700 hover:to-pink-700 transition-all duration-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Subscribe to Updates
              </motion.button>
              <motion.button
                className="px-8 py-3 border-2 border-white/30 text-white font-semibold rounded-full hover:bg-white/10 transition-all duration-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                View Full Roadmap
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default StalwartRoadmap;