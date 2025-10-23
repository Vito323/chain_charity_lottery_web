'use client';

import StalwartHeader from "@/components/stalwart-header"
import StalwartFooter from "@/components/stalwart-footer"
import ScrollToTop from "@/components/scroll-to-top"
import StalwartUserDashboard from "./content"

const StalwartUserPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      <StalwartHeader />
      <StalwartUserDashboard />
      <StalwartFooter />
      <ScrollToTop />
    </div>
  )
}

export default StalwartUserPage;
