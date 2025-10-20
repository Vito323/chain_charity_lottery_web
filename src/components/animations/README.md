# 动画组件库

这个目录包含了基于 [ReactBits.dev](https://reactbits.dev/) 风格的动画组件，为landing page提供丰富的交互体验。

## 组件列表

### 1. FloatingCoins - 浮动加密货币动画
- **用途**: 创建浮动的加密货币图标效果
- **特点**: 随机位置、随机动画时长、3D旋转效果
- **使用场景**: Hero部分的背景装饰

```tsx
import { FloatingCoins } from '@/components/animations';

<FloatingCoins />
```

### 2. TypewriterText - 打字机效果
- **用途**: 逐字显示文本，模拟打字机效果
- **Props**:
  - `text`: 要显示的文本
  - `speed`: 打字速度（毫秒，默认100）
  - `delay`: 开始延迟（毫秒，默认0）
  - `className`: 自定义样式类

```tsx
import { TypewriterText } from '@/components/animations';

<TypewriterText 
  text="A New Era of Digital Ownership Starts Now" 
  speed={50}
  delay={600}
/>
```

### 3. FadeInUp - 淡入上升动画
- **用途**: 当元素进入视口时触发淡入上升效果
- **Props**:
  - `children`: 要动画的子元素
  - `delay`: 延迟时间（毫秒，默认0）
  - `duration`: 动画持续时间（毫秒，默认600）
  - `className`: 自定义样式类

```tsx
import { FadeInUp } from '@/components/animations';

<FadeInUp delay={200}>
  <h1>标题</h1>
</FadeInUp>
```

### 4. PulseButton - 脉冲按钮
- **用途**: 带有点击脉冲效果的按钮
- **Props**:
  - `children`: 按钮内容
  - `onClick`: 点击事件处理函数
  - `className`: 自定义样式类（支持 `primary`, `secondary` 变体）
  - `disabled`: 是否禁用

```tsx
import { PulseButton } from '@/components/animations';

<PulseButton className="primary" onClick={handleClick}>
  Get Started
</PulseButton>
```

### 5. GradientBackground - 渐变背景动画
- **用途**: 创建动态的渐变背景效果
- **特点**: Canvas动画、径向渐变、实时更新

```tsx
import { GradientBackground } from '@/components/animations';

<GradientBackground />
```

## 动画组合使用

### 交错动画
使用 `fade-in-up-stagger` 类名可以实现交错动画效果：

```tsx
<div className="fade-in-up-stagger">
  <FadeInUp delay={0}>项目1</FadeInUp>
  <FadeInUp delay={100}>项目2</FadeInUp>
  <FadeInUp delay={200}>项目3</FadeInUp>
</div>
```

### 序列动画
通过不同的延迟时间创建序列动画：

```tsx
<FadeInUp delay={200}>
  <div className="hero-badge">标签</div>
</FadeInUp>

<FadeInUp delay={400}>
  <h1>标题</h1>
</FadeInUp>

<FadeInUp delay={600}>
  <p>描述</p>
</FadeInUp>
```

## 性能优化

1. **Intersection Observer**: FadeInUp组件使用Intersection Observer API，只在元素进入视口时触发动画
2. **CSS动画**: 优先使用CSS动画而非JavaScript动画，性能更好
3. **硬件加速**: 使用`transform`和`opacity`属性触发GPU加速
4. **防抖处理**: 动画组件内置防抖处理，避免重复触发

## 自定义样式

所有组件都支持通过`className`属性添加自定义样式：

```tsx
<FadeInUp className="my-custom-animation">
  <div>内容</div>
</FadeInUp>
```

## 响应式支持

动画组件完全支持响应式设计，在不同屏幕尺寸下都能正常工作。移动设备上会自动调整动画参数以提供最佳性能。



