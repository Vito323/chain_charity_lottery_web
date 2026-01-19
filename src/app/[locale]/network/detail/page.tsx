import NodeDetail from "./content";
import Header from "@/components/header";
import Footer from "@/components/footer";
import ScrollToTop from "@/components/scroll-to-top";

interface NodeDetailPageProps {
  searchParams: Promise<{
    rank?: string;
  }>;
}

const NodeDetailPage = async ({ searchParams }: NodeDetailPageProps) => {
  const { rank = "0" } = await searchParams;
  
  return (
    <>
      <Header />
      <NodeDetail rank={rank} />
      <Footer />
      <ScrollToTop />
    </>
  );
};

export default NodeDetailPage;

