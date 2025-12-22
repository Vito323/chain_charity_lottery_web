'use client';

import { motion } from 'framer-motion';

const SyncoraBackground = () => {
  return (
    <div className="absolute inset-0 z-0 overflow-hidden w-full h-full">
      {/* Base Dark Gradient - More Visible with Purple Tint */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-slate-800/90 via-purple-950/40 to-slate-950" />
      
      {/* Animated Grid Pattern - More Visible */}
      <motion.div
        className="absolute top-0 left-0 w-full h-full pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(rgba(139,92,246,0.2) 1px, transparent 1px),
            linear-gradient(90deg, rgba(139,92,246,0.2) 1px, transparent 1px)
          `,
          backgroundSize: '80px 80px',
        }}
        animate={{
          opacity: [0.4, 0.6, 0.4],
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
      
      {/* Large Gradient Glow Orbs - More Visible */}
      <motion.div
        className="absolute top-1/4 left-1/4 w-[700px] h-[700px] bg-gradient-to-br from-purple-600/25 via-pink-600/20 to-blue-600/15 rounded-full blur-[120px]"
        animate={{
          scale: [1, 1.15, 1],
          opacity: [0.4, 0.6, 0.4],
          x: [0, 120, 0],
          y: [0, 80, 0],
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
      
      <motion.div
        className="absolute bottom-1/3 right-1/4 w-[600px] h-[600px] bg-gradient-to-tl from-blue-600/20 via-cyan-600/18 to-purple-600/20 rounded-full blur-[130px]"
        animate={{
          scale: [1.1, 1, 1.1],
          opacity: [0.45, 0.65, 0.45],
          x: [0, -100, 0],
          y: [0, -60, 0],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
      
      {/* Top Radial Glow - More Visible */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_0%,rgba(139,92,246,0.25),transparent_70%)]" />
      
      {/* Concentric Rotating Circles - More Visible */}
      <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] border-2 border-purple-500/20 rounded-full"
        animate={{
          scale: [1, 1.08, 1],
          opacity: [0.2, 0.35, 0.2],
          rotate: [0, 360],
        }}
        transition={{
          scale: { duration: 10, repeat: Infinity, ease: 'easeInOut' },
          opacity: { duration: 7, repeat: Infinity, ease: 'easeInOut' },
          rotate: { duration: 35, repeat: Infinity, ease: 'linear' },
        }}
      />
      
      <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] border-2 border-pink-500/20 rounded-full"
        animate={{
          scale: [1.08, 1, 1.08],
          opacity: [0.25, 0.4, 0.25],
          rotate: [360, 0],
        }}
        transition={{
          scale: { duration: 12, repeat: Infinity, ease: 'easeInOut' },
          opacity: { duration: 8, repeat: Infinity, ease: 'easeInOut' },
          rotate: { duration: 28, repeat: Infinity, ease: 'linear' },
        }}
      />
      
      <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] border-2 border-blue-500/18 rounded-full"
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.2, 0.35, 0.2],
          rotate: [0, -360],
        }}
        transition={{
          scale: { duration: 14, repeat: Infinity, ease: 'easeInOut' },
          opacity: { duration: 9, repeat: Infinity, ease: 'easeInOut' },
          rotate: { duration: 32, repeat: Infinity, ease: 'linear' },
        }}
      />
      
      {/* Additional Accent Elements - More Visible */}
      <motion.div
        className="absolute top-1/4 right-1/3 w-3 h-3 bg-purple-400/50 rounded-full blur-sm"
        animate={{
          scale: [1, 2.5, 1],
          opacity: [0.5, 0.8, 0.5],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
      
      <motion.div
        className="absolute bottom-1/4 left-1/3 w-3 h-3 bg-pink-400/50 rounded-full blur-sm"
        animate={{
          scale: [1, 3, 1],
          opacity: [0.5, 0.8, 0.5],
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
      
      {/* Bottom Gradient Overlay - Lighter */}
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/40 via-transparent to-transparent" />
    </div>
  );
};

export default SyncoraBackground;

