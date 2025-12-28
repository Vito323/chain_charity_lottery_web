/**
 * Node data constants
 * Contains complete information for all three node tiers
 */

export type NodeTierId = 'genesis' | 'super' | 'standard';

/**
 * Node tier basic information (for list page)
 */
export interface NodeTier {
  id: NodeTierId;
  name: string;
  price: number;
  currency: string;
  aprRange: [number, number];
  globalLimit: number;
  description: string;
  highlight?: string;
  accentFrom: string;
  accentTo: string;
}

/**
 * Node statistics
 */
export interface NodeStats {
  totalLimit: number;
  sold: number;
  remaining: number;
}

/**
 * Investment returns information
 */
export interface InvestmentReturns {
  initial: string;
  threeYearReturn: string;
  year1: string;
  year2: string;
  year3: string;
  totalReturnRate: string;
  returnDescription: string;
}

/**
 * Price advantage information
 */
export interface PriceAdvantage {
  nodePrice: string;
  exclusivePrice: string;
  publicPrice: string;
  publicOffering: string;
  advantage: string;
  advantageDescription: string;
}

/**
 * NFT information for each node (only gradient and borderColor, no title)
 */
export interface NodeNFT {
  gradient: string;
  borderColor: string;
}

/**
 * Complete node information including details
 */
export interface NodeData extends NodeTier {
  stats: NodeStats;
  investmentReturns: InvestmentReturns;
  priceAdvantage: PriceAdvantage;
  nft: NodeNFT;
}

/**
 * Complete node data array - three nodes with all information
 */
export const NODES_DATA: NodeData[] = [
  {
    // Basic tier information
    id: 'genesis',
    name: 'Genesis Node',
    price: 100_000,
    currency: 'USDT',
    aprRange: [25, 35],
    globalLimit: 50,
    description: 'High yield node for early supporters.',
    highlight: '3-year projected return',
    accentFrom: 'from-purple-500',
    accentTo: 'to-pink-500',

    // Statistics
    stats: {
      totalLimit: 50,
      sold: 12,
      remaining: 38,
    },

    // Investment returns
    investmentReturns: {
      initial: '$100K',
      threeYearReturn: '$2.4M',
      year1: '$350K',
      year2: '$520K',
      year3: '$630K',
      totalReturnRate: '2408%',
      returnDescription: 'Genesis nodes offer the highest returns with a projected 2408% total return over 3 years.',
    },

    // Price advantage
    priceAdvantage: {
      nodePrice: '$0.17/CCT',
      exclusivePrice: 'Exclusive pre-sale price',
      publicPrice: '$2.5/CCT',
      publicOffering: 'Public offering price',
      advantage: '14.6x',
      advantageDescription: 'Genesis node holders enjoy a 14.6x price advantage compared to public offering.',
    },

    // NFT information
    nft: {
      gradient: 'from-purple-900 via-pink-900 to-purple-900',
      borderColor: 'border-purple-500',
    },
  },
  {
    // Basic tier information
    id: 'super',
    name: 'Super Node',
    price: 50_000,
    currency: 'USDT',
    aprRange: [20, 30],
    globalLimit: 600,
    description: 'Designed for experienced investors.',
    accentFrom: 'from-blue-500',
    accentTo: 'to-cyan-500',

    // Statistics
    stats: {
      totalLimit: 600,
      sold: 245,
      remaining: 355,
    },

    // Investment returns
    investmentReturns: {
      initial: '$50K',
      threeYearReturn: '$1.2M',
      year1: '$175K',
      year2: '$260K',
      year3: '$315K',
      totalReturnRate: '1200%',
      returnDescription: 'Super nodes provide excellent returns with a projected 1200% total return over 3 years.',
    },

    // Price advantage
    priceAdvantage: {
      nodePrice: '$0.17/CCT',
      exclusivePrice: 'Exclusive pre-sale price',
      publicPrice: '$2.5/CCT',
      publicOffering: 'Public offering price',
      advantage: '14.6x',
      advantageDescription: 'Super node holders enjoy a 14.6x price advantage compared to public offering.',
    },

    // NFT information
    nft: {
      gradient: 'from-blue-900 via-cyan-900 to-blue-900',
      borderColor: 'border-blue-500',
    },
  },
  {
    // Basic tier information
    id: 'standard',
    name: 'Standard Node',
    price: 10_000,
    currency: 'USDT',
    aprRange: [15, 25],
    globalLimit: 5_000,
    description: 'Accessible entry for everyday investors.',
    accentFrom: 'from-emerald-500',
    accentTo: 'to-teal-500',

    // Statistics
    stats: {
      totalLimit: 5_000,
      sold: 1_868,
      remaining: 3_132,
    },

    // Investment returns
    investmentReturns: {
      initial: '10K USDT',
      threeYearReturn: '200K USDT',
      year1: '2K USDT',
      year2: '6K USDT',
      year3: '10K USDT',
      totalReturnRate: '100%',
      returnDescription: 'Standard nodes offer stable returns with a projected 100% total return over 3 years.',
    },

    // Price advantage
    priceAdvantage: {
      nodePrice: '$0.17/CCT',
      exclusivePrice: 'Exclusive pre-sale price',
      publicPrice: '$2.5/CCT',
      publicOffering: 'Public offering price',
      advantage: '14.6x',
      advantageDescription: 'Standard node holders enjoy a 14.6x price advantage compared to public offering.',
    },

    // NFT information
    nft: {
      gradient: 'from-emerald-900 via-teal-900 to-emerald-900',
      borderColor: 'border-emerald-500',
    },
  },
];

/**
 * Get node data by ID
 */
export const getNodeById = (nodeId: string): NodeData | undefined => {
  const nodeIdLower = nodeId.toLowerCase();
  return NODES_DATA.find(
    (node) =>
      node.id === nodeIdLower ||
      nodeIdLower.includes(node.id) ||
      nodeIdLower === 'genesis' ||
      nodeIdLower === 'super' ||
      (nodeIdLower === 'standard' || nodeIdLower.includes('normal'))
  );
};

/**
 * Get node tier information only (for list page)
 */
export const getNodeTiers = (): NodeTier[] => {
  return NODES_DATA.map((node) => ({
    id: node.id,
    name: node.name,
    price: node.price,
    currency: node.currency,
    aprRange: node.aprRange,
    globalLimit: node.globalLimit,
    description: node.description,
    highlight: node.highlight,
    accentFrom: node.accentFrom,
    accentTo: node.accentTo,
  }));
};

