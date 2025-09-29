import Scrollbar from "@/components/scrollbar";
import Header from "@/components/header";
import Hero from "@/components/hero";
import Mission from "@/components/mission";
import About from "@/components/about";
import CaseSlide from "@/components/case";
import CounterSection from "@/components/counter/indext";
import WorldSection from "@/components/world";
import EventSection from "@/components/event";
import CtaSection from "@/components/cta";
import BlogSection from "@/components/blog-section";
import Footer from "@/components/footer";
import OurTeam from "@/components/team";

export default function Home() {
  return (
    <>
      <Header />
      <Hero />
      <Mission />
      <About />
      <CaseSlide />
      <CounterSection />
      <OurTeam></OurTeam>
      <WorldSection />
      <EventSection />
      <CtaSection />
      <BlogSection />
      <Footer />
      <Scrollbar />
    </>
  );
}
