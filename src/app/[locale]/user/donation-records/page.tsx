import DonationRecords from './content';
import Header from '@/components/header';
import Footer from '@/components/footer';
import ScrollToTop from '@/components/scroll-to-top';

const DonationRecordsPage = () => {
  return (
    <>
      <Header />
      <div className="min-h-screen bg-linear-to-b from-slate-950 via-slate-900 to-slate-950">
        <DonationRecords />
      </div>
      <Footer />
      <ScrollToTop />
    </>
  );
};

export default DonationRecordsPage;

