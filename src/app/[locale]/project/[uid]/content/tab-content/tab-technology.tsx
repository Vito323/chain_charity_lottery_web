'use client';

import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import { useTranslations } from 'next-intl';

interface TabTechnologyProps {
  projectInfo?: any;
}

const TabTechnology = ({ projectInfo }: TabTechnologyProps) => {
  const t = useTranslations('projectDetail.technology');
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  const technologies = [
    {
      name: "React",
      description: t('technologies.react'),
      icon: "ti-atom",
      category: t('categories.frontend'),
      color: "from-blue-500 to-cyan-500"
    },
    {
      name: "Next.js",
      description: t('technologies.nextjs'),
      icon: "▲",
      category: t('categories.framework'),
      color: "from-gray-500 to-gray-700"
    },
    {
      name: "TypeScript",
      description: t('technologies.typescript'),
      icon: "ti-code",
      category: t('categories.language'),
      color: "from-blue-600 to-blue-800"
    },
    {
      name: "Tailwind CSS",
      description: t('technologies.tailwind'),
      icon: "ti-palette",
      category: t('categories.styling'),
      color: "from-cyan-500 to-teal-500"
    },
    {
      name: "Framer Motion",
      description: t('technologies.framerMotion'),
      icon: "ti-zap",
      category: t('categories.animation'),
      color: "from-purple-500 to-pink-500"
    },
    {
      name: "Node.js",
      description: t('technologies.nodejs'),
      icon: "ti-server",
      category: t('categories.backend'),
      color: "from-green-500 to-emerald-500"
    },
    {
      name: "PostgreSQL",
      description: t('technologies.postgresql'),
      icon: "ti-database",
      category: t('categories.database'),
      color: "from-blue-700 to-indigo-700"
    },
    {
      name: "Docker",
      description: t('technologies.docker'),
      icon: "ti-layers",
      category: t('categories.devops'),
      color: "from-blue-400 to-blue-600"
    }
  ];

  const categories = [...new Set(technologies.map(tech => tech.category))];

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

      {/* 技术分类 */}
      <motion.div variants={containerVariants} className="space-y-8">
        {categories.map((category, categoryIndex) => (
          <motion.div key={category} variants={itemVariants}>
            <h3 className="text-xl font-bold text-white mb-6 flex items-center">
              <span className="w-2 h-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full mr-3"></span>
              {category}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {technologies
                .filter(tech => tech.category === category)
                .map((tech, techIndex) => (
                  <motion.div
                    key={tech.name}
                    variants={itemVariants}
                    className="group bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-4 hover:bg-white/10 transition-all duration-300 hover:scale-105"
                    whileHover={{ y: -2 }}
                  >
                    <div className={`inline-flex items-center justify-center w-12 h-12 rounded-lg bg-gradient-to-r ${tech.color} mb-3`}>
                      <i className={`${tech.icon} text-lg text-white`}></i>
                    </div>
                    <h4 className="text-lg font-semibold text-white mb-2 group-hover:text-purple-300 transition-colors duration-300">
                      {tech.name}
                    </h4>
                    <p className="text-white/70 text-sm leading-relaxed">
                      {tech.description}
                    </p>
                  </motion.div>
                ))}
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* 技术优势 */}
      <motion.div variants={itemVariants} className="mt-12">
        <div className="bg-gradient-to-r from-purple-600/20 to-pink-600/20 rounded-2xl p-8 border border-white/10">
          <h3 className="text-2xl font-bold text-white mb-6 text-center">
            {t('whyMatters.title')}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <i className="ti-rocket text-4xl text-purple-400 mb-4"></i>
              <h4 className="text-lg font-semibold text-white mb-2">{t('whyMatters.performance.title')}</h4>
              <p className="text-white/80 text-sm">
                {t('whyMatters.performance.description')}
              </p>
            </div>
            <div className="text-center">
              <i className="ti-lock text-4xl text-purple-400 mb-4"></i>
              <h4 className="text-lg font-semibold text-white mb-2">{t('whyMatters.security.title')}</h4>
              <p className="text-white/80 text-sm">
                {t('whyMatters.security.description')}
              </p>
            </div>
            <div className="text-center">
              <i className="ti-trending-up text-4xl text-purple-400 mb-4"></i>
              <h4 className="text-lg font-semibold text-white mb-2">{t('whyMatters.scalability.title')}</h4>
              <p className="text-white/80 text-sm">
                {t('whyMatters.scalability.description')}
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default TabTechnology;
