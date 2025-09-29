import About from "@/components/about";
import CaseSlide from "@/components/case";
import CounterSection from "@/components/counter/indext";
import Footer from "@/components/footer";
import Header from "@/components/header";
import Mission from "@/components/mission";
import PageTitle from "@/components/page-title";
import Scrollbar from "@/components/scrollbar";
import OurTeam from "@/components/team";
import VedioCta from "@/components/vediocta";
import OurHistory from "./history";

const AboutPage = () => {
  return (
    <>
      <Header />
      <PageTitle pageTitle={"About Us"} pagesub={"About"} />
      <VedioCta />
      <Mission subclass={"section-padding"} />
      <About />
      <CaseSlide />
      <CounterSection />
      <OurTeam />
      <OurHistory></OurHistory>
      <Footer />
      <Scrollbar />
    </>
  );
};

export default AboutPage;
