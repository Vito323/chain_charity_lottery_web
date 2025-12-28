# FundPoolManager Hook 使用指南

## 概述

`useFundPoolManager` 是一个 React Hook，用于与 FundPoolManager 智能合约进行交互。它提供了完整的合约功能封装，包括项目管理、捐赠、资金提取等功能。

## 功能特性

### 只读函数 (View Functions)
- **合约信息查询**: 获取版本号、所有者、各种基础点数配置
- **资金统计**: 获取团队资金、彩票资金、项目资金等统计信息
- **项目管理**: 查询项目信息、项目资金统计、所有者项目列表
- **捐赠查询**: 获取捐赠信息和捐赠总数
- **余额分解**: 获取详细的ETH和代币资金分解信息
- **代币管理**: 检查代币是否被允许、获取允许的代币列表

### 写入函数 (Write Functions)
- **项目管理**: 创建项目、更新项目状态、更新项目受益人
- **捐赠功能**: ETH捐赠、代币捐赠
- **资金提取**: 提取项目ETH/代币资金、提取彩票ETH/代币资金
- **代币管理**: 添加/移除允许的代币
- **管理功能**: 设置彩票管理员、紧急提取、所有权转移

## 环境配置

在使用 Hook 之前，需要配置环境变量：

### 1. 创建环境配置文件

在项目根目录创建 `.env.local` 文件：

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

**重要变更**: `useFundPoolManager` 现在根据当前连接的钱包链自动选择配置，不再使用单一的环境变量。

- **合约地址配置**:
  - `NEXT_PUBLIC_POLYGON_CONTRACT_ADDRESS`: Polygon 主网 (链ID: 137) 的 FundPoolManager 合约地址
  - `NEXT_PUBLIC_BSC_CONTRACT_ADDRESS`: BSC 主网 (链ID: 56) 的 FundPoolManager 合约地址
  - `NEXT_PUBLIC_LOCAL_CONTRACT_ADDRESS`: 本地开发网络 (链ID: 31337) 的合约地址

- **支持的链**:
  - `137`: Polygon 主网 (POL)
  - `56`: BSC 主网
  - `31337`: 本地开发网络 (Hardhat)

- **工作原理**:
  - Hook 使用 `useChainId()` 获取当前连接的钱包链ID
  - 根据链ID自动选择对应的合约地址
  - 当用户切换链时，Hook 会自动切换到对应链的合约配置

## 使用方法

### 1. 导入 Hook

```typescript
import { useFundPoolManager } from '@/hooks/useFundPoolManager';
```

### 2. 在组件中使用

```typescript
function MyComponent() {
    const {
        isLoading,
        error,
        contractAddress,
        // 只读函数
        getVersion,
        getOwner,
        getProject,
        getETHBalanceBreakdown,
        getTokenBalanceBreakdown,
        isTokenAllowed,
        getAllowedTokens,
        // 写入函数
        createProject,
        donateETH,
        donateToken,
        withdrawProjectFundsETH,
        withdrawProjectFundsToken,
        addAllowedToken,
        removeAllowedToken
    } = useFundPoolManager();

    // 使用函数...
}
```

## API 参考

### 状态
- `isLoading: boolean` - 是否正在处理交易
- `error: string | null` - 错误信息
- `contractAddress: string` - 合约地址

### 只读函数

#### 合约信息
- `getVersion(): Promise<number>` - 获取合约版本号
- `getOwner(): Promise<string>` - 获取合约所有者
- `getLotteryManager(): Promise<string>` - 获取彩票管理员

#### 基础点数配置
- `getBasisPointsDivisor(): Promise<number>` - 获取基础点数除数
- `getTeamFeeBasisPoints(): Promise<number>` - 获取团队费用基础点数
- `getLotteryPoolBasisPoints(): Promise<number>` - 获取彩票池基础点数
- `getProjectDonationBasisPoints(): Promise<number>` - 获取项目捐赠基础点数

#### 资金统计
- `getTotalTeamFunds(): Promise<number>` - 获取总团队资金
- `getTotalLotteryFunds(): Promise<number>` - 获取总彩票资金
- `getTotalProjectFunds(): Promise<number>` - 获取总项目资金
- `getWithdrawnTeamFunds(): Promise<number>` - 获取已提取的团队资金
- `getWithdrawnLotteryFunds(): Promise<number>` - 获取已提取的彩票资金

#### 项目管理
- `getProject(projectId: string): Promise<Project | null>` - 获取项目信息
- `getProjectFundStats(projectId: string): Promise<ProjectFundStats | null>` - 获取项目资金统计
- `getOwnerProjects(owner: string): Promise<string[]>` - 获取所有者项目列表

