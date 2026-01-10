'use client';

import Header from "@/components/header"
import Footer from "@/components/footer"
import ScrollToTop from "@/components/scroll-to-top"
import UserDashboard from "./content"

const UserPage = () => {
  return (
    <div className="min-h-screen bg-linear-to-b from-slate-950 via-slate-900 to-slate-950">
      <Header />
      <UserDashboard />
      <Footer />
      <ScrollToTop />
    </div>
  )
}

export default UserPage;
