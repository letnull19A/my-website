FROM node:24-alpine AS builder

WORKDIR /app

RUN npm install -g pnpm@11

COPY package.json ./

RUN pnpm install --dangerously-allow-all-builds

COPY . .

RUN pnpm build

FROM node:24-alpine

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=4000
ENV HOST=0.0.0.0

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/data ./data
COPY --from=builder /app/openapi.yaml ./openapi.yaml

EXPOSE 4000

CMD ["node", "dist/main.js"]
