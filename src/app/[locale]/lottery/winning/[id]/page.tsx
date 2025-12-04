import StalwartWinningDetail, { WinningType } from './content';
import StalwartHeader from '@/components/stalwart-header';
import StalwartFooter from '@/components/stalwart-footer';
import ScrollToTop from '@/components/scroll-to-top';

interface WinningDetailPageProps {
  params: Promise<{
    id: string;
  }>;
  searchParams: Promise<{
    type?: 'lottery' | 'follow';
  }>;
}

const StalwartWinningDetailPage = async ({ params, searchParams }: WinningDetailPageProps) => {
  const { id } = await params;
  const { type = 'lottery' } = await searchParams;

  return (
    <>
      <StalwartHeader />
      <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
        <StalwartWinningDetail winningId={id} type={type as WinningType} />
      </div>
      <StalwartFooter />
      <ScrollToTop />
    </>
  );
};

export default StalwartWinningDetailPage;

