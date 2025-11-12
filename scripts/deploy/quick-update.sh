#!/bin/bash
# 快速更新脚本 - 仅拉取代码并重启，不重新克隆
# 使用方法: chmod +x scripts/deploy/quick-update.sh && ./scripts/deploy/quick-update.sh
# 或者在服务器上: cd /var/www/xfinds && chmod +x scripts/deploy/quick-update.sh && ./scripts/deploy/quick-update.sh

set -e

PROJECT_DIR="/var/www/xfinds"

echo "=========================================="
echo "快速更新 Xfinds 应用"
echo "=========================================="

if [ ! -d "$PROJECT_DIR" ]; then
    echo "❌ 错误: 项目目录不存在，请使用完整部署脚本"
    echo "运行: /root/deploy-xfinds.sh"
    exit 1
fi

cd "$PROJECT_DIR"

echo ""
echo "=== 停止 PM2 进程 ==="
pm2 stop xfinds 2>/dev/null || true

echo ""
echo "=== 拉取最新代码 ==="
git pull origin main

echo ""
echo "=== 清理构建缓存（预防 Sharp 错误） ==="
rm -rf .next
rm -rf node_modules/.cache

echo ""
echo "=== 安装依赖（如有更新） ==="
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
echo "=== 重启应用 ==="
pm2 restart xfinds

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
    echo "⚠️  端口 8000 未监听"
fi

# 测试本地连接
if curl -f -s -o /dev/null -w "%{http_code}" http://localhost:8000 | grep -q "200\|301\|302\|307"; then
    echo "✅ 本地连接测试成功"
else
    echo "⚠️  本地连接测试失败，但继续..."
fi

echo ""
echo "=========================================="
echo "✅ 更新完成！"
echo "=========================================="
echo "访问地址: https://xfinds.cc"
echo ""
pm2 status
echo ""
echo "查看日志: pm2 logs xfinds --lines 20"

