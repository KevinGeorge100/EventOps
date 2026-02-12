# ─── EventOps Dockerfile ──────────────────────────────────
# Multi-stage build for a lightweight Node.js container
# ─────────────────────────────────────────────────────────

# Stage 1: Dependencies
FROM node:18-alpine AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

# Stage 2: Application
FROM node:18-alpine AS runner
WORKDIR /app

# Create non-root user for security
RUN addgroup -g 1001 -S eventops && \
    adduser -S eventops -u 1001

# Copy dependencies from deps stage
COPY --from=deps /app/node_modules ./node_modules
COPY package*.json ./

# Copy application source
COPY src/ ./src/

# Create data directory and set permissions
RUN mkdir -p data && chown -R eventops:eventops /app

# Copy default data if exists
COPY data/ ./data/
RUN chown -R eventops:eventops /app/data

# Switch to non-root user
USER eventops

# Expose application port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://localhost:3000/health || exit 1

# Start the application
CMD ["node", "src/server.js"]
