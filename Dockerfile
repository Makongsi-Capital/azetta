FROM oven/bun:1.4.4-slim AS base
WORKDIR /app

# ── Shared deps ───────────────────────────────────────────────────────────────
# Copy all package manifests so bun can resolve the workspace graph
FROM base AS deps
COPY package.json bun.lock ./

COPY packages/config/package.json   ./packages/config/package.json
COPY packages/db/package.json       ./packages/db/package.json

COPY apps/api/package.json          ./apps/api/package.json
COPY apps/web/package.json          ./apps/web/package.json
COPY apps/admin/package.json        ./apps/admin/package.json

RUN bun install --frozen-lockfile


# ── Prisma CodeGen (Generated once, shared by API, Admin, & Web) ───────────
FROM base AS prisma-base
# bun installs a node_modules per workspace package (prisma CLI + generators,
# vite/svelte, ...), not everything at /app/node_modules, so copy the whole
# installed tree from deps.
COPY --from=deps /app ./

COPY packages/db/package.json                   ./packages/db/package.json
COPY packages/db/prisma                         ./packages/db/prisma
COPY packages/db/prisma.config.ts               ./packages/db/prisma.config.ts
COPY packages/db/tsconfig.json                  ./packages/db/tsconfig.json

# Shared tsconfig presets (apps extend @azetta/config/tsconfig/*)
COPY packages/config/package.json               ./packages/config/package.json
COPY packages/config/tsconfig                   ./packages/config/tsconfig

# Generate Prisma client types once inside packages/db/src/generated.
# Run from packages/db so bunx resolves the local prisma CLI and prisma.config.ts
RUN cd packages/db && DATABASE_URL="postgresql://build:build@localhost:5432/build?schema=public" bunx prisma generate




# ── 4. Migrator Target ────────────────────────────────────────────────────────
FROM prisma-base AS migrator
WORKDIR /app
# Prisma sources for @azetta/db (generated client already lives in src/generated)
COPY packages/db/src ./packages/db/src
COPY apps/api ./apps/api

# prisma.config.ts in packages/db points at prisma/schema.prisma + prisma/migrations
CMD ["sh", "-c", "cd /app/packages/db && bunx prisma migrate deploy && cd /app && bun apps/api/scripts/seed.ts"]


# ── 5. API Builder ────────────────────────────────────────────────────────────
FROM prisma-base AS builder-api
# @azetta/db sources + generated client so the workspace import graph resolves
COPY packages/db/src ./packages/db/src
COPY apps/api/src ./apps/api/src
COPY apps/api/tsconfig.json ./apps/api/tsconfig.json
WORKDIR /app/apps/api
RUN bun build --compile --target bun --outfile server src/index.ts

# ── 6. Admin Builder ──────────────────────────────────────────────────────────
FROM prisma-base AS builder-admin
COPY apps/admin ./apps/admin
WORKDIR /app/apps/admin
RUN bun run build

# ── 7. Web Builder ────────────────────────────────────────────────────────────
FROM prisma-base AS builder-web
COPY apps/web ./apps/web
WORKDIR /app/apps/web
RUN bun run build




# ── 8. API Runner Target ──────────────────────────────────────────────────────
FROM base AS runner-api
WORKDIR /app
ENV NODE_ENV=production PORT=3000
COPY --from=builder-api /app/apps/api/server ./server
USER bun
EXPOSE 3000
ENTRYPOINT ["./server"]

# ── 9. Admin Runner Target ────────────────────────────────────────────────────
FROM base AS runner-admin
WORKDIR /app
ENV NODE_ENV=production HOST=0.0.0.0 PORT=3000
COPY --from=builder-admin /app/apps/admin/build ./build
COPY apps/admin/package.json ./
USER bun
EXPOSE 3000
CMD ["bun", "build/index.js"]

# ── 10. Web Runner Target ─────────────────────────────────────────────────────
FROM base AS runner-web
WORKDIR /app
ENV NODE_ENV=production HOST=0.0.0.0 PORT=3000
COPY --from=builder-web /app/apps/web/build ./build
COPY apps/web/package.json ./
USER bun
EXPOSE 3000
CMD ["bun", "build/index.js"]