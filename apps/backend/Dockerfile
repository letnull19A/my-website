FROM node:24-alpine

WORKDIR /app

RUN npm install -g pnpm@11

COPY package.json ./

RUN pnpm install --dangerously-allow-all-builds

COPY . .

ENV NODE_ENV=production
ENV PORT=4000
ENV HOST=0.0.0.0

EXPOSE 4000

CMD ["node", "server.js"]
