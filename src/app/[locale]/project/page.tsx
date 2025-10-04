import Footer from "@/components/footer";
import Header from "@/components/header";
import Mission from "@/components/mission";
import PageTitle from "@/components/page-title";
import Scrollbar from "@/components/scrollbar";
import Casesection from "./content";

const CausesPage = () => {
  return (
    <>
      <Header />
      <PageTitle pageTitle={"Our Projects"} pagesub={"Projects"} />
      <Casesection />
      <Footer />
      <Scrollbar />
    </>
  );
};
export default CausesPage;
