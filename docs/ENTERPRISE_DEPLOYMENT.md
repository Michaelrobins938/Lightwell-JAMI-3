# 🚀 Enterprise Deployment Guide for Luna AI

This guide provides comprehensive instructions for deploying Luna AI as an enterprise-grade production system.

## 📋 Prerequisites

### System Requirements
- **CPU**: 4+ cores (8+ recommended)
- **RAM**: 16GB+ (32GB recommended)
- **Storage**: 100GB+ SSD
- **OS**: Ubuntu 20.04+ or CentOS 8+
- **Docker**: 20.10+
- **Docker Compose**: 2.0+

### Network Requirements
- **Domain**: SSL certificate for your domain
- **Firewall**: Configured for ports 80, 443, 3000, 5432, 6379
- **Load Balancer**: Optional but recommended for high availability

## 🔧 Environment Setup

### 1. Create Environment File
```bash
# Copy the production environment template
cp env.example .env.production

# Edit with your production values
nano .env.production
```

### 2. Required Environment Variables
```env
# Database
DB_PASSWORD=your_secure_database_password
DATABASE_URL=postgresql://luna_user:your_secure_database_password@postgres:5432/luna

# Security
JWT_SECRET=your_super_secure_jwt_secret_minimum_32_characters
NODE_ENV=production

# AI Services
GROQ_API_KEY=your_groq_api_key
OPENAI_API_KEY=your_openai_api_key

# Payment Processing
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key

# Redis
REDIS_PASSWORD=your_secure_redis_password
REDIS_URL=redis://:your_secure_redis_password@redis:6379

# Monitoring
GRAFANA_PASSWORD=your_secure_grafana_password

# Application
NEXT_PUBLIC_BASE_URL=https://your-domain.com
```

### 3. SSL Certificate Setup
```bash
# Create SSL directory
mkdir -p ssl

# For Let's Encrypt (recommended)
sudo certbot certonly --standalone -d your-domain.com

# Copy certificates
sudo cp /etc/letsencrypt/live/your-domain.com/fullchain.pem ssl/
sudo cp /etc/letsencrypt/live/your-domain.com/privkey.pem ssl/
sudo chown $USER:$USER ssl/*
```

## 🐳 Docker Deployment

### 1. Build and Deploy
```bash
# Build the application
docker-compose -f docker-compose.prod.yml build

# Start all services
docker-compose -f docker-compose.prod.yml up -d

# Check service status
docker-compose -f docker-compose.prod.yml ps

# View logs
docker-compose -f docker-compose.prod.yml logs -f luna-app
```

### 2. Database Migration
```bash
# Run database migrations
docker-compose -f docker-compose.prod.yml exec luna-app npx prisma migrate deploy

# Generate Prisma client
docker-compose -f docker-compose.prod.yml exec luna-app npx prisma generate
```

### 3. Health Check
```bash
# Check application health
curl https://your-domain.com/api/health

# Check all services
docker-compose -f docker-compose.prod.yml ps
```

## 📊 Monitoring Setup

### 1. Access Monitoring Dashboards
- **Grafana**: http://your-domain.com:3001 (admin / your_grafana_password)
- **Prometheus**: http://your-domain.com:9090
- **Kibana**: http://your-domain.com:5601

### 2. Configure Grafana Dashboards
```bash
# Copy dashboard configurations
cp -r grafana/provisioning /path/to/grafana/

# Restart Grafana
docker-compose -f docker-compose.prod.yml restart grafana
```

### 3. Set Up Alerts
```yaml
# prometheus/alerts.yml
groups:
  - name: luna_alerts
    rules:
      - alert: LunaAppDown
        expr: up{job="luna-app"} == 0
        for: 1m
        labels:
          severity: critical
        annotations:
          summary: "Luna application is down"
          description: "Luna application has been down for more than 1 minute"

      - alert: HighResponseTime
        expr: http_request_duration_seconds{job="luna-app"} > 5
        for: 5m
        labels:
          severity: warning
        annotations:
          summary: "High response time detected"
          description: "Response time is above 5 seconds"
```

## 🔒 Security Configuration

### 1. Firewall Setup
```bash
# UFW Firewall Configuration
sudo ufw allow 22/tcp
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw allow 3000/tcp
sudo ufw enable
```

### 2. Nginx Security Headers
```nginx
# nginx.conf
server {
    listen 443 ssl http2;
    server_name your-domain.com;

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;
    add_header Content-Security-Policy "default-src 'self' http: https: data: blob: 'unsafe-inline'" always;
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;

    # SSL configuration
    ssl_certificate /etc/nginx/ssl/fullchain.pem;
    ssl_certificate_key /etc/nginx/ssl/privkey.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-RSA-AES256-GCM-SHA512:DHE-RSA-AES256-GCM-SHA512:ECDHE-RSA-AES256-GCM-SHA384:DHE-RSA-AES256-GCM-SHA384;
    ssl_prefer_server_ciphers off;

    # Rate limiting
    limit_req_zone $binary_remote_addr zone=api:10m rate=10r/s;
    limit_req zone=api burst=20 nodelay;

    location / {
        proxy_pass http://luna-app:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

### 3. Database Security
```sql
-- init-db.sql
CREATE DATABASE luna;
CREATE USER luna_user WITH PASSWORD 'your_secure_password';
GRANT ALL PRIVILEGES ON DATABASE luna TO luna_user;

