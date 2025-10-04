import Scrollbar from "@/components/scrollbar";
import Header from "@/components/header";
import Hero from "@/components/hero";
import Mission from "@/components/mission";
import About from "@/components/about";
import CounterSection from "@/components/counter/indext";
import CtaSection from "@/components/cta";
import Footer from "@/components/footer";
import OurTeam from "@/components/team";

export default function Home() {
  return (
    <>
      <Header />
      <Hero />
      <Mission />
      <About />
      {/* <CaseSlide /> */}
      <CounterSection />
      <OurTeam />
      {/* <WorldSection /> */}
      {/* <EventSection /> */}
      <CtaSection />
      {/* <BlogSection /> */}
      <Footer />
      <Scrollbar />
    </>
  );
}
