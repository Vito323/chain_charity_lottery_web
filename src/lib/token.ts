// Polygon 网络主流 ERC-20 代币地址
export const TOKEN_ADDRESSES = {
  // 稳定币
  USDC: "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174", // USD Coin
  USDT: "0xc2132D05D31c914a87C6611C10748AEb04B58e8F", // Tether USD
  DAI: "0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063", // Dai Stablecoin
  BUSD: "0x9C9e5fD8bbc25984B178FdCE6117Defa39d2db39", // Binance USD
  
  // DeFi 代币
  AAVE: "0xD6DF932A45C0f255f85145f286eA0b292B21C90B", // Aave Token
  CRV: "0x172370d5Cd63279eFa6d502DAB29171933a610AF", // Curve DAO Token
  SUSHI: "0x0b3F868E0BE5597D5DB7fEB59E1CADBb0fdDa50a", // SushiToken
  QUICK: "0x831753DD7087CaC61aB5644b308642cc1c33Dc13", // QuickSwap
  
  // 预言机和基础设施
  LINK: "0x53E0bca35eC356BD5ddDFebbD1Fc0fD03FaBad39", // ChainLink Token
  MATIC: "0x0000000000000000000000000000000000001010", // Polygon (Wrapped)
  
  // 跨链桥代币
  WBTC: "0x1BFD67037B42Cf73acF2047067bd4F2C47D9BfD6", // Wrapped BTC
  WETH: "0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619", // Wrapped Ether
  
  // 游戏和 NFT
  SAND: "0xBbba073C31bF03b8ACf7c28EF0738DeFCF414678", // The Sandbox
  MANA: "0xA1c57f48F0Deb89c5696871eF12e1367c23C071", // Decentraland
  
  // 其他主流代币
  UNI: "0xb33EaAd8d922B1083446DC23f610c2567fB5180f", // Uniswap
  COMP: "0x8505b9d2254A7eE4689010a6f3486C798A8Ec731", // Compound
  YFI: "0xDA537104D6A5edd53c6fBba9A898708E465260b6", // Yearn Finance
  SNX: "0x50B728D8D964fd00C2d0AAD81718b71311feF68a", // Synthetix Network Token
  
  // Polygon 生态代币
  GHST: "0x385Eeac5cB8A0A6D7698F57A30373c3a8d857A3", // Aavegotchi
  DF: "0x08C15FA26E519A78a666D19a5C926101c1ee0BF9", // dForce
  BAL: "0x9a71012B13CA4d3D0Cdc72A177DF3ef03b0E76A3", // Balancer
  RNDR: "0x61299774020dA444Af134c82fa83E3810b309991", // Render Token
};

// 代币信息接口
export interface TokenInfo {
  symbol: string;
  name: string;
  decimals: number;
  address: string;
  logoURI?: string;
}

// 代币详细信息
export const TOKEN_INFO: Record<string, TokenInfo> = {
  USDC: {
    symbol: "USDC",
    name: "USD Coin",
    decimals: 6,
    address: TOKEN_ADDRESSES.USDC,
  },
  USDT: {
    symbol: "USDT", 
    name: "Tether USD",
    decimals: 6,
    address: TOKEN_ADDRESSES.USDT,
  },
  DAI: {
    symbol: "DAI",
    name: "Dai Stablecoin", 
    decimals: 18,
    address: TOKEN_ADDRESSES.DAI,
  },
  BUSD: {
    symbol: "BUSD",
    name: "Binance USD",
    decimals: 18,
    address: TOKEN_ADDRESSES.BUSD,
  },
  AAVE: {
    symbol: "AAVE",
    name: "Aave Token",
    decimals: 18,
    address: TOKEN_ADDRESSES.AAVE,
  },
  CRV: {
    symbol: "CRV",
    name: "Curve DAO Token",
    decimals: 18,
    address: TOKEN_ADDRESSES.CRV,
  },
  SUSHI: {
    symbol: "SUSHI",
    name: "SushiToken",
    decimals: 18,
    address: TOKEN_ADDRESSES.SUSHI,
  },
  QUICK: {
    symbol: "QUICK",
    name: "QuickSwap",
    decimals: 18,
    address: TOKEN_ADDRESSES.QUICK,
  },
  LINK: {
    symbol: "LINK",
    name: "ChainLink Token",
    decimals: 18,
    address: TOKEN_ADDRESSES.LINK,
  },
  MATIC: {
    symbol: "MATIC",
    name: "Polygon",
    decimals: 18,
    address: TOKEN_ADDRESSES.MATIC,
  },
  WBTC: {
    symbol: "WBTC",
    name: "Wrapped BTC",
    decimals: 8,
    address: TOKEN_ADDRESSES.WBTC,
  },
  WETH: {
    symbol: "WETH",
    name: "Wrapped Ether",
    decimals: 18,
    address: TOKEN_ADDRESSES.WETH,
  },
  SAND: {
    symbol: "SAND",
    name: "The Sandbox",
    decimals: 18,
    address: TOKEN_ADDRESSES.SAND,
  },
  MANA: {
    symbol: "MANA",
    name: "Decentraland",
    decimals: 18,
    address: TOKEN_ADDRESSES.MANA,
  },
  UNI: {
    symbol: "UNI",
    name: "Uniswap",
    decimals: 18,
    address: TOKEN_ADDRESSES.UNI,
  },
  COMP: {
    symbol: "COMP",
    name: "Compound",
    decimals: 18,
    address: TOKEN_ADDRESSES.COMP,
  },
  YFI: {
    symbol: "YFI",
    name: "Yearn Finance",
    decimals: 18,
    address: TOKEN_ADDRESSES.YFI,
  },
  SNX: {
    symbol: "SNX",
    name: "Synthetix Network Token",
    decimals: 18,
    address: TOKEN_ADDRESSES.SNX,
  },
  GHST: {
    symbol: "GHST",
    name: "Aavegotchi",
    decimals: 18,
    address: TOKEN_ADDRESSES.GHST,
  },
  DF: {
    symbol: "DF",
    name: "dForce",
    decimals: 18,
    address: TOKEN_ADDRESSES.DF,
  },
  BAL: {
    symbol: "BAL",
    name: "Balancer",
    decimals: 18,
    address: TOKEN_ADDRESSES.BAL,
  },
  RNDR: {
    symbol: "RNDR",
    name: "Render Token",
    decimals: 18,
    address: TOKEN_ADDRESSES.RNDR,
  },
};

// 获取代币信息的辅助函数
export const getTokenInfo = (symbol: string): TokenInfo | undefined => {
  return TOKEN_INFO[symbol.toUpperCase()];
};

// 获取代币地址的辅助函数
export const getTokenAddress = (symbol: string): string | undefined => {
  return TOKEN_ADDRESSES[symbol.toUpperCase() as keyof typeof TOKEN_ADDRESSES];
};

// 检查代币是否支持的辅助函数
export const isSupportedToken = (symbol: string): boolean => {
  return symbol.toUpperCase() in TOKEN_ADDRESSES;
};

// 获取所有支持的代币符号
export const getSupportedTokens = (): string[] => {
  return Object.keys(TOKEN_ADDRESSES);
};