'use client';

import type React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WagmiProvider } from 'wagmi';
import { Locale, RainbowKitProvider, lightTheme } from '@rainbow-me/rainbowkit';
import { config } from '@/lib/wagmi';
import { useLocale } from 'next-intl';


const queryClient = new QueryClient();

export function Providers({ children }: { children: React.ReactNode }) {
  const currentLocale = useLocale();


  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider
          locale={currentLocale as Locale}
          theme={lightTheme({ accentColor: '#08cc7f', accentColorForeground: '#ffffff' })}
        >
          {children}
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
