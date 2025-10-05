import Header from "@/components/header";
import LotteryContent from "./content";
import PageTitle from "@/components/page-title";
import Footer from "@/components/footer";
import Scrollbar from "@/components/scrollbar";
;


const LotteryPage: React.FC = () => {
  

  return (
    <>
     <Header />
     <PageTitle pageTitle={"Lottery"} pagesub={"Lottery"} />
      <LotteryContent />
      <Footer />
      <Scrollbar />
    </>
  );
};

export default LotteryPage;
