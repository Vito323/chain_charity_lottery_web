"use client";
import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { usePathname } from "next/navigation";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider } from "wagmi";
import { Locale, RainbowKitProvider, lightTheme } from "@rainbow-me/rainbowkit";
import { config } from "@/lib/wagmi";
import { useLocale } from "next-intl";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { queryCategories } from "@/service/project";
import useGlobalStore from "@/store";
import { polygon } from "wagmi/chains";
import { projectConfig } from "@/service/common";
const queryClient = new QueryClient();

export function Providers({ children }: { children: React.ReactNode }) {
  const currentLocale = useLocale();
  const setCategories = useGlobalStore((state) => state.setCategories);
  const setConfig = useGlobalStore((state) => state.setConfig);
  const pathname = usePathname();

  const getCategories = React.useCallback(async () => {
    const response = await queryCategories();
    if (response.ok) {
      setCategories(response.data);
    }
  }, [setCategories]);

  const getConfig = React.useCallback(async () => {
    const response = await projectConfig();
    if (response.ok) {
      setConfig(response.data);
    }
  }, [setConfig]);

  React.useEffect(() => {
    getCategories();
  }, [getCategories]);
  React.useEffect(() => {
    getConfig();
  }, [getConfig]);

  // Scroll to top on route change
  React.useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [pathname]);

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider
          initialChain={polygon}
          locale={currentLocale as Locale}
          theme={lightTheme({
            accentColor: "#08cc7f",
            accentColorForeground: "#ffffff",
          })}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={pathname}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              {children}
            </motion.div>
          </AnimatePresence>
          <ToastContainer></ToastContainer>
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
