# To use this Dockerfile, you have to set `output: 'standalone'` in your next.config.mjs file.
# From https://github.com/vercel/next.js/blob/canary/examples/with-docker/Dockerfile

FROM node:22.14.0-alpine AS base

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

RUN corepack enable pnpm && pnpm install -g turbo

# Stage 1: Setup build environment
FROM base AS builder
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk update
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY . .
RUN turbo prune frontend --docker

# Stage 2: Install dependencies
FROM base AS installer
RUN apk update
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY .gitignore .gitignore
COPY --from=builder /app/out/pnpm-lock.yaml ./pnpm-lock.yaml
COPY --from=builder /app/out/pnpm-workspace.yaml ./pnpm-workspace.yaml
COPY --from=builder /app/out/json/ .

RUN pnpm install --frozen-lockfile

COPY --from=builder /app/out/full/ .
COPY turbo.json turbo.json

# Mount build secrets
RUN --mount=type=secret,id=NEXT_PUBLIC_URL \
    --mount=type=secret,id=NEXT_PUBLIC_API_URL \
    --mount=type=secret,id=JWT_SECRET \
    --mount=type=secret,id=TURBO_TEAM \
    --mount=type=secret,id=TURBO_TOKEN \
    echo "NEXT_PUBLIC_URL=$(cat /run/secrets/NEXT_PUBLIC_URL)" >> apps/frontend/.env && \
    echo "NEXT_PUBLIC_API_URL=$(cat /run/secrets/NEXT_PUBLIC_API_URL)" >> apps/frontend/.env && \
    echo "JWT_SECRET=$(cat /run/secrets/JWT_SECRET)" >> apps/frontend/.env && \
    echo "TURBO_TEAM=$(cat /run/secrets/TURBO_TEAM)" >> .env && \
    echo "TURBO_TOKEN=$(cat /run/secrets/TURBO_TOKEN)" >> .env

ENV TURBO_TEAM=$(cat /run/secrets/TURBO_TEAM)
ENV TURBO_TOKEN=$(cat /run/secrets/TURBO_TOKEN)

RUN pnpm build --filter frontend

# Stage 3: Production server
FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=installer /app/apps/frontend/.next/standalone ./
COPY --from=installer /app/apps/frontend/.next/static ./apps/frontend/.next/static
COPY --from=installer /app/apps/frontend/public ./apps/frontend/public

ENV PORT=3001
EXPOSE 3001

CMD ["node", "apps/frontend/server.js"]
