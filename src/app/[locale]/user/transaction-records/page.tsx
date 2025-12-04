import StalwartTransactionRecords from './content';
import StalwartHeader from '@/components/stalwart-header';
import StalwartFooter from '@/components/stalwart-footer';
import ScrollToTop from '@/components/scroll-to-top';

const StalwartTransactionRecordsPage = () => {
  return (
    <>
      <StalwartHeader />
      <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
        <StalwartTransactionRecords />
      </div>
      <StalwartFooter />
      <ScrollToTop />
    </>
  );
};

export default StalwartTransactionRecordsPage;

