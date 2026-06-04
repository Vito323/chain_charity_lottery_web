import NodeBindingsContent from '../content';
import Header from '@/components/header';
import Footer from '@/components/footer';
import ScrollToTop from '@/components/scroll-to-top';

interface NodeBindingsPageProps {
  params: Promise<{
    id: string;
    locale: string;
  }>;
}

const NodeBindingsPage = async ({ params }: NodeBindingsPageProps) => {
  const { id } = await params;

  return (
    <>
      <Header />
      <div className="min-h-screen bg-linear-to-b from-slate-950 via-slate-900 to-slate-950">
        <NodeBindingsContent nodeId={id} />
      </div>
      <Footer />
      <ScrollToTop />
    </>
  );
};

export default NodeBindingsPage;
