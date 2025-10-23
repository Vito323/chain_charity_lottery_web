# Stalwart Projects Page

一个新的符合stalwart设计主题的projects页面，参考了CausesPage的布局和文案结构。

## 特性

- 🎨 **现代设计风格**: 采用深色主题和渐变色彩，与stalwart设计语言保持一致
- ✨ **流畅动画**: 使用Framer Motion实现滚动动画和悬停效果
- 📱 **响应式设计**: 适配各种屏幕尺寸
- 🎭 **玻璃拟态效果**: 现代化的视觉设计语言
- 🎯 **保持原有功能**: 完全保留原有projects页面的功能和数据结构

## 组件结构

### 主页面
- `src/app/[locale]/(home)/stalwart-projects/page.tsx` - 主页面文件

### 组件
- `StalwartProjectsContent` - 主内容组件，包含页面标题和项目列表
- `StalwartProjectList` - 项目列表组件，处理数据加载和状态管理
- `StalwartProjectCard` - 项目卡片组件，展示单个项目信息

### 样式
- `stalwart-projects-content.scss` - 主内容样式
- `stalwart-project-card.scss` - 项目卡片样式

## 设计特点

- 深色渐变背景 (从 #0b1020 到 #16213e)
- 紫色到粉色的渐变按钮和装饰元素
- 玻璃拟态效果的卡片设计
- 浮动装饰元素增加视觉层次
- 与stalwart其他组件保持一致的设计语言

## 功能特性

- 项目分类标签页
- 项目卡片悬停效果
- 响应式网格布局
- 加载状态和错误处理
- 空状态展示
- 项目详情跳转
- 捐赠按钮

## 使用方法

访问 `/stalwart-projects` 路径即可查看新的projects页面。导航栏中的"Projects"链接已更新指向新页面。
