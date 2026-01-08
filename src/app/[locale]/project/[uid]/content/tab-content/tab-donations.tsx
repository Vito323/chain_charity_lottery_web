'use client';

import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { useChainId } from 'wagmi';
import { ProjectDetailData, DonorData } from '@/service/project';
import { ProjectChainInfo } from '@/components/case-cards';
import { getChainInfo, getScanUrl } from '@/utils/chain-info';

interface NetworkAddress {
  name: string;
  address: string;
  icon: string;
  color: string;
  backgroundColor: string;
}

interface TabDonationsProps {
  projectInfo?: ProjectDetailData;
  uid: string;
}

const TabDonations = ({ projectInfo }: TabDonationsProps) => {
  const t = useTranslations('projectDetail.donations');
  const tCommon = useTranslations('common');
  const chainId = useChainId();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  // 根据当前链动态获取网络信息
  const chainInfo = getChainInfo(chainId);
  const scanUrl = getScanUrl(chainId);


  console.log('chainInfo', chainInfo);


  const networkAddresses: NetworkAddress[] = [
    {
      name: chainInfo.name,
      address: projectInfo?.beneficiary || "",
      icon: chainInfo.icon, // 使用tokenSymbol来获取SVG路径
      color: chainInfo.color,
      backgroundColor: chainInfo.backgroundColor,
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: 'easeOut' as const,
      },
    },
  };

  return (
    <motion.div
      ref={ref}
      variants={containerVariants}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      className="bg-white/5 backdrop-blur-sm rounded-3xl border border-white/10 p-8"
    >
      <motion.div variants={itemVariants} className="mb-8">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
          {t('title')}
        </h2>
        
        {/* 捐赠表格 */}
        <div className="overflow-x-auto">
          <table className="w-full text-white/80">
            <thead>
              <tr className="border-b border-white/10">
                <th className="text-left py-4 px-2">{t('table.donatedAt')}</th>
                <th className="text-left py-4 px-2">{t('table.donor')}</th>
                <th className="text-left py-4 px-2">{tCommon('labels.transactionHash')}</th>
                <th className="text-left py-4 px-2">{t('table.amount')}</th>
              </tr>
            </thead>
            <tbody>
              {projectInfo?.donors && projectInfo.donors.length > 0 ? (
                projectInfo.donors.map((donation: DonorData, index: number) => {
                  const address = donation?.address || '';
                  const hash = donation?.hash || '';
                  const createdAt = donation?.createdAt ? new Date(donation.createdAt) : new Date();
                  const isValidDate = !isNaN(createdAt.getTime());
                  
                  return (
                    <motion.tr
                      key={index}
                      variants={itemVariants}
                      className="border-b border-white/5 hover:bg-white/5 transition-colors"
                    >
                      <td className="py-4 px-2">
                        {isValidDate ? createdAt.toLocaleDateString() : t('table.invalidDate')}
                      </td>
                      <td className="py-4 px-2 font-mono text-sm">
                        {address.length > 10 ? `${address.slice(0, 6)}...${address.slice(-4)}` : address}
                      </td>
                      <td className="py-4 px-2 font-mono text-sm">
                        <div className="flex items-center gap-2">
                          <span className="text-white/80">
                            {hash.length > 14 ? `${hash.slice(0, 6)}...${hash.slice(-8)}` : hash}
                          </span>
                          <span 
                            className="text-white/40 hover:text-white/80 cursor-pointer transition-colors duration-200"
                            onClick={() => window.open(`${scanUrl}${hash}`, "_blank")}
                            title={t('table.viewTransactionDetails')}
                          >
                            <i className="fa fa-external-link text-xs"></i>
                          </span>
                        </div>
                      </td>
                      <td className="py-4 px-2 font-semibold">
                        {donation?.total 
                          ? new Intl.NumberFormat('en-US', {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            }).format(parseFloat(String(donation.total)))
                          : '0.00'}
                      </td>
                    </motion.tr>
                  );
                })
              ) : (
                <motion.tr variants={itemVariants}>
                  <td colSpan={4} className="py-12 text-center">
                    <div className="flex flex-col items-center">
                      <div className="w-16 h-16 bg-linear-to-r from-purple-500/20 to-pink-500/20 rounded-full flex items-center justify-center mb-4">
                        <i className="ti-heart text-2xl text-purple-400"></i>
                      </div>
                      <h3 className="text-xl font-semibold text-white mb-2">
                        {t('empty.title')}
                      </h3>
                      <p className="text-white/60">
                        {t('empty.description')}
                      </p>
                    </div>
                  </td>
                </motion.tr>
              )}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* 侧边栏信息 */}
      <motion.div variants={itemVariants} className="mt-8">
        <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
          <h3 className="text-lg font-semibold text-white mb-4">
            {t('sidebar.allTimeDonations')}
          </h3>
          <h4 className="text-2xl font-bold text-white mb-4">
            {t('sidebar.beFirstToGive')}
          </h4>
          <h5 className="text-lg font-semibold text-white mb-4">
            {t('sidebar.projectRecipientAddress')}
          </h5>
          
          <div className="space-y-3">
            {networkAddresses.map((network, index) => (
              <div key={index} className="bg-white/5 rounded-xl p-4 border border-white/10">
                <div className="flex items-center gap-3">
                  <div 
                    className="w-6 h-6 rounded-full flex items-center justify-center overflow-hidden"
                    // style={{ backgroundColor: network.backgroundColor }}
                  >
                    <Image
                      src={network.icon}
                      alt={network.name}
                      width={20}
                      height={20}
                      className="w-5 h-5"
                    />
                  </div>
                  <div>
                    <div className="text-white font-semibold">{network.name}</div>
                    <div className="text-white/60 text-sm font-mono">
                      {network.address || t('sidebar.noAddressAvailable')}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default TabDonations;
