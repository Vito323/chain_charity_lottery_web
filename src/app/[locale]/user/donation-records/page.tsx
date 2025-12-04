import StalwartDonationRecords from './content';
import StalwartHeader from '@/components/stalwart-header';
import StalwartFooter from '@/components/stalwart-footer';
import ScrollToTop from '@/components/scroll-to-top';

const StalwartDonationRecordsPage = () => {
  return (
    <>
      <StalwartHeader />
      <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
        <StalwartDonationRecords />
      </div>
      <StalwartFooter />
      <ScrollToTop />
    </>
  );
};

export default StalwartDonationRecordsPage;

