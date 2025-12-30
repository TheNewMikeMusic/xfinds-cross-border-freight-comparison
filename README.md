# Xfinds

### Professional Cross-Border Shopping Agent Aggregator & Comparison Platform
### 专业级跨境购物代理聚合与比价平台

[![Next.js](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.4-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](LICENSE)

Xfinds is a modern, open-source cross-border shopping agent aggregator. By integrating real-time data from multiple freight agents, it provides users with a one-stop service for price comparison, inventory checking, and shipping estimation. Built with Next.js 14 App Router and featuring a glassmorphic design, it offers a premium cross-platform user experience.

Xfinds 是一个现代化的开源跨境购物代理聚合平台。它通过整合多个货运代理的实时数据，为用户提供一站式的价格比对、库存查询及物流估算服务。项目采用先进的 Next.js 14 App Router 架构，结合毛玻璃设计语言（Glassmorphism），打造极致的跨端交互体验。

[Live Demo | 官方演示](https://xfinds.cc) · [Report Bug | 反馈问题](https://github.com/TheNewMikeMusic/Xfinds/issues) · [Request Feature | 功能请求](https://github.com/TheNewMikeMusic/Xfinds/issues)

---

## Showcase | 项目展示

<div align="center">
  <img src="https://pub-b2cc1d944b2d43e88716eeaa7d223086.r2.dev/ScreenShot_2025-12-30_110255_958.png" alt="Xfinds Homepage - Dark Mode" width="100%" style="border-radius: 8px; margin-bottom: 20px;" />
</div>

| Product Grid (Light Mode) | Product Details & Variants |
| :---: | :---: |
| <img src="https://pub-b2cc1d944b2d43e88716eeaa7d223086.r2.dev/ScreenShot_2025-12-30_124517_559.png" width="100%" /> | <img src="https://pub-b2cc1d944b2d43e88716eeaa7d223086.r2.dev/ScreenShot_2025-12-30_114122_459.png" width="100%" /> |
| 首页商品网格（日间模式） | 商品详情与变体选择 |

| Agent Price Comparison | Smart Shopping Cart |
| :---: | :---: |
| <img src="https://pub-b2cc1d944b2d43e88716eeaa7d223086.r2.dev/ScreenShot_2025-12-30_124445_841.png" width="100%" /> | <img src="https://pub-b2cc1d944b2d43e88716eeaa7d223086.r2.dev/ScreenShot_2025-12-30_124531_340.png" width="100%" /> |
| 代理商价格比对 | 智能购物车结算 |

---

## Core Features | 核心特性

- **Multi-Agent Price Engine**: Supports Kakobuy, Mulebuy, TigBuy, HippoBuy and more. Real-time comparison of product prices and shipping costs.  
  **多代理比价引擎**：支持 Kakobuy, Mulebuy, TigBuy, HippoBuy 等多家主流代理商，实时对比商品价格与运费。
- **Smart Fuzzy Search**: High-performance fuzzy search powered by Fuse.js. Accurate matches even with typos.  
  **智能模糊搜索**：基于 Fuse.js 实现的高性能模糊搜索，即使输入存在拼写错误也能精准匹配。
- **Dynamic Exchange Rates**: Real-time updates for CNY, USD, EUR, GBP, JPY, KRW. Automatic price conversion.  
  **动态汇率系统**：实时更新 CNY, USD, EUR, GBP, JPY, KRW 等主流货币汇率，自动完成价格转换。
- **Ultra-Responsive UI**: Built with Radix UI and shadcn/ui. Exceptional performance across mobile, tablet, and desktop.  
  **极致响应式 UI**：采用 Radix UI 与 shadcn/ui 组件库，在移动端、平板与桌面端均有出色表现。
- **Dark Mode Support**: Deeply adapted dark/light themes for an ergonomic visual experience.  
  **深色模式支持**：深度适配深浅色主题，提供符合人眼工程学的视觉体验。
- **I18n Architecture**: Native support for English and Chinese with flexible localization configurations.  
  **国际化架构**：原生支持中英双语，灵活的本地化配置。

---

## Tech Stack | 技术栈

| Category | Technology |
| :--- | :--- |
| **Framework** | Next.js 14 (App Router), React 18 |
| **Language** | TypeScript 5.4 (Strict Mode) |
| **Styling** | Tailwind CSS 3.4, Framer Motion (Animation) |
| **UI Components** | shadcn/ui, Radix UI |
| **State Management** | Zustand |
| **Data Handling** | Fuse.js (Search), Sharp (Image Optimization) |
| **Internationalization** | next-intl |
| **Authentication** | JWT (jose), bcryptjs |
| **Testing** | Vitest, Playwright |

---

## Quick Start | 快速开始

### Prerequisites | 环境准备

- Node.js 18.0+
- npm 9.0+ / yarn 1.22+

### Installation | 安装步骤

1. **Clone the repository | 克隆仓库**
   ```bash
   git clone https://github.com/TheNewMikeMusic/Xfinds.git
   cd Xfinds
   ```

2. **Install dependencies | 安装依赖**
   ```bash
   npm install
   ```

3. **Set up environment variables | 配置环境变量**
   ```bash
   cp .env.example .env.local
   ```

4. **Start development server | 启动开发服务器**
   ```bash
   npm run dev
   ```

5. **Access the project | 访问项目**
   Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Project Structure | 项目结构

```text
Xfinds/
├── app/                  # Next.js App Router (Routes & API)
│   ├── [locale]/         # Internationalized routes
│   └── api/              # Backend API endpoints
├── components/           # React business components
│   ├── ui/               # Base UI components (shadcn)
│   └── shared/           # Shared reusable components
├── lib/                  # Utilities and business logic
├── store/                # Zustand global state management
├── messages/             # i18n translation files
├── data/                 # Static data files (JSON)
└── public/               # Static assets (Images, Icons)
```

---

## Contributing | 贡献指南

Contributions are highly welcome! Please read our [Contributing Guide](CONTRIBUTING.md) before submitting a PR.  
我们非常欢迎开发者参与贡献。请在提交 PR 前阅读 [贡献文档](CONTRIBUTING.md)。

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## License | 开源协议

This project is licensed under the **MIT License**. See [LICENSE](LICENSE) for details.  
本项目基于 **MIT License** 协议开源。详情请参阅 [LICENSE](LICENSE) 文件。

---

<div align="center">
  <p>If you find this project helpful, please give it a ⭐️ Star!</p>
  <p>如果您觉得这个项目对您有帮助，欢迎给一个 ⭐️ Star！</p>
  <p>Made with Love by Xfinds Team</p>
</div>
