# To use this Dockerfile, you have to set `output: 'standalone'` in your next.config.mjs file.
# From https://github.com/vercel/next.js/blob/canary/examples/with-docker/Dockerfile

ARG NODE_VERSION=22.14.0
FROM node:${NODE_VERSION}-slim AS base

# Stage 1: Install dependencies
FROM base AS deps
WORKDIR /app
ENV NODE_ENV=production

COPY package.json pnpm-lock.yaml ./
RUN corepack enable pnpm && pnpm install --frozen-lockfile

# Stage 2: Build the application
RUN apt-get update -qq && \
    apt-get install --no-install-recommends -y build-essential node-gyp pkg-config python-is-python3

# Install node modules
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile --prod=false

COPY . .
RUN corepack enable pnpm && pnpm run build

# Remove development dependencies
RUN pnpm prune --prod


# Stage 3: Production server
FROM base AS runner
WORKDIR /app
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
RUN if [ -d "/app/public" ]; then cp -r /app/public ./public; fi # Copy public folder if it exists

EXPOSE 3000
CMD ["node", "server.js"]
