'use client';

import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import Image from 'next/image';

const StalwartFeatures = () => {
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
        ease: 'easeOut',
      },
    },
  };

  const features = [
    {
      img: '/assets/images/66fa5b30f77a5519b8e02bc9_f-img1.png',
      title: 'Low-latency inference',
      description: 'Optimized runtime delivering consistently fast responses for real-world workloads.'
    },
    {
      img: '/assets/images/66fa5b30f77a5519b8e02bcd_f-img2.png',
      title: 'Scalable infra',
      description: 'Elastic capacity with intelligent autoscaling for spikes and steady demand.'
    },
    {
      img: '/assets/images/66fa5b30f77a5519b8e02bca_f-img3.png',
      title: 'Observability',
      description: 'Built-in metrics, tracing and logs to debug and optimize model performance.'
    },
    {
      img: '/assets/images/66fa5b30f77a5519b8e02bcc_f-img4.png',
      title: 'Security-first',
      description: 'Enterprise-grade security, isolation and compliance for sensitive data.'
    },
    {
      img: '/assets/images/66fa5b30f77a5519b8e02bcb_f-img5.png',
      title: 'Developer tooling',
      description: 'Local dev parity, SDKs and CLI to streamline your AI workflow.'
    },
    {
      img: '/assets/images/66fa5b30f77a5519b8e02bd6_f-img6.png',
      title: 'Cost efficiency',
      description: 'Smart batching, caching and tiered resources to optimize spend.'
    }
  ];

  return (
    <section ref={ref} className="py-28 bg-gradient-to-b from-slate-950 to-slate-900">
      <div className="max-w-7xl mx-auto px-6 md:px-8">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="mb-14"
        >
          <motion.div
            variants={itemVariants}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/10 bg-white/5 backdrop-blur-sm text-white/80 text-xs"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-fuchsia-400" />
            Stalwart Blockchain Features
          </motion.div>
          <div className="mt-5 grid grid-cols-1 lg:grid-cols-12 gap-8 items-end">
            <div className="lg:col-span-7">
              <motion.h2
                variants={itemVariants}
                className="text-3xl md:text-5xl font-extrabold text-white tracking-tight"
              >
                Enterprise‑grade blockchain infrastructure
              </motion.h2>
            </div>
            <div className="lg:col-span-5">
              <motion.p
                variants={itemVariants}
                className="text-sm md:text-base text-white/75 leading-relaxed"
              >
                Purpose‑built capabilities for high‑throughput, low‑latency applications. Secure by default with first‑class developer experience.
              </motion.p>
            </div>
          </div>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="group relative p-6 md:p-8 rounded-2xl border border-white/10 bg-white/[0.04] hover:bg-white/[0.06] backdrop-blur-md transition-all duration-300"
              whileHover={{ y: -6 }}
            >
              {/* Gradient outline on hover */}
              <div className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                   style={{
                     background: 'linear-gradient(135deg, rgba(168,85,247,0.25), rgba(236,72,153,0.25))',
                     WebkitMask: 'linear-gradient(#000, #000) content-box, linear-gradient(#000, #000)'
                   }}
              />
              
              {/* Icon image */}
              <div className="relative z-10 w-20 h-20 md:w-24 md:h-24 flex items-center justify-center overflow-hidden mb-6 group-hover:scale-105 transition-transform duration-300">
                <Image src={feature.img} alt={feature.title} width={80} height={80} className="w-16 h-16 md:w-20 md:h-20 object-contain" />
              </div>

              {/* Content */}
              <div className="relative z-10">
                <h3 className="text-lg md:text-xl font-bold !text-white mb-3 transition-colors duration-300">
                  {feature.title}
                </h3>
                <p className="!text-white/70 text-base md:text-lg leading-relaxed">
                  {feature.description}
                </p>
              </div>

              {/* Glow */}
              <div className="pointer-events-none absolute -inset-px rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-md bg-gradient-to-r from-purple-600/20 via-pink-600/20 to-fuchsia-600/20" />
            </motion.div>
          ))}
        </motion.div>

        {/* CTA Section */}
        <motion.div
          variants={itemVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="text-center mt-14"
        >
          <motion.button
            className="px-8 py-4 bg-gradient-to-r from-purple-600 via-pink-600 to-fuchsia-600 text-white font-semibold rounded-full text-lg hover:from-purple-700 hover:via-pink-700 hover:to-fuchsia-700 transition-all duration-300 shadow-lg hover:shadow-purple-500/25"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Explore All Features
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
};

export default StalwartFeatures;