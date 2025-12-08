import NodeDetail from "./content";
import Header from "@/components/header";
import Footer from "@/components/footer";
import ScrollToTop from "@/components/scroll-to-top";

interface NodeDetailPageProps {
  params: Promise<{
    nodeId: string;
  }>;
}

const NodeDetailPage = async ({ params }: NodeDetailPageProps) => {
  const { nodeId } = await params;
  
  return (
    <>
      <Header />
      <NodeDetail nodeId={nodeId} />
      <Footer />
      <ScrollToTop />
    </>
  );
};

export default NodeDetailPage;

