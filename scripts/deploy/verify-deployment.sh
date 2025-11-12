#!/bin/bash
# 部署后验证脚本
# 用于检查应用是否正常运行，预防 502 错误

set -e

PROJECT_DIR="/var/www/xfinds"
APP_NAME="xfinds"
APP_PORT=8000

echo "=========================================="
echo "验证部署状态"
echo "=========================================="

# 1. 检查 PM2 状态
echo ""
echo "=== 1. 检查 PM2 状态 ==="
if pm2 list | grep -q "${APP_NAME}.*online"; then
    echo "✅ PM2 应用状态: online"
    pm2 status | grep "${APP_NAME}" || true
else
    echo "❌ PM2 应用未运行或状态异常"
    pm2 status
    exit 1
fi

# 2. 检查端口监听
echo ""
echo "=== 2. 检查端口 ${APP_PORT} 监听 ==="
if netstat -tulpn 2>/dev/null | grep -q ":${APP_PORT}" || ss -tulpn 2>/dev/null | grep -q ":${APP_PORT}"; then
    echo "✅ 端口 ${APP_PORT} 正在监听"
    netstat -tulpn 2>/dev/null | grep ":${APP_PORT}" || ss -tulpn 2>/dev/null | grep ":${APP_PORT}"
else
    echo "❌ 端口 ${APP_PORT} 未监听"
    exit 1
fi

# 3. 测试本地连接
echo ""
echo "=== 3. 测试本地连接 ==="
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" --max-time 5 http://localhost:${APP_PORT} || echo "000")
if [ "$HTTP_CODE" = "200" ] || [ "$HTTP_CODE" = "301" ] || [ "$HTTP_CODE" = "302" ] || [ "$HTTP_CODE" = "307" ]; then
    echo "✅ 本地连接成功 (HTTP ${HTTP_CODE})"
else
    echo "❌ 本地连接失败 (HTTP ${HTTP_CODE})"
    echo "检查应用日志："
    pm2 logs ${APP_NAME} --lines 20 --nostream
    exit 1
fi

# 4. 检查构建文件
echo ""
echo "=== 4. 检查构建文件 ==="
if [ -d "${PROJECT_DIR}/.next" ]; then
    echo "✅ 构建文件存在"
else
    echo "❌ 构建文件不存在"
    exit 1
fi

# 5. 检查 Nginx 配置
echo ""
echo "=== 5. 检查 Nginx 配置 ==="
if nginx -t 2>&1 | grep -q "successful"; then
    echo "✅ Nginx 配置正确"
else
    echo "❌ Nginx 配置错误"
    nginx -t
    exit 1
fi

# 6. 检查应用日志中的错误
echo ""
echo "=== 6. 检查应用错误日志 ==="
ERROR_COUNT=$(pm2 logs ${APP_NAME} --lines 50 --nostream 2>&1 | grep -i "error\|failed\|exception" | wc -l || echo "0")
if [ "$ERROR_COUNT" -eq "0" ]; then
    echo "✅ 未发现明显错误"
else
    echo "⚠️  发现 ${ERROR_COUNT} 个可能的错误，查看日志："
    pm2 logs ${APP_NAME} --lines 30 --nostream | grep -i "error\|failed\|exception" || true
fi

# 7. 检查 Sharp 相关错误
echo ""
echo "=== 7. 检查 Sharp 图片优化错误 ==="
SHARP_ERRORS=$(pm2 logs ${APP_NAME} --lines 50 --nostream 2>&1 | grep -i "sharp\|input buffer" | wc -l || echo "0")
if [ "$SHARP_ERRORS" -eq "0" ]; then
    echo "✅ 未发现 Sharp 错误"
else
    echo "⚠️  发现 ${SHARP_ERRORS} 个 Sharp 相关错误"
    echo "建议执行修复："
    echo "  cd ${PROJECT_DIR}"
    echo "  pm2 stop ${APP_NAME}"
    echo "  rm -rf .next node_modules/.cache"
    echo "  npm install sharp@latest --force"
    echo "  npm run build"
    echo "  pm2 restart ${APP_NAME}"
fi

echo ""
echo "=========================================="
echo "✅ 验证完成"
echo "=========================================="
echo ""
echo "如果所有检查都通过，应用应该正常运行。"
echo "访问: https://xfinds.cc"

