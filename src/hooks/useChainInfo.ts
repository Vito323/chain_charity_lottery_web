import { useChainId } from 'wagmi';
import { mainnet, polygon } from 'wagmi/chains';

interface ChainInfo {
  name: string;
  symbol: string;
  color: string;
  id: number;
}

export const useChainInfo = () => {
  const chainId = useChainId();

  const getCurrentChain = (): ChainInfo => {
    if (chainId === mainnet.id) {
      return { 
        name: "Ethereum", 
        symbol: "ETH", 
        color: "#627EEA",
        id: mainnet.id
      };
    }
    if (chainId === polygon.id) {
      return { 
        name: "Polygon", 
        symbol: "MATIC", 
        color: "#8247E5",
        id: polygon.id
      };
    }
    return { 
      name: "Unknown", 
      symbol: "UNKNOWN", 
      color: "#6c757d",
      id: chainId
    };
  };

  const currentChain = getCurrentChain();

  return {
    chainId,
    currentChain,
    isMainnet: chainId === mainnet.id,
    isPolygon: chainId === polygon.id,
    isSupported: chainId === mainnet.id || chainId === polygon.id
  };
};
