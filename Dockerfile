# Use a specific version of Node
FROM node:18-alpine AS base

ARG DATABASE_URL
ARG SKIP_ENV_VALIDATION="true"

# Set up environment for pnpm
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

# Install corepack and Turbo
RUN apk add --no-cache libc6-compat \
    && apk update \
    && corepack enable \
    && pnpm i -g turbo

# Create a builder stage
FROM base AS builder

# Install libc6-compat (required for some dependencies)
RUN apk add --no-cache libc6-compat \
    && apk update

# Set working directory and copy project files
WORKDIR /app
COPY . .

# Prune dependencies using Turbo
RUN turbo prune --scope web --docker

# Create an installer stage
FROM base AS installer

# Install libc6-compat (required for some dependencies)
RUN apk add --no-cache libc6-compat \
    && apk update

# Set working directory and copy project files
WORKDIR /app
COPY .gitignore .gitignore
COPY --from=builder /app/out/json/ .
COPY --from=builder /app/out/pnpm-lock.yaml ./pnpm-lock.yaml
COPY --from=builder /app/out/pnpm-workspace.yaml ./pnpm-workspace.yaml

# Copy project files from the builder stage
COPY --from=builder /app/out/full/ .

# Install dependencies using pnpm
RUN corepack enable && pnpm install

COPY ./tsconfig.json .
COPY ./.eslintrc.cjs .

# Build the project
RUN pnpx turbo run build --filter web

COPY ./run-nextjs.sh .

# Create a runner stage
FROM base AS runner

# Set working directory
WORKDIR /app

# Install corepack
RUN corepack enable

# Add a system group and user for running the app
RUN addgroup --system --gid 1001 nodejs \
    && adduser --system --uid 1001 nextjs

# Copy project files from the installer stage
COPY --from=installer --chown=nextjs:nodejs /app/ .
RUN chmod +x ./run-nextjs.sh

USER nextjs


CMD ["sh","./run-nextjs.sh"]