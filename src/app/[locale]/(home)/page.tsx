"use client";
import { motion } from "framer-motion";
import StalwartHeader from "@/components/stalwart-header";
import StalwartHero from "@/components/stalwart-hero";
import StalwartFeatures from "@/components/stalwart-features";
import StalwartAbout from "@/components/stalwart-about";
import StalwartRoadmap from "@/components/stalwart-roadmap";
import StalwartTeam from "@/components/stalwart-team";
import StalwartFooter from "@/components/stalwart-footer";
import ScrollToTop from "@/components/scroll-to-top";

export default function StalwartPage() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="min-h-screen bg-[#0b1020] pt-24"
    >
      <StalwartHeader />
      {/* Hero Section */}
      <div id="hero">
        <StalwartHero />
      </div>

      {/* Features Section */}
      <div id="features">
        <StalwartFeatures />
      </div>

      {/* About Section */}
      <div id="about">
        <StalwartAbout />
      </div>

      {/* Team Section */}
      <div id="team">
        <StalwartTeam />
      </div>

      {/* Products Section */}
      {/* <div id="products"><StalwartProducts /></div> */}

      {/* Technology Section */}
      {/* <div id="technology"><StalwartTechnology /></div> */}

      {/* Ecosystem Section */}
      {/* <div id="ecosystem"><StalwartEcosystem /></div> */}

      {/* Roadmap Section */}
      <div id="roadmap">
        <StalwartRoadmap />
      </div>

      {/* Footer */}
      <StalwartFooter />

      {/* Scroll to Top Button */}
      <ScrollToTop />
    </motion.div>
  );
}
