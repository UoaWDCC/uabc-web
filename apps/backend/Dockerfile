# To use this Dockerfile, you have to set `output: 'standalone'` in your next.config.mjs file.
# From https://github.com/vercel/next.js/blob/canary/examples/with-docker/Dockerfile

FROM node:22.17.0-alpine AS base

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
ENV NODE_ENV=production

RUN corepack enable pnpm && pnpm install -g turbo

# Stage 1: Setup build environment
FROM base AS builder
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk update
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY . .
RUN turbo prune backend --docker

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

ARG DATABASE_URI
ARG JWT_SECRET
ARG PAYLOAD_SECRET
ARG GOOGLE_CLIENT_ID
ARG GOOGLE_CLIENT_SECRET
ARG NEXT_PUBLIC_URL
ARG TURBO_TEAM
ARG TURBO_TOKEN

ENV DATABASE_URI=${DATABASE_URI}
ENV JWT_SECRET=${JWT_SECRET}
ENV PAYLOAD_SECRET=${PAYLOAD_SECRET}
ENV GOOGLE_CLIENT_ID=${GOOGLE_CLIENT_ID}
ENV GOOGLE_CLIENT_SECRET=${GOOGLE_CLIENT_SECRET}
ENV NEXT_PUBLIC_URL=${NEXT_PUBLIC_URL}

# Now run the build
RUN pnpm build --filter backend

# Stage 3: Production server
FROM base AS runner
WORKDIR /app

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=installer /app/apps/backend/.next/standalone ./
COPY --from=installer /app/apps/backend/.next/static ./apps/backend/.next/static

ENV PORT=3000

EXPOSE 3000

CMD ["node", "apps/backend/server.js"]
