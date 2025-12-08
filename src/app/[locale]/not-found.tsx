import Header from "@/components/header";
import Footer from "@/components/footer";
import NotFound404 from "@/components/404-not-found";
import ScrollToTop from "@/components/scroll-to-top";

const ErrorPage = () => {
  return (
    <>
      <Header />
      <NotFound404 />
      <Footer />
      <ScrollToTop />
    </>
  );
};
export default ErrorPage;
