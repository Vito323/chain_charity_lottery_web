"use client";

import React from "react";
import { motion, type Variants } from "framer-motion";
import { useTranslations } from "next-intl";
import { useAccount } from "wagmi";
import CopyButton from "@/components/copy-button";

interface UserAddressInfoProps {
  userAddress?: string;
  isInView: boolean;
  variants: Variants;
}

const UserAddressInfo: React.FC<UserAddressInfoProps> = ({
  userAddress,
  isInView,
  variants,
}) => {
  const t = useTranslations("network.invite");
  const { address: connectedAddress } = useAccount();

  // 使用传入的地址或连接的地址，如果没有则使用默认值
  const displayAddress = userAddress || connectedAddress || "0x0000000000000000000000000000000000000000";

  // 格式化地址显示
  const formatAddress = (address: string) => {
    if (address.length <= 10) return address;
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return (
    <motion.section variants={variants} className="relative">
      <div className="relative rounded-xl sm:rounded-2xl border border-white/10 bg-gradient-to-br from-slate-900/90 via-slate-950/95 to-slate-900/90 p-4 sm:p-5 md:p-6 shadow-xl overflow-hidden">
        {/* Background gradient effects */}
        <div className="pointer-events-none absolute -top-20 -right-16 sm:-top-32 sm:-right-24 w-48 h-48 sm:w-72 sm:h-72 blur-3xl opacity-40 bg-indigo-500/10" />
        <div className="pointer-events-none absolute -bottom-20 -left-16 sm:-bottom-32 sm:-left-24 w-56 h-56 sm:w-80 sm:h-80 blur-3xl opacity-40 bg-purple-500/10" />

        <div className="relative z-10">
          {/* Section Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.2 }}
            className="mb-4 sm:mb-6"
          >
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse" />
              <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-white">
                {t("userAddress.title") || "Your Address"}
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-white/70">
              {t("userAddress.subtitle") || "The address that will be bound to the parent node"}
            </p>
          </motion.div>

          {/* Address Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.3 }}
            className="rounded-lg sm:rounded-xl border border-white/10 bg-white/5 p-4 sm:p-5"
          >
            <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
              <span className="text-xs sm:text-sm text-white/60 flex-shrink-0">
                {t("userAddress.label") || "Address"}:
              </span>
              <div className="flex items-center gap-2 flex-1 min-w-0">
                <code className="text-xs sm:text-sm text-white/80 font-mono bg-white/5 px-3 py-2 rounded break-all flex-1">
                  {formatAddress(displayAddress)}
                </code>
                <CopyButton text={displayAddress} />
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
};

export default UserAddressInfo;
