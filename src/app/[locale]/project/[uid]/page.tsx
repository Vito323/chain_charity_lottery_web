import StalwartShowcase from "./content";
import StalwartHeader from "@/components/stalwart-header";
import StalwartFooter from "@/components/stalwart-footer";
import ScrollToTop from "@/components/scroll-to-top";

interface StalwartShowcasePageProps {
  params: Promise<{
    uid: string;
  }>;
}

const StalwartShowcasePage = async ({ params }: StalwartShowcasePageProps) => {
  const { uid } = await params;
  
  return (
    <>
      <StalwartHeader />
      <StalwartShowcase uid={uid} />
      <StalwartFooter />
      <ScrollToTop />
    </>
  );
};

export default StalwartShowcasePage;
