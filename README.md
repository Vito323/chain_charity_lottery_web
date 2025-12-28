# Hawaiian Nation Charity Web

这是一个基于 Next.js 的慈善平台前端应用，集成了区块链功能，支持项目管理和捐赠功能。

## 环境配置

在开始之前，需要配置环境变量：

### 1. 创建环境配置文件

在项目根目录创建 `.env.local` 文件（可以参考 `env.template` 模板文件）：

```bash
# 各链的合约地址配置（根据实际部署的合约地址配置）
NEXT_PUBLIC_POLYGON_CONTRACT_ADDRESS=0xYourPolygonContractAddress
NEXT_PUBLIC_BSC_CONTRACT_ADDRESS=0xYourBSCContractAddress
NEXT_PUBLIC_LOCAL_CONTRACT_ADDRESS=0x5FbDB2315678afecb367f032d93F642f64180aa3

# Alchemy API Keys (可选，用于 NFT 查询)
NEXT_PUBLIC_ALCHEMY_MAINNET_KEY=your_mainnet_key_here
NEXT_PUBLIC_ALCHEMY_POLYGON_KEY=your_polygon_key_here

# RainbowKit 配置
NEXT_PUBLIC_RAINBOWKIT_PROJECT_ID=your_project_id_here
```

### 2. 网络配置说明

**重要变更**: 系统现在根据当前连接的钱包链自动选择配置，不再使用环境变量指定默认链。

- **合约地址配置**:
  - `NEXT_PUBLIC_POLYGON_CONTRACT_ADDRESS`: Polygon 主网 (链ID: 137) 的 FundPoolManager 合约地址
  - `NEXT_PUBLIC_BSC_CONTRACT_ADDRESS`: BSC 主网 (链ID: 56) 的 FundPoolManager 合约地址
  - `NEXT_PUBLIC_LOCAL_CONTRACT_ADDRESS`: 本地开发网络 (链ID: 31337) 的合约地址

- **支持的链**:
  - `137`: Polygon 主网 (POL)
  - `56`: BSC 主网
  - `31337`: 本地开发网络 (Hardhat)

- **工作原理**:
  - 系统会根据用户当前连接的钱包链ID (`useChainId()`) 自动选择对应的合约地址
  - 当用户切换链时，系统会自动切换到对应链的合约配置

## 开始使用

首先，运行开发服务器：

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
