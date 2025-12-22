// Node holding data interface
export interface NodeHolding {
  id: string;
  nodeType: 'genesis' | 'super' | 'standard';
  purchaseCost: {
    usd: number;
    clt: number;
  };
  yesterdayEarnings: {
    amount: number;
    percentage: number;
  };
  accumulatedEarnings: number;
}

