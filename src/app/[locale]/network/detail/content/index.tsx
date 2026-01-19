"use client";

import React from "react";
import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef, useState } from "react";
import { useAccount, useChainId } from "wagmi";
import { useTranslations } from "next-intl";
import { toast } from "react-toastify";
import { useConnectModal } from "@rainbow-me/rainbowkit";
import { useSearchParams } from "next/navigation";
import { useRouter, usePathname } from "@/i18n/navigation";
import NodePurchaseModal from "@/components/node-purchase-modal";
import NodePurchaseSuccessModal from "@/components/node-purchase-success-modal";
import { useNodeDetail } from "./hooks/useNodeDetail";
import { useNodeContract, NodeType } from "@/hooks/useNodeContract";
import { pendingNode } from "@/service/node";
import { userToken } from "@/service/user";
import { containerVariants, itemVariants } from "./utils/animations";
import { getSecurityMeasures } from "./utils/securityMeasures";
import NodeHeader from "./components/NodeHeader";
import NodeStats from "./components/NodeStats";
import NFTSelector from "./components/NFTSelector";
import InvestmentReturns from "./components/InvestmentReturns";
import PriceAdvantage from "./components/PriceAdvantage";
import SecurityMeasures from "./components/SecurityMeasures";
import { USDT_ADDRESSES } from "@/hooks/useDonationTokenBalance";
import { bsc } from "wagmi/chains";
import { getChainById } from "@/lib/chain-config";

interface NodeDetailProps {
  rank: string;
}

