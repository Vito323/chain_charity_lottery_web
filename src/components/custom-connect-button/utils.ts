/**
 * 格式化钱包地址显示
 */
export const formatAddress = (address: string): string => {
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
};

/**
 * 获取链的备用图标
 */
export const getFallbackChainIcon = (chainId: number): string => {
  const fallbackChains: { [key: number]: string } = {
    1: '⟠',
    137: '∞',
  };
  return fallbackChains[chainId] || '?';
};

