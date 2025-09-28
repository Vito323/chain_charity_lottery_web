import Footer from "@/components/footer";
import Header from "@/components/header";
import PageTitle from "@/components/page-title";
import Scrollbar from "@/components/scrollbar";
import EventSection2 from "./content";

const EventPage =() => {
  return(
      <>
          <Header/>
          <PageTitle pageTitle={'Our Event'} pagesub={'Event'}/> 
          <EventSection2/>
          <Footer/>
          <Scrollbar/>
      </>
  )
};
export default EventPage;
