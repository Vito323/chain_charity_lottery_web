// Node holding data interface
export interface NodeHolding {
  id: string;
  nodeType: 'genesis' | 'super' | 'standard';
  purchaseCost: {
    /** Purchase cost in USDT (no CCT conversion) */
    usdt: number;
  };
  accumulatedEarnings: number;
}

