# Stage 1: Base image
FROM node:22-alpine AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

# Stage 2: Monorepo Builder
FROM base AS builder
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Copy root workspace configurations
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml turbo.json ./
COPY packages/ ./packages/
COPY apps/api/ ./apps/api/

# Install dependencies and build
RUN pnpm install --frozen-lockfile
RUN pnpm --filter @career-clarity/database db:generate
RUN pnpm --filter @career-clarity/api build
RUN pnpm --filter @career-clarity/api --prod deploy pruned-api

# Stage 3: Production Runner
FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3001

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nestjs

# Copy pruned production deployment
COPY --from=builder /app/pruned-api ./
COPY --from=builder /app/packages/database/prisma ./prisma

USER nestjs

EXPOSE 3001

CMD ["node", "dist/main"]
