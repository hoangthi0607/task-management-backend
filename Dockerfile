# ---- Stage 1: Build ----
FROM node:18-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

RUN npx prisma generate
RUN npm run build


# ---- Stage 2: Run ----
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY --from=builder /app ./

EXPOSE 3000

# 💣 RESET DB + SEED + START
CMD ["sh", "-c", "npx prisma migrate reset --force && npm run seed && node ../dist/main.js"]