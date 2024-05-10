FROM node:18-alpine AS base

ARG NEXT_PUBLIC_BACKEND_URL

ENV NEXT_PUBLIC_BACKEND_URL=${NEXT_PUBLIC_BACKEND_URL}

# required to install global dependencies using pnpm
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

FROM base AS builder
RUN apk add --no-cache libc6-compat
RUN apk update

WORKDIR /app
# this is required to use pnpm
RUN corepack enable 
RUN pnpm i -g turbo
COPY . .
RUN turbo prune --scope web --docker


FROM base AS installer
RUN apk add --no-cache libc6-compat
RUN apk update
WORKDIR /app

RUN corepack enable
COPY .gitignore .gitignore
# Build the project
COPY --from=builder /app/out/full/ .
COPY --from=builder /app/.env .
RUN pnpm install
RUN pnpx turbo run build --filter web 

FROM base AS runner
WORKDIR /app
RUN corepack enable

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs
USER nextjs

COPY --from=installer  --chown=nextjs:nodejs /app/ .
CMD ["pnpm", "start"]