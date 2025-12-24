import { polygon, bsc } from 'wagmi/chains';
import { SCAN_URL } from '@/constants/enum';

/**
 * 链信息配置
 */
export interface ChainInfo {
  name: string;
  icon: string; // SVG路径
  tokenSymbol: string; // 用于获取token SVG图标
  color: string;
  scanUrl: string;
}

/**
 * 根据链ID获取链信息
 */
export const getChainInfo = (chainId?: number): ChainInfo => {
  switch (chainId) {
    case polygon.id:
      return {
        name: 'Polygon',
        icon: '/icons/tokens/POL.svg',
        tokenSymbol: 'POL',
        color: '#8247E5',
        scanUrl: SCAN_URL.POLYGON,
      };
    case bsc.id:
      return {
        name: 'BSC',
        icon: '/icons/tokens/BNB.svg',
        tokenSymbol: 'BNB',
        color: '#F3BA2F',
        scanUrl: SCAN_URL.BSC,
      };
    default:
      // 默认返回 Polygon
      return {
        name: 'Polygon',
        icon: '/icons/tokens/POL.svg',
        tokenSymbol: 'POL',
        color: '#8247E5',
        scanUrl: SCAN_URL.POLYGON,
      };
  }
};

/**
 * 根据链ID获取扫描URL
 */
export const getScanUrl = (chainId?: number): string => {
  return getChainInfo(chainId).scanUrl;
};

