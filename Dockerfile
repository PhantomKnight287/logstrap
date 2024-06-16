# Use a specific version of Node
FROM node:18-alpine AS base

ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser

# Set up environment for pnpm
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

# Install corepack and Turbo
RUN apk add --no-cache libc6-compat \
    && apk update \
    && corepack enable \
    && pnpm i -g turbo@1.10.16

# Create a builder stage
FROM base AS builder

# Install libc6-compat (required for some dependencies)
RUN apk add --no-cache libc6-compat \
    && apk update

# Set working directory and copy project files
WORKDIR /app
COPY . .

# Prune dependencies using Turbo
RUN turbo prune --scope backend --docker

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
RUN corepack enable \
    && pnpm install

# Build the project
RUN pnpm turbo run build --filter backend

# Create a runner stage
FROM base AS runner

# Set working directory
WORKDIR /app

# Install corepack
RUN corepack enable

# Add a system group and user for running the app
RUN addgroup --system --gid 1001 nodejs \
    && adduser --system --uid 1001 nestjs

# Copy project files from the installer stage
COPY --from=installer --chown=nestjs:nodejs /app/ .

# Switch to the nestjs user and set the default command
USER nestjs
CMD ["pnpm", "start"]