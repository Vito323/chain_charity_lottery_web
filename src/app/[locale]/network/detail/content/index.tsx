"use client";

import React from "react";
import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef, useState } from "react";
import { useAccount } from "wagmi";
import { useTranslations } from "next-intl";
import { useConnectModal } from "@rainbow-me/rainbowkit";
import { useSearchParams } from "next/navigation";
import { useRouter, usePathname } from "@/i18n/navigation";
import NodePurchaseModal from "@/components/node-purchase-modal";
import NodePurchaseSuccessModal from "@/components/node-purchase-success-modal";
import { useNodeDetail } from "./hooks/useNodeDetail";
import { containerVariants, itemVariants } from "./utils/animations";
import { getSecurityMeasures } from "./utils/securityMeasures";
import NodeHeader from "./components/NodeHeader";
import NodeStats from "./components/NodeStats";
import NFTSelector from "./components/NFTSelector";
import InvestmentReturns from "./components/InvestmentReturns";
import PriceAdvantage from "./components/PriceAdvantage";
import SecurityMeasures from "./components/SecurityMeasures";

interface NodeDetailProps {
  tier: string;
}

const NodeDetail: React.FC<NodeDetailProps> = ({ tier }) => {
  const t = useTranslations("nodeDetail");
  const tNetwork = useTranslations("network");
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const { isConnected } = useAccount();
  const { openConnectModal } = useConnectModal();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [purchaseData, setPurchaseData] = useState<{
    nodeType: "genesis" | "super" | "standard";
    certificateId?: number;
    nodeCount?: number;
  } | null>(null);

  const {
    selectedNodeId,
    currentNode,
    isGenesis,
    isSuper,
    isStandard,
    nfts,
  } = useNodeDetail(tier);

  // 节点基本信息
  const nodeInfo = {
    name: currentNode.name,
    title: isGenesis
      ? t("certificates.genesisNodeCertificate")
      : t("certificates.certificateOfOwnership"),
    description: currentNode.description,
  };

  // 处理购买节点
  const handlePurchaseNode = () => {
    if (!isConnected) {
      openConnectModal?.();
      return;
    }
    setShowPurchaseModal(true);
  };

  // 节点价格配置
  const nodePriceConfig = {
    price: currentNode.price,
    exclusivePrice: 0.17, // 美元/CCT
  };

  // 处理 NFT 切换
  const handleNFTChange = (nodeId: "genesis" | "super" | "standard") => {
    // 更新 URL searchParams
    const params = new URLSearchParams(searchParams.toString());
    params.set("tier", nodeId);
    router.replace(`${pathname}?${params.toString()}`);
  };

  // 安全保障措施数据
  const securityMeasures = getSecurityMeasures(t);

  return (
    <div className="min-h-screen bg-linear-to-b from-slate-950 via-slate-900 to-slate-950">
      <main
        className="pt-20 sm:pt-24 md:pt-28 lg:pt-36 pb-12 sm:pb-16 md:pb-20"
        ref={ref}
      >
        <motion.div
          className="max-w-7xl mx-auto px-4 sm:px-5 md:px-6 lg:px-8 space-y-8 sm:space-y-10 md:space-y-12 lg:space-y-16"
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          {/* Page Header */}
          <motion.div variants={itemVariants}>
            <NodeHeader
              name={nodeInfo.name}
              title={nodeInfo.title}
              description={nodeInfo.description}
            />
          </motion.div>

          {/* Investment Limit & Total Stats */}
          <NodeStats
            stats={currentNode.stats}
            isStandard={isStandard}
            isSuper={isSuper}
            isInView={isInView}
            variants={itemVariants}
          />

          {/* NFT Certificates Section - All nodes show NFT selection */}
          <NFTSelector
            nfts={nfts}
            selectedNodeId={selectedNodeId}
            onNFTChange={handleNFTChange}
            isInView={isInView}
            variants={itemVariants}
          />

          {/* Investment Returns & Price Advantage Section - Combined for PC */}
          <motion.section variants={itemVariants} className="relative">
            <div className="relative rounded-xl sm:rounded-2xl border border-white/10 bg-linear-to-br from-slate-900/90 via-slate-950/95 to-slate-900/90 p-4 sm:p-5 md:p-6 shadow-xl overflow-hidden">
              {/* Background gradient effects */}
              <div className={`pointer-events-none absolute -top-20 -right-20 w-64 h-64 blur-3xl opacity-30 ${
                isStandard ? "bg-emerald-500/20" : isSuper ? "bg-blue-500/20" : "bg-purple-500/20"
              }`} />
              <div className={`pointer-events-none absolute -bottom-20 -left-20 w-64 h-64 blur-3xl opacity-30 ${
                isStandard ? "bg-teal-500/20" : isSuper ? "bg-cyan-500/20" : "bg-pink-500/20"
              }`} />

              <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                {/* Investment Returns Section */}
                <InvestmentReturns
                  investmentReturns={currentNode.investmentReturns}
                  isStandard={isStandard}
                  isSuper={isSuper}
                  isInView={isInView}
                />

                {/* Price Advantage Section */}
                <PriceAdvantage
                  priceAdvantage={currentNode.priceAdvantage}
                  isInView={isInView}
                />
              </div>
            </div>
          </motion.section>

          {/* Security Measures Section */}
          <SecurityMeasures
            securityMeasures={securityMeasures}
            isInView={isInView}
            variants={itemVariants}
          />

          {/* Purchase Button Section */}
          <motion.section
            variants={itemVariants}
            className="flex justify-center pt-4 sm:pt-5 px-4"
          >
            <motion.button
              onClick={handlePurchaseNode}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`w-full cursor-pointer sm:w-auto inline-flex items-center justify-center rounded-full px-5 sm:px-6 md:px-8 py-2.5 sm:py-3 md:py-4 text-sm sm:text-base font-semibold text-white shadow-lg transition-all duration-300 ${
                isStandard
                  ? "bg-linear-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 shadow-emerald-500/30"
                  : isSuper
                  ? "bg-linear-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 shadow-blue-500/30"
                  : "bg-linear-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 shadow-purple-500/30"
              }`}
            >
              {isConnected ? t("purchase.title") : t("purchase.connectWallet")}
            </motion.button>
          </motion.section>

          {/* Footer Note */}
          <motion.div
            variants={itemVariants}
            className="text-center pt-4 sm:pt-5 border-t border-white/10 px-4"
          >
            <p className="text-xs text-white/70 leading-relaxed">
              {t("purchase.footerNote")}
            </p>
          </motion.div>
        </motion.div>
      </main>

      {/* Purchase Modal */}
      <NodePurchaseModal
        isOpen={showPurchaseModal}
        onClose={() => setShowPurchaseModal(false)}
        nodeType={currentNode.id}
        nodePrice={nodePriceConfig.price}
        exclusivePrice={nodePriceConfig.exclusivePrice}
        remaining={isStandard ? currentNode.stats.remaining : undefined}
        onPurchaseSuccess={(nodeType, certificateId) => {
          // Mock: 假设用户已有一些节点
          const mockNodeCount = Math.floor(Math.random() * 5) + 1;
          setPurchaseData({
            nodeType,
            certificateId: certificateId,
            nodeCount: mockNodeCount,
          });
          setShowSuccessModal(true);
        }}
      />

      {/* Purchase Success Modal */}
      {purchaseData && (
        <NodePurchaseSuccessModal
          isOpen={showSuccessModal}
          onClose={() => {
            setShowSuccessModal(false);
            setPurchaseData(null);
          }}
          nodeType={purchaseData.nodeType}
          nodeCount={purchaseData.nodeCount}
          certificateId={purchaseData.certificateId}
        />
      )}
    </div>
  );
};

export default NodeDetail;
