'use client';

import type React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WagmiProvider } from 'wagmi';
import { Locale, RainbowKitProvider, lightTheme } from '@rainbow-me/rainbowkit';
import { config } from '@/lib/wagmi';
import { useLocale } from 'next-intl';
import { mainnet, polygon } from 'wagmi/chains';

const queryClient = new QueryClient();

export function Providers({ children }: { children: React.ReactNode }) {
  const currentLocale = useLocale();


  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider
          locale={currentLocale as Locale}
          theme={lightTheme({ accentColor: '#08cc7f', accentColorForeground: '#ffffff' })}
          accountDetails={{
            // 默认有 copy & disconnect，这里可以加新的
            additionalActions: [
              {
                label: '在 Etherscan 查看',
                onClick: (address) => {
                  window.open(`https://etherscan.io/address/${address}`, '_blank');
                },
              },
              {
                label: '我的自定义功能',
                onClick: (address) => {
                  console.log('执行自定义操作，当前地址:', address);
                },
              },
            ],
          }}
        >
          {children}
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
