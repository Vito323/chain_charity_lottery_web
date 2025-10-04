import Footer from "@/components/footer";
import Header from "@/components/header";
import PageTitle from "@/components/page-title";
import Scrollbar from "@/components/scrollbar";
import CaseSingle from "./content";
import TabContent from "./tab-content";

const CaseSinglePage = () => {
  return (
    <>
      <Header />
      <PageTitle
        pageTitle={"Our Project"}
        pagePrev="Project"
        pagesub={"Project Name"}
      />
      <CaseSingle />
      <Footer />
      <Scrollbar />
    </>
  );
};
export default CaseSinglePage;
