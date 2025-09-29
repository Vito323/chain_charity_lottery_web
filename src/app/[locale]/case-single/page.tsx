import Footer from "@/components/footer";
import Header from "@/components/header";
import PageTitle from "@/components/page-title";
import Scrollbar from "@/components/scrollbar";
import CaseSingle from "./content";



const CaseSinglePage =() => {
  return(
      <>
          <Header/>
          <PageTitle pageTitle={'Single Causes'} pagesub={'Ensure Education for every poor children'}/> 
          <CaseSingle />
          <Footer/>
          <Scrollbar/>
      </>
  )
};
export default CaseSinglePage;
