# Xfinds 部署指南

## 服务器信息
- **IP 地址**: 154.21.200.177
- **域名**: xfinds.cc
- **用户名**: root
- **密码**: dm6b1acaggAoLcln
- **应用端口**: 8000
- **HTTPS**: Let's Encrypt

## 快速部署方法

### 方法一：一键部署（使用 GitHub Token，推荐 ⭐）

**已验证成功** ✅ - 这是最简单快捷的方式，使用 GitHub Token 认证，确保可以访问仓库。

**在服务器上直接执行以下命令**：

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
APP_URL=https://xfinds.cc
NEXT_PUBLIC_APP_URL=https://xfinds.cc
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
echo "=== 启动应用（8000 端口） ==="
pm2 start npm --name "xfinds" -- start
pm2 save
pm2 startup | tail -1 | bash || true

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
nginx -t && systemctl reload nginx || echo "Nginx 配置测试失败，请检查配置"

echo ""
echo "=========================================="
echo "部署完成！"
echo "访问地址: https://xfinds.cc"
echo "备份位置: $BACKUP_DIR"
echo ""
echo "注意：如果尚未配置 HTTPS，请运行："
echo "  chmod +x setup-https.sh && ./setup-https.sh"
echo "=========================================="
pm2 status
SCRIPT_END

chmod +x /root/deploy-from-github.sh
/root/deploy-from-github.sh
```

**脚本功能说明**：
- ✅ 使用 GitHub Token 认证，确保可以访问仓库
- ✅ 自动停止当前运行的 PM2 进程
- ✅ 备份现有项目（包括 .env.local）
- ✅ 完全删除旧项目
- ✅ 从 GitHub 拉取最新代码
- ✅ 恢复环境变量配置
- ✅ 安装依赖并构建项目
- ✅ 重启 PM2 进程
- ✅ 自动配置防火墙

**部署状态**：✅ 已验证成功

### 方法二：使用本地部署脚本

适用于已有项目目录的情况，不会完全替换项目。

1. **连接到服务器**：
```bash
ssh root@154.21.200.177
```

2. **上传部署脚本到服务器**：
   - 方式 A: 使用 SCP（在本地 PowerShell 执行）：
   ```powershell
   scp server-deploy.sh root@154.21.200.177:/root/
   ```
   
   - 方式 B: 直接在服务器上创建文件：
   ```bash
   nano /root/server-deploy.sh
   # 然后复制 server-deploy.sh 的内容
   ```

3. **执行部署脚本**：
```bash
chmod +x /root/server-deploy.sh
/root/server-deploy.sh
```

### 方法三：手动部署步骤

如果脚本执行失败，可以按照以下步骤手动部署：

#### 1. 连接到服务器
```bash
ssh root@154.21.200.177
```

#### 2. 更新系统并安装必要工具
```bash
apt-get update && apt-get upgrade -y
apt-get install -y git curl

# 安装 Node.js 20
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt-get install -y nodejs

# 安装 PM2
npm install -g pm2

# 验证安装
node -v
npm -v
pm2 -v
```

#### 3. 克隆项目
```bash
mkdir -p /var/www/xfinds
cd /var/www/xfinds
git clone https://github.com/TheNewMikeMusic/Xfinds.git .
```

#### 4. 安装依赖
```bash
cd /var/www/xfinds
npm install
```

#### 5. 配置环境变量
```bash
cd /var/www/xfinds
JWT_SECRET=$(openssl rand -base64 32)
cat > .env.local << EOF
NODE_ENV=production
JWT_SECRET=${JWT_SECRET}
AUTH_MODE=stub
APP_URL=https://xfinds.cc
NEXT_PUBLIC_APP_URL=https://xfinds.cc
EXCHANGE_RATE_API=https://api.exchangerate-api.com/v4/latest/CNY
EOF
```

#### 6. 构建项目
```bash
cd /var/www/xfinds
npm run build
```

#### 7. 启动应用
```bash
cd /var/www/xfinds
pm2 start npm --name "xfinds" -- start
pm2 save
pm2 startup
```

#### 8. 配置防火墙（如果需要）
```bash
# UFW
ufw allow 8000/tcp
ufw allow 80/tcp
ufw allow 443/tcp

