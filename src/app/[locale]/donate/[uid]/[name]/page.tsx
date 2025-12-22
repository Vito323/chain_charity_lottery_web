import Header from "@/components/header";
import Footer from "@/components/footer";
import Donate from "./content";
import ScrollToTop from "@/components/scroll-to-top";

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
    <div className="min-h-screen bg-slate-900">
      <Header />
      <Donate uid={uid} name={name} />
      <Footer />
      <ScrollToTop />
    </div>
  );
};

export default DonatePage;
