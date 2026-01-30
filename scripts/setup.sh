#!/bin/bash

# This script sets up the Mercury investment platform environment.

# Update package lists
echo "Updating package lists..."
sudo apt-get update

# Install necessary packages
echo "Installing necessary packages..."
sudo apt-get install -y nodejs npm docker-compose

# Navigate to the web application directory
cd apps/web

# Install web application dependencies
echo "Installing web application dependencies..."
npm install

# Navigate to the API application directory
cd ../api

# Install API application dependencies
echo "Installing API application dependencies..."
npm install

# Navigate to shared package directory
cd ../../packages/shared

# Install shared package dependencies
echo "Installing shared package dependencies..."
npm install

# Navigate to UI kit package directory
cd ../ui-kit

# Install UI kit package dependencies
echo "Installing UI kit package dependencies..."
npm install

# Setup Docker containers
echo "Setting up Docker containers..."
cd ../../infra/docker
docker-compose up -d

echo "Setup complete!"