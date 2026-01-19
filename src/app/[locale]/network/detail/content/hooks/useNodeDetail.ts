import { useMemo, useState, useEffect, useCallback } from "react";
import { NODES_DATA, type NodeTierId, type NodeData } from "@/constants/nodes";
import { queryNodeList, type NodeData as ApiNodeData } from "@/service/node";
import { useTranslations } from "next-intl";

/**
 * Map rank to node tier ID
 * rank 0 = Genesis, 1 = Super, 2 = Normal
 */
const getNodeTierIdByRank = (rank: string | number): NodeTierId => {
  const rankNum = typeof rank === 'string' ? parseInt(rank, 10) : rank;
  if (rankNum === 0) return 'genesis';
  if (rankNum === 1) return 'super';
  if (rankNum === 2) return 'standard';
  return 'standard'; // default fallback
};

/**
 * Convert API NodeData to NodeData, merging with default data
 * Priority: API data first, then default data
 */
const convertApiNodeToNodeData = (apiNode: ApiNodeData): NodeData => {
  const tierId = getNodeTierIdByRank(apiNode.rank);
  const defaultNode = NODES_DATA.find((node) => node.id === tierId) || NODES_DATA[0];

  // Merge API data with default data, prioritizing API data
  return {
    ...defaultNode,
    id: tierId,
    name: apiNode.name?.trim() || defaultNode.name,
    price: apiNode.price ?? defaultNode.price,
    globalLimit: apiNode.maxSupply ?? defaultNode.globalLimit,
    description: apiNode.description?.trim() || defaultNode.description,
    rank: apiNode.rank,
    // Store reward from API for InvestmentReturns calculation
    reward: apiNode.reward ?? 0,
  } as NodeData & { reward: number };
};

export const useNodeDetail = (rank: string) => {
  const t = useTranslations("network");
  const [nodeList, setNodeList] = useState<NodeData[]>(NODES_DATA);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch node list from API
  const fetchNodeList = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await queryNodeList();
      if (response.ok && response.data && response.data.length > 0) {
        // Convert API nodes to NodeData format
        const convertedNodes = response.data.map((apiNode) =>
          convertApiNodeToNodeData(apiNode)
        );
        setNodeList(convertedNodes);
      } else {
        // Fallback to default data if API fails or returns empty
        setNodeList(NODES_DATA);
      }
    } catch (err) {
      console.error('Failed to fetch node list:', err);
      // Fallback to default data on error
      setNodeList(NODES_DATA);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchNodeList();
  }, [fetchNodeList]);

  // Current selected rank
  const selectedRank = useMemo(() => {
    const rankNum = parseInt(rank, 10);
    if (isNaN(rankNum) || rankNum < 0 || rankNum > 2) {
      return "0"; // default to Genesis
    }
    return rank;
  }, [rank]);

  // Get current node data by rank
  const currentNode = useMemo(() => {
    const rankNum = parseInt(selectedRank, 10);
    const node = nodeList.find((n) => {
      const nodeRank = typeof n.rank === 'string' ? parseInt(n.rank, 10) : n.rank;
      return nodeRank === rankNum;
    });
    return node || nodeList[0] || NODES_DATA[0];
  }, [selectedRank, nodeList]);

  const isGenesis = currentNode.id === "genesis";
  const isSuper = currentNode.id === "super";
  const isStandard = currentNode.id === "standard";

  // NFT 数据 - 从 nodeList 获取，如果没有则使用默认数据
  const nfts = useMemo(() => {
    const allNodes = nodeList.length > 0 ? nodeList : NODES_DATA;
    return allNodes.map((node) => {
      const nodeRank = typeof node.rank === 'string' ? node.rank : String(node.rank);
      return {
        id: node.id,
        rank: nodeRank,
        nodeName: t(`nodeTiers.${node.id}.name`), // 使用多语言翻译
        gradient: node.nft.gradient,
        borderColor: node.nft.borderColor,
      };
    });
  }, [nodeList, t]);

  return {
    selectedRank,
    currentNode,
    isGenesis,
    isSuper,
    isStandard,
    nfts,
    isLoading,
  };
};

