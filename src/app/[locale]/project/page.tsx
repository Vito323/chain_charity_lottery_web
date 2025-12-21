"use client";

import { motion } from "framer-motion";
import Header from "@/components/header";
import ProjectsContent from "@/components/projects-content";
import Footer from "@/components/footer";
import ScrollToTop from "@/components/scroll-to-top";

export default function ProjectsPage() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="min-h-screen bg-[#0b1020] pt-24"
    >
      <Header />
      
      {/* Projects Section */}
      <div id="projects">
        <ProjectsContent />
      </div>

      {/* Footer */}
      <Footer />

      {/* Scroll to Top Button */}
      <ScrollToTop />
    </motion.div>
  );
}
