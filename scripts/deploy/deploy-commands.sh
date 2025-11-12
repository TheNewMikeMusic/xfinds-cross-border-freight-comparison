#!/bin/bash
# 在服务器上直接创建并执行部署脚本

cat > /root/deploy-from-github.sh << 'SCRIPT_END'
#!/bin/bash
# 从 GitHub 拉取最新代码并完全替换部署
# 使用方法: chmod +x deploy-from-github.sh && ./deploy-from-github.sh

set -e

# 配置变量
PROJECT_DIR="/var/www/xfinds"
GITHUB_REPO="https://github.com/TheNewMikeMusic/Xfinds.git"
BRANCH="main"
BACKUP_DIR="/var/www/xfinds-backup-$(date +%Y%m%d-%H%M%S)"

echo "=========================================="
echo "从 GitHub 拉取并部署 Xfinds"
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

# 4. 从 GitHub 克隆最新代码
echo ""
echo "=== 从 GitHub 拉取最新代码 ==="
cd "$PROJECT_DIR"
git clone "$GITHUB_REPO" .

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

# 7. 安装依赖
echo ""
echo "=== 安装依赖 ==="
npm install

# 8. 构建项目
echo ""
echo "=== 构建项目 ==="
npm run build

# 9. 启动 PM2 进程
echo ""
echo "=== 启动应用 ==="
pm2 start npm --name "xfinds" -- start
pm2 save

# 10. 设置开机自启（如果需要）
pm2 startup | tail -1 | bash || true

# 11. 配置防火墙
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

echo ""
echo "提示: 如果部署有问题，可以从备份恢复："
echo "  cp -r $BACKUP_DIR/project/* $PROJECT_DIR/"
SCRIPT_END

chmod +x /root/deploy-from-github.sh
echo "脚本已创建，开始执行部署..."
/root/deploy-from-github.sh


