import { action } from "./provider";




export interface PendingNode {
  nodeId: string;
  received: string;
  nonce: number
  deadline: number
  amount: string
  stakeAmount: string
  signature: string;
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

/** 节点下绑定用户列表（与 App `GET /api/node/bind-user/:nodeId` 对齐） */
export interface BindUserListItem {
  id: string;
  referrer: string;
  referrerNodeId: string;
}

export const normalizeBindUserList = (data: unknown): BindUserListItem[] => {
  const raw = Array.isArray(data)
    ? data
    : data && typeof data === 'object' && Array.isArray((data as { list?: unknown }).list)
      ? (data as { list: unknown[] }).list
      : [];

  return raw
    .filter((item): item is Record<string, unknown> => item != null && typeof item === 'object')
    .map((item) => ({
      id: String(item.id ?? ''),
      referrer: String(item.referrer ?? ''),
      referrerNodeId: String(item.referrerNodeId ?? ''),
    }));
};

export const getBindUserList = async (nodeId: string) =>
  action<BindUserListItem[]>({
    url: `/node/bind-user/${encodeURIComponent(nodeId)}`,
    method: 'GET',
  });