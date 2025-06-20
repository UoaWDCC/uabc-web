# syntax=docker/dockerfile:1

# Build stage
FROM node:22-alpine AS builder
ENV BUN_INSTALL="/usr/local"
RUN apk add --no-cache curl unzip
RUN curl -fsSL https://bun.sh/install | bash && ln -s /root/.bun/bin/bun /usr/local/bin/bun
RUN bun install -g turbo

WORKDIR /app

# Copy entire workspace
COPY . .

# Run the build for the specific app
RUN turbo prune --scope=frontend --docker
 
# Add lockfile and package.json's of isolated subworkspace
FROM node:22-alpine AS installer
ENV BUN_INSTALL="/usr/local"
RUN apk add --no-cache curl unzip
RUN curl -fsSL https://bun.sh/install | bash && ln -s /root/.bun/bin/bun /usr/local/bin/bun

WORKDIR /app

# First install the dependencies (this is done before copying the source code to leverage Docker layer caching)
COPY .gitignore .gitignore
COPY --from=builder /app/out/json/ .
COPY --from=builder /app/out/bun.lock ./bun.lock
COPY --from=builder /app/out/bunfig.toml ./bunfig.toml

# Install dependencies
RUN bun install --frozen-lockfile

# Build the project
COPY --from=builder /app/out/full/ .
COPY .env.example .env.local
COPY turbo.json turbo.json

# Install sharp for production image optimization
RUN apk add --no-cache vips-dev
RUN npm install sharp

# Build the project
RUN bun build --filter frontend

# Production stage
FROM node:22-alpine AS runner
ENV BUN_INSTALL="/usr/local"
RUN apk add --no-cache curl unzip vips-dev
RUN curl -fsSL https://bun.sh/install | bash && ln -s /root/.bun/bin/bun /usr/local/bin/bun

WORKDIR /app

# Copy the built application
COPY --from=installer /app/apps/frontend/next.config.mjs .
COPY --from=installer /app/apps/frontend/package.json .
COPY --from=installer /app/apps/frontend/.next ./.next
COPY --from=installer /app/apps/frontend/public ./public
COPY --from=installer /app/node_modules ./node_modules

# Set the correct permission for built application
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Switch to the non-root user
USER nextjs

EXPOSE 3000

ENV PORT 3000
ENV HOSTNAME 0.0.0.0

CMD ["bun", "start"]
