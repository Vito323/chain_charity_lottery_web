

"use client";

import React from "react";
import { motion } from "framer-motion";
import { useSearchParams } from "next/navigation";
import { useAccount, useSignMessage } from "wagmi";
import { useConnectModal } from "@rainbow-me/rainbowkit";
import { toast } from "react-toastify";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";

import Header from "@/components/header";
import Footer from "@/components/footer";
import ScrollToTop from "@/components/scroll-to-top";

import {
  bindUserReferrer,
  bindUserReferrerPending,
  queryUserReferrer,
  userConnect,
  userNodes,
} from "@/service/user";
import ConfirmBindModal from "./confirm-modal";
import AlreadyBoundModal from "./bind-alert";

const isEvmAddress = (value: string) => /^0x[a-fA-F0-9]{40}$/.test(value);

const BindNodePage = () => {
  const searchParams = useSearchParams();
  const { address, isConnected } = useAccount();
  const { openConnectModal } = useConnectModal();
  const { signMessageAsync } = useSignMessage();
  const t = useTranslations("bindNode");
  const router = useRouter();

  const [referrer, setReferrer] = React.useState("");
  const [isProcessing, setIsProcessing] = React.useState(false);
  const [showConfirmBindModal, setShowConfirmBindModal] = React.useState(false);
  const [showAlreadyBoundModal, setShowAlreadyBoundModal] = React.useState(false);
  const hasCheckedConnectRef = React.useRef<string | null>(null);

  // URL example: /bind-node?referrer=0x...
  React.useEffect(() => {
    const fromUrl = (searchParams.get("referrer") || "").trim();
    if (fromUrl) setReferrer(fromUrl);
  }, [searchParams]);

  const normalizedReferrer = React.useMemo(
    () => referrer.trim(),
    [referrer]
  );

  // When wallet connected, check if already bound/connected
  React.useEffect(() => {
    if (!isConnected || !address) {
      hasCheckedConnectRef.current = null;
      setShowAlreadyBoundModal(false);
      return;
    }
    if (hasCheckedConnectRef.current === address) return;
    hasCheckedConnectRef.current = address;

    queryUserReferrer(address)
      .then((res) => {
        if (res?.data && res.data !== "0x0") {
          // 如果已经绑定，直接跳转首页
          router.replace("/");
          return;
          // setShowAlreadyBoundModal(true);
        }
      })
      .catch((e) => {
        console.error("userConnect failed:", e);
      });
  }, [isConnected, address]);

  const validateBeforeBind = () => {
    if (isProcessing) return false;
    if (showAlreadyBoundModal) return false;

    if (!isConnected || !address) {
      toast.error(t("toasts.connectWalletFirst"));
      openConnectModal?.();
      return false;
    }

    if (!normalizedReferrer) {
      toast.error(t("toasts.enterWalletAddress"));
      return false;
    }

    if (!isEvmAddress(normalizedReferrer)) {
      toast.error(t("toasts.invalidWalletAddress"));
      return false;
    }

    if (normalizedReferrer.toLowerCase() === address.toLowerCase()) {
      toast.error(t("toasts.cannotBindSelf"));
      return false;
    }

    return true;
  };

  const handleBind = async () => {
    if (!validateBeforeBind()) return;

    setIsProcessing(true);
    try {
      const nodesRes = await queryUserReferrer(normalizedReferrer);
      // const nodes = nodesRes.ok && Array.isArray(nodesRes.data) ? nodesRes.data : [];
      if (nodesRes.data === "0x0" || !nodesRes.data) {
        toast.error(t("toasts.referrerHasNoNodes"));
        return;
      }
      const pendingRes = await bindUserReferrerPending(address!!, normalizedReferrer);
      if (!pendingRes.ok || !pendingRes.data?.message) {
        toast.error(t("toasts.failedToGenerateParams"));
        return;
      }
      const signature = await signMessageAsync({
        message: pendingRes.data.message,
      });

      const bindRes = await bindUserReferrer({
        nonce: pendingRes.data.nonce,
        address: address!! as string,
        referrer: normalizedReferrer,
        signature,
        timestamp: pendingRes.data.timestamp,
      });
      if (!bindRes.ok) {
        toast.error(t("toasts.bindingFailed"));
        return;
      }
      router.replace("/");
      toast.success(t("toasts.bindingSuccessful"));
    } catch (e: any) {
      const msg = String(e?.message || "");
      if (msg.includes("user rejected") || msg.includes("User rejected")) {
        toast.error(t("toasts.signatureRejected"));
      } else {
        toast.error(t("toasts.unknownError"));
      }
      console.error("Bind failed:", e);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleBindClick = () => {
    if (!validateBeforeBind()) return;
    setShowConfirmBindModal(true);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.15,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 18 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.55, ease: "easeOut" as const },
    },
  };

  const isSelfReferrer = React.useMemo(() => {
    if (!address || !normalizedReferrer) return false;
    return normalizedReferrer.toLowerCase() === address.toLowerCase();
  }, [address, normalizedReferrer]);

  const buttonDisabled =
    isProcessing ||
    !isConnected ||
    !normalizedReferrer ||
    !isEvmAddress(normalizedReferrer) ||
    isSelfReferrer;

  return (
    <>
      <Header />
      <div className="min-h-screen bg-linear-to-b from-slate-950 via-slate-900 to-slate-950">
        <ConfirmBindModal
          open={showConfirmBindModal}
          address={normalizedReferrer}
          onCancel={() => setShowConfirmBindModal(false)}
          onConfirm={async () => {
            setShowConfirmBindModal(false);
            await handleBind();
          }}
        />
        <AlreadyBoundModal
          open={showAlreadyBoundModal}
          onConfirm={() => {
            setShowAlreadyBoundModal(false);
            router.replace("/");
          }}
        />
        <section className="relative py-12 pt-28 md:py-20 md:pt-44">
          {/* Background blurs */}
          <div className="absolute inset-0 z-0">
            <motion.div
              className="absolute top-24 right-10 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl"
              animate={{ scale: [1, 1.08, 1], opacity: [0.25, 0.45, 0.25] }}
              transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.div
              className="absolute bottom-16 left-10 w-72 h-72 bg-indigo-500/10 rounded-full blur-3xl"
              animate={{ scale: [1, 1.1, 1], opacity: [0.25, 0.45, 0.25] }}
              transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
            />
          </div>

          <motion.div
            className="relative z-10 max-w-4xl mx-auto px-6 md:px-8"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {/* Header */}
            <motion.div variants={itemVariants} className="text-center mb-10 md:mb-14">
              <motion.div
                className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full border border-white/15 bg-white/5 backdrop-blur-sm text-white/90 mb-6"
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.6 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
              >
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-sm">{t("badge")}</span>
              </motion.div>

              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
                {t("title")}{" "}
                <span className="bg-linear-to-r from-indigo-300 via-purple-300 to-pink-300 bg-clip-text text-transparent">
                  {t("titleHighlight")}
                </span>
              </h1>
              <p className="text-base md:text-lg text-white/80 max-w-2xl mx-auto leading-relaxed px-2">
                {t("subtitle")}
              </p>
            </motion.div>

            {/* Card */}
            <motion.div
              variants={itemVariants}
              className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-6 sm:p-8 md:p-10 shadow-xl"
            >
              <div className="pointer-events-none absolute -top-24 -right-24 w-80 h-80 blur-3xl opacity-30 bg-purple-500/20" />
              <div className="pointer-events-none absolute -bottom-24 -left-24 w-80 h-80 blur-3xl opacity-30 bg-indigo-500/20" />

              <div className="relative z-10 space-y-6">
                {/* Connected wallet */}
                <div className="rounded-2xl border border-white/10 bg-white/5 p-5 sm:p-6">
                  <div className="text-sm text-white/70 mb-2">{t("sections.yourWallet")}</div>
                  <div className="flex items-start gap-3">
                    <div className="flex-1 font-mono text-sm sm:text-base text-white break-all overflow-wrap-anywhere">
                      {address || "--"}
                    </div>
                    {address && (
                      <button
                        type="button"
                        onClick={() => navigator.clipboard.writeText(address)}
                        className="shrink-0 p-2 rounded-lg bg-white/5 hover:bg-white/10 text-white/60 hover:text-white transition-colors cursor-pointer"
                        title={t("actions.copy")}
                      >
                        <i className="fa fa-copy text-sm" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Input */}
                <div className="rounded-2xl border border-white/10 bg-white/5 p-5 sm:p-6">
                  <label className="block text-sm text-white/70 mb-2">
                    {t("sections.referrerWalletAddress")}
                  </label>
                  <input
                    value={referrer}
                    onChange={(e) => setReferrer(e.target.value)}
                    placeholder={t("placeholders.walletAddress")}
                    className="w-full rounded-2xl border border-white/15 bg-slate-950/40 px-4 py-3 text-white placeholder:text-white/30 outline-none focus:border-white/30 focus:ring-2 focus:ring-purple-500/25 font-mono text-sm sm:text-base"
                    autoComplete="off"
                    inputMode="text"
                  />
                  {isSelfReferrer && (
                    <div className="mt-2 text-xs text-amber-300/90!">
                      {t("validation.referrerCannotBeSelf")}
                    </div>
                  )}
                </div>

                {/* Action */}
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                  {!isConnected ? (
                    <button
                      type="button"
                      onClick={() => openConnectModal?.()}
                      className="w-full sm:w-auto inline-flex items-center justify-center rounded-full px-6 py-3 text-sm sm:text-base font-semibold text-white bg-linear-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 shadow-lg shadow-purple-500/30 transition-all duration-300 cursor-pointer"
                    >
                      {t("actions.connectWallet")}
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={handleBindClick}
                      disabled={buttonDisabled}
                      className={`w-full sm:flex-1 inline-flex items-center justify-center rounded-full px-6 py-3 text-sm sm:text-base font-semibold transition-all duration-300 ${
                        buttonDisabled
                          ? "bg-gray-600/40 text-gray-300 cursor-not-allowed"
                          : "text-white bg-linear-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 shadow-lg shadow-purple-500/30 cursor-pointer hover:-translate-y-0.5"
                      }`}
                    >
                      {isProcessing ? (
                        <span className="inline-flex items-center gap-2">
                          <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          {t("status.processing")}
                        </span>
                      ) : (
                        t("actions.bind")
                      )}
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() => setReferrer("")}
                    disabled={isProcessing}
                    className={`w-full sm:w-auto inline-flex items-center justify-center rounded-full px-6 py-3 text-sm sm:text-base font-semibold border transition-all duration-300 ${
                      isProcessing
                        ? "border-white/10 text-white/30 bg-white/5 cursor-not-allowed"
                        : "border-white/15 text-white/80 bg-white/5 hover:bg-white/10 hover:text-white cursor-pointer"
                    }`}
                  >
                    {t("actions.clear")}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </section>
      </div>
      <Footer />
      <ScrollToTop />
    </>
  );
};

export default BindNodePage;