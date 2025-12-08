'use client';

import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import Image from 'next/image';
import VideoModal from '../modal-video';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';

const About = () => {
  const t = useTranslations('about');
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

  const imageVariants = {
    hidden: { opacity: 0, x: 50 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 1,
        ease: 'easeOut' as const,
      },
    },
  };

  return (
    <section ref={ref} className="py-28 bg-gradient-to-b from-slate-900 to-slate-950">
      <div className="max-w-7xl mx-auto px-6 md:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
          {/* Text Content */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            className="space-y-6 order-1 lg:order-1"
          >
            <motion.div variants={itemVariants}>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/10 bg-white/5 backdrop-blur-sm text-white/80 text-xs mb-4">
                <span className="w-1.5 h-1.5 rounded-full bg-fuchsia-400" />
                {t('badge')}
              </div>
              <h2 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight leading-tight">
                {t('title')}
              </h2>
            </motion.div>

            <motion.div variants={itemVariants} className="space-y-4">
              <p className="text-lg text-white/80 leading-relaxed">
                {t('description1')}
              </p>
              <p className="text-lg text-white/80 leading-relaxed">
                {t('description2')}
              </p>
            </motion.div>

            <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4 items-start sm:items-center mt-6">
              <Link
                href="/project"
                className="px-8 py-4 bg-gradient-to-r from-purple-600 via-pink-600 to-fuchsia-600 text-white font-semibold rounded-full text-lg hover:from-purple-700 hover:via-pink-700 hover:to-fuchsia-700 transition-all duration-300 shadow-lg hover:shadow-purple-500/25 hover:scale-105"
              >
                {t('donateNow')}
              </Link>
              <div className="flex items-center gap-3">
                <VideoModal />
                <span className="text-white/70 text-lg">{t('watchVideo')}</span>
              </div>
            </motion.div>
          </motion.div>

          {/* Image Content */}
          <motion.div
            variants={imageVariants}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            className="relative order-2 lg:order-2"
          >
            <div className="relative group">
              {/* Main image container with glassmorphism effect */}
              <div className="relative rounded-3xl overflow-hidden border border-white/10 bg-white/5 backdrop-blur-sm p-4">
                <Image
                  src="/images/about3.png"
                  alt="About us"
                  width={600}
                  height={500}
                  className="w-full h-auto rounded-2xl object-cover group-hover:scale-105 transition-transform duration-500"
                />
                
                {/* Overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/50 via-transparent to-transparent rounded-2xl" />
              </div>

              {/* Floating decorative elements */}
              <motion.div
                className="absolute -top-4 -right-4 w-20 h-20 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full blur-xl"
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.3, 0.6, 0.3],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              />
              <motion.div
                className="absolute -bottom-6 -left-6 w-32 h-32 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-full blur-xl"
                animate={{
                  scale: [1.2, 1, 1.2],
                  opacity: [0.4, 0.7, 0.4],
                }}
                transition={{
                  duration: 6,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              />

              {/* Glow effect */}
              <div className="pointer-events-none absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-md bg-gradient-to-r from-purple-600/20 via-pink-600/20 to-fuchsia-600/20" />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default About;
