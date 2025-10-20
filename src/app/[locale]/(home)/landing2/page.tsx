import StalwartHero from "@/components/stalwart-hero";
import StalwartProducts from "@/components/stalwart-products";
import StalwartTechnology from "@/components/stalwart-technology";
import StalwartFeatures from "@/components/stalwart-features";
import StalwartRoadmap from "@/components/stalwart-roadmap";
import StalwartEcosystem from "@/components/stalwart-ecosystem";
import StalwartFooter from "@/components/stalwart-footer";
import ModernNavbar from "@/components/modern-navbar";
import './landing2-globals.css';

export default function Landing2Page() {
  return (
    <>
      <ModernNavbar />
      <main className="stalwart-landing-page">
        <StalwartHero />
        <StalwartProducts />
        <StalwartTechnology />
        <StalwartFeatures />
        <StalwartRoadmap />
        <StalwartEcosystem />
      </main>
      <StalwartFooter />
    </>
  );
}
