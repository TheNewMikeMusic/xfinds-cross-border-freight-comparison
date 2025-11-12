# Xfinds

一个现代化的深色主题产品搜索与代理比较 Web 应用，灵感来自 plug4.me 和 uufinds，使用 Next.js、TypeScript、Tailwind、Framer Motion 和 shadcn/ui 构建。设计采用液体玻璃美学、流畅动画和由 Fuse.js 驱动的智能关键词搜索。

## 功能特性

- 🔍 **智能搜索**: 使用 Fuse.js 进行模糊搜索，支持关键词、分类、代理筛选
- 🛍️ **产品比较**: 并排比较不同代理的报价
- 🛒 **购物车**: 保存选中的产品报价，批量打开代理链接
- 👥 **代理目录**: 浏览所有合作的代理服务商
- 📤 **产品上传**: 开发模式下上传新产品（仅开发环境）
- 🔐 **用户认证**: Stub 模式快速认证系统
- 🌐 **多语言支持**: 中文（默认）和英文界面
- 🎨 **液体玻璃美学**: 深色主题，毛玻璃效果，微交互动画

## 技术栈

- **框架**: Next.js 14+ (App Router)
- **语言**: TypeScript (严格模式)
- **样式**: Tailwind CSS v3.4
- **UI 组件**: shadcn/ui
- **动画**: Framer Motion
- **状态管理**: Zustand
- **搜索**: Fuse.js
- **国际化**: next-intl (准备中)

## 快速开始

1. 安装依赖：
```bash
npm install
```

2. 复制环境变量文件：
```bash
cp .env.example .env.local
```

3. 编辑 `.env.local` 文件，设置必需的环境变量（见下方环境变量说明）

4. 启动开发服务器：
```bash
npm run dev
```

5. 打开浏览器访问 [http://localhost:3000](http://localhost:3000)

## 项目结构

```
Xfinds/
├── app/                    # Next.js App Router 页面
├── components/             # React 组件
│   ├── ui/                # shadcn/ui 基础组件
│   ├── shared/            # 共享组件（Navbar, Footer等）
│   ├── search/            # 搜索相关组件
│   ├── product/           # 产品相关组件
│   └── ...
├── lib/                    # 工具函数和库
├── store/                  # Zustand 状态管理
├── data/                   # JSON 数据文件
├── docs/                   # 项目文档
│   ├── deployment/        # 部署相关文档
│   └── troubleshooting/   # 故障排查文档
├── scripts/                # 脚本文件
│   ├── deploy/            # 部署脚本
│   └── process-images.ts  # 图片处理脚本
├── public/                 # 静态资源
├── DEPLOY.md              # 部署指南（快速参考）
├── setup-https.sh         # HTTPS 配置脚本
└── nginx.conf             # Nginx 配置文件

```

## 开发

- `npm run dev` - 启动开发服务器
- `npm run build` - 构建生产版本
- `npm run start` - 启动生产服务器
- `npm run lint` - 运行 ESLint
- `npm run type-check` - 类型检查

## 部署

详细的部署指南请查看 [`DEPLOY.md`](./DEPLOY.md) 文件。

快速部署：
1. 查看 [`DEPLOY.md`](./DEPLOY.md) 获取一键部署命令
2. 遇到问题请查看 [`docs/troubleshooting/`](./docs/troubleshooting/) 目录

## 环境变量

创建 `.env.local` 文件并配置以下变量（参考 `.env.example`）：

### 必需变量

- `JWT_SECRET` - JWT签名密钥（生产环境必须至少32个字符）
  - 开发环境可以使用默认值
  - 生产环境必须设置强密码：`openssl rand -base64 32`

### 可选变量

- `NODE_ENV` - 环境模式 (`development` | `production`)，默认 `development`
- `AUTH_MODE` - 认证模式，默认 `stub`
- `ADMIN_TOKEN` - 管理员令牌（用于生产环境的admin API）
- `APP_URL` - 应用URL（用于邮件链接），默认 `http://localhost:3000`
- `NEXT_PUBLIC_APP_URL` - 公共应用URL，默认 `http://localhost:3000`
- `EXCHANGE_RATE_API` - 汇率API端点，默认使用免费API

### 生产环境注意事项

⚠️ **重要**: 在生产环境部署前，请确保：
1. `JWT_SECRET` 已设置为强密码（至少32个字符）
2. `NODE_ENV=production`
3. `ADMIN_TOKEN` 已设置（如果使用admin功能）
4. 所有敏感信息不在代码中硬编码

## 许可证

MIT
