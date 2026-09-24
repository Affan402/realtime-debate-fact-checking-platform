# ============================================================
# STAGE 1 — builder: a node environment that compiles the app.
# This stage is THROWN AWAY after the build — the final image
# never contains node, dev tools, or your source code.
# ============================================================
FROM node:22-alpine AS builder
WORKDIR /app

# Layer caching: copy dependency manifests FIRST, install, THEN copy source.
# A code change re-runs only "COPY . ." — "npm ci" is served from cache.
# NOTE: no --omit=dev! vite/typescript/@vitejs/plugin-react live in
# devDependencies and are REQUIRED to run the build.
COPY package*.json ./
RUN npm ci

# Copy the rest of the source code
COPY . .

# Build-time configuration. Vite bakes import.meta.env.VITE_* into the
# bundle the moment "npm run build" executes — there is NO runtime
# override possible. Docker automatically exposes ARG values as env
# vars to RUN commands in this stage, so Vite sees them.
ARG VITE_API_URL=/api
ARG VITE_SOCKET_URL=http://localhost:8080

RUN npm run build

# ============================================================
# STAGE 2 — serve: a tiny nginx image holding only static files.
# Final image ≈ 50MB instead of ≈ 1GB — that's the whole point
# of multi-stage builds.
# ============================================================
FROM nginx:alpine

# SPA routing + /api proxy + WebSocket proxy rules (rarely changes — copied first)
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Static build output from stage 1 (Vite's default outDir is "dist")
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]