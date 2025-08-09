# Docker Guide

This guide covers how to use Docker with the Next.js boilerplate project for development, testing, and production deployment.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Quick Start](#quick-start)
3. [Development with Docker](#development-with-docker)
4. [Production Deployment](#production-deployment)
5. [Docker Compose](#docker-compose)
6. [Customization](#customization)
7. [Troubleshooting](#troubleshooting)

## Prerequisites

- **Docker**: Version 20.10 or higher
- **Docker Compose**: Version 2.0 or higher
- **Git**: To clone the repository

### Install Docker

#### macOS
```bash
# Using Homebrew
brew install --cask docker

# Or download from docker.com
```

#### Ubuntu/Debian
```bash
# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Add user to docker group
sudo usermod -aG docker $USER

# Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/download/v2.20.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose
```

#### Windows
Download and install Docker Desktop from [docker.com](https://www.docker.com/products/docker-desktop)

## Quick Start

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd next-boiler
   ```

2. **Start development environment**
   ```bash
   # Using the provided script
   ./scripts/docker-deploy.sh
   
   # Or manually
   docker-compose up -d
   ```

3. **Access the application**
   - Application: http://localhost:3000
   - Health check: http://localhost:3000/api/health
   - Database: localhost:5432
   - Redis: localhost:6379

## Development with Docker

### Development Environment

The development environment includes:
- **Next.js app** with hot reload
- **PostgreSQL 15** database
- **Redis 7** cache
- **Volume mounts** for live code changes

```bash
# Start development environment
docker-compose up -d

# View logs
docker-compose logs -f app

# Stop services
docker-compose down
```

### Development Workflow

1. **Start services**
   ```bash
   docker-compose up -d
   ```

2. **Make code changes**
   - Edit files in your local directory
   - Changes are automatically reflected due to volume mounts

3. **View logs**
   ```bash
   docker-compose logs -f app
   ```

4. **Restart services if needed**
   ```bash
   docker-compose restart app
   ```

5. **Stop services**
   ```bash
   docker-compose down
   ```

### Database Management

```bash
# Access PostgreSQL
docker-compose exec db psql -U postgres -d next_boiler_dev

# Run migrations
docker-compose exec app npm run db:migrate

# Generate types
docker-compose exec app npm run db:generate

# Open Drizzle Studio
docker-compose exec app npm run db:studio
```

## Production Deployment

### Production Environment

The production environment includes:
- **Optimized Next.js build**
- **Production PostgreSQL** with health checks
- **Production Redis** with health checks
- **Security headers** and optimizations

### Environment Variables

Create a `.env.production` file:

```bash
# Database
POSTGRES_PASSWORD=your-secure-password
DATABASE_URL=postgresql://postgres:your-secure-password@db:5432/next_boiler_prod

# JWT Secrets
JWT_SECRET=your-super-secure-jwt-secret
JWT_REFRESH_SECRET=your-super-secure-refresh-secret
COOKIE_SECRET=your-super-secure-cookie-secret

# Monitoring
SENTRY_DSN=your-sentry-dsn
```

### Deploy to Production

```bash
# Set environment variables
export POSTGRES_PASSWORD="your-secure-password"
export JWT_SECRET="your-super-secure-jwt-secret"
export JWT_REFRESH_SECRET="your-super-secure-refresh-secret"
export COOKIE_SECRET="your-super-secure-cookie-secret"
export SENTRY_DSN="your-sentry-dsn"

# Deploy
./scripts/docker-deploy.sh production
```

### Production Commands

```bash
# Start production services
docker-compose -f docker-compose.prod.yml up -d

# View production logs
docker-compose -f docker-compose.prod.yml logs -f

# Scale services
docker-compose -f docker-compose.prod.yml up -d --scale app=3

# Stop production services
docker-compose -f docker-compose.prod.yml down
```

## Docker Compose

### Development Configuration

```yaml
# docker-compose.yml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=development
      - DATABASE_URL=postgresql://postgres:password@db:5432/next_boiler_dev
      - REDIS_URL=redis://redis:6379
    depends_on:
      - db
      - redis
    volumes:
      - .:/app
      - /app/node_modules
      - /app/.next
    restart: unless-stopped
    command: npm run dev

  db:
    image: postgres:15-alpine
    environment:
      - POSTGRES_DB=next_boiler_dev
      - POSTGRES_USER=postgres
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

### Production Configuration

```yaml
# docker-compose.prod.yml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - DATABASE_URL=postgresql://postgres:${POSTGRES_PASSWORD}@db:5432/next_boiler_prod
      - REDIS_URL=redis://redis:6379
      - JWT_SECRET=${JWT_SECRET}
      - JWT_REFRESH_SECRET=${JWT_REFRESH_SECRET}
      - COOKIE_SECRET=${COOKIE_SECRET}
      - SENTRY_DSN=${SENTRY_DSN}
    depends_on:
      - db
      - redis
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3000/api/health"]
      interval: 30s
      timeout: 10s
      retries: 3

  db:
    image: postgres:15-alpine
    environment:
      - POSTGRES_DB=next_boiler_prod
      - POSTGRES_USER=postgres
      - POSTGRES_PASSWORD=${POSTGRES_PASSWORD}
    volumes:
      - postgres_data:/var/lib/postgresql/data
    restart: unless-stopped
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres"]
      interval: 10s
      timeout: 5s
      retries: 5

  redis:
    image: redis:7-alpine
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 10s
      timeout: 5s
      retries: 5

volumes:
  postgres_data:
```

## Customization

### Custom Ports

```yaml
# docker-compose.override.yml
version: '3.8'

services:
  app:
    ports:
      - "8080:3000"  # Map host port 8080 to container port 3000
  
  db:
    ports:
      - "5433:5432"  # Map host port 5433 to container port 5432
  
  redis:
    ports:
      - "6380:6379"  # Map host port 6380 to container port 6379
```

### Environment-Specific Configurations

```yaml
# docker-compose.staging.yml
version: '3.8'

services:
  app:
    environment:
      - NODE_ENV=staging
      - DATABASE_URL=postgresql://postgres:${POSTGRES_PASSWORD}@db:5432/next_boiler_staging
      - SENTRY_DSN=${STAGING_SENTRY_DSN}
  
  db:
    environment:
      - POSTGRES_DB=next_boiler_staging
```

### Custom Build Arguments

```dockerfile
# Dockerfile
FROM node:18-alpine AS base

ARG NODE_ENV=production
ARG BUILD_VERSION=latest

ENV NODE_ENV=$NODE_ENV
ENV BUILD_VERSION=$BUILD_VERSION

# ... rest of Dockerfile
```

```yaml
# docker-compose.yml
services:
  app:
    build:
      context: .
      args:
        NODE_ENV: development
        BUILD_VERSION: dev
```

## Troubleshooting

### Common Issues

#### Port Already in Use

```bash
# Check what's using the port
lsof -i :3000

# Kill the process
kill -9 <PID>

# Or use different ports
docker-compose up -d -p 3001:3000
```

#### Database Connection Issues

```bash
# Check database status
docker-compose exec db pg_isready -U postgres

# Check database logs
docker-compose logs db

# Reset database
docker-compose down -v
docker-compose up -d
```

#### Build Failures

```bash
# Clear Docker cache
docker system prune -a

# Rebuild without cache
docker-compose build --no-cache

# Check Dockerfile syntax
docker build --target builder .
```

#### Memory Issues

```bash
# Check container resource usage
docker stats

# Limit memory usage
docker-compose up -d --scale app=1
```

### Debugging

#### Access Running Containers

```bash
# Access app container
docker-compose exec app sh

# Access database
docker-compose exec db psql -U postgres

# Access Redis
docker-compose exec redis redis-cli
```

#### View Logs

```bash
# View all logs
docker-compose logs

# Follow specific service logs
docker-compose logs -f app

# View logs with timestamps
docker-compose logs -t app
```

#### Health Checks

```bash
# Check service health
docker-compose ps

# Test health endpoint
curl http://localhost:3000/api/health

# Check container health
docker inspect <container-id> | grep Health -A 10
```

### Performance Optimization

#### Multi-Stage Builds

The Dockerfile uses multi-stage builds to optimize image size:

1. **deps stage**: Install dependencies
2. **builder stage**: Build the application
3. **runner stage**: Create minimal production image

#### Volume Mounts

Development environment uses volume mounts for:
- Source code changes (live reload)
- Node modules (cached)
- Build output (cached)

#### Resource Limits

```yaml
# docker-compose.yml
services:
  app:
    deploy:
      resources:
        limits:
          memory: 1G
          cpus: '0.5'
        reservations:
          memory: 512M
          cpus: '0.25'
```

## Best Practices

### Security

- ✅ Never commit secrets to version control
- ✅ Use environment variables for sensitive data
- ✅ Run containers as non-root users
- ✅ Keep base images updated
- ✅ Scan images for vulnerabilities

### Performance

- ✅ Use multi-stage builds
- ✅ Optimize layer caching
- ✅ Minimize image size
- ✅ Use health checks
- ✅ Monitor resource usage

### Development

- ✅ Use volume mounts for live reload
- ✅ Separate development and production configs
- ✅ Use Docker Compose for local development
- ✅ Implement proper health checks
- ✅ Document custom configurations

This Docker guide provides comprehensive coverage of containerizing the Next.js boilerplate project. Follow these practices to ensure efficient, secure, and maintainable Docker deployments. 