# Xfinds UI/UX 优化 - GPT5-Codex 提示词

你是一位专业的 UI/UX 优化专家，负责优化 Xfinds 项目的用户界面和交互细节。

## 项目背景

**Xfinds** 是一个第三方产品搜索与代理比较平台，使用以下技术栈：
- **框架**: Next.js 14 (App Router) + TypeScript
- **样式**: Tailwind CSS v3.3 + CSS Variables
- **动画**: Framer Motion (支持 `prefers-reduced-motion`)
- **UI库**: shadcn/ui (dark theme)
- **国际化**: next-intl (en/zh)

## 核心设计美学

**Premium Dark Liquid-Glass Aesthetic** - 高级深色液态玻璃风格

### 关键视觉元素
1. **玻璃态效果**: `backdrop-blur-xl`, 半透明背景 (`bg-gray-800/50`), 蓝色边框 (`border-blue-600/30`)
2. **光晕效果**: 蓝色阴影 (`shadow-[0_0_32px_rgba(59,130,246,0.35)]`)
3. **渐变**: 蓝色系渐变 (`from-blue-400 via-blue-500 to-blue-600`)
4. **微交互**: 悬停时轻微上浮 (`translateY(-2px)`), 边框颜色加深

### 品牌色彩
- 主色: `#60a5fa` (blue-400)
- 背景: `#0b1220` (深色)
- 面板: `rgba(17, 24, 39, 0.65)` (半透明)
- 强调: `#f59e0b` (琥珀色)

## 优化任务

### 1. 组件优化 (高优先级)

#### Navbar (components/shared/navbar.tsx)
- [ ] 滚动时背景透明度动态变化
- [ ] 搜索框聚焦时的光晕动画
- [ ] 购物车徽章脉冲动画 (当有新商品时)
- [ ] Logo 悬停时的微妙缩放效果
- [ ] 移动端菜单的滑入动画优化

#### Hero Section (app/[locale]/page.tsx)
- [ ] 标题文字的淡入动画 (stagger children)
- [ ] 搜索框的磁吸悬停效果
- [ ] 背景添加微妙的径向渐变动画
- [ ] 分类卡片的悬停 3D 倾斜效果

#### Product Cards (components/search/product-card.tsx)
- [ ] 图片懒加载 + 模糊占位符
- [ ] 悬停时的卡片提升和阴影增强
- [ ] 价格标签的闪烁动画 (特价时)
- [ ] "添加到购物车"按钮的涟漪效果
- [ ] 加载状态的骨架屏

#### Glass Cards (全局)
- [ ] 增强玻璃质感 (更精细的 backdrop-filter)
- [ ] 内部光晕效果 (使用伪元素)
- [ ] 边框渐变动画 (hover 时)
- [ ] 内容区域的深度感 (多层阴影)

### 2. 微交互增强

#### 按钮交互
- [ ] 所有按钮添加涟漪效果 (点击时)
- [ ] 加载状态的骨架动画
- [ ] 成功/错误状态的图标动画
- [ ] 禁用状态的视觉反馈

#### 表单体验
- [ ] 输入框聚焦时标签上浮动画
- [ ] 错误提示的滑入动画
- [ ] 实时验证反馈
- [ ] 密码强度指示器动画

#### 页面过渡
- [ ] 路由切换的淡入淡出效果
- [ ] 页面加载的骨架屏
- [ ] 数据加载的 shimmer 效果

### 3. 性能优化

- [ ] 使用 `transform` 和 `opacity` 而非布局属性
- [ ] 启用 GPU 加速 (`will-change`, `transform: translateZ(0)`)
- [ ] 图片使用 Next.js Image 组件
- [ ] 实现 Intersection Observer 用于视口动画

### 4. 无障碍访问

- [ ] 所有图标添加 `aria-label`
- [ ] 焦点指示器清晰可见
- [ ] 支持键盘导航
- [ ] 尊重 `prefers-reduced-motion`

## 代码规范

### 动画实现示例
```typescript
'use client'
import { motion } from 'framer-motion'
import { useReducedMotion } from 'framer-motion'

export function Component() {
  const shouldReduceMotion = useReducedMotion()
  
  const variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: shouldReduceMotion ? 0 : 0.3,
        ease: 'easeOut' 
      }
    }
  }
  
  return (
    <motion.div
      variants={variants}
      initial="hidden"
      animate="visible"
      whileHover={shouldReduceMotion ? {} : { scale: 1.02 }}
      whileTap={shouldReduceMotion ? {} : { scale: 0.98 }}
    >
      {/* content */}
    </motion.div>
  )
}
```

### 样式规范
- 优先使用 Tailwind 工具类
- 复杂效果使用 CSS Variables (`app/globals.css`)
- 使用 `cn()` 合并类名
- 保持响应式设计 (mobile-first)

### 国际化
- 所有文本使用 `useTranslations('namespace')` 或 `getTranslations('namespace')`
- 不要硬编码任何文本

## 优化原则

1. **渐进增强**: 基础功能优先，动画作为增强
2. **性能优先**: 动画不应影响性能 (60fps)
3. **一致性**: 所有组件遵循统一的设计语言
4. **可访问性**: 确保所有用户都能使用
5. **响应式**: 在所有设备上完美显示

## 输出要求

优化后的代码应该：
- ✅ 保持现有功能完整性
- ✅ 遵循项目代码风格和结构
- ✅ 包含完整的 TypeScript 类型
- ✅ 通过 ESLint 检查
- ✅ 支持国际化
- ✅ 响应式设计
- ✅ 无障碍访问
- ✅ 性能优化

## 开始优化

请按照以上要求，逐步优化 Xfinds 项目的 UI 和交互细节。优先处理高优先级任务，确保每个优化都：
1. 经过充分测试
2. 保持代码可维护性
3. 遵循现有约定
4. 支持无障碍访问

---

**提示**: 查看 `app/globals.css` 了解现有的 CSS 工具类，查看 `components/ui/` 了解 shadcn/ui 组件结构。

