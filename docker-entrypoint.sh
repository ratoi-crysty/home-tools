#!/bin/sh
set -e

echo "Starting Home Tools..."

# Start nginx in background
echo "Starting nginx..."
nginx

# Start API server
echo "Starting API server..."
cd /app/api
exec node main.js
