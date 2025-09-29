import Footer from "@/components/footer";
import Header from "@/components/header";
import PageTitle from "@/components/page-title";
import Scrollbar from "@/components/scrollbar";
import Error from "./404";

const ErrorPage = () => {
  return (
    <>
      <Header />
      <PageTitle pageTitle={"404"} pagesub={"404"} />
      <Error />
      <Footer />
      <Scrollbar />
    </>
  );
};
export default ErrorPage;
