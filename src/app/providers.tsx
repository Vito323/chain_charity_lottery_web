'use client';
import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WagmiProvider } from 'wagmi';
import { Locale, RainbowKitProvider, lightTheme } from '@rainbow-me/rainbowkit';
import { config } from '@/lib/wagmi';
import { useLocale } from 'next-intl';
import { polygonAmoy } from 'wagmi/chains';
import {ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { CategoryData, queryCategories } from '@/service/project';
import useGlobalStore from '@/store';
const queryClient = new QueryClient();

export function Providers({ children }: { children: React.ReactNode }) {
  const currentLocale = useLocale();
  const setCategories = useGlobalStore((state) => state.setCategories);

  const getCategories = React.useCallback(async () => {
    const response = await queryCategories();
    if(response){
      setCategories(response as unknown as CategoryData[]);
    }
  }, [setCategories]);

  React.useEffect(() => {
    getCategories();
  }, [getCategories]);


  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider
          initialChain={polygonAmoy}
          locale={currentLocale as Locale}
          theme={lightTheme({ accentColor: '#08cc7f', accentColorForeground: '#ffffff' })}
        >
          {children}
          <ToastContainer></ToastContainer>
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
