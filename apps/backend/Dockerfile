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
# ARG TURBO_TEAM
# ARG TURBO_TOKEN
# ARG DATABASE_URI
# ARG PAYLOAD_SECRET
# ARG GOOGLE_CLIENT_ID
# ARG GOOGLE_CLIENT_SECRET
# ARG NEXT_PUBLIC_URL
# ARG JWT_SECRET

# ENV DATABASE_URI=${DATABASE_URI}
# ENV PAYLOAD_SECRET=${PAYLOAD_SECRET}
# ENV GOOGLE_CLIENT_ID=${GOOGLE_CLIENT_ID}
# ENV GOOGLE_CLIENT_SECRET=${GOOGLE_CLIENT_SECRET}
# ENV NEXT_PUBLIC_URL=${NEXT_PUBLIC_URL}
# ENV JWT_SECRET=${JWT_SECRET}
# ENV TURBO_TEAM=${TURBO_TEAM}
# ENV TURBO_TOKEN=${TURBO_TOKEN}

# Mount build secrets
RUN --mount=type=secret,id=DATABASE_URI \
    --mount=type=secret,id=JWT_SECRET \
    --mount=type=secret,id=PAYLOAD_SECRET \
    --mount=type=secret,id=GOOGLE_CLIENT_ID \
    --mount=type=secret,id=GOOGLE_CLIENT_SECRET \
    --mount=type=secret,id=NEXT_PUBLIC_URL \
    --mount=type=secret,id=TURBO_TEAM \
    --mount=type=secret,id=TURBO_TOKEN \
    --mount=type=secret,id=NEXT_PUBLIC_API_URL \
    echo "DATABASE_URI=$(cat /run/secrets/DATABASE_URI)" >> apps/backend/.env && \
    echo "JWT_SECRET=$(cat /run/secrets/JWT_SECRET)" >> apps/backend/.env && \
    echo "PAYLOAD_SECRET=$(cat /run/secrets/PAYLOAD_SECRET)" >> apps/backend/.env && \
    echo "GOOGLE_CLIENT_ID=$(cat /run/secrets/GOOGLE_CLIENT_ID)" >> apps/backend/.env && \
    echo "GOOGLE_CLIENT_SECRET=$(cat /run/secrets/GOOGLE_CLIENT_SECRET)" >> apps/backend/.env && \
    echo "NEXT_PUBLIC_URL=$(cat /run/secrets/NEXT_PUBLIC_URL)" >> apps/backend/.env && \
    echo "TURBO_TEAM=$(cat /run/secrets/TURBO_TEAM)" >> .env && \
    echo "TURBO_TOKEN=$(cat /run/secrets/TURBO_TOKEN)" >> .env && \
    echo "NEXT_PUBLIC_API_URL=$(cat /run/secrets/NEXT_PUBLIC_API_URL)" >> apps/backend/.env

# Now run the build
RUN pnpm build --filter backend

# Stage 3: Production server
FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=installer /app/apps/backend/.next/standalone ./
COPY --from=installer /app/apps/backend/.next/static ./apps/backend/.next/static
COPY --from=installer /app/apps/backend/public ./apps/backend/public

# ARG DATABASE_URI
# ARG PAYLOAD_SECRET
# ARG GOOGLE_CLIENT_ID
# ARG GOOGLE_CLIENT_SECRET
# ARG NEXT_PUBLIC_URL
# ARG JWT_SECRET

# ENV DATABASE_URI=${DATABASE_URI}
# ENV PAYLOAD_SECRET=${PAYLOAD_SECRET}
# ENV GOOGLE_CLIENT_ID=${GOOGLE_CLIENT_ID}
# ENV GOOGLE_CLIENT_SECRET=${GOOGLE_CLIENT_SECRET}
# ENV NEXT_PUBLIC_URL=${NEXT_PUBLIC_URL}
# ENV JWT_SECRET=${JWT_SECRET}
ENV PORT=3000

EXPOSE 3000

CMD ["node", "apps/backend/server.js"]
