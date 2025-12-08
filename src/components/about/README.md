# StalwartAbout Component

一个新的About模块，保持了旧版About的文案和布局，但采用了stalwart的设计风格。

## 特性

- 🎨 **现代设计风格**: 采用深色主题和渐变色彩
- ✨ **流畅动画**: 使用Framer Motion实现滚动动画效果
- 📱 **响应式设计**: 适配各种屏幕尺寸
- 🎭 **玻璃拟态效果**: 现代化的视觉设计语言
- 🎯 **保持原有内容**: 完全保留旧版About的文案和布局结构

## 使用方法

```tsx
import StalwartAbout from '@/components/stalwart-about';

export default function AboutPage() {
  return (
    <div>
      <StalwartAbout />
    </div>
  );
}
```

## 设计特点

- 深色渐变背景 (slate-900 到 slate-950)
- 紫色到粉色的渐变按钮和装饰元素
- 玻璃拟态效果的图片容器
- 浮动装饰元素增加视觉层次
- 与stalwart其他组件保持一致的设计语言

## 组件结构

- 左侧：文本内容区域（标题、描述、按钮）
- 右侧：图片展示区域（带装饰效果）
- 响应式布局，移动端垂直排列
