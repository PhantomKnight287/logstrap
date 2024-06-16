FROM node:18-alpine AS base

# Set up environment for pnpm
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"


# Install corepack and Turbo
RUN apk add --no-cache libc6-compat \
    && apk update \
    && corepack enable 

# Set working directory and copy project files
WORKDIR /app
COPY . .

RUN pnpm install
RUN pnpm build

CMD [ "pnpm","start" ]