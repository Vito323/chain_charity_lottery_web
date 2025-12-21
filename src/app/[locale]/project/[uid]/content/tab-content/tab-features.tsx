'use client';

import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import { useTranslations } from 'next-intl';

const TabFeatures = () => {
  const t = useTranslations('projectDetail.features');
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  const features = [
    {
      title: t('items.modernDesign.title'),
      description: t('items.modernDesign.description'),
      icon: "ti-palette",
      color: "from-purple-500 to-pink-500"
    },
    {
      title: t('items.highPerformance.title'),
      description: t('items.highPerformance.description'),
      icon: "ti-zap",
      color: "from-blue-500 to-cyan-500"
    },
    {
      title: t('items.scalableSolutions.title'),
      description: t('items.scalableSolutions.description'),
      icon: "ti-trending-up",
      color: "from-green-500 to-emerald-500"
    },
    {
      title: t('items.secureReliable.title'),
      description: t('items.secureReliable.description'),
      icon: "ti-lock",
      color: "from-orange-500 to-red-500"
    },
    {
      title: t('items.crossPlatform.title'),
      description: t('items.crossPlatform.description'),
      icon: "ti-device-mobile",
      color: "from-indigo-500 to-purple-500"
    },
    {
      title: t('items.support.title'),
      description: t('items.support.description'),
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
          {t('title')}
        </h2>
        <p className="text-lg text-white/80 max-w-2xl mx-auto">
          {t('subtitle')}
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
            {t('whyChoose.title')}
          </h3>
          <p className="text-white/80 leading-relaxed max-w-3xl mx-auto">
            {t('whyChoose.description')}
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default TabFeatures;
