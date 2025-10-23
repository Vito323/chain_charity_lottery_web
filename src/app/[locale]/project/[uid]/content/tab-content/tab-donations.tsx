'use client';

import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import { ProjectDetailData, DonorData } from '@/service/project';
import { ProjectChainInfo } from '@/components/case-cards';
import { SCAN_URL } from '@/constants/enum';

interface NetworkAddress {
  name: string;
  address: string;
  icon: string;
  color: string;
}

interface TabDonationsProps {
  projectInfo?: ProjectDetailData;
  currentProjectInfo?: ProjectChainInfo | null;
  uid: string;
}

const TabDonations = ({ projectInfo, currentProjectInfo, uid }: TabDonationsProps) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  const networkAddresses: NetworkAddress[] = [
    {
      name: "Polygon",
      address: currentProjectInfo?.beneficiary || "",
      icon: "fa-circle",
      color: "#8247E5",
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
          Donations
        </h2>
        
        {/* 捐赠表格 */}
        <div className="overflow-x-auto">
          <table className="w-full text-white/80">
            <thead>
              <tr className="border-b border-white/10">
                <th className="text-left py-4 px-2">Donated at</th>
                <th className="text-left py-4 px-2">Donor</th>
                <th className="text-left py-4 px-2">Hash Tx</th>
                <th className="text-left py-4 px-2">Amount</th>
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
                        {isValidDate ? createdAt.toLocaleDateString() : 'Invalid Date'}
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
                            onClick={() => window.open(`${SCAN_URL.POLYGON}${hash}`, "_blank")}
                            title="查看交易详情"
                          >
                            <i className="fa fa-external-link text-xs"></i>
                          </span>
                        </div>
                      </td>
                      <td className="py-4 px-2 font-semibold">
                        {donation?.total || '0'}
                      </td>
                    </motion.tr>
                  );
                })
              ) : (
                <motion.tr variants={itemVariants}>
                  <td colSpan={4} className="py-12 text-center">
                    <div className="flex flex-col items-center">
                      <div className="w-16 h-16 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full flex items-center justify-center mb-4">
                        <i className="ti-heart text-2xl text-purple-400"></i>
                      </div>
                      <h3 className="text-xl font-semibold text-white mb-2">
                        No Donations Yet
                      </h3>
                      <p className="text-white/60">
                        No one has donated to this project yet. Be the first supporter!
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
            All time donations received
          </h3>
          <h4 className="text-2xl font-bold text-white mb-4">
            Be the first to give!
          </h4>
          <h5 className="text-lg font-semibold text-white mb-4">
            Project recipient address
          </h5>
          
          <div className="space-y-3">
            {networkAddresses.map((network, index) => (
              <div key={index} className="bg-white/5 rounded-xl p-4 border border-white/10">
                <div className="flex items-center gap-3">
                  <div 
                    className="w-6 h-6 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: network.color }}
                  >
                    <i className={`fa ${network.icon} text-white text-xs`}></i>
                  </div>
                  <div>
                    <div className="text-white font-semibold">{network.name}</div>
                    <div className="text-white/60 text-sm font-mono">
                      {network.address || 'No address available'}
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
