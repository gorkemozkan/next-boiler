# Docker Quick Reference

A quick reference guide for Docker commands and common operations with the Next.js boilerplate project.

## 🚀 Quick Start

```bash
# Start all services
npm run docker:up

# Stop all services
npm run docker:down

# View logs
npm run docker:logs

# Check status
docker-compose ps
```

## 📋 Common Commands

### Container Management

```bash
# Start services
docker-compose up -d

# Stop services
docker-compose down

# Restart specific service
docker-compose restart app

# Rebuild and start
docker-compose up -d --build

# View running containers
docker-compose ps

# View logs
docker-compose logs -f
docker-compose logs -f app
docker-compose logs -f db
docker-compose logs -f redis
```

### Database Operations

```bash
# Access PostgreSQL
docker-compose exec db psql -U postgres -d next_boiler_dev

# Run migrations
DATABASE_URL="postgresql://postgres:password@localhost:5432/next_boiler_dev" npm run db:push

# Generate migrations
DATABASE_URL="postgresql://postgres:password@localhost:5432/next_boiler_dev" npm run db:generate

# Check tables
docker-compose exec db psql -U postgres -d next_boiler_dev -c "\dt"

# Check database version
docker-compose exec db psql -U postgres -d next_boiler_dev -c "SELECT version();"
```

### Redis Operations

```bash
# Access Redis CLI
docker-compose exec redis redis-cli

# Test Redis connection
docker-compose exec redis redis-cli ping

# Check Redis info
docker-compose exec redis redis-cli info
```

### Application Operations

```bash
# Access app container
docker-compose exec app sh

# Test health endpoint
curl http://localhost:3000/api/health

# Test application
curl http://localhost:3000

# View app logs
docker-compose logs -f app
```

## 🔧 Troubleshooting

### Port Conflicts

```bash
# Check what's using port 3000
lsof -i :3000

# Kill process using port
kill -9 <PID>

# Use different port
docker-compose up -d -p 3001:3000
```

### Database Issues

```bash
# Check database status
docker-compose exec db pg_isready -U postgres

# Reset database (WARNING: deletes all data)
docker-compose down -v
docker-compose up -d

# Check database logs
docker-compose logs db
```

### Build Issues

```bash
# Clear Docker cache
docker system prune -a

# Rebuild without cache
docker-compose build --no-cache

# Check Dockerfile syntax
docker build --target builder .
```

### SSL Issues

```bash
# If you see SSL connection errors
docker-compose up -d --build
```

## 📊 Monitoring

### Resource Usage

```bash
# Check container resource usage
docker stats

# Check disk usage
docker system df

# Check image sizes
docker images
```

### Health Checks

```bash
# Test application health
curl -s http://localhost:3000/api/health | jq .

# Test database health
docker-compose exec db pg_isready -U postgres

# Test Redis health
docker-compose exec redis redis-cli ping
```

## 🧹 Cleanup

```bash
# Stop and remove containers
docker-compose down

# Remove containers and volumes
docker-compose down -v

# Remove containers, volumes, and images
docker-compose down -v --rmi all

# Clean up all Docker resources
npm run docker:clean
# or
docker system prune -a --volumes
```

## 🔐 Security

### Environment Variables

```bash
# Set secure passwords
export POSTGRES_PASSWORD="your-secure-password"
export JWT_SECRET="your-super-secure-jwt-secret"
export JWT_REFRESH_SECRET="your-super-secure-refresh-secret"
export COOKIE_SECRET="your-super-secure-cookie-secret"

# Use in docker-compose
docker-compose up -d
```

### Non-Root User

The application runs as a non-root user (`nextjs`) for security.

## 📝 Logs

### View Logs

```bash
# All services
docker-compose logs

# Specific service
docker-compose logs app
docker-compose logs db
docker-compose logs redis

# Follow logs
docker-compose logs -f app

# Last N lines
docker-compose logs --tail=100 app

# With timestamps
docker-compose logs -t app
```

### Log Levels

```bash
# Set log level
docker-compose up -d --log-level DEBUG

# Available levels: DEBUG, INFO, WARNING, ERROR, CRITICAL
```

## 🔄 Development Workflow

### Typical Development Session

```bash
# 1. Start services
npm run docker:up

# 2. Set up database (first time only)
DATABASE_URL="postgresql://postgres:password@localhost:5432/next_boiler_dev" npm run db:push

# 3. Make code changes
# Edit files in your editor

# 4. Rebuild to see changes
docker-compose up -d --build

# 5. Check logs
docker-compose logs -f app

# 6. Test changes
curl http://localhost:3000

# 7. Stop when done
npm run docker:down
```

### Code Changes

```bash
# For most changes, rebuild is needed
docker-compose up -d --build

# For environment variable changes
docker-compose restart app

# For database schema changes
DATABASE_URL="postgresql://postgres:password@localhost:5432/next_boiler_dev" npm run db:push
```

## 🎯 Production Commands

```bash
# Build production image
npm run docker:build

# Deploy to production
npm run docker:prod

# Use production compose file
docker-compose -f docker-compose.prod.yml up -d

# Scale services
docker-compose -f docker-compose.prod.yml up -d --scale app=3
```

## 📚 Additional Resources

- [Docker Documentation](https://docs.docker.com/)
- [Docker Compose Documentation](https://docs.docker.com/compose/)
- [Next.js Docker Guide](https://nextjs.org/docs/deployment#docker-image)
- [PostgreSQL Docker Image](https://hub.docker.com/_/postgres)
- [Redis Docker Image](https://hub.docker.com/_/redis) 