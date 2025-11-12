#!/bin/bash
# 从 GitHub 拉取最新代码并完全替换部署
# 使用方法: chmod +x deploy-from-github.sh && ./deploy-from-github.sh

set -e

# 配置变量
PROJECT_DIR="/var/www/xfinds"
GITHUB_TOKEN="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"
GITHUB_REPO_AUTH="https://${GITHUB_TOKEN}@github.com/TheNewMikeMusic/Xfinds.git"
BRANCH="main"
BACKUP_DIR="/var/www/xfinds-backup-$(date +%Y%m%d-%H%M%S)"

echo "=========================================="
echo "从 GitHub 拉取并部署 Xfinds（使用 Token 认证）"
echo "域名: xfinds.cc | 端口: 8000 | HTTPS: Let's Encrypt"
echo "=========================================="

# 1. 停止 PM2 进程
echo ""
echo "=== 停止 PM2 进程 ==="
pm2 stop xfinds 2>/dev/null || true
pm2 delete xfinds 2>/dev/null || true

# 2. 备份现有项目（如果存在）
if [ -d "$PROJECT_DIR" ]; then
    echo ""
    echo "=== 备份现有项目 ==="
    mkdir -p "$BACKUP_DIR"
    
    # 备份 .env.local（如果存在）
    if [ -f "$PROJECT_DIR/.env.local" ]; then
        cp "$PROJECT_DIR/.env.local" "$BACKUP_DIR/.env.local.backup"
        echo "已备份 .env.local"
    fi
    
    # 备份整个项目目录
    echo "正在备份项目目录到: $BACKUP_DIR"
    cp -r "$PROJECT_DIR" "$BACKUP_DIR/project" 2>/dev/null || true
    
    echo "备份完成"
fi

# 3. 删除现有项目目录
echo ""
echo "=== 清理现有项目 ==="
rm -rf "$PROJECT_DIR"
mkdir -p "$PROJECT_DIR"

# 4. 从 GitHub 克隆最新代码（使用 token）
echo ""
echo "=== 从 GitHub 拉取最新代码（使用 Token 认证） ==="
cd "$PROJECT_DIR"
git clone "$GITHUB_REPO_AUTH" .

# 5. 切换到指定分支
echo ""
echo "=== 切换到 $BRANCH 分支 ==="
git checkout "$BRANCH"
git pull origin "$BRANCH"

# 6. 恢复 .env.local（如果备份存在）
if [ -f "$BACKUP_DIR/.env.local.backup" ]; then
    echo ""
    echo "=== 恢复环境变量配置 ==="
    cp "$BACKUP_DIR/.env.local.backup" "$PROJECT_DIR/.env.local"
    # 更新环境变量中的 URL 为 HTTPS
    sed -i 's|APP_URL=.*|APP_URL=https://xfinds.cc|' .env.local
    sed -i 's|NEXT_PUBLIC_APP_URL=.*|NEXT_PUBLIC_APP_URL=https://xfinds.cc|' .env.local
    echo "已恢复并更新 .env.local"
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

# 7. 安装依赖
echo ""
echo "=== 安装依赖 ==="
npm install

# 8. 构建项目
echo ""
echo "=== 构建项目 ==="
npm run build

# 9. 启动 PM2 进程（8000 端口）
echo ""
echo "=== 启动应用（8000 端口） ==="
pm2 start npm --name "xfinds" -- start
pm2 save

# 10. 设置开机自启（如果需要）
pm2 startup | tail -1 | bash || true

# 11. 配置防火墙
echo ""
echo "=== 配置防火墙 ==="
ufw allow 8000/tcp 2>/dev/null || firewall-cmd --permanent --add-port=8000/tcp 2>/dev/null || true
ufw allow 80/tcp 2>/dev/null || firewall-cmd --permanent --add-port=80/tcp 2>/dev/null || true
ufw allow 443/tcp 2>/dev/null || firewall-cmd --permanent --add-port=443/tcp 2>/dev/null || true
firewall-cmd --reload 2>/dev/null || true

# 12. 配置 Nginx
echo ""
echo "=== 配置 Nginx ==="
# 安装 Nginx（如果未安装）
if ! command -v nginx &> /dev/null; then
    echo "安装 Nginx..."
    apt-get update
    apt-get install -y nginx
fi

# 复制 Nginx 配置
cp nginx.conf /etc/nginx/sites-available/xfinds

# 启用站点
if [ ! -L /etc/nginx/sites-enabled/xfinds ]; then
    echo "启用 Nginx 站点..."
    ln -s /etc/nginx/sites-available/xfinds /etc/nginx/sites-enabled/
fi

# 测试并重新加载 Nginx
echo "测试 Nginx 配置..."
nginx -t && systemctl reload nginx || echo "Nginx 配置测试失败，请检查配置"

echo ""
echo "=========================================="
echo "部署完成！"
echo "访问地址: https://xfinds.cc"
echo "备份位置: $BACKUP_DIR"
echo "=========================================="
pm2 status

echo ""
echo "验证步骤："
echo "1. 检查 PM2 状态: pm2 status"
echo "2. 检查 Nginx 状态: systemctl status nginx"
echo "3. 访问 https://xfinds.cc"
echo "4. 检查应用日志: pm2 logs xfinds --lines 20"
