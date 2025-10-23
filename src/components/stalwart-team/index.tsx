'use client';

import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import Image from 'next/image';

const StalwartTeam = () => {
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

  const teamMembers = [
    {
      name: 'Sarah Johnson',
      position: 'CEO & Founder',
      description: 'Visionary leader with 15+ years in humanitarian work, dedicated to creating sustainable change.',
      image: 'https://placehold.co/300x300/6366f1/ffffff/png?text=Sarah+Johnson'
    },
    {
      name: 'Michael Chen',
      position: 'CTO',
      description: 'Technology innovator passionate about using tech solutions to solve global challenges.',
      image: 'https://placehold.co/300x300/ec4899/ffffff/png?text=Michael+Chen'
    },
    {
      name: 'Dr. Emily Rodriguez',
      position: 'Medical Director',
      description: 'Healthcare expert committed to bringing medical aid to underserved communities worldwide.',
      image: 'https://placehold.co/300x300/3b82f6/ffffff/png?text=Emily+Rodriguez'
    },
    {
      name: 'David Thompson',
      position: 'Operations Director',
      description: 'Logistics specialist ensuring efficient delivery of aid and resources where they&apos;re needed most.',
      image: 'https://placehold.co/300x300/10b981/ffffff/png?text=David+Thompson'
    }
  ];

  return (
    <section ref={ref} className="py-28 bg-gradient-to-b from-slate-900 to-slate-950">
      <div className="max-w-7xl mx-auto px-6 md:px-8">
        {/* Header Section */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="text-center mb-16"
        >
          <motion.div
            variants={itemVariants}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/10 bg-white/5 backdrop-blur-sm text-white/80 text-xs mb-6"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-fuchsia-400" />
            Our Team
          </motion.div>
          
          <motion.h2
            variants={itemVariants}
            className="text-3xl md:text-5xl font-extrabold text-white tracking-tight mb-6"
          >
            Meet The People Behind Our Mission
          </motion.h2>
          
          <motion.p
            variants={itemVariants}
            className="text-lg text-white/80 max-w-3xl mx-auto leading-relaxed"
          >
            They possess the secret knowledge and interesting experience of creating a digital product that makes a real difference in people&apos;s lives.
          </motion.p>
        </motion.div>

        {/* Team Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
        >
          {teamMembers.map((member, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="group relative"
              whileHover={{ y: -8 }}
            >
              {/* Card Container */}
              <div className="relative p-6 rounded-2xl border border-white/10 bg-white/[0.04] hover:bg-white/[0.06] backdrop-blur-md transition-all duration-300 h-full">
                {/* Gradient outline on hover */}
                <div 
                  className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{
                    background: 'linear-gradient(135deg, rgba(168,85,247,0.25), rgba(236,72,153,0.25))',
                    WebkitMask: 'linear-gradient(#000, #000) content-box, linear-gradient(#000, #000)',
                    mask: 'linear-gradient(#000, #000) content-box, linear-gradient(#000, #000)',
                    padding: '1px'
                  }}
                />
                
                {/* Image Container */}
                <div className="relative mb-6 group-hover:scale-105 transition-transform duration-300">
                  <div className="relative w-32 h-32 mx-auto rounded-full overflow-hidden border-2 border-white/10">
                    <Image
                      src={member.image}
                      alt={member.name}
                      width={128}
                      height={128}
                      className="w-full h-full object-cover"
                    />
                    {/* Overlay gradient */}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/50 via-transparent to-transparent" />
                  </div>
                  
                  {/* Floating decorative elements */}
                  <motion.div
                    className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-r from-purple-500/30 to-pink-500/30 rounded-full blur-sm"
                    animate={{
                      scale: [1, 1.2, 1],
                      opacity: [0.3, 0.6, 0.3],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: 'easeInOut',
                    }}
                  />
                </div>

                {/* Content */}
                <div className="text-center space-y-3">
                  <h3 className="text-xl font-bold text-white group-hover:text-fuchsia-300 transition-colors duration-300">
                    {member.name}
                  </h3>
                  <div className="text-fuchsia-400 font-medium text-sm">
                    {member.position}
                  </div>
                  <p className="text-white/70 text-sm leading-relaxed">
                    {member.description}
                  </p>
                </div>


                {/* Glow effect */}
                <div className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-md bg-gradient-to-r from-purple-600/20 via-pink-600/20 to-fuchsia-600/20" />
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default StalwartTeam;
