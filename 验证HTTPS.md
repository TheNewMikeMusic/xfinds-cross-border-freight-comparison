# HTTPS 验证和测试

## 当前状态

根据您的输出，HTTPS 配置已成功完成：

✅ SSL 证书已获取
✅ Nginx 正在监听 80 和 443 端口
✅ 证书有效期：89 天（到 2026-02-10）
✅ 防火墙已配置

## 完整验证命令

在服务器上执行以下命令进行完整验证：

```bash
# 1. 测试 HTTPS 连接（完整响应）
curl -I https://xfinds.cc

# 2. 测试 HTTP 重定向到 HTTPS
curl -I http://xfinds.cc

# 3. 检查 SSL 证书详细信息
openssl s_client -connect xfinds.cc:443 -servername xfinds.cc < /dev/null 2>/dev/null | openssl x509 -noout -dates -subject

# 4. 检查 Nginx 状态
systemctl status nginx

# 5. 检查应用是否在 8000 端口运行
netstat -tulpn | grep 8000
# 或
ss -tulpn | grep 8000

# 6. 检查 PM2 状态
pm2 status

# 7. 测试本地应用连接
curl http://localhost:8000
```

## 浏览器验证

1. 访问 `https://xfinds.cc`
2. 检查浏览器地址栏的锁图标
3. 点击锁图标查看证书详情
4. 确认证书颁发机构是 Let's Encrypt

## 预期结果

### curl HTTPS 测试应该返回：
```
HTTP/2 200
server: nginx/1.22.1
date: ...
content-type: text/html
...
```

### curl HTTP 测试应该返回：
```
HTTP/1.1 301 Moved Permanently
Location: https://xfinds.cc/...
```

## 如果 HTTPS 访问正常

恭喜！您的 HTTPS 配置已完全成功。现在可以：

1. ✅ 通过 `https://xfinds.cc` 访问应用
2. ✅ HTTP 会自动重定向到 HTTPS
3. ✅ SSL 证书会自动续期（Certbot 已配置）

## 如果还有问题

### 问题：HTTPS 连接超时
- 检查云服务商安全组是否开放 443 端口
- 检查服务器防火墙：`ufw status`

### 问题：证书错误
- 检查证书路径：`ls -la /etc/letsencrypt/live/xfinds.cc/`
- 重新加载 Nginx：`systemctl reload nginx`

### 问题：应用无法访问
- 检查应用是否运行：`pm2 status`
- 检查应用日志：`pm2 logs xfinds`
- 检查 Nginx 日志：`tail -f /var/log/nginx/error.log`

