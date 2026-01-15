// 上级节点信息类型定义
export interface ParentNodeInfo {
  address: string;
  name?: string;
  avatar?: string;
  nodeType: 'genesis' | 'super' | 'standard';
  nodeCount: number;
  totalEarnings: number;
  joinDate: string;
  level: number;
  referralCount: number;
}
