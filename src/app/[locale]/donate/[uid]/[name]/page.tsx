import StalwartHeader from "@/components/stalwart-header";
import StalwartFooter from "@/components/stalwart-footer";
import StalwartDonate from "@/components/stalwart-donate";
import ScrollToTop from "@/components/scroll-to-top";

interface StalwartDonatePageProps {
  params: Promise<{
    uid: string;
    name: string;
    locale: string;
  }>;
}

const StalwartDonatePage = async ({ params }: StalwartDonatePageProps) => {
  const { uid, name } = await params;
  
  return (
    <div className="min-h-screen bg-slate-900">
      <StalwartHeader />
      <StalwartDonate uid={uid} name={name} />
      <StalwartFooter />
      <ScrollToTop />
    </div>
  );
};

export default StalwartDonatePage;
