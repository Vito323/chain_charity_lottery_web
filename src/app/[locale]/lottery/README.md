# Stalwart Lottery Page

这是一个符合 Stalwart 设计风格的新 lottery 页面，使用 Tailwind CSS 构建，保持了与现有 Stalwart 组件的一致性。

## 功能特性

### 🎯 主要功能
- **倒计时显示**: 实时显示下次开奖的倒计时
- **奖池金额**: 动态显示当前奖池总额
- **NFT 票券管理**: 显示用户的钱包中的 lottery NFT 票券
- **历史记录**: 展示历史开奖结果和交易记录
- **响应式设计**: 完全适配移动端和桌面端

### 🎨 设计特色
- **Stalwart 风格**: 采用深色主题和渐变色彩
- **动画效果**: 使用 Framer Motion 提供流畅的动画
- **玻璃拟态**: 使用 backdrop-blur 和半透明效果
- **交互反馈**: 悬停和点击状态的视觉反馈

## 文件结构

```
stalwart-lottery/
├── page.tsx              # 主页面组件
├── content/
│   └── index.tsx         # 彩票内容组件
├── history/
│   └── index.tsx         # 历史记录组件
└── README.md             # 说明文档
```

## 组件说明

### StalwartLotteryContent
- 倒计时显示
- 奖池金额展示
- NFT 票券网格显示
- 钱包连接状态处理

### StalwartLotteryHistory
- 历史开奖结果表格
- 交易哈希复制功能
- 中奖号码显示
- 奖池金额展示

## 技术栈

- **React**: 组件化开发
- **TypeScript**: 类型安全
- **Tailwind CSS**: 样式框架
- **Framer Motion**: 动画库
- **Wagmi**: Web3 集成
- **Next.js**: 框架支持

## 使用方法

1. 确保钱包已连接
2. 查看当前奖池和倒计时
3. 浏览您的 NFT 票券
4. 查看历史开奖记录

## 路由

页面路径: `/stalwart-lottery`

导航链接已更新到 Stalwart 头部组件中。
