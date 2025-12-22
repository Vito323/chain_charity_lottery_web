"use client";
import { motion } from "framer-motion";
import Header from "@/components/header";
import Hero from "@/components/hero";
import Features from "@/components/features";
import About from "@/components/about";
import Roadmap from "@/components/roadmap";
import Team from "@/components/team";
import Footer from "@/components/footer";
import ScrollToTop from "@/components/scroll-to-top";

export default function HomePage() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="min-h-screen bg-[#0b1020]"
    >
      <Header />
      {/* Hero Section */}
      <div id="hero">
        <Hero />
      </div>

      {/* Features Section */}
      <div id="features">
        <Features />
      </div>

      {/* About Section */}
      <div id="about">
        <About />
      </div>

      {/* Team Section */}
      <div id="team">
        <Team />
      </div>

      {/* Products Section */}
      {/* <div id="products"><Products /></div> */}

      {/* Technology Section */}
      {/* <div id="technology"><Technology /></div> */}

      {/* Ecosystem Section */}
      {/* <div id="ecosystem"><Ecosystem /></div> */}

      {/* Roadmap Section */}
      <div id="roadmap">
        <Roadmap />
      </div>

      {/* Footer */}
      <Footer />

      {/* Scroll to Top Button */}
      <ScrollToTop />
    </motion.div>
  );
}
