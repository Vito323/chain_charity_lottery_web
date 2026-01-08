"use client";
import { connectorsForWallets, getDefaultWallets } from '@rainbow-me/rainbowkit';
import { metaMaskWallet, tokenPocketWallet } from '@rainbow-me/rainbowkit/wallets';
import {
  mainnet,
  polygon,
  polygonAmoy,
  bsc,
} from 'wagmi/chains';
import { defineChain } from 'viem';
import { createConfig, http } from 'wagmi';

const appName = 'Hawaiian Nation ChainCharity';
const projectId = 'YOUR_PROJECT_ID';

const chains = [bsc, polygon, polygonAmoy] as const;

const { wallets } = getDefaultWallets();

const reorderedWallets = wallets.map((group) => {
  if (group.groupName === 'Popular') {
    const rest = group.wallets.filter((w) => w !== metaMaskWallet);
    return { ...group, wallets: [metaMaskWallet, tokenPocketWallet, ...rest] };
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
