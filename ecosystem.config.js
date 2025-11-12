// PM2 生态系统配置文件
// 用于确保应用自动重启和健康检查

module.exports = {
  apps: [
    {
      name: 'xfinds',
      script: 'npm',
      args: 'start',
      cwd: '/var/www/xfinds',
      instances: 1,
      exec_mode: 'fork',
      
      // 自动重启配置
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      
      // 环境变量
      env: {
        NODE_ENV: 'production',
        PORT: 8000,
      },
      
      // 日志配置
      error_file: '/root/.pm2/logs/xfinds-error.log',
      out_file: '/root/.pm2/logs/xfinds-out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      merge_logs: true,
      
      // 重启策略
      min_uptime: '10s',
      max_restarts: 10,
      restart_delay: 4000,
      
      // 健康检查（如果应用支持）
      // 注意：Next.js 默认不提供健康检查端点，这里使用端口检查
      // 如果需要，可以在应用中添加 /api/health 端点
    },
  ],
}