# 或 firewalld
firewall-cmd --permanent --add-port=8000/tcp
firewall-cmd --permanent --add-port=80/tcp
firewall-cmd --permanent --add-port=443/tcp
firewall-cmd --reload
```

## 配置 HTTPS（Let's Encrypt）

### 前置条件
- 域名 `xfinds.cc` 已正确解析到服务器 IP `154.21.200.177`
- 80 和 443 端口已在防火墙中开放
- Nginx 已安装并运行

### 方法一：使用自动配置脚本（推荐）

1. **确保已部署最新代码**（包含 `setup-https.sh` 脚本）

2. **执行 HTTPS 配置脚本**：
```bash
cd /var/www/xfinds
chmod +x setup-https.sh
./setup-https.sh
```

脚本会自动：
- 安装 Certbot
- 获取 SSL 证书
- 配置证书自动续期

### 方法二：手动配置

1. **安装 Certbot**：
```bash
apt-get update
apt-get install -y certbot python3-certbot-nginx
```

2. **确保 Nginx 配置已就位**：
```bash
cp /var/www/xfinds/nginx.conf /etc/nginx/sites-available/xfinds
ln -s /etc/nginx/sites-available/xfinds /etc/nginx/sites-enabled/
nginx -t
systemctl reload nginx
```

3. **获取 SSL 证书**：
```bash
certbot --nginx -d xfinds.cc -d www.xfinds.cc
```

4. **测试证书续期**：
```bash
certbot renew --dry-run
```

### 验证 HTTPS

部署完成后，访问：
- **HTTPS**: https://xfinds.cc
- **HTTP 自动重定向**: http://xfinds.cc（会自动跳转到 HTTPS）

## 配置 Nginx 反向代理

Nginx 配置已包含在部署脚本中，会自动配置：

- HTTP 到 HTTPS 重定向
- SSL/TLS 证书配置
- 代理到 Next.js 应用（8000 端口）
- 静态文件缓存
- Gzip 压缩

## 常用管理命令

### PM2 命令
```bash
# 查看应用状态
pm2 status

# 查看日志
pm2 logs xfinds

# 重启应用
pm2 restart xfinds

# 停止应用
pm2 stop xfinds

# 删除应用
pm2 delete xfinds
```

### 更新代码

#### 方式一：使用 GitHub 部署脚本（推荐）
```bash
/root/deploy-from-github.sh
```

#### 方式二：手动更新
```bash
cd /var/www/xfinds
git pull origin main
npm install
npm run build
pm2 restart xfinds
```

## 访问应用

部署完成后，可以通过以下地址访问：
- **HTTPS（推荐）**: https://xfinds.cc
- **HTTP（自动重定向到 HTTPS）**: http://xfinds.cc
- **直接访问应用端口**: http://154.21.200.177:8000（仅用于测试，生产环境应使用 HTTPS）

## 故障排查

### 应用无法启动
1. 检查日志：`pm2 logs xfinds`
2. 检查端口是否被占用：`netstat -tulpn | grep 3000`
3. 检查环境变量：`cat /var/www/xfinds/.env.local`

### 构建失败
1. 检查 Node.js 版本：`node -v`（需要 18+）
2. 清除缓存：`rm -rf .next node_modules && npm install`
3. 检查磁盘空间：`df -h`

### 无法访问
1. 检查防火墙：`ufw status` 或 `firewall-cmd --list-all`
2. 检查 PM2 状态：`pm2 status`
3. 检查端口监听：`netstat -tulpn | grep 3000`

## 安全建议

1. **更改默认密码**：部署后立即更改 root 密码
2. **配置 SSH 密钥**：使用密钥认证替代密码登录
3. **设置防火墙规则**：只开放必要的端口
4. **定期更新**：保持系统和依赖包更新
5. **备份数据**：定期备份重要数据

## 支持

如有问题，请检查：
- PM2 日志：`pm2 logs xfinds`
- Nginx 日志：`/var/log/nginx/xfinds-error.log`
- 系统日志：`journalctl -u nginx` 或 `dmesg`

