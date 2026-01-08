import WithdrawPage from './index';
import Header from '@/components/header';
import Footer from '@/components/footer';
import ScrollToTop from '@/components/scroll-to-top';

const LotteryWithdrawPage = () => {
  return (
    <>
      <Header />
      <div className="min-h-screen bg-[#0b1020] pt-16">
        <WithdrawPage />
      </div>
      <Footer />
      <ScrollToTop />
    </>
  );
};

export default LotteryWithdrawPage;

