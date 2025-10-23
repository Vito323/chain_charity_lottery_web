import Footer from "@/components/footer";
import Header from "@/components/header";
// import PageTitle from "@/components/page-title";
import Scrollbar from "@/components/scrollbar";
import CaseSingle from "./content";

interface CaseSinglePageProps {
  params: Promise<{
    uid: string;
  }>;
}

const CaseSinglePage = async ({ params }: CaseSinglePageProps) => {
  const { uid } = await params;
  
  return (
    <>
      <Header />
      <CaseSingle uid={uid} />
      <Footer />
      <Scrollbar />
    </>
  );
};

export default CaseSinglePage;
