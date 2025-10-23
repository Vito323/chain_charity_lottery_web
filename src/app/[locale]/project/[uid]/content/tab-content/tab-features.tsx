'use client';

import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';

interface TabFeaturesProps {
  projectInfo?: any;
}

const TabFeatures = ({ projectInfo }: TabFeaturesProps) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  const features = [
    {
      title: "Modern Design",
      description: "Cutting-edge UI/UX design that captivates and engages users with intuitive interfaces and stunning visuals.",
      icon: "ti-palette",
      color: "from-purple-500 to-pink-500"
    },
    {
      title: "High Performance",
      description: "Optimized for speed and efficiency across all devices, ensuring smooth user experiences and fast load times.",
      icon: "ti-zap",
      color: "from-blue-500 to-cyan-500"
    },
    {
      title: "Scalable Solutions",
      description: "Built to grow with your business needs and requirements, supporting everything from startups to enterprises.",
      icon: "ti-trending-up",
      color: "from-green-500 to-emerald-500"
    },
    {
      title: "Secure & Reliable",
      description: "Enterprise-grade security and 99.9% uptime guarantee, ensuring your data and applications are always protected.",
      icon: "ti-lock",
      color: "from-orange-500 to-red-500"
    },
    {
      title: "Cross-Platform",
      description: "Seamless experience across all platforms and devices, from desktop to mobile and everything in between.",
      icon: "ti-device-mobile",
      color: "from-indigo-500 to-purple-500"
    },
    {
      title: "24/7 Support",
      description: "Round-the-clock support and maintenance, ensuring your project runs smoothly at all times.",
      icon: "ti-tools",
      color: "from-teal-500 to-blue-500"
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: 'easeOut' as const,
      },
    },
  };

  return (
    <motion.div
      ref={ref}
      variants={containerVariants}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      className="bg-white/5 backdrop-blur-sm rounded-3xl border border-white/10 p-8"
    >
      <motion.div variants={itemVariants} className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
          Key Features
        </h2>
        <p className="text-lg text-white/80 max-w-2xl mx-auto">
          Discover the comprehensive range of features and capabilities that make our platform stand out
        </p>
      </motion.div>

      <motion.div variants={containerVariants} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((feature, index) => (
          <motion.div
            key={index}
            variants={itemVariants}
            className="group bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-6 hover:bg-white/10 transition-all duration-300 hover:scale-105"
            whileHover={{ y: -5 }}
          >
            <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-r ${feature.color} mb-4`}>
              <i className={`${feature.icon} text-2xl text-white`}></i>
            </div>
            <h3 className="text-xl font-bold text-white mb-3 group-hover:text-purple-300 transition-colors duration-300">
              {feature.title}
            </h3>
            <p className="text-white/70 leading-relaxed">
              {feature.description}
            </p>
          </motion.div>
        ))}
      </motion.div>

      {/* 额外信息 */}
      <motion.div variants={itemVariants} className="mt-12 text-center">
        <div className="bg-gradient-to-r from-purple-600/20 to-pink-600/20 rounded-2xl p-8 border border-white/10">
          <h3 className="text-2xl font-bold text-white mb-4">
            Why Choose Our Platform?
          </h3>
          <p className="text-white/80 leading-relaxed max-w-3xl mx-auto">
            Our platform combines cutting-edge technology with user-centric design to deliver 
            exceptional experiences. We're committed to continuous innovation and excellence, 
            ensuring that our users always have access to the best tools and features available.
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default TabFeatures;
