# syntax=docker/dockerfile:1
# Build del frontend dentro del monorepo pnpm (workspace con lock en la raíz).
# Contexto de build: raíz del repositorio.

FROM node:20-alpine AS build

WORKDIR /repo

# Copiar config del monorepo y del workspace
COPY package.json pnpm-workspace.yaml pnpm-lock.yaml ./
COPY frontend/package.json ./frontend/package.json

# Instalar dependencias del workspace (solo frontend)
RUN corepack enable \
    && pnpm install --frozen-lockfile

# Copiar código del frontend y construir
COPY frontend ./frontend
RUN pnpm --dir frontend build

# ------------------------------------------------------------------
# Etapa runtime: Nginx + proxy reverso hacia el backend
# ------------------------------------------------------------------
FROM nginx:1.27-alpine

COPY --from=build /repo/frontend/dist /usr/share/nginx/html
COPY frontend/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
