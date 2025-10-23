# Stalwart User Dashboard

## 概述

这是一个全新的用户中心页面，采用 Stalwart 设计风格，提供现代化的用户界面和丰富的功能。

## 页面路径

- **URL**: `/stalwart-user`
- **文件位置**: `src/app/[locale]/stalwart-user/`

## 主要功能

### 🎨 设计特点

1. **Stalwart 风格一致性**
   - 深色渐变背景（slate-950 到 slate-900）
   - 玻璃态效果和毛玻璃背景
   - 紫色到粉色的渐变色彩方案
   - 圆角卡片设计和悬停动画

2. **响应式设计**
   - 移动端友好的布局
   - 灵活的网格系统
   - 自适应文字大小

### 🚀 功能模块

#### 1. Hero 区域
- 动态背景动画
- 渐变文字效果
- 用户状态指示器

#### 2. 用户统计面板
- **Total NFTs**: 钱包中的 NFT 总数
- **Collections**: 收藏集数量
- **Wallet Address**: 钱包地址显示
- **Status**: 连接状态指示

#### 3. NFT 收藏展示
- 集成现有的 NFTList 组件
- 刷新功能
- 错误处理界面
- 连接钱包界面

#### 4. 侧边栏功能
- **Quick Actions**: 快速操作按钮
- **Recent Activity**: 最近活动记录
- **Wallet Info**: 钱包详细信息

### 🛠 技术实现

- **框架**: Next.js 15 + React 18
- **样式**: Tailwind CSS
- **动画**: Framer Motion
- **状态管理**: Wagmi (Web3)
- **类型安全**: TypeScript

### 📱 响应式断点

- **移动端**: < 768px
- **平板端**: 768px - 1024px
- **桌面端**: > 1024px

### 🎯 使用方式

1. 访问 `/stalwart-user` 路径
2. 连接钱包查看 NFT 收藏
3. 使用侧边栏的快速操作
4. 查看用户统计和活动记录

### 🔧 自定义配置

可以通过修改 `content/index.tsx` 文件来自定义：
- 用户统计数据
- 活动记录类型
- 快速操作按钮
- 样式和动画效果

## 文件结构

```
stalwart-user/
├── page.tsx              # 主页面组件
├── content/
│   └── index.tsx         # 用户仪表板内容
└── README.md            # 说明文档
```

## 依赖组件

- `StalwartHeader`: 页面头部
- `StalwartFooter`: 页面底部
- `StalwartConnectButton`: 钱包连接按钮
- `NFTList`: NFT 列表展示
- `useWalletNFTs`: NFT 数据钩子
- `useAccount`: 钱包账户钩子
