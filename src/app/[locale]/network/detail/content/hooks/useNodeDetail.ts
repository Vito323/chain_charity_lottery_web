import { useMemo } from "react";
import { NODES_DATA, getNodeById, type NodeTierId } from "@/constants/nodes";

export const useNodeDetail = (tier: string) => {
  // 当前选中的节点 ID（直接使用 tier 参数）
  const selectedNodeId = useMemo(() => {
    const tierLower = tier.toLowerCase();
    // 验证 tier 是否为有效的 NodeTierId
    if (["genesis", "super", "standard"].includes(tierLower)) {
      return tierLower as NodeTierId;
    }
    // 如果无效，尝试通过 getNodeById 获取
    const node = getNodeById(tier);
    return (node?.id || "genesis") as NodeTierId;
  }, [tier]);

  // 根据 tier 获取当前节点数据
  const currentNode = useMemo(() => {
    debugger;
    const node = getNodeById(tier);
    return node || NODES_DATA[0];
  }, [tier]);

  const isGenesis = currentNode.id === "genesis";
  const isSuper = currentNode.id === "super";
  const isStandard = currentNode.id === "standard";

  // NFT 数据 - 三个节点对应三个 NFT
  const nfts = NODES_DATA.map((node) => ({
    id: node.id,
    nodeId: node.id,
    nodeName: node.name,
    gradient: node.nft.gradient,
    borderColor: node.nft.borderColor,
  }));

  return {
    selectedNodeId,
    currentNode,
    isGenesis,
    isSuper,
    isStandard,
    nfts,
  };
};

