import Footer from "@/components/footer";
import Header from "@/components/header";
import PageTitle from "@/components/page-title";
import Scrollbar from "@/components/scrollbar";
import Content from "../content";

interface DonatePageProps {
  params: Promise<{
    uid: string;
    locale: string;
  }>;
}

const DonatePage = async ({ params }: DonatePageProps) => {
  const { uid } = await params;
  
  return (
    <>
      <Header />
      <PageTitle pageTitle={"Donate Now"} pagesub={`Donate to Project ${uid}`} />
      <Content uid={uid} />
      <Footer />
      <Scrollbar />
    </>
  );
};
export default DonatePage;
