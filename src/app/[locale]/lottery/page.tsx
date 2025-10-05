import Header from "@/components/header";
import LotteryContent from "./content";
import Footer from "@/components/footer";
import Scrollbar from "@/components/scrollbar";
import LotteryHistory from "./history";
const LotteryPage: React.FC = () => {
  return (
    <>
      <Header />
      {/* <PageTitle pageTitle={"Lottery"} pagesub={"Lottery"} /> */}
      <LotteryContent />
      <LotteryHistory></LotteryHistory>
      <Footer />
      <Scrollbar />
    </>
  );
};

export default LotteryPage;
