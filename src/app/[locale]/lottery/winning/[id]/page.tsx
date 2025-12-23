import WinningDetail, { WinningType } from './content';
import Header from '@/components/header';
import Footer from '@/components/footer';
import ScrollToTop from '@/components/scroll-to-top';

interface WinningDetailPageProps {
  params: Promise<{
    id: string;
  }>;
  searchParams: Promise<{
    type?: 'lottery' | 'follow';
  }>;
}

const WinningDetailPage = async ({ params, searchParams }: WinningDetailPageProps) => {
  const { id } = await params;
  const { type = 'lottery' } = await searchParams;

  return (
    <>
      <Header />
      <div className="min-h-screen bg-linear-to-b from-slate-950 via-slate-900 to-slate-950">
        <WinningDetail winningId={id} type={type as WinningType} />
      </div>
      <Footer />
      <ScrollToTop />
    </>
  );
};

export default WinningDetailPage;

