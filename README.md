# Xfinds

<div align="center">
  <p><strong>Professional Cross-Border Shopping Agent Aggregator & Comparison Platform</strong></p>
  <p><strong>企业级跨境购物代理聚合与全球比价系统</strong></p>

  <p>
    <a href="https://nextjs.org/"><img src="https://img.shields.io/badge/Next.js-14-black?style=flat-square&logo=next.js" alt="Next.js" /></a>
    <a href="https://www.typescriptlang.org/"><img src="https://img.shields.io/badge/TypeScript-5.4-blue?style=flat-square&logo=typescript" alt="TypeScript" /></a>
    <a href="https://tailwindcss.com/"><img src="https://img.shields.io/badge/Tailwind-3.4-38B2AC?style=flat-square&logo=tailwind-css" alt="Tailwind" /></a>
    <a href="LICENSE"><img src="https://img.shields.io/badge/License-MIT-green?style=flat-square" alt="License" /></a>
  </p>

  <p>
    <a href="https://xfinds.cc">Live Demo</a> •
    <a href="https://github.com/TheNewMikeMusic/Xfinds/issues">Report Bug</a> •
    <a href="https://github.com/TheNewMikeMusic/Xfinds/milestones">Roadmap</a>
  </p>
</div>

---

### Introduction | 项目简介

Xfinds is a high-performance aggregator for the global e-commerce ecosystem. It provides a unified interface for real-time price comparison and logistics estimation across major shipping agents. Featuring a modern Glassmorphism UI, it empowers users with data-driven purchasing decisions.

Xfinds 是一款高性能跨境电商聚合平台。通过统一接口实现多家货运代理的实时比价与物流估算。采用现代毛玻璃设计语言，为用户提供数据驱动的跨境购物决策支持。

---

### Showcase | 系统演示

<div align="center">
  <img src="https://pub-b2cc1d944b2d43e88716eeaa7d223086.r2.dev/ScreenShot_2025-12-30_110255_958.png" alt="Xfinds Banner" width="100%" style="border-radius: 8px;" />
</div>

| High-Precision Search | Rich Variant Selector |
| :--- | :--- |
| <img src="https://pub-b2cc1d944b2d43e88716eeaa7d223086.r2.dev/ScreenShot_2025-12-30_124517_559.png" width="100%" style="border-radius: 4px;" /> | <img src="https://pub-b2cc1d944b2d43e88716eeaa7d223086.r2.dev/ScreenShot_2025-12-30_114122_459.png" width="100%" style="border-radius: 4px;" /> |
| _Fuzzy Matching & Filtering_ | _SKU & Media Management_ |

| Comparative Analysis | Optimized Checkout |
| :--- | :--- |
| <img src="https://pub-b2cc1d944b2d43e88716eeaa7d223086.r2.dev/ScreenShot_2025-12-30_124445_841.png" width="100%" style="border-radius: 4px;" /> | <img src="https://pub-b2cc1d944b2d43e88716eeaa7d223086.r2.dev/ScreenShot_2025-12-30_124531_340.png" width="100%" style="border-radius: 4px;" /> |
| _Real-time Price Engine_ | _Smart Cart Logic_ |

---

### Core Features | 核心特性

- **Multi-Agent Engine**: Sub-second price calculation for 6+ shipping agents.
- **Enterprise Search**: Advanced fuzzy matching powered by Fuse.js.
- **Financial Engine**: Real-time multi-currency conversion (CNY/USD/EUR/JPY).
- **Global Ready**: Full English/Chinese support with i18n architecture.
- **Optimized UI**: Responsive Glassmorphism design with Dark Mode.

---

### Tech Stack | 技术选型

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript (Strict Mode)
- **Styling**: Tailwind CSS & Framer Motion
- **Components**: shadcn/ui (Radix UI)
- **State**: Zustand
- **Test**: Vitest & Playwright

---

### Project Structure | 项目结构

```text
Xfinds/
├── app/                  # Routes & API Endpoints
├── components/           # UI & Shared Components
├── lib/                  # Core Business Logic
├── store/                # Global State (Zustand)
├── messages/             # Localization Files
├── data/                 # Static Knowledge Base
└── public/               # Static Assets
```

---

### Quick Start | 快速开始

1. **Clone & Install**
   ```bash
   git clone https://github.com/TheNewMikeMusic/Xfinds.git
   npm install
   ```
2. **Environment**
   ```bash
   cp .env.example .env.local
   ```
3. **Run**
   ```bash
   npm run dev
   ```

---

### License | 开源协议

Distributed under the **MIT License**. See `LICENSE` for details.

<div align="center">
  <p>Built with Precision by Xfinds Team</p>
</div>
