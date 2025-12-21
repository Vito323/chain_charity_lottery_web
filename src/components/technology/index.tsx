'use client';

import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';

const Technology = () => {
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
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: 'easeOut' as const,
      },
    },
  };

  const technologies = [
    {
      name: 'Machine Learning',
      description: 'Advanced algorithms that learn and adapt from data patterns.',
      icon: (
        <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 20 20">
          <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      gradient: 'from-blue-500 to-cyan-500',
    },
    {
      name: 'Deep Learning',
      description: 'Neural networks that mimic human brain processing.',
      icon: (
        <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3zm11.707 4.707a1 1 0 00-1.414-1.414L10 9.586 8.707 8.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
        </svg>
      ),
      gradient: 'from-purple-500 to-pink-500',
    },
    {
      name: 'Natural Language Processing',
      description: 'Understanding and generating human language with precision.',
      icon: (
        <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L3 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
        </svg>
      ),
      gradient: 'from-green-500 to-emerald-500',
    },
    {
      name: 'Computer Vision',
      description: 'Advanced image and video analysis capabilities.',
      icon: (
        <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
        </svg>
      ),
      gradient: 'from-orange-500 to-red-500',
    },
    {
      name: 'Reinforcement Learning',
      description: 'AI that learns through trial and error interactions.',
      icon: (
        <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 11-1.898-.632l4-12a1 1 0 011.265-.633zM5.707 6.293a1 1 0 010 1.414L3.414 10l2.293 2.293a1 1 0 11-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0zm8.586 0a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 11-1.414-1.414L16.586 10l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
        </svg>
      ),
      gradient: 'from-indigo-500 to-purple-500',
    },
    {
      name: 'Edge Computing',
      description: 'Processing AI models closer to the data source.',
      icon: (
        <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
        </svg>
      ),
      gradient: 'from-pink-500 to-rose-500',
    },
  ];

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
            Cutting-Edge Technology
          </motion.h2>
          <motion.p
            variants={itemVariants}
            className="text-xl text-gray-300 max-w-3xl mx-auto"
          >
            Built on the latest advancements in artificial intelligence and machine learning technologies.
          </motion.p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {technologies.map((tech, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="group relative p-8 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 hover:border-white/20 transition-all duration-300"
              whileHover={{ y: -5, scale: 1.02 }}
            >
              {/* Background Gradient */}
              <div className={`absolute inset-0 bg-gradient-to-br ${tech.gradient} opacity-0 group-hover:opacity-10 rounded-2xl transition-opacity duration-300`} />
              
              {/* Icon */}
              <div className={`relative z-10 w-20 h-20 bg-gradient-to-br ${tech.gradient} rounded-2xl flex items-center justify-center text-white mb-6 group-hover:scale-110 transition-transform duration-300`}>
                {tech.icon}
              </div>

              {/* Content */}
              <div className="relative z-10">
                <h3 className="text-xl font-semibold text-white mb-4 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-purple-400 group-hover:to-pink-400 group-hover:bg-clip-text transition-all duration-300">
                  {tech.name}
                </h3>
                <p className="text-gray-300 leading-relaxed">
                  {tech.description}
                </p>
              </div>

              {/* Hover Effect */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-purple-500/0 via-pink-500/0 to-purple-500/0 group-hover:from-purple-500/5 group-hover:via-pink-500/5 group-hover:to-purple-500/5 transition-all duration-500" />
            </motion.div>
          ))}
        </motion.div>

        {/* Technology Stats */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="mt-20 grid grid-cols-1 md:grid-cols-4 gap-8"
        >
          {[
            { number: '99.9%', label: 'Accuracy Rate' },
            { number: '< 100ms', label: 'Response Time' },
            { number: '50+', label: 'AI Models' },
            { number: '24/7', label: 'Monitoring' },
          ].map((stat, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="text-center group"
              whileHover={{ scale: 1.05 }}
            >
              <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-2 group-hover:from-pink-400 group-hover:to-purple-400 transition-all duration-300">
                {stat.number}
              </div>
              <div className="text-gray-300 text-lg">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>

        {/* CTA Section */}
        <motion.div
          variants={itemVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="text-center mt-16"
        >
          <motion.button
            className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-full text-lg hover:from-purple-700 hover:to-pink-700 transition-all duration-300 shadow-lg hover:shadow-xl"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Explore Our Technology
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
};

export default Technology;