# StalwartDonate Component

一个符合 Stalwart 设计风格的加密货币捐赠组件，保持了原有 DonatePage 的功能和文案，但采用了现代化的设计语言。

## 特性

- 🎨 **Stalwart 设计风格**: 采用深色主题和渐变色彩，与 Stalwart 系列组件保持一致
- ✨ **流畅动画**: 使用 Framer Motion 实现滚动动画和交互效果
- 📱 **响应式设计**: 适配各种屏幕尺寸
- 🎭 **玻璃拟态效果**: 现代化的视觉设计语言
- 🎯 **保持原有功能**: 完全保留原有捐赠页面的所有功能
- 💳 **钱包集成**: 支持多种钱包连接
- 🪙 **多代币支持**: 支持多种加密货币捐赠

## 设计特点

- 深色渐变背景 (slate-900 到 slate-800)
- 紫色到粉色的渐变按钮和装饰元素
- 玻璃拟态效果的卡片容器
- 浮动装饰元素增加视觉层次
- 与 Stalwart 其他组件保持一致的设计语言

## 使用方法

### 作为独立组件使用

```tsx
import StalwartDonate from '@/components/stalwart-donate';

export default function DonatePage() {
  return (
    <StalwartDonate 
      uid="project-123" 
      name="Project Name" 
    />
  );
}
```

### 作为页面使用

访问 `/stalwart-donate/[uid]/[name]` 路由即可使用完整的捐赠页面。

## 组件结构

- **Header Section**: 项目标题和描述
- **Project Info**: 项目名称和 ID 显示
- **Wallet Connection**: 钱包连接状态
- **Token Selection**: 代币选择器
- **Amount Input**: 捐赠金额输入
- **Total Display**: 总捐赠金额显示
- **Action Button**: 捐赠/连接钱包按钮

## 技术栈

- React 18
- TypeScript
- Framer Motion (动画)
- Tailwind CSS (样式)
- Wagmi (钱包集成)
- RainbowKit (钱包连接)

## 样式特点

- 使用 Tailwind CSS 类名
- 响应式设计，支持移动端
- 深色主题配色方案
- 渐变背景和装饰元素
- 玻璃拟态效果
- 流畅的动画过渡

## 功能特性

- 钱包连接/断开
- 代币选择和余额显示
- 实时价格计算
- 表单验证
- 交易状态处理
- 错误处理和用户反馈
- 自动返回上一页

## 与原有组件的区别

1. **设计风格**: 从浅色主题改为深色主题
2. **布局结构**: 采用卡片式布局，更加现代化
3. **动画效果**: 添加了丰富的动画效果
4. **视觉层次**: 使用渐变和玻璃效果增强视觉层次
5. **响应式**: 更好的移动端适配

## 依赖组件

- `TokenSelect`: 自定义代币选择模态框（替代第三方组件）
- `useDonationForm`: 捐赠表单 Hook
- `useFundPoolManager`: 资金池管理 Hook
- `useTokenPrices`: 代币价格 Hook

## 修复的问题

- ✅ **头部间距错误**: 调整了页面顶部间距，从 `py-12` 改为 `py-24`
- ✅ **Project Info icon 挤压**: 修复了图标被文字挤压的问题，使用 `flex-shrink-0` 和 `items-start`
- ✅ **ModalSelect 样式失效**: 创建了自定义的 `TokenSelect` 组件，完全符合 Stalwart 设计风格
- ✅ **Project Info 布局优化**: 
  - 统一了图标尺寸 (14x14) 和位置
  - 增强了文字对比度和可读性
  - 添加了状态指示点和悬停效果
  - 优化了文字层次结构和间距
