import Showcase from "./content";
import Header from "@/components/header";
import Footer from "@/components/footer";
import ScrollToTop from "@/components/scroll-to-top";

interface ShowcasePageProps {
  params: Promise<{
    uid: string;
  }>;
}

const ShowcasePage = async ({ params }: ShowcasePageProps) => {
  const { uid } = await params;
  
  return (
    <>
      <Header />
      <Showcase uid={uid} />
      <Footer />
      <ScrollToTop />
    </>
  );
};

export default ShowcasePage;
