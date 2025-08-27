# 🚀 Luna Platform - Production Deployment Guide

## 📋 Table of Contents

1. [Prerequisites](#prerequisites)
2. [Environment Setup](#environment-setup)
3. [Security Configuration](#security-configuration)
4. [Database Setup](#database-setup)
5. [AI Service Configuration](#ai-service-configuration)
6. [Deployment Options](#deployment-options)
7. [Monitoring & Alerting](#monitoring--alerting)
8. [Maintenance Procedures](#maintenance-procedures)
9. [Troubleshooting](#troubleshooting)
10. [Emergency Procedures](#emergency-procedures)

---

## 🔧 Prerequisites

### System Requirements
- **Node.js**: 18.x or higher
- **PostgreSQL**: 15.x or higher
- **Redis**: 7.x or higher (for caching)
- **Docker**: 20.x or higher (optional)
- **SSL Certificate**: Valid SSL certificate for production
- **Domain**: Registered domain name

### Required Services
- **AI Provider**: Groq API account with sufficient credits
- **Email Service**: SMTP provider (SendGrid, AWS SES, etc.)
- **Payment Processing**: Stripe account for donations
- **Monitoring**: Prometheus, Grafana, or similar
- **Logging**: ELK stack or cloud logging service

---

## 🌍 Environment Setup

### 1. Environment Variables

Create `.env.production` file:

```bash
# Application
NODE_ENV=production
PORT=3000
BASE_URL=https://your-domain.com

# Database
DATABASE_URL=postgresql://username:password@host:5432/luna_production
DB_PASSWORD=your-secure-db-password

# Authentication
JWT_SECRET=your-super-secure-jwt-secret-key
JWT_EXPIRES_IN=7d

# AI Services
GROQ_API_KEY=your-groq-api-key
GROQ_API_URL=https://api.groq.com/openai/v1
GROQ_MODEL=llama3-70b-8192

# Payment Processing
STRIPE_SECRET_KEY=sk_live_your-stripe-secret-key
STRIPE_WEBHOOK_SECRET=whsec_your-webhook-secret
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_your-publishable-key

# Email Service
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_USER=apikey
SMTP_PASS=your-sendgrid-api-key
EMAIL_FROM=noreply@your-domain.com

# Redis (for caching)
REDIS_URL=redis://localhost:6379
REDIS_PASSWORD=your-redis-password

# Monitoring
SENTRY_DSN=your-sentry-dsn
LOG_LEVEL=info

# Security
CORS_ORIGIN=https://your-domain.com
RATE_LIMIT_WINDOW=60000
RATE_LIMIT_MAX=100

# Crisis Intervention
CRISIS_HOTLINE_NUMBER=988
EMERGENCY_CONTACTS=["911", "988", "1-800-273-8255"]
```

### 2. SSL Configuration

#### Using Let's Encrypt (Recommended)
```bash
# Install Certbot
sudo apt-get update
sudo apt-get install certbot

# Obtain certificate
sudo certbot certonly --standalone -d your-domain.com

# Auto-renewal
sudo crontab -e
# Add: 0 12 * * * /usr/bin/certbot renew --quiet
```

#### Using Cloudflare (Alternative)
1. Add domain to Cloudflare
2. Enable SSL/TLS encryption mode: "Full (strict)"
3. Configure DNS records

---

## 🔒 Security Configuration

### 1. Security Headers

Update `next.config.js`:

```javascript
const securityHeaders = [
  {
    key: 'X-DNS-Prefetch-Control',
    value: 'on'
  },
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=63072000; includeSubDomains; preload'
  },
  {
    key: 'X-XSS-Protection',
    value: '1; mode=block'
  },
  {
    key: 'X-Frame-Options',
    value: 'SAMEORIGIN'
  },
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff'
  },
  {
    key: 'Referrer-Policy',
    value: 'origin-when-cross-origin'
  },
  {
    key: 'Content-Security-Policy',
    value: "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' https://api.groq.com https://api.stripe.com; frame-src 'self' https://js.stripe.com;"
  }
];

module.exports = {
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: securityHeaders,
      },
    ];
  },
  // ... other config
};
```

### 2. Rate Limiting

Configure rate limiting in `src/middleware/security.ts`:

```typescript
// Production rate limiting
const RATE_LIMIT_WINDOW = 60000; // 1 minute
const MAX_REQUESTS_PER_WINDOW = 100;
const MAX_REQUESTS_PER_IP = 50;
const CRISIS_ENDPOINTS = ['/api/crisis-intervention', '/api/emergency'];
const CRISIS_RATE_LIMIT = 10; // Allow more requests for crisis endpoints
```

### 3. Input Validation

Implement comprehensive input validation:

```typescript
// src/middleware/validation.ts
export const validateCrisisInput = (input: any) => {
  const errors: string[] = [];
  
  if (!input.message || typeof input.message !== 'string') {
    errors.push('Message is required and must be a string');
  }
  
  if (input.message && input.message.length > 1000) {
    errors.push('Message must be less than 1000 characters');
  }
  
  // Check for potential crisis keywords
  const crisisKeywords = ['suicide', 'kill myself', 'want to die', 'end it all'];
  const hasCrisisKeywords = crisisKeywords.some(keyword => 
    input.message.toLowerCase().includes(keyword)
  );
  
  if (hasCrisisKeywords) {
    // Log for crisis intervention
    logger.warn('Crisis keywords detected', { message: input.message });
  }
  
  return { isValid: errors.length === 0, errors };
};
```

---

## 🗄️ Database Setup

### 1. PostgreSQL Configuration

```sql
-- Create production database
CREATE DATABASE luna_production;

-- Create user with limited permissions
CREATE USER luna_user WITH PASSWORD 'your-secure-password';
GRANT CONNECT ON DATABASE luna_production TO luna_user;
GRANT USAGE ON SCHEMA public TO luna_user;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO luna_user;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO luna_user;

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
```

### 2. Database Migrations

```bash
# Run migrations
npx prisma migrate deploy

# Generate Prisma client
npx prisma generate

# Seed production data (if needed)
npx prisma db seed
```

### 3. Database Backup Strategy

```bash
#!/bin/bash
# backup-database.sh

DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/backups"
DB_NAME="luna_production"
DB_USER="luna_user"

# Create backup
pg_dump -h localhost -U $DB_USER -d $DB_NAME > $BACKUP_DIR/luna_backup_$DATE.sql

# Compress backup
gzip $BACKUP_DIR/luna_backup_$DATE.sql

# Keep only last 7 days of backups
find $BACKUP_DIR -name "luna_backup_*.sql.gz" -mtime +7 -delete

# Upload to cloud storage (optional)
aws s3 cp $BACKUP_DIR/luna_backup_$DATE.sql.gz s3://your-backup-bucket/
```

---

## 🤖 AI Service Configuration

### 1. Groq API Setup

```typescript
// src/config/ai.ts
export const aiConfig = {
  groq: {
    apiKey: process.env.GROQ_API_KEY,
    apiUrl: process.env.GROQ_API_URL || 'https://api.groq.com/openai/v1',
    model: process.env.GROQ_MODEL || 'llama3-70b-8192',
    maxTokens: 4096,
    temperature: 0.7,
    timeout: 30000,
    retries: 3
  },
  fallback: {
    enabled: true,
    provider: 'openai', // Fallback to OpenAI if Groq fails
    apiKey: process.env.OPENAI_API_KEY,
    model: 'gpt-4'
  }
};
```

### 2. Crisis Detection Configuration

```typescript
// src/ai/crisis_intervention_system.ts
export const crisisConfig = {
  keywords: [
    'suicide', 'kill myself', 'want to die', 'end it all',
    'no reason to live', 'better off dead', 'hurt myself',
    'self harm', 'cut myself', 'overdose'
  ],
  severityLevels: {
    low: ['sad', 'depressed', 'lonely'],
    medium: ['hopeless', 'worthless', 'tired of life'],
    high: ['want to die', 'kill myself', 'end it all'],
    critical: ['going to kill myself', 'suicide plan', 'final goodbye']
  },
  responseThresholds: {
    low: 0.3,
    medium: 0.5,
    high: 0.7,
    critical: 0.9
  }
};
```

---

## 🚀 Deployment Options

### Option 1: Docker Deployment (Recommended)

```bash
# Build production image
docker build -t luna-ai:latest .

# Run with docker-compose
docker-compose -f docker-compose.prod.yml up -d

# Check status
docker-compose -f docker-compose.prod.yml ps
```

### Option 2: Vercel Deployment

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod

# Set environment variables
vercel env add DATABASE_URL
vercel env add GROQ_API_KEY
# ... add all other env vars
```

### Option 3: AWS ECS Deployment

```yaml
# task-definition.json
{
  "family": "luna-ai",
  "networkMode": "awsvpc",
  "requiresCompatibilities": ["FARGATE"],
  "cpu": "1024",
  "memory": "2048",
  "executionRoleArn": "arn:aws:iam::account:role/ecsTaskExecutionRole",
  "containerDefinitions": [
    {
      "name": "luna-app",
      "image": "your-registry/luna-ai:latest",
      "portMappings": [
        {
          "containerPort": 3000,
          "protocol": "tcp"
        }
      ],
      "environment": [
        {
          "name": "NODE_ENV",
          "value": "production"
        }
      ],
      "secrets": [
        {
          "name": "DATABASE_URL",
          "valueFrom": "arn:aws:secretsmanager:region:account:secret:luna/database-url"
        }
      ],
      "logConfiguration": {
        "logDriver": "awslogs",
        "options": {
          "awslogs-group": "/ecs/luna-ai",
          "awslogs-region": "us-east-1",
          "awslogs-stream-prefix": "ecs"
        }
      }
    }
  ]
}
```

---

## 📊 Monitoring & Alerting

### 1. Health Check Endpoint

```typescript
// src/pages/api/health.ts
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const startTime = Date.now();
  
  try {
    // Check database connectivity
    const dbHealth = await checkDatabaseHealth();
    
    // Check AI service connectivity
    const aiHealth = await checkAIServiceHealth();
    
    // Check crisis intervention system
    const crisisHealth = await checkCrisisInterventionHealth();
    
    // Check authentication system
    const authHealth = await checkAuthenticationHealth();
    
    const responseTime = Date.now() - startTime;
    
    const health = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      responseTime,
      services: {
        database: dbHealth,
        ai: aiHealth,
        crisis: crisisHealth,
        auth: authHealth
      },
      version: process.env.npm_package_version,
      environment: process.env.NODE_ENV
    };
    
    const isHealthy = Object.values(health.services).every(service => service.status === 'healthy');
    
    res.status(isHealthy ? 200 : 503).json(health);
  } catch (error) {
    res.status(503).json({
      status: 'unhealthy',
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
}
```

### 2. Prometheus Metrics

```typescript
// src/services/metrics.ts
import { register, Counter, Histogram, Gauge } from 'prom-client';

// Define metrics
export const metrics = {
  httpRequestsTotal: new Counter({
    name: 'http_requests_total',
    help: 'Total number of HTTP requests',
    labelNames: ['method', 'route', 'status']
  }),
  
  httpRequestDuration: new Histogram({
    name: 'http_request_duration_seconds',
    help: 'HTTP request duration in seconds',
    labelNames: ['method', 'route']
  }),
  
  aiRequestsTotal: new Counter({
    name: 'ai_requests_total',
    help: 'Total number of AI requests',
    labelNames: ['model', 'status']
  }),
  
  crisisInterventionsTotal: new Counter({
    name: 'crisis_interventions_total',
    help: 'Total number of crisis interventions',
    labelNames: ['severity', 'action']
  }),
  
  activeUsers: new Gauge({
    name: 'active_users',
    help: 'Number of currently active users'
  })
};

// Metrics endpoint
export async function metricsHandler(req: NextApiRequest, res: NextApiResponse) {
  res.setHeader('Content-Type', register.contentType);
  res.end(await register.metrics());
}
```

### 3. Alerting Rules

```yaml
# prometheus/alerts.yml
groups:
  - name: luna-alerts
    rules:
      - alert: HighErrorRate
        expr: rate(http_requests_total{status=~"5.."}[5m]) > 0.1
        for: 2m
        labels:
          severity: critical
        annotations:
          summary: "High error rate detected"
          
      - alert: CrisisInterventionHigh
        expr: rate(crisis_interventions_total[5m]) > 0.5
        for: 1m
        labels:
          severity: critical
        annotations:
          summary: "High number of crisis interventions"
          
      - alert: AIServiceDown
        expr: up{job="luna-ai"} == 0
        for: 1m
        labels:
          severity: critical
        annotations:
          summary: "AI service is down"
```

---

## 🔧 Maintenance Procedures

### 1. Database Maintenance

```bash
#!/bin/bash
# maintenance.sh

# Vacuum database
psql -h localhost -U luna_user -d luna_production -c "VACUUM ANALYZE;"

# Update statistics
psql -h localhost -U luna_user -d luna_production -c "ANALYZE;"

# Check for long-running queries
psql -h localhost -U luna_user -d luna_production -c "
SELECT pid, now() - pg_stat_activity.query_start AS duration, query 
FROM pg_stat_activity 
WHERE (now() - pg_stat_activity.query_start) > interval '5 minutes';
"
```

### 2. Log Rotation

```bash
# /etc/logrotate.d/luna
/var/log/luna/*.log {
    daily
    missingok
    rotate 30
    compress
    delaycompress
    notifempty
    create 644 luna luna
    postrotate
        systemctl reload luna
    endscript
}
```

### 3. SSL Certificate Renewal

```bash
#!/bin/bash
# renew-ssl.sh

# Renew certificates
certbot renew

# Reload nginx
systemctl reload nginx

# Check certificate status
openssl x509 -in /etc/letsencrypt/live/your-domain.com/fullchain.pem -text -noout | grep "Not After"
```

---

## 🚨 Troubleshooting

### Common Issues

#### 1. Database Connection Issues
```bash
# Check database connectivity
psql -h localhost -U luna_user -d luna_production -c "SELECT 1;"

# Check connection pool
psql -h localhost -U luna_user -d luna_production -c "
SELECT count(*) as active_connections 
FROM pg_stat_activity 
WHERE state = 'active';
"
```

#### 2. AI Service Issues
```bash
# Test Groq API
curl -H "Authorization: Bearer $GROQ_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"model":"llama3-70b-8192","messages":[{"role":"user","content":"Hello"}]}' \
  https://api.groq.com/openai/v1/chat/completions
```

#### 3. Memory Issues
```bash
# Check memory usage
free -h

# Check Node.js memory
node -e "console.log(process.memoryUsage())"

# Restart if needed
systemctl restart luna
```

### Performance Optimization

#### 1. Database Optimization
```sql
-- Create indexes for frequently queried columns
CREATE INDEX CONCURRENTLY idx_users_email ON users(email);
CREATE INDEX CONCURRENTLY idx_chat_history_user_id ON chat_history(user_id);
CREATE INDEX CONCURRENTLY idx_mood_entries_user_id ON mood_entries(user_id);

-- Analyze table statistics
ANALYZE users;
ANALYZE chat_history;
ANALYZE mood_entries;
```

#### 2. Caching Strategy
```typescript
// Redis caching configuration
export const cacheConfig = {
  ttl: {
    userSession: 3600, // 1 hour
    aiResponse: 300,    // 5 minutes
    crisisResources: 86400, // 24 hours
    staticContent: 604800 // 1 week
  },
  keys: {
    userSession: (userId: string) => `session:${userId}`,
    aiResponse: (hash: string) => `ai:${hash}`,
    crisisResources: 'crisis:resources'
  }
};
```

---

## 🆘 Emergency Procedures

### 1. Crisis Intervention Failure

```typescript
// Emergency fallback for crisis intervention
export const emergencyCrisisFallback = async (userId: string, message: string) => {
  // 1. Immediately show crisis resources
  await showCrisisResources();
  
  // 2. Attempt to contact emergency services
  await contactEmergencyServices(userId);
  
  // 3. Log the incident
  logger.critical('Crisis intervention system failure', {
    userId,
    message,
    timestamp: new Date()
  });
  
  // 4. Notify administrators
  await notifyAdministrators('CRISIS_SYSTEM_FAILURE', {
    userId,
    message,
    timestamp: new Date()
  });
};
```

### 2. System Outage Recovery

```bash
#!/bin/bash
# emergency-recovery.sh

# 1. Check system status
systemctl status luna

# 2. Restart services if needed
systemctl restart luna
systemctl restart postgresql
systemctl restart redis

# 3. Check database connectivity
psql -h localhost -U luna_user -d luna_production -c "SELECT 1;"

# 4. Verify AI service
curl -H "Authorization: Bearer $GROQ_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"model":"llama3-70b-8192","messages":[{"role":"user","content":"test"}]}' \
  https://api.groq.com/openai/v1/chat/completions

# 5. Check logs
tail -f /var/log/luna/error.log
```

### 3. Data Breach Response

```typescript
// Data breach response procedures
export const dataBreachResponse = async (incident: DataBreachIncident) => {
  // 1. Immediately isolate affected systems
  await isolateAffectedSystems(incident);
  
  // 2. Preserve evidence
  await preserveEvidence(incident);
  
  // 3. Notify authorities (if required)
  await notifyAuthorities(incident);
  
  // 4. Notify affected users
  await notifyAffectedUsers(incident);
  
  // 5. Implement security measures
  await implementSecurityMeasures(incident);
  
  // 6. Document incident
  await documentIncident(incident);
};
```

---

## 📈 Performance Monitoring

### 1. Key Performance Indicators (KPIs)

- **Response Time**: Target < 500ms for API calls
- **Uptime**: Target 99.9% availability
- **Error Rate**: Target < 0.1% error rate
- **Crisis Response Time**: Target < 200ms for crisis interventions
- **AI Response Quality**: Monitor therapeutic effectiveness
- **User Engagement**: Track session duration and return rates

### 2. Monitoring Dashboard

```typescript
// src/pages/api/metrics-dashboard.ts
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const metrics = {
    performance: {
      averageResponseTime: await getAverageResponseTime(),
      errorRate: await getErrorRate(),
      uptime: await getUptime()
    },
    therapeutic: {
      crisisInterventions: await getCrisisInterventionCount(),
      averageSessionDuration: await getAverageSessionDuration(),
      userSatisfaction: await getUserSatisfaction()
    },
    system: {
      cpuUsage: await getCPUUsage(),
      memoryUsage: await getMemoryUsage(),
      databaseConnections: await getDatabaseConnections()
    }
  };
  
  res.json(metrics);
}
```

---

## 🔄 Continuous Deployment

### 1. GitHub Actions Workflow

```yaml
# .github/workflows/deploy.yml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18'
          
      - name: Install dependencies
        run: npm ci
        
      - name: Run tests
        run: npm test
        
      - name: Build application
        run: npm run build
        
      - name: Deploy to production
        run: |
          # Your deployment commands here
          docker-compose -f docker-compose.prod.yml up -d
          
      - name: Run health checks
        run: |
          # Wait for deployment
          sleep 30
          
          # Check health endpoint
          curl -f http://localhost:3000/api/health
          
      - name: Notify deployment
        if: success()
        run: |
          # Send notification
          curl -X POST $SLACK_WEBHOOK_URL \
            -H 'Content-type: application/json' \
            -d '{"text":"Production deployment successful"}'
```

---

## 📚 Additional Resources

- [Luna Architecture Documentation](./ARCHITECTURE.md)
- [API Documentation](./docs/api.md)
- [Security Guidelines](./SECURITY.md)
- [Monitoring Setup](./MONITORING.md)
- [Emergency Contacts](./EMERGENCY.md)

---

## 🆘 Support

For deployment support:
- **Email**: support@luna-ai.com
- **Slack**: #luna-deployment
- **Documentation**: https://docs.luna-ai.com
- **Emergency**: +1-800-LUNA-AI

---

*Last updated: January 2025*
*Version: 1.0.0* 