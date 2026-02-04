"use client";
import React, { useState, useRef, useEffect } from "react";
import { useDisconnect, useAccount } from "wagmi";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { AnimatePresence } from "framer-motion";
import { useTranslations } from "next-intl";
import { formatAddress } from "./utils";
import { TermsModal } from "./TermsModal";
import { MobileBottomSheet } from "./MobileBottomSheet";
import { DesktopDropdown } from "./DesktopDropdown";
import { ServiceAgreementModal } from "@/components/service-agreement-modal";
import { PrivacyPolicyModal } from "@/components/privacy-policy-modal";
import { userConnect } from "@/service/user";
import useGlobalStore from "@/store";
import { useMasterContract } from "@/hooks/useMasterContract";
import { queryWithdrawableAmount } from "@/service/lottery";
import { usePathname, useRouter } from "@/i18n/navigation";

const CustomConnectButton = () => {
  const { disconnect } = useDisconnect();
  const { address, isConnected } = useAccount();
  const [showDropdown, setShowDropdown] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [showServiceAgreement, setShowServiceAgreement] = useState(false);
  const [showPrivacyPolicy, setShowPrivacyPolicy] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const hasCalledConnectRef = useRef<string | null>(null);
  const tCommon = useTranslations("common");
  const pathname = usePathname();
  const router = useRouter();
  const setWithdrawAmount = useGlobalStore((state) => state.setWithdrawAmount);
  const { getUserWithdrawableAmount } = useMasterContract();

  // 监听钱包连接状态，连接后调用 userConnect 接口验证（bind-node 页面除外）
  useEffect(() => {
    if (isConnected && address) {
      // bind-node 页面不调用 userConnect
      if (pathname?.includes("/bind-node")) {
        return;
      }

      // 防止重复调用：如果当前地址已经调用过，则不再调用
      if (hasCalledConnectRef.current === address) {
        return;
      }

      // 标记当前地址已开始调用
      hasCalledConnectRef.current = address;

      userConnect(address)
        .then((result) => {
          // 如果不在白名单，跳转至 bind-node 页面
          if (!result.data) {
            // toast.error(tCommon("errors.notInWhitelist"));
            router.push("/bind-node");
            // disconnect();
            setWithdrawAmount("0");
            hasCalledConnectRef.current = null; // 重置，允许重试
          
          }
        })
        .catch((error) => {
          console.error("Failed to call userConnect:", error);
          disconnect();
          hasCalledConnectRef.current = null; // 重置，允许重试
        });
    } else {
      // 如果断开连接，重置标记
      hasCalledConnectRef.current = null;
    }
  }, [isConnected, address, pathname, disconnect, router]);

  // 当下拉框展示且钱包连接时，调用 withdrawAmount 接口更新可提现金额
  useEffect(() => {
    if (showDropdown) {
      if (isConnected && address) {
        queryWithdrawableAmount(address).then((result) => {
          console.log(result.data, "result1122");
          // const value = formatUnits(result.data, 18);
          setWithdrawAmount(result.data || "0");
        });
      } else {
        setWithdrawAmount("0");
      }
    }
  }, [showDropdown, isConnected, address, setWithdrawAmount]);

  // 处理点击外部关闭下拉菜单
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
    };

    if (showDropdown) {
      document.body.style.overflow = "hidden";
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showDropdown]);

  // 处理条款弹窗的 body 滚动
  useEffect(() => {
    if (showTermsModal || showServiceAgreement || showPrivacyPolicy) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [showTermsModal, showServiceAgreement, showPrivacyPolicy]);

  const handleConnectClick = () => {
    setShowTermsModal(true);
  };

  const handleTermsAgree = () => {
    if (acceptedTerms) {
      setShowTermsModal(false);
      setAcceptedTerms(false);
      // openConnectModal 会在 ConnectButton.Custom 的渲染函数中提供
    }
  };

  const handleTermsCancel = () => {
    setShowTermsModal(false);
    setAcceptedTerms(false);
  };

  const handleCloseDropdown = () => {
    setShowDropdown(false);
  };

  return (
    <ConnectButton.Custom>
      {({
        account,
        chain,
        openChainModal,
        openConnectModal,
        authenticationStatus,
        mounted,
      }) => {
        const ready = mounted && authenticationStatus !== "loading";
        const connected =
          ready &&
          account &&
          chain &&
          (!authenticationStatus || authenticationStatus === "authenticated");

        // 处理同意条款后的连接
        const handleConfirmConnect = () => {
          if (acceptedTerms) {
            setShowTermsModal(false);
            setAcceptedTerms(false);
            openConnectModal();
          }
        };
        console.log(connected, mounted, "connected1122");

        return (
          <div className="relative inline-block" ref={dropdownRef}>
            {(() => {
              if (!connected) {
                return (
                  <button
                    className="relative bg-linear-to-br from-purple-600 via-pink-600 to-rose-500 text-white border-0 rounded-full px-7 py-3.5 text-base font-semibold cursor-pointer transition-all duration-300 ease-out font-inherit flex items-center gap-2 shadow-lg shadow-purple-600/25 overflow-hidden min-w-[140px] justify-center hover:from-purple-700 hover:via-pink-700 hover:to-rose-600 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-purple-600/35 active:translate-y-0 active:shadow-lg active:shadow-purple-600/25 focus:outline-none before:absolute before:top-0 before:-left-full before:w-full before:h-full before:bg-gradient-to-r before:from-transparent before:via-white/20 before:to-transparent before:transition-all before:duration-500 hover:before:left-full"
                    onClick={handleConnectClick}
                  >
                    {tCommon("actions.connectWallet")}
                  </button>
                );
              }

              if (chain.unsupported) {
                return (
                  <button
                    className="relative bg-linear-to-br from-red-600 to-red-700 text-white border-0 rounded-full px-7 py-3.5 text-base font-semibold cursor-pointer transition-all duration-300 ease-out font-inherit flex items-center gap-2 shadow-lg shadow-red-600/25 overflow-hidden min-w-[140px] justify-center hover:from-red-700 hover:to-red-800 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-red-600/35 active:translate-y-0 active:shadow-lg active:shadow-red-600/25 focus:outline-none before:absolute before:top-0 before:-left-full before:w-full before:h-full before:bg-gradient-to-r before:from-transparent before:via-white/20 before:to-transparent before:transition-all before:duration-500 hover:before:left-full"
                    onClick={openChainModal}
                  >
                    {tCommon("wallet.wrongNetwork")}
                  </button>
                );
              }

              return (
                <button
                  className="relative bg-white/10 text-white border border-white/25 rounded-full px-7 py-3.5 text-base font-medium cursor-pointer transition-all duration-300 ease-out font-inherit flex items-center gap-2 shadow-lg shadow-black/10 backdrop-blur-sm overflow-hidden min-w-[140px] justify-center hover:bg-white/15 hover:border-white/40 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-black/20 focus:outline-none before:absolute before:top-0 before:-left-full before:w-full before:h-full before:bg-gradient-to-r before:from-transparent before:via-white/10 before:to-transparent before:transition-all before:duration-500 hover:before:left-full"
                  onClick={() => setShowDropdown(!showDropdown)}
                >
                  <span className="text-white">
                    {formatAddress(account.address)}
                  </span>
                  <i
                    className={`fa fa-chevron-down text-xs transition-transform duration-300 ease-out text-white/80 hover:text-white ${
                      showDropdown ? "rotate-180" : ""
                    }`}
                  ></i>
                </button>
              );
            })()}

            <AnimatePresence>
              {showDropdown && connected && (
                <>
                  <MobileBottomSheet
                    show={showDropdown}
                    account={account}
                    chain={chain}
                    openChainModal={openChainModal}
                    onClose={handleCloseDropdown}
                    mounted={mounted}
                  />
                  <DesktopDropdown
                    show={showDropdown}
                    account={account}
                    chain={chain}
                    openChainModal={openChainModal}
                    onClose={handleCloseDropdown}
                  />
                </>
              )}
            </AnimatePresence>

            <TermsModal
              show={showTermsModal}
              acceptedTerms={acceptedTerms}
              onAcceptedTermsChange={setAcceptedTerms}
              onConfirm={handleConfirmConnect}
              onCancel={handleTermsCancel}
              onOpenServiceAgreement={() => setShowServiceAgreement(true)}
              onOpenPrivacyPolicy={() => setShowPrivacyPolicy(true)}
              mounted={mounted}
            />
            <ServiceAgreementModal
              show={showServiceAgreement}
              onClose={() => setShowServiceAgreement(false)}
              mounted={mounted}
            />
            <PrivacyPolicyModal
              show={showPrivacyPolicy}
              onClose={() => setShowPrivacyPolicy(false)}
              mounted={mounted}
            />
          </div>
        );
      }}
    </ConnectButton.Custom>
  );
};

export default CustomConnectButton;
