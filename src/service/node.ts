import { action } from "./provider";



export interface PendingNode {
  nodeType: number,
  nodeId: string,
  referrer: string,
  nonce: number,
  deadline: number,
  signature: string,
}


export interface NodeData {
  id: number, // 节点ID
  name: string, // 节点名称
  rank: string, // 节点排名
  description: string, // 节点描述
  status: number, // 节点状态
  maxSupply: number, // 最大供应量
  currentSupply: number, // 当前供应量
  price: number, // 价格
  reward: number, // 奖励
}



export const queryNodeList = async () =>
  action<NodeData[]>({
    url: `/node`,
    method: 'GET',
  });



export const pendingNode = async (nodeId: number, to: string) =>
  action<PendingNode>({
    url: `/node/purchase-pending`,
    method: 'POST',
    data: { nodeId, to },
  });