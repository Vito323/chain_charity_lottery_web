import TokenDetails from './content';
import Header from '@/components/header';
import Footer from '@/components/footer';
import ScrollToTop from '@/components/scroll-to-top';

const TokenDetailsPage = () => {
  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
        <TokenDetails />
      </div>
      <Footer />
      <ScrollToTop />
    </>
  );
};

export default TokenDetailsPage;

