# Deployment Guide

This guide covers comprehensive deployment strategies for the Next.js boilerplate project, including different environments, platforms, and best practices.

## Table of Contents

1. [Deployment Overview](#deployment-overview)
2. [Environment Configuration](#environment-configuration)
3. [Local Development](#local-development)
4. [Staging Environment](#staging-environment)
5. [Production Environment](#production-environment)
6. [Platform-Specific Deployment](#platform-specific-deployment)
7. [Database Deployment](#database-deployment)
8. [Monitoring and Observability](#monitoring-and-observability)
9. [Security Considerations](#security-considerations)
10. [Performance Optimization](#performance-optimization)
11. [Rollback Strategies](#rollback-strategies)
12. [Troubleshooting](#troubleshooting)

## Deployment Overview

### Deployment Architecture

The Next.js boilerplate is designed for deployment across multiple environments:

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Development   │    │     Staging     │    │   Production    │
│   Environment   │    │   Environment   │    │   Environment   │
├─────────────────┤    ├─────────────────┤    ├─────────────────┤
│ Local Database  │    │ Staging DB      │    │ Production DB   │
│ Local Redis     │    │ Staging Redis   │    │ Production Redis│
│ Local Sentry    │    │ Staging Sentry  │    │ Production Sentry│
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### Deployment Checklist

- [ ] Environment variables configured
- [ ] Database migrations applied
- [ ] SSL certificates installed
- [ ] Domain and DNS configured
- [ ] Monitoring tools set up
- [ ] Backup strategies implemented
- [ ] Security headers configured
- [ ] Performance monitoring enabled

## Environment Configuration

### Environment Files Structure

```
project-root/
├── .env                    # Production defaults (gitignored)
├── .env.local             # Local overrides (gitignored)
├── .env.staging           # Staging configuration (gitignored)
├── .env.production        # Production configuration (gitignored)
├── env.example            # Template for production
└── env.local.example      # Template for local development
```

### Environment Variables by Environment

#### Development Environment

```bash
# .env.local
NODE_ENV=development
DATABASE_URL=postgresql://username:password@localhost:5432/next_boiler_dev
REDIS_URL=redis://localhost:6379
SENTRY_DSN=your-dev-sentry-dsn
JWT_SECRET=dev-jwt-secret-key
JWT_REFRESH_SECRET=dev-refresh-secret-key
COOKIE_SECRET=dev-cookie-secret
```

#### Staging Environment

```bash
# .env.staging
NODE_ENV=staging
DATABASE_URL=postgresql://username:password@staging-db:5432/next_boiler_staging
REDIS_URL=redis://staging-redis:6379
SENTRY_DSN=your-staging-sentry-dsn
JWT_SECRET=staging-jwt-secret-key
JWT_REFRESH_SECRET=staging-refresh-secret-key
COOKIE_SECRET=staging-cookie-secret
APP_URL=https://staging.yourapp.com
```

#### Production Environment

```bash
# .env.production
NODE_ENV=production
DATABASE_URL=postgresql://username:password@production-db:5432/next_boiler_prod
REDIS_URL=redis://production-redis:6379
SENTRY_DSN=your-production-sentry-dsn
JWT_SECRET=production-jwt-secret-key
JWT_REFRESH_SECRET=production-refresh-secret-key
COOKIE_SECRET=production-cookie-secret
APP_URL=https://yourapp.com
```

### Environment Validation

```typescript
// lib/env-validation.ts
import { z } from 'zod';

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'staging', 'production']),
  DATABASE_URL: z.string().url(),
  JWT_SECRET: z.string().min(32),
  JWT_REFRESH_SECRET: z.string().min(32),
  COOKIE_SECRET: z.string().min(32),
  APP_URL: z.string().url(),
  SENTRY_DSN: z.string().optional(),
  REDIS_URL: z.string().optional(),
});

export function validateEnv() {
  const env = envSchema.parse(process.env);
  return env;
}
```

## Local Development

### Prerequisites

```bash
# Install dependencies
npm install

# Install development tools
npm install -g nodemon pm2
```

### Local Setup

```bash
# 1. Copy environment files
cp env.example .env
cp env.local.example .env.local

# 2. Start local services
brew services start postgresql
brew services start redis

# 3. Create database
createdb next_boiler_dev

# 4. Run migrations
npm run db:migrate

# 5. Generate types
npm run db:generate

# 6. Start development server
npm run dev
```

### Local Development Scripts

```json
{
  "scripts": {
    "dev": "next dev --turbopack",
    "dev:debug": "NODE_OPTIONS='--inspect' next dev",
    "dev:profile": "next dev --profile",
    "build": "next build",
    "start": "next start",
    "start:debug": "NODE_OPTIONS='--inspect' next start"
  }
}
```

## Staging Environment

### Staging Setup

```bash
# 1. Create staging branch
git checkout -b staging

# 2. Configure staging environment
cp .env.staging .env

# 3. Build for staging
npm run build:staging

# 4. Deploy to staging server
npm run deploy:staging
```

### Staging Configuration

```typescript
// next.config.ts
const nextConfig = {
  env: {
    CUSTOM_KEY: process.env.NODE_ENV === 'staging' ? 'staging-value' : 'production-value',
  },
  experimental: {
    // Enable experimental features in staging
    serverComponentsExternalPackages: ['@prisma/client'],
  },
};
```

### Staging Deployment Script

```bash
#!/bin/bash
# scripts/deploy-staging.sh

echo "Deploying to staging environment..."

# Pull latest changes
git pull origin staging

# Install dependencies
npm ci --only=production

# Build application
npm run build

# Apply database migrations
npm run db:migrate

# Restart application
pm2 restart next-boiler-staging

echo "Staging deployment completed!"
```

## Production Environment

### Production Build

```bash
# 1. Build for production
npm run build

# 2. Verify build output
ls -la .next/

# 3. Test production build locally
npm start
```

### Production Configuration

```typescript
// next.config.ts
const nextConfig = {
  output: 'standalone', // For containerized deployments
  experimental: {
    // Production optimizations
    optimizeCss: true,
    optimizePackageImports: ['@radix-ui/react-icons'],
  },
  headers: async () => [
    {
      source: '/(.*)',
      headers: [
        {
          key: 'X-Frame-Options',
          value: 'DENY',
        },
        {
          key: 'X-Content-Type-Options',
          value: 'nosniff',
        },
        {
          key: 'Referrer-Policy',
          value: 'origin-when-cross-origin',
        },
      ],
    },
  ],
};
```

### Production Deployment Script

```bash
#!/bin/bash
# scripts/deploy-production.sh

set -e

echo "Starting production deployment..."

# Load production environment
source .env.production

# Pull latest changes
git pull origin main

# Install dependencies
npm ci --only=production

# Run tests
npm test

# Build application
npm run build

# Apply database migrations
npm run db:migrate

# Upload source maps to Sentry
npm run sentry:sourcemaps

# Restart application
pm2 restart next-boiler-production

echo "Production deployment completed successfully!"
```

## Platform-Specific Deployment

### Vercel Deployment

#### Vercel Configuration

```json
// vercel.json
{
  "buildCommand": "npm run build",
  "outputDirectory": ".next",
  "installCommand": "npm ci",
  "framework": "nextjs",
  "env": {
    "DATABASE_URL": "@database-url",
    "JWT_SECRET": "@jwt-secret",
    "JWT_REFRESH_SECRET": "@jwt-refresh-secret"
  },
  "functions": {
    "app/api/**/*.ts": {
      "maxDuration": 30
    }
  }
}
```

#### Vercel CLI Deployment

```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy to Vercel
vercel --prod
```

### Docker Deployment

#### Dockerfile

```dockerfile
# Dockerfile
FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Install dependencies based on the preferred package manager
COPY package.json package-lock.json* ./
RUN npm ci --only=production

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Next.js collects completely anonymous telemetry data about general usage.
# Learn more here: https://nextjs.org/telemetry
# Uncomment the following line in case you want to disable telemetry during the build.
ENV NEXT_TELEMETRY_DISABLED 1

RUN npm run build

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public

# Set the correct permission for prerender cache
RUN mkdir .next
RUN chown nextjs:nodejs .next

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

CMD ["node", "server.js"]
```

#### Docker Compose

```yaml
# docker-compose.yml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - DATABASE_URL=postgresql://username:password@db:5432/next_boiler
    depends_on:
      - db
      - redis
    restart: unless-stopped

  db:
    image: postgres:15
    environment:
      - POSTGRES_DB=next_boiler
      - POSTGRES_USER=username
      - POSTGRES_PASSWORD=password
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"
    restart: unless-stopped

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    restart: unless-stopped

volumes:
  postgres_data:
```

#### Docker Deployment Commands

```bash
# Build and run with Docker Compose
docker-compose up -d --build

# View logs
docker-compose logs -f app

# Stop services
docker-compose down

# Clean up volumes
docker-compose down -v
```

### AWS Deployment

#### AWS ECS Configuration

```json
// aws/task-definition.json
{
  "family": "next-boiler",
  "networkMode": "awsvpc",
  "requiresCompatibilities": ["FARGATE"],
  "cpu": "512",
  "memory": "1024",
  "executionRoleArn": "arn:aws:iam::account:role/ecsTaskExecutionRole",
  "containerDefinitions": [
    {
      "name": "next-boiler",
      "image": "your-ecr-repo/next-boiler:latest",
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
      "logConfiguration": {
        "logDriver": "awslogs",
        "options": {
          "awslogs-group": "/ecs/next-boiler",
          "awslogs-region": "us-east-1",
          "awslogs-stream-prefix": "ecs"
        }
      }
    }
  ]
}
```

#### AWS Deployment Script

```bash
#!/bin/bash
# scripts/deploy-aws.sh

set -e

echo "Deploying to AWS ECS..."

# Build Docker image
docker build -t next-boiler .

# Tag image
docker tag next-boiler:latest $AWS_ACCOUNT.dkr.ecr.$AWS_REGION.amazonaws.com/next-boiler:latest

# Push to ECR
aws ecr get-login-password --region $AWS_REGION | docker login --username AWS --password-stdin $AWS_ACCOUNT.dkr.ecr.$AWS_REGION.amazonaws.com
docker push $AWS_ACCOUNT.dkr.ecr.$AWS_REGION.amazonaws.com/next-boiler:latest

# Update ECS service
aws ecs update-service --cluster next-boiler-cluster --service next-boiler-service --force-new-deployment

echo "AWS deployment completed!"
```

## Database Deployment

### Database Migration Strategy

```bash
# 1. Generate migration
npm run db:generate

# 2. Review migration file
cat drizzle/migrations/0001_initial.sql

# 3. Apply migration to staging
npm run db:migrate:staging

# 4. Test in staging
npm run test:staging

# 5. Apply migration to production
npm run db:migrate:production
```

### Database Backup Strategy

```bash
#!/bin/bash
# scripts/backup-database.sh

BACKUP_DIR="/backups"
DATE=$(date +%Y%m%d_%H%M%S)
DB_NAME="next_boiler"

# Create backup directory
mkdir -p $BACKUP_DIR

# Create backup
pg_dump $DATABASE_URL > $BACKUP_DIR/${DB_NAME}_${DATE}.sql

# Compress backup
gzip $BACKUP_DIR/${DB_NAME}_${DATE}.sql

# Keep only last 7 days of backups
find $BACKUP_DIR -name "*.sql.gz" -mtime +7 -delete

echo "Database backup completed: ${DB_NAME}_${DATE}.sql.gz"
```

### Database Connection Pooling

```typescript
// lib/db.ts
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 20, // Maximum number of connections
  idleTimeoutMillis: 30000, // Close idle connections after 30 seconds
  connectionTimeoutMillis: 2000, // Return an error after 2 seconds if connection could not be established
});

export const db = drizzle(pool);
```

## Monitoring and Observability

### Sentry Integration

#### Sentry Configuration

```typescript
// sentry.server.config.ts
import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,
  integrations: [
    new Sentry.Integrations.Http({ tracing: true }),
    new Sentry.Integrations.Express(),
  ],
});
```

#### Sentry Deployment Scripts

```bash
# Create new release
npm run sentry:create-release

# Upload source maps
npm run sentry:sourcemaps

# Finalize release
npm run sentry:finalize-release
```

### Health Checks

#### Health Check Endpoint

```typescript
// app/api/health/route.ts
import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    // Check database connection
    await db.execute(sql`SELECT 1`);
    
    // Check Redis connection (if applicable)
    // await redis.ping();
    
    return NextResponse.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV,
    });
  } catch (error) {
    return NextResponse.json(
      {
        status: 'unhealthy',
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString(),
      },
      { status: 503 }
    );
  }
}
```

#### Health Check Monitoring

```bash
#!/bin/bash
# scripts/health-check.sh

HEALTH_URL="https://yourapp.com/api/health"
MAX_RETRIES=3
RETRY_DELAY=5

for i in $(seq 1 $MAX_RETRIES); do
  if curl -f $HEALTH_URL > /dev/null 2>&1; then
    echo "Health check passed"
    exit 0
  else
    echo "Health check failed (attempt $i/$MAX_RETRIES)"
    if [ $i -lt $MAX_RETRIES ]; then
      sleep $RETRY_DELAY
    fi
  fi
done

echo "Health check failed after $MAX_RETRIES attempts"
exit 1
```

## Security Considerations

### Security Headers

```typescript
// next.config.ts
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
  }
];

const nextConfig = {
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: securityHeaders,
      },
    ];
  },
};
```

### Environment Security

```bash
# Generate secure secrets
npm run generate:jwt-secrets

# Verify environment variables
npm run security:check

# Check for exposed secrets
npm run security:check:all
```

### SSL/TLS Configuration

```nginx
# nginx.conf
server {
    listen 443 ssl http2;
    server_name yourapp.com;
    
    ssl_certificate /etc/letsencrypt/live/yourapp.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/yourapp.com/privkey.pem;
    
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-RSA-AES128-GCM-SHA256:ECDHE-RSA-AES256-GCM-SHA384;
    ssl_prefer_server_ciphers off;
    
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## Performance Optimization

### Build Optimization

```typescript
// next.config.ts
const nextConfig = {
  experimental: {
    optimizeCss: true,
    optimizePackageImports: ['@radix-ui/react-icons', 'lucide-react'],
  },
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  images: {
    formats: ['image/webp', 'image/avif'],
    minimumCacheTTL: 60,
  },
};
```

### Bundle Analysis

```bash
# Install bundle analyzer
npm install --save-dev @next/bundle-analyzer

# Analyze bundle
ANALYZE=true npm run build
```

### Performance Monitoring

```typescript
// lib/performance.ts
export function measurePerformance<T>(
  name: string,
  fn: () => Promise<T>
): Promise<T> {
  const start = performance.now();
  
  return fn().finally(() => {
    const duration = performance.now() - start;
    console.log(`${name} took ${duration.toFixed(2)}ms`);
    
    // Send to monitoring service
    if (process.env.NODE_ENV === 'production') {
      // Send to Sentry or other monitoring service
    }
  });
}
```

## Rollback Strategies

### Database Rollback

```bash
# Rollback last migration
npm run db:rollback

# Rollback to specific migration
npm run db:rollback --to 0001_initial
```

### Application Rollback

```bash
#!/bin/bash
# scripts/rollback.sh

set -e

echo "Rolling back to previous version..."

# Get current version
CURRENT_VERSION=$(git rev-parse HEAD)

# Get previous version
PREVIOUS_VERSION=$(git rev-parse HEAD~1)

# Checkout previous version
git checkout $PREVIOUS_VERSION

# Install dependencies
npm ci --only=production

# Build application
npm run build

# Restart application
pm2 restart next-boiler-production

echo "Rollback completed to version: $PREVIOUS_VERSION"
```

### Blue-Green Deployment

```bash
#!/bin/bash
# scripts/blue-green-deploy.sh

set -e

echo "Starting blue-green deployment..."

# Deploy new version to green environment
echo "Deploying to green environment..."
./scripts/deploy-green.sh

# Run health checks on green
echo "Running health checks on green..."
./scripts/health-check-green.sh

# Switch traffic to green
echo "Switching traffic to green..."
./scripts/switch-traffic.sh

# Deploy old version to blue for next deployment
echo "Updating blue environment..."
./scripts/deploy-blue.sh

echo "Blue-green deployment completed!"
```

## Troubleshooting

### Common Deployment Issues

#### Build Failures

```bash
# Clear Next.js cache
rm -rf .next
rm -rf node_modules/.cache

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install

# Check TypeScript errors
npx tsc --noEmit
```

#### Database Connection Issues

```bash
# Test database connection
psql $DATABASE_URL -c "SELECT 1"

# Check connection pool
psql $DATABASE_URL -c "SELECT * FROM pg_stat_activity;"

# Verify environment variables
echo $DATABASE_URL
```

#### Memory Issues

```bash
# Check memory usage
pm2 monit

# Restart with more memory
pm2 restart next-boiler --max-memory-restart 1G

# Check for memory leaks
node --inspect npm start
```

### Log Analysis

#### Log Aggregation

```bash
# View application logs
pm2 logs next-boiler

# View system logs
journalctl -u next-boiler -f

# Search for errors
grep -i error /var/log/next-boiler/app.log
```

#### Performance Analysis

```bash
# Profile CPU usage
node --prof npm start

# Analyze CPU profile
node --prof-process isolate-*.log > processed.txt

# Monitor memory usage
node --inspect --max-old-space-size=2048 npm start
```

### Emergency Procedures

#### Emergency Rollback

```bash
#!/bin/bash
# scripts/emergency-rollback.sh

echo "EMERGENCY ROLLBACK INITIATED"

# Immediately rollback to last known good version
git checkout $LAST_KNOWN_GOOD_VERSION

# Restart application
pm2 restart next-boiler-production

# Notify team
curl -X POST $SLACK_WEBHOOK_URL \
  -H 'Content-type: application/json' \
  -d '{"text":"🚨 Emergency rollback initiated to version: '$LAST_KNOWN_GOOD_VERSION'"}'

echo "Emergency rollback completed"
```

#### Database Recovery

```bash
#!/bin/bash
# scripts/database-recovery.sh

echo "Starting database recovery..."

# Stop application
pm2 stop next-boiler-production

# Restore from backup
pg_restore $DATABASE_URL < /backups/latest_backup.sql

# Start application
pm2 start next-boiler-production

echo "Database recovery completed"
```

This deployment guide provides comprehensive coverage of deployment strategies, environment management, and operational best practices for the Next.js boilerplate project. Follow these guidelines to ensure smooth, secure, and reliable deployments across all environments. 