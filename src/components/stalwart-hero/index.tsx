'use client';

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { useCounterAnimation } from '@/hooks/useScrollAnimation';
import Link from 'next/link';
const StalwartHero = () => {
  const [isLoaded, setIsLoaded] = useState(false);

  // 计数动画钩子
  const { elementRef: donationRef, currentValue: donationValue } = useCounterAnimation(6200, 2);
  const { elementRef: fundRef, currentValue: fundValue } = useCounterAnimation(635, 2);
  const { elementRef: volunteersRef, currentValue: volunteersValue } = useCounterAnimation(245, 2);
  const { elementRef: projectsRef, currentValue: projectsValue } = useCounterAnimation(605, 2);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3,
        delayChildren: 0.2,
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

  const GRID_PATTERN_URL = "data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.08'%3E%3Ccircle cx='30' cy='30' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E";
  const SPHERE_MP4 = '/assets/videos/65f4bba832c832613f1a4dfd_Sphere_(dark_theme)-transcode.mp4';
  const SPHERE_WEBM = '/assets/videos/65f4bba832c832613f1a4dfd_Sphere_(dark_theme)-transcode.webm';
  const SPHERE_POSTER = '/assets/images/65f4bba832c832613f1a4dfd_Sphere_(dark_theme)-poster-00001.jpg';

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-32 md:pt-40">
      {/* Background Elements */}
      <div className="absolute inset-0 z-0">
        {/* Video Background */}
        <div className="absolute inset-0">
          <video
            className="w-full h-full object-cover opacity-40"
            autoPlay
            loop
            muted
            playsInline
            poster={SPHERE_POSTER}
          >
            <source src={SPHERE_WEBM} type="video/webm" />
            <source src={SPHERE_MP4} type="video/mp4" />
          </video>
        </div>
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/90 via-slate-900/70 to-slate-950/95" />
        
        {/* Animated Background Shapes */}
        <motion.div
          className="absolute top-20 left-10 w-72 h-72 bg-purple-500/20 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
        <motion.div
          className="absolute bottom-20 right-10 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.4, 0.7, 0.4],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
        
        {/* Grid Pattern */}
        <div
          className="absolute inset-0 opacity-30"
          style={{ backgroundImage: `url("${GRID_PATTERN_URL}")` }}
        />
      </div>
      {/* Main Content */}
      <motion.div
        className="relative z-10 max-w-7xl mx-auto px-6 md:px-8 text-center"
        variants={containerVariants}
        initial="hidden"
        animate={isLoaded ? "visible" : "hidden"}
      >
        {/* Subtle radial highlight behind text to improve readability */}
        <div className="pointer-events-none absolute -z-10 left-1/2 top-8 -translate-x-1/2 w-[60vw] max-w-3xl aspect-square rounded-full bg-[radial-gradient(closest-side,rgba(255,255,255,0.08),transparent_65%)]" />
        {/* Main Heading */}
        <motion.div variants={itemVariants} className="mb-12">
          <motion.div
            className="inline-flex items-center gap-2.5 px-3 py-2 rounded-full border border-white/15 bg-white/5 backdrop-blur-sm text-white/90 drop-shadow-[0_2px_8px_rgba(0,0,0,0.6)]"
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.6 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs md:text-sm">Connecting the world with Kindness</span>
          </motion.div>
          <h1 className="mt-6 text-[2.5rem] md:text-6xl lg:text-7xl xl:text-[5.2rem] font-extrabold text-white leading-[1.05] tracking-tight drop-shadow-[0_3px_16px_rgba(0,0,0,0.6)]">
            <motion.span
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.6 }}
              transition={{ duration: 0.7, ease: 'easeOut' }}
            >
              Connecting the world with 
            </motion.span>
            <br className="hidden md:block" />
            <motion.span
              className="bg-gradient-to-r from-purple-300 via-pink-300 to-fuchsia-300 bg-clip-text text-transparent"
              style={{ backgroundSize: '200% 100%' }}
              initial={{ backgroundPositionX: '0%' }}
              whileInView={{ backgroundPositionX: '100%' }}
              viewport={{ once: true, amount: 0.6 }}
              transition={{ duration: 1.8, ease: 'easeInOut' }}
            >
              Kindness
            </motion.span>
          </h1>
          <motion.p
            className="mt-6 text-base md:text-lg lg:text-xl text-white/90 max-w-3xl mx-auto leading-relaxed drop-shadow-[0_2px_10px_rgba(0,0,0,0.6)]"
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.6 }}
            transition={{ duration: 0.6, ease: 'easeOut', delay: 0.1 }}
          >
            Protecting our home with action.
          </motion.p>
        </motion.div>

        {/* CTA Buttons */}
        <motion.div
          variants={itemVariants}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-14"
        >
          <motion.div
            className="px-7 md:px-9 py-3.5 md:py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-full text-base md:text-lg hover:from-purple-700 hover:to-pink-700 transition-all duration-300 shadow-lg hover:shadow-purple-500/25"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
          >
            <Link href="/project">
            View project
            </Link>
          </motion.div>
        </motion.div>

        {/* Hero Image/Visual */}
        {/* <motion.div variants={itemVariants} className="relative max-w-5xl mx-auto">
          <motion.div
            className="relative w-full h-72 sm:h-80 md:h-[520px] rounded-3xl overflow-hidden border border-white/10 bg-white/5 backdrop-blur"
            variants={floatingVariants}
            animate="animate"
          >
            <video className="w-full h-full object-cover" autoPlay loop muted playsInline poster={CUBE_POSTER}>
              <source src={CUBE_WEBM} type="video/webm" />
              <source src={CUBE_MP4} type="video/mp4" />
            </video>
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-900/50 via-transparent to-transparent" />
          </motion.div>
        </motion.div> */}

        {/* Stats */}
        <motion.div
          variants={itemVariants}
          className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-16"
        >
          <motion.div
            className="text-center"
            whileHover={{ scale: 1.05 }}
          >
            <div className="text-4xl md:text-5xl font-bold text-white mb-2">
              <span ref={donationRef}>{donationValue.toLocaleString()}</span>+
            </div>
            <div className="text-gray-300 text-lg">Donation</div>
          </motion.div>
          
          <motion.div
            className="text-center"
            whileHover={{ scale: 1.05 }}
          >
            <div className="text-4xl md:text-5xl font-bold text-white mb-2">
              <span ref={fundRef}>{fundValue.toLocaleString()}</span>k
            </div>
            <div className="text-gray-300 text-lg">Fund Raised</div>
          </motion.div>
          
          <motion.div
            className="text-center"
            whileHover={{ scale: 1.05 }}
          >
            <div className="text-4xl md:text-5xl font-bold text-white mb-2">
              <span ref={volunteersRef}>{volunteersValue.toLocaleString()}</span>+
            </div>
            <div className="text-gray-300 text-lg">Volunteers</div>
          </motion.div>
          
          <motion.div
            className="text-center"
            whileHover={{ scale: 1.05 }}
          >
            <div className="text-4xl md:text-5xl font-bold text-white mb-2">
              <span ref={projectsRef}>{projectsValue.toLocaleString()}</span>+
            </div>
            <div className="text-gray-300 text-lg">Projects</div>
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Scroll Indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
          <motion.div
            className="w-1 h-3 bg-white rounded-full mt-2"
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </div>
      </motion.div>
    </section>
  );
};

export default StalwartHero;