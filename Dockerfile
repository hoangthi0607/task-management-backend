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
RUN npm ci --production

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.env ./

EXPOSE 3000

# 💣 RESET DB + SEED + START
CMD ["sh", "-c", "npx prisma migrate reset --force && npx prisma migrate dev 20260330044319_add_user_status  && npm run seed && npm run start"]