import { polygon, bsc } from 'wagmi/chains';

/**
 * 链合约配置接口
 */
export interface ChainContractConfig {
  chainId: number;
  contractAddress: string;
}

/**
 * 各链的合约地址配置
 * 根据实际部署的合约地址进行配置
 */
const CHAIN_CONTRACTS: Record<number, ChainContractConfig> = {
  [polygon.id]: {
    chainId: polygon.id,
    contractAddress: process.env.NEXT_PUBLIC_POLYGON_CONTRACT_ADDRESS || '',
  },
  [bsc.id]: {
    chainId: bsc.id,
    contractAddress: process.env.NEXT_PUBLIC_BSC_CONTRACT_ADDRESS || '',
  },
  // 本地开发网络
  31337: {
    chainId: 31337,
    contractAddress: process.env.NEXT_PUBLIC_LOCAL_CONTRACT_ADDRESS || '',
  },
};

/**
 * 根据链ID获取合约配置
 */
export const getContractConfig = (chainId?: number): ChainContractConfig | null => {
  if (!chainId) {
    return null;
  }

  const config = CHAIN_CONTRACTS[chainId];
  if (!config || !config.contractAddress) {
    console.warn(`未找到链ID ${chainId} 的合约配置`);
    return null;
  }

  return config;
};

/**
 * 根据链ID获取合约地址
 */
export const getContractAddress = (chainId?: number): string | null => {
  const config = getContractConfig(chainId);
  return config?.contractAddress || null;
};

/**
 * 检查链是否支持
 */
export const isChainSupported = (chainId?: number): boolean => {
  if (!chainId) {
    return false;
  }
  return chainId in CHAIN_CONTRACTS;
};

