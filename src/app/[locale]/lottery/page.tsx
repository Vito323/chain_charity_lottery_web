"use client";

import { motion } from "framer-motion";
import Header from "@/components/header";
import LotteryContent from "./content";
import LotteryHistory from "./history";
import Footer from "@/components/footer";
import ScrollToTop from "@/components/scroll-to-top";

export default function LotteryPage() {



  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="min-h-screen bg-[#0b1020] pt-24"
    >
      <Header />
      
      {/* Lottery Content Section */}
      <div id="lottery-content">
        <LotteryContent/>
      </div>

      {/* Lottery History Section */}
      <div id="lottery-history">
        <LotteryHistory />
      </div>

      {/* Footer */}
      <Footer />

      {/* Scroll to Top Button */}
      <ScrollToTop />
    </motion.div>
  );
}
