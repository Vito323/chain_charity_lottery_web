import { useState, useEffect } from "react";
import { NODES_DATA, getNodeById, type NodeTierId } from "@/constants/nodes";

export const useNodeDetail = (nodeId: string) => {
  const [selectedNodeId, setSelectedNodeId] = useState<NodeTierId>("genesis");

  // 根据 nodeId 初始化选中的节点
  useEffect(() => {
    const initialNode = getNodeById(nodeId);
    if (initialNode) {
      setSelectedNodeId(initialNode.id);
    }
  }, [nodeId]);

  // 获取当前选中的节点数据
  const currentNode = NODES_DATA.find((node) => node.id === selectedNodeId) || NODES_DATA[0];
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
    setSelectedNodeId,
    currentNode,
    isGenesis,
    isSuper,
    isStandard,
    nfts,
  };
};

