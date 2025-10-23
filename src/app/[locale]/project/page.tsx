"use client";

import { motion } from "framer-motion";
import StalwartHeader from "@/components/stalwart-header";
import StalwartProjectsContent from "@/components/stalwart-projects-content";
import StalwartFooter from "@/components/stalwart-footer";
import ScrollToTop from "@/components/scroll-to-top";

export default function StalwartProjectsPage() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="min-h-screen bg-[#0b1020] pt-24"
    >
      <StalwartHeader />
      
      {/* Projects Section */}
      <div id="projects">
        <StalwartProjectsContent />
      </div>

      {/* Footer */}
      <StalwartFooter />

      {/* Scroll to Top Button */}
      <ScrollToTop />
    </motion.div>
  );
}