#### 捐赠查询
- `getDonationCount(): Promise<number>` - 获取捐赠总数
- `getDonation(donationId: number): Promise<Donation | null>` - 获取捐赠信息

#### 余额分解
- `getBalanceBreakdown(): Promise<BalanceBreakdown | null>` - 获取余额分解

### 写入函数

#### 项目管理
- `createProject(projectId: string, projectOwner: string, beneficiary: string): Promise<string>` - 创建项目
- `updateProject(projectId: string, isActive: boolean): Promise<string>` - 更新项目状态
- `updateProjectBeneficiary(projectId: string, newBeneficiary: string): Promise<string>` - 更新项目受益人

#### 捐赠和资金提取
- `donate(projectId: string, amount: string): Promise<string>` - 捐赠（金额以ETH为单位）
- `withdrawProjectFunds(projectId: string, amount: string): Promise<string>` - 提取项目资金
- `withdrawLotteryFunds(amount: string): Promise<string>` - 提取彩票资金

#### 管理功能
- `setLotteryManager(lotteryManager: string): Promise<string>` - 设置彩票管理员
- `emergencyWithdraw(recipient: string, amount: string): Promise<string>` - 紧急提取
- `transferOwnership(newOwner: string): Promise<string>` - 转移所有权
- `renounceOwnership(): Promise<string>` - 放弃所有权

## 数据类型

### Project
```typescript
interface Project {
    id: string;
    owner: string;
    beneficiary: string;
    isActive: boolean;
    version: number;
    createdAt: number;
    totalDonated: number;
    withdrawableAmount: number;
    withdrawnAmount: number;
}
```

### Donation
```typescript
interface Donation {
    donor: string;
    amount: number;
    timestamp: number;
    projectId: string;
}
```

### BalanceBreakdown
```typescript
interface BalanceBreakdown {
    totalBalance: number;
    availableTeamFunds: number;
    availableLotteryFunds: number;
    totalAvailableProjectFunds: number;
}
```

### ProjectFundStats
```typescript
interface ProjectFundStats {
    totalDonated: number;
    withdrawableAmount: number;
    withdrawnAmount: number;
}
```

## 使用示例

### 创建项目
```typescript
const handleCreateProject = async () => {
    try {
        const txHash = await createProject(
            "project-001",
            "0x1234567890123456789012345678901234567890",
            "0x0987654321098765432109876543210987654321"
        );
        console.log("项目创建成功:", txHash);
    } catch (error) {
        console.error("创建项目失败:", error);
    }
};
```

### 捐赠
```typescript
const handleDonate = async () => {
    try {
        const txHash = await donate("project-001", "1.0"); // 捐赠1 ETH
        console.log("捐赠成功:", txHash);
    } catch (error) {
        console.error("捐赠失败:", error);
    }
};
```

### 查询项目信息
```typescript
const loadProjectInfo = async () => {
    try {
        const project = await getProject("project-001");
        if (project) {
            console.log("项目信息:", project);
        }
    } catch (error) {
        console.error("查询项目信息失败:", error);
    }
};
```

## 错误处理

Hook 内置了错误处理机制，会自动处理常见的错误情况：
- 用户拒绝交易
- 余额不足
- 合约调用失败

错误信息会存储在 `error` 状态中，可以通过检查该状态来显示错误信息给用户。

## 注意事项

1. **环境配置**: 确保正确配置 `.env.local` 文件中对应链的合约地址（`NEXT_PUBLIC_POLYGON_CONTRACT_ADDRESS`、`NEXT_PUBLIC_BSC_CONTRACT_ADDRESS` 等）
2. **合约部署**: 确保合约已部署到指定的网络和地址
3. **钱包连接**: 使用写入函数前需要确保钱包已连接并切换到正确的网络
4. **金额单位**: 
   - ETH 相关函数使用 ETH 为单位（字符串格式）
   - 代币相关函数使用代币的最小单位（假设18位小数）
5. **代币支持**: 合约现在支持多代币功能，需要先添加允许的代币才能进行代币捐赠
6. **交易确认**: 所有写入函数都会等待交易确认后才返回
7. **错误处理**: 建议在使用时添加适当的错误处理逻辑
8. **服务端渲染**: Hook 已处理 SSR 兼容性，在服务端会安全返回 null
9. **代币精度**: 代币函数默认使用18位小数，如需其他精度请修改 `ethers.parseUnits` 的第二个参数

## 完整示例

参考 `useContract.example.tsx` 文件查看完整的使用示例。
