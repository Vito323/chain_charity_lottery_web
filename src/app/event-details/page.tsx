import Footer from "@/components/footer";
import Header from "@/components/header";
import PageTitle from "@/components/page-title";
import Scrollbar from "@/components/scrollbar";
import EventContent from "./content";
const EventDetailPage = () => {
  return (
    <>
      <Header />
      <PageTitle
        pageTitle={"Single Event"}
        pagesub={"Education for All Children"}
      />
      <EventContent></EventContent>
      <Footer />
      <Scrollbar />
    </>
  );
};
export default EventDetailPage;
