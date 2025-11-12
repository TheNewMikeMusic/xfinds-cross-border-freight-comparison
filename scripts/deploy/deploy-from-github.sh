#!/bin/bash
# 从 GitHub 拉取并部署 Xfinds（使用 Token 认证）
# 包含预防 502 错误和 Sharp 错误的措施

set -e

PROJECT_DIR="/var/www/xfinds"
GITHUB_TOKEN="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"
GITHUB_REPO_AUTH="https://${GITHUB_TOKEN}@github.com/TheNewMikeMusic/Xfinds.git"
BRANCH="main"
BACKUP_DIR="/var/www/xfinds-backup-$(date +%Y%m%d-%H%M%S)"

echo "=========================================="
echo "从 GitHub 拉取并部署 Xfinds（使用 Token 认证）"
echo "=========================================="

echo ""
echo "=== 停止 PM2 进程 ==="
pm2 stop xfinds 2>/dev/null || true
pm2 delete xfinds 2>/dev/null || true

if [ -d "$PROJECT_DIR" ]; then
    echo ""
    echo "=== 备份现有项目 ==="
    mkdir -p "$BACKUP_DIR"
    if [ -f "$PROJECT_DIR/.env.local" ]; then
        cp "$PROJECT_DIR/.env.local" "$BACKUP_DIR/.env.local.backup"
        echo "已备份 .env.local"
    fi
    cp -r "$PROJECT_DIR" "$BACKUP_DIR/project" 2>/dev/null || true
    echo "备份完成"
fi

echo ""
echo "=== 清理现有项目 ==="
rm -rf "$PROJECT_DIR"
mkdir -p "$PROJECT_DIR"

echo ""
echo "=== 从 GitHub 拉取最新代码（使用 Token 认证） ==="
cd "$PROJECT_DIR"
git clone "$GITHUB_REPO_AUTH" .

echo ""
echo "=== 切换到 $BRANCH 分支 ==="
git checkout "$BRANCH"
git pull origin "$BRANCH"

if [ -f "$BACKUP_DIR/.env.local.backup" ]; then
    echo ""
    echo "=== 恢复环境变量配置 ==="
    cp "$BACKUP_DIR/.env.local.backup" "$PROJECT_DIR/.env.local"
    echo "已恢复 .env.local"
else
    echo ""
    echo "=== 创建新的环境变量配置 ==="
    JWT_SECRET=$(openssl rand -base64 32)
    cat > .env.local << EOF
NODE_ENV=production
JWT_SECRET=${JWT_SECRET}
AUTH_MODE=stub
APP_URL=https://xfinds.cc
NEXT_PUBLIC_APP_URL=https://xfinds.cc
EXCHANGE_RATE_API=https://api.exchangerate-api.com/v4/latest/CNY
EOF
    echo "已创建新的 .env.local"
fi

echo ""
echo "=== 清理构建和缓存（预防 Sharp 错误） ==="
rm -rf .next
rm -rf node_modules/.cache

echo ""
echo "=== 安装依赖 ==="
npm install

echo ""
echo "=== 确保 Sharp 正确安装（预防图片优化错误） ==="
npm install sharp@latest --force || echo "Sharp 安装警告，继续..."

echo ""
echo "=== 构建项目 ==="
npm run build

# 验证构建是否成功
if [ ! -d ".next" ]; then
    echo "❌ 错误: 构建失败，.next 目录不存在"
    exit 1
fi

echo ""
echo "=== 使用 PM2 生态系统配置启动应用 ==="
# 如果存在 ecosystem.config.js，使用它；否则使用传统方式
if [ -f "ecosystem.config.js" ]; then
    echo "使用 ecosystem.config.js 配置启动..."
    pm2 start ecosystem.config.js
else
    echo "使用传统方式启动..."
    pm2 start npm --name "xfinds" -- start
fi

pm2 save
pm2 startup | tail -1 | bash || true

echo ""
echo "=== 等待应用启动并验证 ==="
sleep 5

# 检查应用状态
if pm2 list | grep -q "xfinds.*online"; then
    echo "✅ 应用已启动"
else
    echo "⚠️  应用可能未正常启动，检查日志..."
    pm2 logs xfinds --lines 20 --nostream
    exit 1
fi

# 检查端口监听
if netstat -tulpn 2>/dev/null | grep -q ":8000" || ss -tulpn 2>/dev/null | grep -q ":8000"; then
    echo "✅ 端口 8000 正在监听"
else
    echo "⚠️  端口 8000 未监听，检查应用日志..."
    pm2 logs xfinds --lines 30 --nostream
    exit 1
fi

# 测试本地连接
if curl -f -s -o /dev/null -w "%{http_code}" http://localhost:8000 | grep -q "200\|301\|302\|307"; then
    echo "✅ 本地连接测试成功"
else
    echo "⚠️  本地连接测试失败，但继续..."
fi

echo ""
echo "=== 配置防火墙 ==="
ufw allow 8000/tcp 2>/dev/null || firewall-cmd --permanent --add-port=8000/tcp 2>/dev/null || true
ufw allow 80/tcp 2>/dev/null || firewall-cmd --permanent --add-port=80/tcp 2>/dev/null || true
ufw allow 443/tcp 2>/dev/null || firewall-cmd --permanent --add-port=443/tcp 2>/dev/null || true
firewall-cmd --reload 2>/dev/null || true

echo ""
echo "=== 配置 Nginx ==="
if [ ! -f /etc/nginx/sites-available/xfinds ]; then
    echo "复制 Nginx 配置文件..."
    cp nginx.conf /etc/nginx/sites-available/xfinds
fi

if [ ! -L /etc/nginx/sites-enabled/xfinds ]; then
    echo "启用 Nginx 站点..."
    ln -s /etc/nginx/sites-available/xfinds /etc/nginx/sites-enabled/
fi

echo "测试 Nginx 配置..."
if nginx -t; then
    systemctl reload nginx
    echo "✅ Nginx 配置已应用"
else
    echo "❌ Nginx 配置测试失败，请检查配置"
    exit 1
fi

echo ""
echo "=== 最终验证 ==="
pm2 status
echo ""
echo "应用日志（最后 10 行）："
pm2 logs xfinds --lines 10 --nostream || true

echo ""
echo "=========================================="
echo "✅ 部署完成！"
echo "=========================================="
echo "访问地址: https://xfinds.cc"
echo "备份位置: $BACKUP_DIR"
echo ""
echo "应用状态:"
pm2 list | grep xfinds || echo "未找到 xfinds 进程"
echo ""
echo "如果遇到问题，请检查："
echo "  - pm2 logs xfinds"
echo "  - tail -50 /var/log/nginx/xfinds-error.log"
echo "=========================================="

