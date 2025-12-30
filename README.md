# Xfinds

<div align="center">
  <p><strong>Universal Cross-Border Shopping Agent Aggregator & Comparison Platform</strong></p>
  <p><strong>全场景跨境购物代理聚合与全球比价平台</strong></p>

  <p>
    <a href="https://nextjs.org/"><img src="https://img.shields.io/badge/Next.js-14-black?style=flat-square&logo=next.js" alt="Next.js" /></a>
    <a href="https://www.typescriptlang.org/"><img src="https://img.shields.io/badge/TypeScript-5.x-blue?style=flat-square&logo=typescript" alt="TypeScript" /></a>
    <a href="https://tailwindcss.com/"><img src="https://img.shields.io/badge/TailwindCSS-3.x-38B2AC?style=flat-square&logo=tailwind-css" alt="TailwindCSS" /></a>
    <a href="LICENSE"><img src="https://img.shields.io/badge/License-Apache%202.0-blue?style=flat-square" alt="Apache 2.0 License" /></a>
  </p>

  <p>
    <a href="https://xfinds.cc"><strong>Live Demo</strong></a> •
    <a href="https://github.com/TheNewMikeMusic/Xfinds/issues"><strong>Issues</strong></a> •
    <a href="https://github.com/TheNewMikeMusic/Xfinds/milestones"><strong>Roadmap</strong></a>
  </p>
</div>

---

### What is Xfinds? | 平台定位

Xfinds is a **consumer-facing platform** designed to bring transparency to the fragmented cross-border e-commerce market. It aggregates multiple shopping agents into a single, cohesive experience—enabling users to **search**, **compare**, and **optimize** global purchases with verifiable cost data.

**Xfinds** 是一个面向 C 端的跨境购物决策平台。通过整合多家代理商数据，为用户提供统一检索、横向比价与成本优化方案，让复杂的全球购物流程变得透明且高效。

> [!IMPORTANT]
> **Disclaimer | 项目声明**: This repository is a **frontend demonstration template**. All products and agent data are local/mocked for UI/UX display. For commercial use, developers must integrate their own live APIs.  
> 本项目目前为**前端演示模板**。所有商品与代理商数据均为本地 Mock 数据，仅供交互演示。如需投入实际商用，开发者需自行对接真实的后端 API。

---

### Key Capabilities | 核心能力

- **Unified Search** — Single entry point for high-performance fuzzy search across major agents.  
  **统一检索**：聚合多家代理商品数据，支持高性能模糊匹配。
- **Smart Comparison** — Side-by-side analysis of item prices, service fees, and region-specific constraints.  
  **智能比价**：横向对比商品底价、代理服务费及各类限制条件。
- **Dynamic Estimation** — Real-time shipping cost and delivery time calculation based on granular carrier rules.  
  **动态估算**：基于线路规则实时计算运费及预计送达时间。
- **Strategy Optimization** — Intelligent suggestions to merge or split orders to minimize total landed cost.  
  **策略优化**：提供智能合单/分单建议，最大程度降低到手成本。

---

### System Showcase | 系统演示

<div align="center">
  <p><em>Premium Interface (Dark Mode) | 沉浸式视觉体验（夜间模式）</em></p>
  <img src="https://pub-b2cc1d944b2d43e88716eeaa7d223086.r2.dev/ScreenShot_2025-12-30_110255_958.png" width="95%" alt="Xfinds dark mode banner" />
</div>

<br/>

<div align="center">
  <table style="width: 100%; border-collapse: collapse;">
    <tr>
      <td align="center" width="50%">
        <img src="https://pub-b2cc1d944b2d43e88716eeaa7d223086.r2.dev/ScreenShot_2025-12-30_124517_559.png" width="100%" />
        <br/><b>Discovery Grid (Light)</b><br/>日间模式商品网格
      </td>
      <td align="center" width="50%">
        <img src="https://pub-b2cc1d944b2d43e88716eeaa7d223086.r2.dev/ScreenShot_2025-12-30_114122_459.png" width="100%" />
        <br/><b>Product Details</b><br/>商品详情与变体
      </td>
    </tr>
    <tr>
      <td align="center">
        <img src="https://pub-b2cc1d944b2d43e88716eeaa7d223086.r2.dev/ScreenShot_2025-12-30_124445_841.png" width="100%" />
        <br/><b>Agent Comparison</b><br/>代理商横向比价
      </td>
      <td align="center">
        <img src="https://pub-b2cc1d944b2d43e88716eeaa7d223086.r2.dev/ScreenShot_2025-12-30_124531_340.png" width="100%" />
        <br/><b>Cart Checkout</b><br/>购物车结算优化
      </td>
    </tr>
  </table>
</div>

---

### Why Developers Care | 开发者价值与扩展性

Xfinds is built as an **extensible architecture** for cross-border data orchestration. It provides a robust foundation for building comparison tools with clean separation of concerns.

Xfinds 采用高度可扩展的平台架构，旨在沉淀一套标准化的跨境数据编排工作流。

- **Adapter-based Integration** — Add a new shopping agent by implementing a standardized provider interface without modifying core UI components.  
  **适配器架构**：通过实现标准 Provider 接口即可快速接入新代理，保持核心逻辑独立。
- **Unified Data Schema** — Normalize diverse upstream responses into consistent `Product`, `Offer`, and `ShippingQuote` models.  
  **统一模型**：将异构的上游响应规范化为统一的数据模型，降低下游消费成本。
- **Rule-driven Engines** — Modularized logic for fee calculation and logistics constraints (volumetric weight, region surcharges, etc.).  
  **规则引擎**：计费与物流限制逻辑完全模块化，支持线路规则的可测试与可复用。
- **High DX Standard** — End-to-end type safety with TypeScript, clear API/UI boundaries, and production-ready testing coverage.  
  **极致开发体验**：全链路类型覆盖，API 与视图层深度解耦，支持持续集成。

---

### Quick Start | 快速开始

```bash
# 1. Clone the repository | 克隆仓库
git clone https://github.com/TheNewMikeMusic/Xfinds.git && cd Xfinds

# 2. Install dependencies | 安装依赖
npm install

# 3. Setup environment | 环境配置
cp .env.example .env.local

# 4. Start development | 启动开发
npm run dev
```

---

### Technical Specification | 技术选型

- **Framework**: Next.js 14 (App Router) • TypeScript 5.x • Zustand
- **Styling**: Tailwind CSS • Framer Motion • Radix UI
- **Services**: Fuse.js (Fuzzy search) • next-intl (i18n) • Sharp
- **Testing**: Vitest • Playwright

---

### Project Structure | 项目结构

```text
app/            # Routes, layouts, and API endpoints
components/     # UI primitives & feature components (Atomic Design)
lib/            # Core engines (pricing/shipping) & standardized utils
store/          # Client-side state orchestration
data/           # Static metadata & mock registries
messages/       # Localization dictionaries
```

---

### License | 开源协议

Xfinds is released under the [Apache License 2.0](LICENSE).  
基于 Apache 2.0 协议开源。

<div align="center">
  <p>Built for clarity. Designed for the global shopping community.</p>
</div>
