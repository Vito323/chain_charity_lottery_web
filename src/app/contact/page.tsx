import Footer from "@/components/footer";
import Header from "@/components/header";
import PageTitle from "@/components/page-title";
import Scrollbar from "@/components/scrollbar";
import Content from "./content";



const ContactPage =() => {
  return(
      <>
          <Header/>
          <PageTitle pageTitle={'Contact Us'} pagesub={'Contact'}/> 
          <Content />
          <Footer/>
          <Scrollbar/>
      </>
  )
};
export default ContactPage;