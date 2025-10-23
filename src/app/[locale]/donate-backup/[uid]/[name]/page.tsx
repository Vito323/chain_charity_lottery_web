import Footer from "@/components/footer";
import Header from "@/components/header";
import Scrollbar from "@/components/scrollbar";
import Content from "../../content";

interface DonatePageProps {
  params: Promise<{
    uid: string;
    name: string;
    locale: string;
  }>;
}

const DonatePage = async ({ params }: DonatePageProps) => {
  const { uid, name } = await params;
  
  return (
    <>
      <Header />
      {/* <PageTitle pageTitle={"Donate Now"} pagePrevs={[
        {label: "Project", href: `/project`},
        {label: name, href: `/project/${uid}`}
      ]} pagesub={'Donate Now'} /> */}
      <Content uid={uid} name={name} />
      <Footer />
      <Scrollbar />
    </>
  );
};
export default DonatePage;
