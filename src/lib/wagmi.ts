"use client";
import { connectorsForWallets, getDefaultWallets } from '@rainbow-me/rainbowkit';
import { metaMaskWallet } from '@rainbow-me/rainbowkit/wallets';
import {
  mainnet,
  polygon,
  polygonAmoy,
} from 'wagmi/chains';
import { defineChain } from 'viem';
import { createConfig, http } from 'wagmi';

const appName = 'ChainCharity';
const projectId = 'YOUR_PROJECT_ID';

const localhost = defineChain({
  id: 31337, 
  name: 'LocalNet',
  nativeCurrency: {
    decimals: 18,
    name: 'Ethereum',
    symbol: 'ETH',
  },
  rpcUrls: {
    default: {
      http: ['http://127.0.0.1:8545'],
    },
  },
  blockExplorers: {
    default: { name: 'Local Explorer', url: 'http://localhost:8545' },
  },
  testnet: true,
});

const chains = [mainnet, polygon, polygonAmoy, localhost] as const;

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
