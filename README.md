# Xfinds

### 专业级跨境购物代理聚合与比价平台

[![Next.js](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.4-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](LICENSE)

Xfinds 是一个现代化的开源跨境购物代理聚合平台。它通过整合多个货运代理的实时数据，为用户提供一站式的价格比对、库存查询及物流估算服务。项目采用先进的 Next.js 14 App Router 架构，结合毛玻璃设计语言（Glassmorphism），打造极致的跨端交互体验。

[官方演示](https://xfinds.cc) · [反馈问题](https://github.com/TheNewMikeMusic/Xfinds/issues) · [功能请求](https://github.com/TheNewMikeMusic/Xfinds/issues)

---

## 项目展示

<div align="center">
  <img src="https://pub-b2cc1d944b2d43e88716eeaa7d223086.r2.dev/ScreenShot_2025-12-30_110255_958.png" alt="Xfinds 首页 - 夜间模式" width="100%" style="border-radius: 8px; margin-bottom: 20px;" />
</div>

| 首页商品网格（日间模式） | 商品详情与变体选择 |
| :---: | :---: |
| <img src="https://pub-b2cc1d944b2d43e88716eeaa7d223086.r2.dev/ScreenShot_2025-12-30_124517_559.png" width="100%" /> | <img src="https://pub-b2cc1d944b2d43e88716eeaa7d223086.r2.dev/ScreenShot_2025-12-30_114122_459.png" width="100%" /> |

| 代理商价格比对 | 智能购物车结算 |
| :---: | :---: |
| <img src="https://pub-b2cc1d944b2d43e88716eeaa7d223086.r2.dev/ScreenShot_2025-12-30_124445_841.png" width="100%" /> | <img src="https://pub-b2cc1d944b2d43e88716eeaa7d223086.r2.dev/ScreenShot_2025-12-30_124531_340.png" width="100%" /> |

---

## 核心特性

- **多代理比价引擎**：支持 Kakobuy, Mulebuy, TigBuy, HippoBuy 等多家主流代理商，实时对比商品价格与运费。
- **智能模糊搜索**：基于 Fuse.js 实现的高性能模糊搜索，即使输入存在拼写错误也能精准匹配。
- **动态汇率系统**：实时更新 CNY, USD, EUR, GBP, JPY, KRW 等主流货币汇率，自动完成价格转换。
- **极致响应式 UI**：采用 Radix UI 与 shadcn/ui 组件库，在移动端、平板与桌面端均有出色表现。
- **深色模式支持**：深度适配深浅色主题，提供符合人眼工程学的视觉体验。
- **国际化架构**：原生支持中英双语，灵活的本地化配置。

---

## 技术栈

| 领域 | 技术选型 |
| :--- | :--- |
| **基础框架** | Next.js 14 (App Router), React 18 |
| **开发语言** | TypeScript 5.4 (Strict Mode) |
| **样式方案** | Tailwind CSS 3.4, Framer Motion (动画) |
| **组件库** | shadcn/ui, Radix UI |
| **状态管理** | Zustand |
| **数据处理** | Fuse.js (搜索), Sharp (图像优化) |
| **国际化** | next-intl |
| **身份认证** | JWT (jose), bcryptjs |
| **测试** | Vitest, Playwright |

---

## 快速开始

### 环境准备

- Node.js 18.0 或更高版本
- npm 9.0+ 或 yarn 1.22+

### 安装步骤

1. **克隆仓库**
   ```bash
   git clone https://github.com/TheNewMikeMusic/Xfinds.git
   cd Xfinds
   ```

2. **安装依赖**
   ```bash
   npm install
   ```

3. **配置环境变量**
   ```bash
   cp .env.example .env.local
   ```

4. **启动开发服务器**
   ```bash
   npm run dev
   ```

5. **访问项目**
   在浏览器中打开 [http://localhost:3000](http://localhost:3000)

---

## 项目结构

```text
Xfinds/
├── app/                  # Next.js App Router (路由与页面)
│   ├── [locale]/         # 国际化路由
│   └── api/              # 后端接口
├── components/           # React 业务组件
│   ├── ui/               # 基础 UI 组件 (shadcn)
│   └── shared/           # 公共组件
├── lib/                  # 工具函数与业务逻辑
├── store/                # Zustand 全局状态
├── messages/             # i18n 语言包
├── data/                 # 静态数据文件 (JSON)
└── public/               # 静态资源 (图片、图标)
```

---

## 贡献指南

我们非常欢迎开发者参与贡献。请在提交 PR 前阅读 [贡献文档](CONTRIBUTING.md)。

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 发起 Pull Request

---

## 开源协议

本项目基于 **MIT License** 协议开源。详情请参阅 [LICENSE](LICENSE) 文件。

---

<div align="center">
  <p>如果您觉得这个项目对您有帮助，欢迎给一个 ⭐️ Star！</p>
  <p>Made with Love by Xfinds Team</p>
</div>
