import { NodeHolding } from './types';

// Default mock data based on the image
export const defaultNodeHoldings: NodeHolding[] = [
  {
    id: '1',
    nodeType: 'genesis',
    purchaseCost: {
      usd: 100000,
      clt: 588235,
    },
    yesterdayEarnings: {
      amount: 888.88,
      percentage: 1.35,
    },
    accumulatedEarnings: 5888.88,
  },
  {
    id: '2',
    nodeType: 'genesis',
    purchaseCost: {
      usd: 100000,
      clt: 588235,
    },
    yesterdayEarnings: {
      amount: 888.88,
      percentage: 1.35,
    },
    accumulatedEarnings: 15888.88,
  },
  {
    id: '3',
    nodeType: 'super',
    purchaseCost: {
      usd: 50000,
      clt: 294117,
    },
    yesterdayEarnings: {
      amount: 288.88,
      percentage: 0.95,
    },
    accumulatedEarnings: 6888.88,
  },
  {
    id: '4',
    nodeType: 'super',
    purchaseCost: {
      usd: 50000,
      clt: 294117,
    },
    yesterdayEarnings: {
      amount: 288.88,
      percentage: 0.95,
    },
    accumulatedEarnings: 5888.88,
  },
  {
    id: '5',
    nodeType: 'standard',
    purchaseCost: {
      usd: 10000,
      clt: 58823,
    },
    yesterdayEarnings: {
      amount: 188.88,
      percentage: 0.45,
    },
    accumulatedEarnings: 5888.88,
  },
  {
    id: '6',
    nodeType: 'standard',
    purchaseCost: {
      usd: 10000,
      clt: 58823,
    },
    yesterdayEarnings: {
      amount: 188.88,
      percentage: 0.45,
    },
    accumulatedEarnings: 5888.88,
  },
  {
    id: '7',
    nodeType: 'standard',
    purchaseCost: {
      usd: 10000,
      clt: 29411,
    },
    yesterdayEarnings: {
      amount: 188.88,
      percentage: 0.45,
    },
    accumulatedEarnings: 5888.88,
  },
  {
    id: '8',
    nodeType: 'standard',
    purchaseCost: {
      usd: 10000,
      clt: 29411,
    },
    yesterdayEarnings: {
      amount: 188.88,
      percentage: 0.45,
    },
    accumulatedEarnings: 1888.88,
  },
];

