# Multi-stage Dockerfile for NestJS backend

# 1) Install all deps (including dev) for building
FROM node:20-alpine AS deps
WORKDIR /app
COPY package*.json ./
RUN npm install --no-audit --no-fund

# 2) Build the app
FROM node:20-alpine AS build
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# 3) Production image with only prod deps and built dist
FROM node:20-alpine AS prod
WORKDIR /app
ENV NODE_ENV=production

# Install only production dependencies
COPY package*.json ./
RUN npm install --omit=dev --no-audit --no-fund && npm cache clean --force

# Copy compiled code
COPY --from=build /app/dist ./dist

# If you have any runtime assets (e.g., public/), copy them as well
# COPY --from=build /app/public ./public

EXPOSE 3001
CMD ["node", "dist/main.js"]
