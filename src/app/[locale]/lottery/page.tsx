"use client";

import { motion } from "framer-motion";
import StalwartHeader from "@/components/stalwart-header";
import StalwartLotteryContent from "./content";
import StalwartLotteryHistory from "./history";
import StalwartFooter from "@/components/stalwart-footer";
import ScrollToTop from "@/components/scroll-to-top";

export default function StalwartLotteryPage() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="min-h-screen bg-[#0b1020] pt-24"
    >
      <StalwartHeader />
      
      {/* Lottery Content Section */}
      <div id="lottery-content">
        <StalwartLotteryContent />
      </div>

      {/* Lottery History Section */}
      <div id="lottery-history">
        <StalwartLotteryHistory />
      </div>

      {/* Footer */}
      <StalwartFooter />

      {/* Scroll to Top Button */}
      <ScrollToTop />
    </motion.div>
  );
}
