import Footer from "@/components/footer";
import Header from "@/components/header";
import PageTitle from "@/components/page-title";
import Scrollbar from "@/components/scrollbar";
import CaseSingle from "../content";
import TabContent from "../tab-content";

interface CaseSinglePageProps {
  params: {
    uid: string;
    locale: string;
  };
}

const CaseSinglePage = ({ params }: CaseSinglePageProps) => {
  const { uid, locale } = params;
  
  return (
    <>
      <Header />
      <PageTitle
        pageTitle={"Our Project"}
        pagePrev="Project"
        pagesub={`Project ${uid}`}
      />
      <CaseSingle uid={uid} />
      <Footer />
      <Scrollbar />
    </>
  );
};

export default CaseSinglePage;