const NodeDetail: React.FC<NodeDetailProps> = ({ rank }) => {
  const t = useTranslations("nodeDetail");
  const tNetwork = useTranslations("network");
  const tCommon = useTranslations("common");
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const { isConnected, address, chain } = useAccount();
  const chainId = useChainId();
  const { openConnectModal } = useConnectModal();
  const { purchaseNode, getPaymentToken, getPaymentTokenDecimals } = useNodeContract();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [purchaseData, setPurchaseData] = useState<{
    nodeType: "genesis" | "super" | "standard";
    certificateId?: number;
    nodeCount?: number;
  } | null>(null);

  const {
    selectedRank,
    currentNode,
    isGenesis,
    isSuper,
    isStandard,
    nfts,
    nodeId,
  } = useNodeDetail(rank);

  // 获取 reward 字段（从接口数据中）
  const nodeReward = (currentNode as any).reward ?? 0;
  const nodePrice = currentNode.price;

  // 节点基本信息
  const nodeInfo = {
    name: tNetwork(`nodeTiers.${currentNode.id}.name`),
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

  // 将nodeType转换为NodeType枚举
  const nodeTypeEnum = React.useMemo(() => {
    if (currentNode.id === 'genesis') return NodeType.Genesis;
    if (currentNode.id === 'super') return NodeType.Super;
    return NodeType.Standard;
  }, [currentNode.id]);

  // 处理确认购买
  const handleConfirmPurchase = async (quantity: number, acceptedTerms: boolean) => {
    if (!isConnected || !acceptedTerms || isProcessing) {
      return;
    }

    if (!address) {
      toast.error(tCommon('errors.walletNotConnected'));
      return;
    }

    if (!nodeId) {
      toast.error(tCommon('errors.nodeIdMissing'));
      return;
    }

    // 链ID验证 - 在交易前检查当前链是否匹配
    const expectedChainId = Number(process.env.NEXT_PUBLIC_DEFAULT_CHAIN_ID);
    
    if (chainId !== expectedChainId) {
      const currentChainInfo = chain || getChainById(chainId);
      const expectedChainInfo = getChainById(expectedChainId);
      toast.error(
        tCommon('wallet.wrongNetworkMessage', {
          expectedName: expectedChainInfo.name,
          expectedId: expectedChainId,
          currentName: currentChainInfo.name,
          currentId: chainId,
        }),
        {
          autoClose: 5000,
        }
      );
      return;
    }

    setIsProcessing(true);

    try {
      // 1. 获取支付代币地址和小数位
      const paymentTokenAddress = await getPaymentToken();

      debugger;
      // 2. 检查USDT余额
      const totalPrice = nodePrice * quantity;
      const balanceResponse = await userToken(address, paymentTokenAddress || USDT_ADDRESSES[bsc.id]);
      
      if (!balanceResponse?.data) {
        throw new Error(tCommon('errors.failedToFetchBalance'));
      }

      const usdtBalance = parseFloat(balanceResponse.data.balance);
      if (usdtBalance < totalPrice) {
        console.warn('Insufficient balance:', {
          balance: usdtBalance,
          required: totalPrice,
          shortage: totalPrice - usdtBalance,
        });
        throw new Error('insufficient balance');
      }

      // 3. 调用 pendingNode 接口获取签名信息
      const pendingResponse = await pendingNode(nodeId, address);
      if (!pendingResponse.ok || !pendingResponse.data) {
        throw new Error(tCommon('errors.failedToGetPurchaseSignature'));
      }

      const pendingData = pendingResponse.data;

      // 4. 调用 purchaseNode 方法
      const txHash = await purchaseNode(
        nodeTypeEnum,
        pendingData.nodeId,
        pendingData.referrer,
        pendingData.nonce,
        pendingData.deadline,
        pendingData.signature
      );

      console.log('Purchase successful, transaction hash:', txHash);

      toast.success(tCommon('success.purchaseSuccess'));

      // 关闭购买Modal
      setShowPurchaseModal(false);

      // 触发成功回调
      const certificateId = parseInt(pendingData.nodeId) || undefined;
      const mockNodeCount = Math.floor(Math.random() * 5) + 1;
      setPurchaseData({
        nodeType: currentNode.id,
        certificateId: certificateId,
        nodeCount: mockNodeCount,
      });
      setShowSuccessModal(true);
    } catch (error: any) {
      console.error('Purchase failed:', error);

      // 处理错误信息 - 优先使用多语言配置
      let errorMessage = tCommon('errors.purchaseFailed');
      const errorMsg = error?.message || '';
      
      // 检查是否是已设置的多语言错误信息（直接匹配）
      if (errorMsg === tCommon('errors.failedToFetchBalance')) {
        errorMessage = tCommon('errors.failedToFetchBalance');
      } else if (errorMsg === tCommon('errors.failedToGetPurchaseSignature')) {
        errorMessage = tCommon('errors.failedToGetPurchaseSignature');
      } else if (errorMsg === tCommon('errors.paymentTokenNotFound')) {
        errorMessage = tCommon('errors.paymentTokenNotFound');
      } else if (errorMsg.includes('user rejected') || errorMsg.includes('User rejected')) {
        errorMessage = tCommon('wallet.transactionRejected');
      } else if (errorMsg.includes('insufficient funds') || errorMsg.includes('insufficient balance')) {
        errorMessage = tCommon('errors.insufficientFunds');
      } else if (errorMsg.includes('Failed to fetch balance') || errorMsg.includes('获取余额失败')) {
        errorMessage = tCommon('errors.failedToFetchBalance');
      } else if (errorMsg.includes('Failed to get purchase signature') || errorMsg.includes('获取购买签名失败')) {
        errorMessage = tCommon('errors.failedToGetPurchaseSignature');
      } else if (errorMsg.includes('Payment token address not found') || errorMsg.includes('支付代币地址未找到')) {
        errorMessage = tCommon('errors.paymentTokenNotFound');
      } else if (errorMsg) {
        // 如果错误信息是多语言配置中的键，尝试使用它
        const messageKey = errorMsg.trim();
        if (messageKey.startsWith('errors.') || messageKey.startsWith('wallet.') || messageKey.startsWith('validation.')) {
          const translated = tCommon(messageKey as any);
          errorMessage = translated !== messageKey ? translated : errorMsg;
        } else {
          errorMessage = errorMsg;
        }
      }

      toast.error(errorMessage);
    } finally {
      setIsProcessing(false);
    }
  };

  // 处理 NFT 切换
  const handleNFTChange = (nodeRank: string) => {
    // 更新 URL searchParams
    const params = new URLSearchParams(searchParams.toString());
    params.set("rank", nodeRank);
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
            selectedRank={selectedRank}
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
                  price={nodePrice}
                  reward={nodeReward}
                  currency={currentNode.currency}
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
        currentNode={currentNode}
        remaining={isStandard ? currentNode.stats.remaining : undefined}
        isProcessing={isProcessing}
        onConfirmPurchase={handleConfirmPurchase}
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
