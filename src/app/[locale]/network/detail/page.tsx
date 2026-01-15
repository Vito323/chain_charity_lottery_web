import NodeDetail from "./content";
import Header from "@/components/header";
import Footer from "@/components/footer";
import ScrollToTop from "@/components/scroll-to-top";

interface NodeDetailPageProps {
  searchParams: Promise<{
    tier?: string;
  }>;
}

const NodeDetailPage = async ({ searchParams }: NodeDetailPageProps) => {
  const { tier = "genesis" } = await searchParams;
  
  return (
    <>
      <Header />
      <NodeDetail tier={tier} />
      <Footer />
      <ScrollToTop />
    </>
  );
};

export default NodeDetailPage;

