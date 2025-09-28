import Footer from "@/components/footer";
import Header from "@/components/header";
import PageTitle from "@/components/page-title";
import Scrollbar from "@/components/scrollbar";
import Content from "./content";



const DonatePage =() => {
  return(
      <>
          <Header/>
          <PageTitle pageTitle={'Donate Now'} pagesub={'Donate'}/> 
          <Content/>
          <Footer/>
          <Scrollbar/>
      </>
  )
};
export default DonatePage;