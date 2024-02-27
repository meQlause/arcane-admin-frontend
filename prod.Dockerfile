FROM node:18-alpine AS base

# Step 1. Rebuild the source code only when needed
FROM base AS builder

WORKDIR /arcane-frontend

# Install dependencies based on the preferred package manager
COPY package.json ./
# Omit --production flag for TypeScript devDependencies
RUN yarn install --only=production

COPY . .

RUN yarn build

FROM base AS runner

WORKDIR /arcane-frontend

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs
USER nextjs

COPY --from=builder --chown=nextjs:nodejs /arcane-frontend/ .

CMD ["yarn", "start"]
