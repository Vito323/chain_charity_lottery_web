import StalwartNodeDetail from "./content";
import StalwartHeader from "@/components/stalwart-header";
import StalwartFooter from "@/components/stalwart-footer";
import ScrollToTop from "@/components/scroll-to-top";

interface StalwartNodeDetailPageProps {
  params: Promise<{
    nodeId: string;
  }>;
}

const StalwartNodeDetailPage = async ({ params }: StalwartNodeDetailPageProps) => {
  const { nodeId } = await params;
  
  return (
    <>
      <StalwartHeader />
      <StalwartNodeDetail nodeId={nodeId} />
      <StalwartFooter />
      <ScrollToTop />
    </>
  );
};

export default StalwartNodeDetailPage;

