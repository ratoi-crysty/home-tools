# Stage 1: Build
FROM node:22-alpine AS builder

WORKDIR /app

# Install dependencies
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

# Copy source files
COPY . .

# Build both applications
RUN yarn nx run-many -t build --projects=api,web --configuration=production

# Stage 2: Production
FROM node:22-alpine AS production

WORKDIR /app

# Install nginx and process utilities
RUN apk add --no-cache nginx procps

# Copy built API
COPY --from=builder /app/dist/apps/api ./api

# Copy built web app
COPY --from=builder /app/dist/apps/web/browser /usr/share/nginx/html

# Copy nginx configuration
COPY nginx.conf /etc/nginx/nginx.conf

# Install production dependencies for API
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile --production && \
    yarn cache clean

# Create startup script
COPY docker-entrypoint.sh /docker-entrypoint.sh
RUN chmod +x /docker-entrypoint.sh

# Expose ports
EXPOSE 80 3000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD wget -q --spider http://localhost/api/health || exit 1

ENTRYPOINT ["/docker-entrypoint.sh"]
