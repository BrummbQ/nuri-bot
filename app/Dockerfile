FROM node:22-alpine AS builder

WORKDIR /app

# Install build dependencies
RUN apk add --no-cache python3 make g++

COPY package.json package-lock.json ./
RUN npm ci --no-audit --no-fund --quiet
COPY . .
RUN npm run build
# Change ownership of the output directory to non-root user
RUN chown -R 65532:65532 /app/.output

# Stage 2: Production runtime
FROM gcr.io/distroless/nodejs22-debian12:nonroot AS runner

# Copy built artifacts from builder stage
COPY --from=builder /app/.output /app

ENV NODE_ENV=production
ENV HOST=0.0.0.0
ENV PORT=3000

EXPOSE 3000

# Start command
CMD ["/app/server/index.mjs"]