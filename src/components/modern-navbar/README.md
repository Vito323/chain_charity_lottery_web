# Modern Navbar 组件

这是一个模仿 ReactBits.dev 风格的现代化导航栏组件，具有流畅的动画效果和响应式设计。

## 特性

- 🎨 **现代化设计**: 模仿 ReactBits.dev 的视觉风格
- ⚡ **流畅动画**: 使用 Framer Motion 实现专业级动画效果
- 📱 **响应式设计**: 完美适配桌面端和移动端
- 🔗 **路由集成**: 完全兼容 Next.js 路由系统
- ♿ **可访问性**: 支持键盘导航和屏幕阅读器
- 🎯 **性能优化**: 硬件加速和减少重绘

## 组件结构

```
modern-navbar/
├── index.tsx          # 主组件文件
├── style.scss         # 样式文件
└── README.md          # 文档
```

## 使用方法

### 基本使用

```tsx
import ModernNavbar from '@/components/modern-navbar';

export default function Layout({ children }) {
  return (
    <div>
      <ModernNavbar />
      <main>{children}</main>
    </div>
  );
}
```

### 替换现有导航

在 `src/app/[locale]/layout.tsx` 中替换现有的 Header 组件：

```tsx
// 替换这行
import Header from "@/components/header";

// 为这行
import ModernNavbar from "@/components/modern-navbar";

// 在 JSX 中替换
<ModernNavbar />
```

## 设计特点

### 品牌区域
- **圆形图标**: 带有光圈效果的蓝色渐变图标
- **品牌名称**: "Chainova" 使用现代字体
- **悬停效果**: 图标旋转和缩放动画

### 导航菜单
- **导航链接**: Explore, Marketplace, Docs, Community
- **活动状态**: 当前页面高亮显示
- **悬停效果**: 渐变背景和指示器动画
- **路由匹配**: 支持动态路由匹配

### Connect Wallet 按钮
- **渐变背景**: 深色渐变设计
- **悬停效果**: 缩放和阴影变化
- **涟漪效果**: 点击时的波纹动画
- **可定制**: 可以轻松集成钱包连接逻辑

### 移动端适配
- **汉堡菜单**: 动画式菜单按钮
- **全屏菜单**: 滑入式移动端导航
- **触摸友好**: 优化的触摸交互

## 动画效果

### 入场动画
- 导航栏从顶部滑入
- 品牌区域延迟显示
- 导航链接依次出现
- 按钮最后显示

### 交互动画
- 悬停时的缩放效果
- 按钮的涟漪效果
- 导航指示器的滑动
- 移动端菜单的滑入/滑出

### 滚动效果
- 滚动时背景模糊度变化
- 阴影效果增强
- 边框透明度调整

## 自定义配置

### 修改导航链接

在 `index.tsx` 中修改 `ROUTE_MAP` 数组：

```tsx
const ROUTE_MAP = [
  {
    label: "首页",
    path: "/",
  },
  {
    label: "项目",
    path: "/project",
  },
  // 添加更多链接...
];
```

### 自定义品牌信息

修改品牌区域的内容：

```tsx
// 修改品牌名称
<span className="brand-name">Your Brand</span>

// 修改图标颜色
.icon-circle {
  background: linear-gradient(135deg, #your-color-1, #your-color-2);
}
```

### 集成钱包连接

在 `handleConnectWallet` 函数中添加实际的连接逻辑：

```tsx
const handleConnectWallet = async () => {
  try {
    // 集成 MetaMask 或其他钱包
    const accounts = await window.ethereum.request({
      method: 'eth_requestAccounts'
    });
    console.log('Connected:', accounts[0]);
  } catch (error) {
    console.error('Connection failed:', error);
  }
};
```

## 样式定制

### 颜色主题

```scss
// 修改主色调
.modern-navbar {
  --primary-color: #3b82f6;
  --secondary-color: #1d4ed8;
  --text-color: #1e293b;
  --text-muted: #64748b;
}
```

### 动画速度

```scss
// 调整动画持续时间
.modern-navbar {
  * {
    transition-duration: 0.2s; // 更快
    // 或
    transition-duration: 0.5s; // 更慢
  }
}
```

## 性能优化

- 使用 `transform` 和 `opacity` 属性进行动画
- 硬件加速的 CSS 属性
- 减少重绘和重排
- 支持 `prefers-reduced-motion` 媒体查询

## 浏览器支持

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## 依赖项

- React 18+
- Next.js 13+
- Framer Motion 10+
- SCSS

## 许可证

MIT License
