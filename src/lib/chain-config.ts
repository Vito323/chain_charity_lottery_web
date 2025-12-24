import { polygon, bsc } from 'wagmi/chains';

/**
 * 支持的链类型
 */
export type SupportedChain = 'POL' | 'BSC';

/**
 * 根据链ID获取对应的链类型
 */
export const getChainTypeById = (chainId?: number): SupportedChain | null => {
  if (!chainId) {
    return null;
  }

  switch (chainId) {
    case polygon.id:
      return 'POL';
    case bsc.id:
      return 'BSC';
    default:
      return null;
  }
};

/**
 * 根据链类型获取对应的 wagmi Chain 对象
 */
export const getChainByType = (chainType: SupportedChain) => {
  switch (chainType) {
    case 'BSC':
      return bsc;
    case 'POL':
    default:
      return polygon;
  }
};

/**
 * 根据链ID获取对应的 wagmi Chain 对象
 */
export const getChainById = (chainId?: number) => {
  if (!chainId) {
    return polygon; // 默认返回 Polygon
  }

  switch (chainId) {
    case polygon.id:
      return polygon;
    case bsc.id:
      return bsc;
    default:
      return polygon; // 默认返回 Polygon
  }
};

/**
 * 获取默认链的 wagmi Chain 对象（用于 initialChain）
 * 默认返回 Polygon
 */
export const getDefaultChainConfig = () => {
  return polygon; // 默认使用 Polygon 作为初始链
};

