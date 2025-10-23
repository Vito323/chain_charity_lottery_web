# Stalwart Showcase Page

一个完全延用 `project/[uid]` 完整逻辑布局的 stalwart 设计风格展示页面，根据 [rhinecat.io 项目页面](https://www.rhinecat.io/project/77966134-112b-4d1d-8db7-1dd52c399c51) 的实际布局和文案进行了调整，保持了原有的页面结构、组件架构和功能逻辑，但采用了现代化的 stalwart 设计语言。

## 特性

- **Stalwart 设计风格**: 采用深色主题和渐变色彩，与 Stalwart 系列组件保持一致
- **流畅动画**: 使用 Framer Motion 实现滚动动画和交互效果
- **响应式设计**: 适配各种屏幕尺寸
- **玻璃拟态效果**: 现代化的视觉设计语言
- **完整延用布局逻辑**: 完全保持与 `project/[uid]` 相同的页面结构和组件架构
- **标签页内容**: 提供 About、Donations、Updates 三个标签页内容

## 设计特点

- 深色渐变背景 (slate-900 到 slate-950)
- 紫色到粉色的渐变按钮和装饰元素
- 玻璃拟态效果的卡片容器
- 浮动装饰元素增加视觉层次
- 与 Stalwart 其他组件保持一致的设计语言

## 页面结构

### 主页面
- `src/app/[locale]/stalwart-showcase/page.tsx` - 主页面文件

### 组件结构（完全延用 project/[uid] 的架构）
- `StalwartShowcase` - 主内容组件（对应 CaseSingle）
- `TabContent` - 标签页内容管理（完全延用）
- `TabAbout` - About 标签页（延用原有逻辑）
- `TabDonations` - Donations 标签页（延用原有逻辑）
- `TabUpdates` - Updates 标签页（延用原有逻辑）
- `Covers` - 图片展示组件（简化版）
- `Fundraising` - 筹款信息组件（简化版）

## 布局逻辑（完全延用 project/[uid]）

1. **PageTitle 区域**: 页面标题和面包屑导航
2. **主要内容区域**: 延用 `case-hero-layout` 布局
   - 图片展示区域（左侧，占 2/3 宽度，对应 `case-swiper-container`）
   - 筹款信息区域（右侧，占 1/3 宽度，对应 `case-fundraising-container`）
3. **标签页内容**: 延用 `TabContent` 组件逻辑
   - About 标签页：项目详情和进度条
   - Donations 标签页：捐赠记录展示
   - Updates 标签页：项目更新日志

## 数据流（完全延用原有逻辑）

- **接口请求**: 使用 `projectDetail(uid)` 获取项目详情
- **筹款数据**: 使用 `useFundPoolManager` 获取链上筹款统计
- **数据管理**: 完全兼容原有的 `ProjectDetailData` 接口
- **状态管理**: 保持原有的状态管理和数据传递方式
- **组件接口**: 延用原有的组件 props 接口设计

## 使用方法

访问 `/stalwart-showcase/[uid]` 路径即可查看新的展示页面，其中 `[uid]` 是项目的唯一标识符。

例如：`/stalwart-showcase/77966134-112b-4d1d-8db7-1dd52c399c51`

## 技术栈

- React 18
- TypeScript
- Framer Motion (动画)
- Tailwind CSS (样式)
- Next.js (框架)
- MarkdownRenderer (内容渲染)

## 样式特点

- 使用 Tailwind CSS 类名
- 响应式设计，支持移动端
- 深色主题配色方案
- 渐变背景和装饰元素
- 玻璃拟态效果
- 流畅的动画过渡

## 功能特性

- **真实数据**: 使用接口请求获取真实项目数据，不再使用模拟数据
- **图片轮播**: 使用 Swiper.js 实现真正的图片轮播功能
- **加载状态**: 完整的加载状态和错误处理
- **类型安全**: 安全的数值类型转换，防止运行时错误
- **空值保护**: 全面的 undefined/null 值保护，防止属性访问错误
- **接口集成**: 完全集成 `projectDetail` 和 `useFundPoolManager` 接口
- **标签页切换**: 完全延用原有的标签页切换逻辑
- **进度条**: 延用原有的进度条和统计信息展示
- **内容渲染**: 延用原有的 Markdown 内容渲染
- **捐赠记录**: 延用原有的捐赠记录展示
- **项目更新**: 延用原有的项目更新日志
- **响应式设计**: 响应式网格布局
- **动画效果**: 悬停效果和 Framer Motion 动画

## 与 project/[uid] 的完全一致性

- **相同的页面结构**: Header + 内容 + Footer + Scrollbar
- **相同的布局逻辑**: PageTitle + case-hero-layout + TabContent
- **相同的组件架构**: 完全延用原有的组件层次结构
- **相同的数据流**: 保持原有的 props 传递和状态管理
- **相同的响应式设计**: 延用原有的响应式断点和布局规则

## 与 Stalwart 设计风格的一致性

- 深色主题配色
- 渐变色彩方案
- 玻璃拟态效果
- 流畅的动画过渡
- 现代化的视觉设计语言
- 与 stalwart 系列组件保持统一的设计语言

## 文件结构

```
src/app/[locale]/stalwart-showcase/
├── [uid]/
│   └── page.tsx               # 主页面文件（支持动态路由）
├── content/
│   ├── index.tsx              # 主内容组件（对应 CaseSingle）
│   ├── tab-content/
│   │   ├── index.tsx          # 标签页内容管理
│   │   ├── tab-about.tsx      # About 标签页
│   │   ├── tab-donations.tsx  # Donations 标签页
│   │   └── tab-updates.tsx    # Updates 标签页
│   ├── cover/
│   │   └── index.tsx          # 图片展示组件
│   └── fundraising/
│       └── index.tsx          # 筹款信息组件
└── README.md                  # 说明文档
```
