#!/bin/bash

set -e

# Configuration
IMAGE_NAME="next-boiler"
TAG=${1:-latest}
REGISTRY=${2:-""}

echo "Building Docker image: $IMAGE_NAME:$TAG"

# Build the image
docker build -t $IMAGE_NAME:$TAG .

# Tag for registry if provided
if [ ! -z "$REGISTRY" ]; then
    echo "Tagging for registry: $REGISTRY/$IMAGE_NAME:$TAG"
    docker tag $IMAGE_NAME:$TAG $REGISTRY/$IMAGE_NAME:$TAG
fi

echo "Build completed successfully!"
echo "Image: $IMAGE_NAME:$TAG"
if [ ! -z "$REGISTRY" ]; then
    echo "Registry image: $REGISTRY/$IMAGE_NAME:$TAG"
fi 