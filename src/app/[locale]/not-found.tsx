import StalwartHeader from "@/components/stalwart-header";
import StalwartFooter from "@/components/stalwart-footer";
import Stalwart404 from "@/components/stalwart-404";
import ScrollToTop from "@/components/scroll-to-top";

const ErrorPage = () => {
  return (
    <>
      <StalwartHeader />
      <Stalwart404 />
      <StalwartFooter />
      <ScrollToTop />
    </>
  );
};
export default ErrorPage;