-- Enable SSL
ALTER SYSTEM SET ssl = on;
ALTER SYSTEM SET ssl_cert_file = '/etc/ssl/certs/ssl-cert-snakeoil.pem';
ALTER SYSTEM SET ssl_key_file = '/etc/ssl/private/ssl-cert-snakeoil.key';
SELECT pg_reload_conf();
```

## 🔄 Backup and Recovery

### 1. Automated Backups
```bash
# Create backup script
cat > backup.sh << 'EOF'
#!/bin/bash
BACKUP_DIR="/backup"
DATE=$(date +%Y%m%d_%H%M%S)
docker-compose -f docker-compose.prod.yml exec -T postgres pg_dump -U luna_user luna > $BACKUP_DIR/luna_backup_$DATE.sql

# Keep only last 7 days of backups
find $BACKUP_DIR -name "luna_backup_*.sql" -mtime +7 -delete
EOF

chmod +x backup.sh

# Add to crontab
echo "0 2 * * * /path/to/backup.sh" | crontab -
```

### 2. Recovery Procedure
```bash
# Stop application
docker-compose -f docker-compose.prod.yml down

# Restore database
docker-compose -f docker-compose.prod.yml exec -T postgres psql -U luna_user luna < backup/luna_backup_YYYYMMDD_HHMMSS.sql

# Restart application
docker-compose -f docker-compose.prod.yml up -d
```

## 📈 Performance Optimization

### 1. Database Optimization
```sql
-- PostgreSQL optimizations
ALTER SYSTEM SET shared_buffers = '256MB';
ALTER SYSTEM SET effective_cache_size = '1GB';
ALTER SYSTEM SET maintenance_work_mem = '64MB';
ALTER SYSTEM SET checkpoint_completion_target = 0.9;
ALTER SYSTEM SET wal_buffers = '16MB';
ALTER SYSTEM SET default_statistics_target = 100;
SELECT pg_reload_conf();
```

### 2. Application Optimization
```javascript
// next.config.js optimizations
module.exports = {
  experimental: {
    optimizeCss: true,
    optimizeImages: true,
  },
  compress: true,
  poweredByHeader: false,
  generateEtags: false,
}
```

### 3. Redis Optimization
```bash
# redis.conf optimizations
maxmemory 512mb
maxmemory-policy allkeys-lru
save 900 1
save 300 10
save 60 10000
```

## 🚨 Incident Response

### 1. Emergency Procedures
```bash
# Emergency shutdown
docker-compose -f docker-compose.prod.yml down

# Emergency restart
docker-compose -f docker-compose.prod.yml up -d

# Check logs
docker-compose -f docker-compose.prod.yml logs -f

# Database emergency
docker-compose -f docker-compose.prod.yml exec postgres psql -U luna_user luna
```

### 2. Monitoring Alerts
- Set up email/SMS alerts for critical issues
- Configure on-call rotation
- Document escalation procedures

## 🔧 Maintenance

### 1. Regular Maintenance Tasks
```bash
# Weekly tasks
docker system prune -f
docker volume prune -f

# Monthly tasks
docker-compose -f docker-compose.prod.yml pull
docker-compose -f docker-compose.prod.yml up -d

# Quarterly tasks
Review and update SSL certificates
Update security patches
Review and update dependencies
```

### 2. Log Rotation
```bash
# Configure logrotate
cat > /etc/logrotate.d/luna << 'EOF'
/var/log/luna/*.log {
    daily
    missingok
    rotate 52
    compress
    delaycompress
    notifempty
    create 644 root root
}
EOF
```

## 📊 Health Monitoring

### 1. Key Metrics to Monitor
- **Application**: Response time, error rate, uptime
- **Database**: Connection count, query performance, disk usage
- **AI Service**: API response times, token usage, error rates
- **System**: CPU, memory, disk, network usage

### 2. Alert Thresholds
- Response time > 5 seconds
- Error rate > 5%
- CPU usage > 80%
- Memory usage > 85%
- Disk usage > 90%

## 🎯 Success Criteria

Your deployment is successful when:
- ✅ Application responds within 2 seconds
- ✅ All health checks pass
- ✅ SSL certificate is valid
- ✅ Monitoring dashboards are accessible
- ✅ Backups are running successfully
- ✅ Security headers are properly configured
- ✅ Rate limiting is active
- ✅ Logs are being collected

## 📞 Support

For enterprise support:
- **Documentation**: Check this guide and inline code comments
- **Monitoring**: Use Grafana and Kibana dashboards
- **Logs**: Check application and system logs
- **Health**: Use `/api/health` endpoint for system status

---

**Enterprise Deployment Complete! 🚀✨** 