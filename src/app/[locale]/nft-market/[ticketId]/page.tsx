import StalwartHeader from '@/components/stalwart-header';
import StalwartFooter from '@/components/stalwart-footer';
import ScrollToTop from '@/components/scroll-to-top';
import LotteryTicketDetail from './content';

interface LotteryTicketDetailPageProps {
  params: Promise<{
    ticketId: string;
  }>;
  searchParams: Promise<{
    type?: 'new' | 'market' | 'hold' | 'listed';
  }>;
}

const LotteryTicketDetailPage = async ({ params, searchParams }: LotteryTicketDetailPageProps) => {
  const { ticketId } = await params;
  const { type = 'new' } = await searchParams;
  
  // Convert hold/listed to compatible types
  const normalizedType = type === 'hold' ? 'hold' : type === 'listed' ? 'listed' : type as 'new' | 'market';
  
  return (
    <>
      <StalwartHeader />
      <LotteryTicketDetail ticketId={ticketId} type={normalizedType} />
      <StalwartFooter />
      <ScrollToTop />
    </>
  );
};

export default LotteryTicketDetailPage;

