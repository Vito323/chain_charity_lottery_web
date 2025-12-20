# ReactBits.dev 风格组件库

这个组件库基于 [ReactBits.dev](https://reactbits.dev/) 的设计理念，使用 Framer Motion 创建了专业的动画效果。

## 🚀 组件列表

### 1. FloatingElements - 浮动元素动画
- **用途**: 创建浮动的加密货币图标效果
- **特点**: 使用 Framer Motion 的复杂动画序列
- **动画**: 3D旋转、缩放、透明度变化、闪烁效果

```tsx
import { FloatingElements } from '@/components/reactbits';

<FloatingElements />
```

### 2. TypewriterEffect - 打字机效果
- **用途**: 逐字显示文本，带有完成后的特效
- **Props**:
  - `text`: 要显示的文本
  - `speed`: 打字速度（毫秒）
  - `delay`: 开始延迟
  - `className`: 自定义样式

```tsx
import { TypewriterEffect } from '@/components/reactbits';

<TypewriterEffect 
  text="A New Era of Digital Ownership Starts Now" 
  speed={50}
  delay={600}
/>
```

### 3. ScrollReveal - 滚动显示动画
- **用途**: 当元素进入视口时触发动画
- **Props**:
  - `children`: 要动画的子元素
  - `delay`: 延迟时间
  - `duration`: 动画持续时间
  - `direction`: 动画方向 (up/down/left/right)
  - `distance`: 移动距离

```tsx
import { ScrollReveal } from '@/components/reactbits';

<ScrollReveal delay={200} direction="up" distance={50}>
  <h1>标题</h1>
</ScrollReveal>
```

### 4. AnimatedButton - 动画按钮
- **用途**: 带有悬停、点击动画的按钮
- **Props**:
  - `children`: 按钮内容
  - `onClick`: 点击事件
  - `variant`: 样式变体 (primary/secondary/ghost)
  - `size`: 尺寸 (sm/md/lg)
  - `disabled`: 是否禁用

```tsx
import { AnimatedButton } from '@/components/reactbits';

<AnimatedButton variant="primary" size="lg" onClick={handleClick}>
  Get Started
</AnimatedButton>
```

### 5. ParallaxBackground - 视差背景
- **用途**: 创建动态的视差背景效果
- **特点**: 多层渐变、模糊效果、滚动联动

```tsx
import { ParallaxBackground } from '@/components/reactbits';

<ParallaxBackground />
```

## 🎨 动画特性

### Framer Motion 集成
- 使用 Framer Motion 的 `motion` 组件
- 支持复杂的动画序列和过渡
- 硬件加速和性能优化

### 动画类型
- **入场动画**: ScrollReveal 组件
- **交互动画**: AnimatedButton 悬停效果
- **连续动画**: FloatingElements 循环动画
- **打字动画**: TypewriterEffect 逐字显示
- **视差动画**: ParallaxBackground 滚动联动

### 性能优化
- 使用 `useInView` 钩子优化滚动动画
- 硬件加速的 transform 属性
- 减少重绘和重排
- 支持 `prefers-reduced-motion` 媒体查询

## 🔧 自定义配置

### 动画缓动
```tsx
// 自定义缓动函数
transition={{ 
  ease: [0.25, 0.1, 0.25, 1] // cubic-bezier
}}
```

### 交错动画
```tsx
<div className="scroll-reveal-stagger">
  <ScrollReveal delay={0}>项目1</ScrollReveal>
  <ScrollReveal delay={100}>项目2</ScrollReveal>
  <ScrollReveal delay={200}>项目3</ScrollReveal>
</div>
```

### 响应式动画
```scss
@media (max-width: 768px) {
  .floating-item {
    .floating-icon {
      font-size: 18px; // 移动端调整
    }
  }
}
```

## 🎯 最佳实践

1. **性能优先**: 使用 transform 和 opacity 属性
2. **用户体验**: 支持减少动画偏好设置
3. **可访问性**: 提供键盘导航和屏幕阅读器支持
4. **模块化**: 每个组件都可独立使用和定制

## 📱 响应式支持

所有组件都完全支持响应式设计：
- 移动端优化的动画参数
- 触摸友好的交互效果
- 自适应布局和尺寸

## 🔗 相关资源

- [ReactBits.dev](https://reactbits.dev/) - 设计灵感来源
- [Framer Motion](https://www.framer.com/motion/) - 动画库
- [React 动画最佳实践](https://react.dev/learn/animating)














