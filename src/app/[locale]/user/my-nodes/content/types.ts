// Node holding data interface（字段与 App `UserNodeItemModel` / 列表展示对齐）
export interface NodeHolding {
  id: string;
  nodeType: 'genesis' | 'super' | 'standard';
  /** 接口 `status`：1 为已激活（可展开详情） */
  status: number;
  purchaseCost: {
    /** 节点成本 USDT，对应 `node.price` */
    usdt: number;
  };
  /** 节点收益 USDT，对应 `earnings` */
  accumulatedEarnings: number;
  /** 质押时间（秒） */
  timestampSec: number;
  /** 质押数量 CCT，对应 `node.stake` */
  stake: number;
  /** 周期奖励基数，对应 `node.reward`（用于当前奖励估算） */
  reward: number;
}

