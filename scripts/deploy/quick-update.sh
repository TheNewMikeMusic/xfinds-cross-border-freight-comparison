#!/bin/bash
# 快速更新脚本 - 仅拉取代码并重启，不重新克隆
# 使用方法: chmod +x quick-update.sh && ./quick-update.sh

set -e

PROJECT_DIR="/var/www/xfinds"

echo "=========================================="
echo "快速更新 Xfinds 应用"
echo "=========================================="

if [ ! -d "$PROJECT_DIR" ]; then
    echo "错误: 项目目录不存在，请使用完整部署脚本"
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
echo "=== 安装依赖（如有更新） ==="
npm install

echo ""
echo "=== 构建项目 ==="
npm run build

echo ""
echo "=== 重启应用 ==="
pm2 restart xfinds

echo ""
echo "=========================================="
echo "更新完成！"
echo "访问地址: https://xfinds.cc"
echo "=========================================="
pm2 status

echo ""
echo "查看日志: pm2 logs xfinds --lines 20"

