#!/bin/bash

set -e

# Configuration
ENVIRONMENT=${1:-development}
COMPOSE_FILE="docker-compose.yml"

if [ "$ENVIRONMENT" = "production" ]; then
    COMPOSE_FILE="docker-compose.prod.yml"
    echo "Deploying to production environment..."
    
    # Check if required environment variables are set
    if [ -z "$POSTGRES_PASSWORD" ] || [ -z "$JWT_SECRET" ] || [ -z "$JWT_REFRESH_SECRET" ] || [ -z "$COOKIE_SECRET" ]; then
        echo "Error: Required environment variables not set for production deployment"
        echo "Please set: POSTGRES_PASSWORD, JWT_SECRET, JWT_REFRESH_SECRET, COOKIE_SECRET"
        exit 1
    fi
else
    echo "Deploying to development environment..."
fi

echo "Using compose file: $COMPOSE_FILE"

# Stop existing containers
echo "Stopping existing containers..."
docker-compose -f $COMPOSE_FILE down

# Build and start services
echo "Building and starting services..."
docker-compose -f $COMPOSE_FILE up -d --build

# Wait for services to be ready
echo "Waiting for services to be ready..."
sleep 10

# Check health status
echo "Checking service health..."
docker-compose -f $COMPOSE_FILE ps

# Show logs
echo "Recent logs:"
docker-compose -f $COMPOSE_FILE logs --tail=20

echo "Deployment completed successfully!"
echo "Application should be available at: http://localhost:3000"
echo "Health check: http://localhost:3000/api/health" 