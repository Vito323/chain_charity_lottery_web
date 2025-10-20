import LandingHeader from "@/components/landing-header";
import LandingHero from "@/components/landing-hero";
import EcosystemSection from "@/components/ecosystem-section";
import VideoShowcase from "@/components/video-showcase";
import CommunitySection from "@/components/community-section";
import DigitalOwnershipSection from "@/components/digital-ownership-section";
import StepsSection from "@/components/steps-section";
import ImportanceSection from "@/components/importance-section";
import FaqSection from "@/components/faq-section";
import NewsletterSection from "@/components/newsletter-section";
import LandingFooter from "@/components/landing-footer";

export default function LandingPage() {
  return (
    <>
      <LandingHeader />
      <main className="landing-page">
        <LandingHero />
        <EcosystemSection />
        <VideoShowcase />
        <CommunitySection />
        <DigitalOwnershipSection />
        <StepsSection />
        <ImportanceSection />
        <FaqSection />
        <NewsletterSection />
      </main>
      <LandingFooter />
    </>
  );
}
