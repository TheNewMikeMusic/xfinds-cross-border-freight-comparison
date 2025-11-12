#!/bin/bash
# 分步修复 HTTPS 443 端口问题
# 先配置 HTTP，获取证书后再配置 HTTPS

set -e

echo "=========================================="
echo "分步修复 HTTPS 443 端口问题"
echo "=========================================="

cd /var/www/xfinds

# 步骤 1: 创建临时 HTTP-only 配置（用于获取证书）
echo ""
echo "=== 步骤 1: 创建临时 HTTP-only 配置 ==="
cat > /etc/nginx/sites-available/xfinds << 'NGINX_TEMP'
# 临时 HTTP 配置 - 用于获取 SSL 证书
server {
    listen 80;
    server_name xfinds.cc www.xfinds.cc;

    # Let's Encrypt 验证
    location /.well-known/acme-challenge/ {
        root /var/www/certbot;
    }

    # 临时代理到应用（获取证书后会被 HTTPS 配置替换）
    location / {
        proxy_pass http://localhost:8000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
NGINX_TEMP

# 启用站点
ln -sf /etc/nginx/sites-available/xfinds /etc/nginx/sites-enabled/

# 移除默认站点
if [ -L /etc/nginx/sites-enabled/default ]; then
    rm /etc/nginx/sites-enabled/default
fi

# 创建 certbot webroot 目录
mkdir -p /var/www/certbot

# 测试并启动 Nginx
echo "测试临时 Nginx 配置..."
nginx -t

echo "启动/重启 Nginx..."
systemctl restart nginx
systemctl status nginx --no-pager -l | head -10

# 步骤 2: 获取 SSL 证书
echo ""
echo "=== 步骤 2: 获取 SSL 证书 ==="
echo "请确保域名 xfinds.cc 已正确解析到服务器 IP"

if [ ! -f /etc/letsencrypt/live/xfinds.cc/fullchain.pem ]; then
    echo "开始获取 SSL 证书..."
    certbot certonly --webroot \
        -w /var/www/certbot \
        -d xfinds.cc \
        -d www.xfinds.cc \
        --email admin@xfinds.cc \
        --agree-tos \
        --non-interactive
    
    if [ $? -eq 0 ]; then
        echo "SSL 证书获取成功！"
    else
        echo "SSL 证书获取失败，请检查："
        echo "1. 域名 DNS 是否已正确解析"
        echo "2. 80 端口是否已开放"
        echo "3. Nginx 是否正常运行"
        exit 1
    fi
else
    echo "SSL 证书已存在"
fi

# 步骤 3: 更新为完整的 HTTPS 配置
echo ""
echo "=== 步骤 3: 更新为完整的 HTTPS 配置 ==="
cp nginx.conf /etc/nginx/sites-available/xfinds

# 测试 HTTPS 配置
echo "测试 HTTPS Nginx 配置..."
nginx -t

if [ $? -eq 0 ]; then
    echo "配置测试通过，重新加载 Nginx..."
    systemctl reload nginx
    echo "Nginx 已重新加载"
else
    echo "配置测试失败，请检查错误信息"
    exit 1
fi

# 步骤 4: 配置防火墙
echo ""
echo "=== 步骤 4: 配置防火墙 ==="
ufw allow 80/tcp 2>/dev/null || firewall-cmd --permanent --add-port=80/tcp 2>/dev/null || true
ufw allow 443/tcp 2>/dev/null || firewall-cmd --permanent --add-port=443/tcp 2>/dev/null || true
ufw reload 2>/dev/null || firewall-cmd --reload 2>/dev/null || true
echo "防火墙已配置"

# 步骤 5: 验证
echo ""
echo "=========================================="
echo "验证配置"
echo "=========================================="

echo ""
echo "检查 Nginx 状态..."
systemctl status nginx --no-pager -l | head -5

echo ""
echo "检查端口监听..."
netstat -tulpn | grep -E ':(80|443)' || ss -tulpn | grep -E ':(80|443)'

echo ""
echo "检查 SSL 证书..."
certbot certificates

echo ""
echo "测试 HTTPS 连接..."
curl -I https://xfinds.cc 2>&1 | head -5 || echo "HTTPS 连接测试失败"

echo ""
echo "=========================================="
echo "修复完成！"
echo "=========================================="
echo ""
echo "访问地址: https://xfinds.cc"
echo ""
echo "如果仍有问题，请检查："
echo "1. 域名 DNS 解析: nslookup xfinds.cc"
echo "2. Nginx 日志: tail -f /var/log/nginx/error.log"
echo "3. 防火墙状态: ufw status"

