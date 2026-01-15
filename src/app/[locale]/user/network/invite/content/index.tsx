"use client";

import React, { useRef, useState } from "react";
import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useTranslations } from "next-intl";
import { useAccount } from "wagmi";
import { useRouter } from "@/i18n/navigation";
import { containerVariants, itemVariants } from "../utils/animations";
import ParentNodeInfo from "../components/ParentNodeInfo";
import UserAddressInfo from "../components/UserAddressInfo";
import BindConfirmModal from "../components/BindConfirmModal";
import type { ParentNodeInfo as ParentNodeInfoType } from "../types";

// Mock data - 实际使用时应该从 URL 参数或 API 获取
const mockParentNode: ParentNodeInfoType = {
  address: "0x1234567890123456789012345678901234567890",
  name: "Parent Node",
  avatar: undefined,
  nodeType: "genesis",
  nodeCount: 5,
  totalEarnings: 12345.67,
  joinDate: "2024-01-15",
  level: 3,
  referralCount: 42,
};

const InviteContent: React.FC = () => {
  const t = useTranslations("network.invite");
  const tCommon = useTranslations("common");
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const { address: userAddress } = useAccount();
  const router = useRouter();
  const [showBindModal, setShowBindModal] = useState(false);

  // 处理绑定按钮点击
  const handleBindClick = () => {
    setShowBindModal(true);
  };

  // 处理确认绑定
  const handleConfirmBind = async () => {
    try {
      // TODO: 调用绑定接口
      // await bindToParentNode(mockParentNode.address);
      console.log("Binding to parent node:", mockParentNode.address);
      
      // 模拟 API 调用
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      // 绑定成功后可以跳转或显示成功消息
      // router.push('/user/network');
    } catch (error) {
      console.error("Bind error:", error);
      throw error;
    }
  };

  // 处理邀请按钮点击
  const handleInviteClick = () => {
    // TODO: 生成邀请链接或打开邀请功能
    const inviteLink = `${window.location.origin}/user/network/invite?ref=${userAddress || mockParentNode.address}`;
    navigator.clipboard.writeText(inviteLink).then(() => {
      // 可以显示成功提示
      console.log("Invite link copied:", inviteLink);
    });
  };

  return (
    <section className="relative py-12 pt-32 md:py-20 md:pt-52">
      <motion.div
        ref={ref}
        className="relative z-10 max-w-7xl mx-auto px-6 md:px-8"
        variants={containerVariants}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
        transition={{ duration: 0.3 }}
      >
        {/* Section Header */}
        <motion.div variants={itemVariants} className="text-center mb-8 md:mb-12">
          <motion.div
            className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full border border-white/15 bg-white/5 backdrop-blur-sm text-white/90 mb-6"
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.6 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <span className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse" />
            <span className="text-sm">{t("badge") || "Invite Network"}</span>
          </motion.div>

          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 md:mb-6">
            {t("title") || "Invite Network"}{" "}
            <span className="bg-linear-to-r from-indigo-300 via-purple-300 to-pink-300 bg-clip-text text-transparent">
              {t("titleHighlight") || ""}
            </span>
          </h2>
          <p className="text-base md:text-lg lg:text-xl text-white/80 max-w-3xl mx-auto leading-relaxed px-4">
            {t("subtitle") || "Bind to a parent node and start your referral network"}
          </p>
        </motion.div>

        {/* Main Content - Flexbox Layout */}
        <div className="flex flex-col gap-6 sm:gap-8 md:gap-10">
          {/* Part 1: Parent Node Information */}
          <ParentNodeInfo
            parentNode={mockParentNode}
            isInView={isInView}
            variants={itemVariants}
          />

          {/* Part 2: User Address Information */}
          <UserAddressInfo
            userAddress={userAddress}
            isInView={isInView}
            variants={itemVariants}
          />

          {/* Part 3: Action Buttons */}
          <motion.div
            variants={itemVariants}
            className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-4 sm:gap-6"
          >
            {/* Bind Button */}
            <motion.button
              onClick={handleBindClick}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-full sm:w-auto px-8 sm:px-10 py-3 sm:py-4 rounded-full font-semibold text-base sm:text-lg bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 text-white hover:from-purple-700 hover:via-pink-700 hover:to-purple-700 shadow-lg shadow-purple-500/30 transition-all duration-300 cursor-pointer"
            >
              {t("bindButton") || "Bind to Parent Node"}
            </motion.button>

            {/* Invite Button */}
            <motion.button
              onClick={handleInviteClick}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-full sm:w-auto px-8 sm:px-10 py-3 sm:py-4 rounded-full font-semibold text-base sm:text-lg bg-white/10 text-white border border-white/20 hover:bg-white/20 hover:border-white/30 shadow-lg transition-all duration-300 cursor-pointer"
            >
              {t("inviteButton") || "Invite Friends"}
            </motion.button>
          </motion.div>
        </div>
      </motion.div>

      {/* Bind Confirm Modal */}
      <BindConfirmModal
        isOpen={showBindModal}
        onClose={() => setShowBindModal(false)}
        parentNodeAddress={mockParentNode.address}
        onConfirmBind={handleConfirmBind}
      />
    </section>
  );
};

export default InviteContent;
