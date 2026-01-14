import WinningDetail, { WinningType } from './content';
import Header from '@/components/header';
import Footer from '@/components/footer';
import ScrollToTop from '@/components/scroll-to-top';

interface WinningDetailPageProps {
  searchParams: Promise<{
    period_id?: string;
    type?: 'lottery' | 'follow';
  }>;
}

const WinningDetailPage = async ({ searchParams }: WinningDetailPageProps) => {
  const { period_id, type = 'lottery' } = await searchParams;

  return (
    <>
      <Header />
      <div className="min-h-screen bg-linear-to-b from-slate-950 via-slate-900 to-slate-950">
        <WinningDetail periodId={period_id} type={type as WinningType} />
      </div>
      <Footer />
      <ScrollToTop />
    </>
  );
};

export default WinningDetailPage;

