import { connectorsForWallets, getDefaultWallets } from '@rainbow-me/rainbowkit';
import { metaMaskWallet } from '@rainbow-me/rainbowkit/wallets';
import {
  arbitrum,
  base,
  mainnet,
  optimism,
  polygon,
  sepolia,
} from 'wagmi/chains';
import { createConfig, http } from 'wagmi';

const appName = 'Hawaiian';
const projectId = 'YOUR_PROJECT_ID';

const chains =  
  process.env.NEXT_PUBLIC_ENABLE_TESTNETS === 'true'
    ? ([mainnet, polygon, optimism, arbitrum, base, sepolia] as const)
    : ([mainnet, polygon, optimism, arbitrum, base] as const);

const { wallets } = getDefaultWallets();

const reorderedWallets = wallets.map((group) => {
  if (group.groupName === 'Popular') {
    const rest = group.wallets.filter((w) => w !== metaMaskWallet);
    return { ...group, wallets: [metaMaskWallet, ...rest] };
  }
  return group;
});

const connectors = connectorsForWallets(reorderedWallets, {
  projectId,
  appName,
});

const transports = chains.reduce<Record<number, ReturnType<typeof http>>>((acc, chain) => {
  acc[chain.id] = http();
  return acc;
}, {});

export const config = createConfig({
  chains,
  transports,
  connectors,
  ssr: true,
});
