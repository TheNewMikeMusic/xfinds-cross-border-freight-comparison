# 服务器部署指令

## ⭐ 方法一：一键部署（使用 GitHub Token，已验证成功 ✅）

**推荐使用此方法** - 使用 GitHub Token 认证，确保可以访问仓库。

在服务器上直接执行以下命令：

```bash
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
/root/deploy-from-github.sh
```

**部署状态**：✅ 已验证成功

## 方法二：手动上传脚本后部署

### 步骤 1：连接到服务器
```bash
ssh root@154.21.200.177
```

### 步骤 2：上传部署脚本（在本地 PowerShell 执行）
```powershell
scp deploy-from-github.sh root@154.21.200.177:/root/
```

### 步骤 3：在服务器上执行部署
```bash
chmod +x /root/deploy-from-github.sh
/root/deploy-from-github.sh
```

## 方法三：直接在服务器上创建脚本

### 步骤 1：连接到服务器
```bash
ssh root@154.21.200.177
```

### 步骤 2：创建部署脚本
```bash
cat > /root/deploy-from-github.sh << 'SCRIPT_END'
#!/bin/bash
# 从 GitHub 拉取最新代码并完全替换部署

set -e

PROJECT_DIR="/var/www/xfinds"
GITHUB_REPO="https://github.com/TheNewMikeMusic/Xfinds.git"
BRANCH="main"
BACKUP_DIR="/var/www/xfinds-backup-$(date +%Y%m%d-%H%M%S)"

echo "=========================================="
echo "从 GitHub 拉取并部署 Xfinds"
echo "=========================================="

# 停止 PM2 进程
echo ""
echo "=== 停止 PM2 进程 ==="
pm2 stop xfinds 2>/dev/null || true
pm2 delete xfinds 2>/dev/null || true

# 备份现有项目
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

# 删除现有项目目录
echo ""
echo "=== 清理现有项目 ==="
rm -rf "$PROJECT_DIR"
mkdir -p "$PROJECT_DIR"

# 从 GitHub 克隆最新代码
echo ""
echo "=== 从 GitHub 拉取最新代码 ==="
cd "$PROJECT_DIR"
git clone "$GITHUB_REPO" .
git checkout "$BRANCH"
git pull origin "$BRANCH"

# 恢复 .env.local
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

# 安装依赖
echo ""
echo "=== 安装依赖 ==="
npm install

# 构建项目
echo ""
echo "=== 构建项目 ==="
npm run build

# 启动 PM2 进程
echo ""
echo "=== 启动应用 ==="
pm2 start npm --name "xfinds" -- start
pm2 save
pm2 startup | tail -1 | bash || true

# 配置防火墙
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
```

### 步骤 3：执行部署
```bash
/root/deploy-from-github.sh
```

## 部署后验证

部署完成后，检查应用状态：

```bash
# 查看 PM2 状态
pm2 status

# 查看应用日志
pm2 logs xfinds

# 访问应用
curl http://localhost:3000
```

## 注意事项

1. **备份**：脚本会自动备份现有项目到 `/var/www/xfinds-backup-时间戳/`
2. **环境变量**：如果存在 `.env.local`，会自动恢复；否则会创建新的
3. **完全替换**：此脚本会完全删除旧项目并从 GitHub 重新克隆
4. **GitHub 访问**：确保服务器可以访问 GitHub（可能需要配置代理）

## 故障排查

如果部署失败，可以：

1. 查看备份目录恢复项目：
```bash
cp -r /var/www/xfinds-backup-*/project/* /var/www/xfinds/
```

2. 查看 PM2 日志：
```bash
pm2 logs xfinds
```

3. 手动检查：
```bash
cd /var/www/xfinds
ls -la
cat .env.local
```


