'use client';

import { motion } from 'framer-motion';

const BoostifyBackground = () => {
  return (
    <div className="absolute inset-0 z-0 overflow-hidden w-full h-full">
      {/* Base Gradient Background - More Visible */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-indigo-900/80 via-purple-900/70 to-slate-950" />
      
      {/* Large Animated Gradient Orbs - More Visible */}
      <motion.div
        className="absolute -top-40 -left-40 w-[600px] h-[600px] bg-gradient-to-br from-purple-500/30 to-purple-500/5 rounded-full blur-[120px]"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.5, 0.7, 0.5],
          x: [0, 80, 0],
          y: [0, 60, 0],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
      
      <motion.div
        className="absolute -bottom-40 -right-40 w-[700px] h-[700px] bg-gradient-to-tl from-pink-500/25 via-fuchsia-500/20 to-pink-500/5 rounded-full blur-[140px]"
        animate={{
          scale: [1.1, 1, 1.1],
          opacity: [0.4, 0.6, 0.4],
          x: [0, -60, 0],
          y: [0, -80, 0],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
      
      <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-to-r from-blue-500/20 via-cyan-500/15 to-blue-500/5 rounded-full blur-[100px]"
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.35, 0.55, 0.35],
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
      
      {/* Geometric Accents - More Visible */}
      <motion.div
        className="absolute top-32 right-32 w-40 h-40 border-2 border-purple-400/25 rounded-2xl rotate-45"
        animate={{
          rotate: [45, 225, 45],
          opacity: [0.2, 0.4, 0.2],
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: 'linear',
        }}
      />
      
      <motion.div
        className="absolute bottom-40 left-24 w-32 h-32 border-2 border-pink-400/20 rounded-full"
        animate={{
          scale: [1, 1.4, 1],
          opacity: [0.2, 0.35, 0.2],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
      
      <motion.div
        className="absolute top-1/3 right-1/4 w-20 h-20 border-2 border-blue-400/25 rotate-45"
        animate={{
          rotate: [45, 405, 45],
          scale: [1, 1.2, 1],
          opacity: [0.25, 0.4, 0.25],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: 'linear',
        }}
      />
      
      {/* Grid Pattern - More Visible */}
      <div 
        className="absolute inset-0 opacity-[0.08]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(139,92,246,0.15) 1px, transparent 1px),
            linear-gradient(90deg, rgba(139,92,246,0.15) 1px, transparent 1px)
          `,
          backgroundSize: '80px 80px',
        }}
      />
      
      {/* Radial Gradient Overlay - Lighter */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_transparent_0%,_rgba(15,23,42,0.6)_100%)]" />
      
      {/* Additional Top Light Effect - More Visible */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-b from-purple-500/15 to-transparent blur-3xl" />
    </div>
  );
};

export default BoostifyBackground;

