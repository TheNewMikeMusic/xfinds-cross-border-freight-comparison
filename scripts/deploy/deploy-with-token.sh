#!/bin/bash
# 在服务器上直接创建并执行部署脚本（使用 GitHub Token）

cat > /root/deploy-from-github.sh << 'SCRIPT_END'
#!/bin/bash
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
APP_URL=http://154.21.200.177
NEXT_PUBLIC_APP_URL=http://154.21.200.177
EXCHANGE_RATE_API=https://api.exchangerate-api.com/v4/latest/CNY
EOF
    echo "已创建新的 .env.local"
fi

echo ""
echo "=== 安装依赖 ==="
npm install

echo ""
echo "=== 构建项目 ==="
npm run build

echo ""
echo "=== 启动应用 ==="
pm2 start npm --name "xfinds" -- start
pm2 save
pm2 startup | tail -1 | bash || true

echo ""
echo "=== 配置防火墙 ==="
ufw allow 3000/tcp 2>/dev/null || firewall-cmd --permanent --add-port=3000/tcp 2>/dev/null || true
firewall-cmd --reload 2>/dev/null || true

echo ""
echo "=========================================="
echo "部署完成！"
echo "访问地址: http://154.21.200.177:3000"
echo "备份位置: $BACKUP_DIR"
echo "=========================================="
pm2 status
SCRIPT_END

chmod +x /root/deploy-from-github.sh
echo "脚本已创建，开始执行部署..."
/root/deploy-from-github.sh


