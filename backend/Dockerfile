# Stage 1: Builder
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files -> Install dependencies
COPY package*.json ./
RUN npm ci

# Copy Source -> Build TypeScript & Generate Prisma
COPY . .
# Set dummy DATABASE_URL for build time (needed for prisma generate)
ENV DATABASE_URL="postgresql://dummy:dummy@localhost:5432/dummy"
RUN npx prisma generate
RUN npm run build

# Stage 2: Production
FROM node:20-alpine

WORKDIR /app

# Copy built assets from builder
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma

# Create logs directory
RUN mkdir -p logs

# Healthcheck
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD wget --quiet --tries=1 --spider http://localhost:3000/ || exit 1

EXPOSE 3000

# Start application
CMD ["node", "dist/server.js"]
