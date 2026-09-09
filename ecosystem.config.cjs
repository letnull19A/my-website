// pm2 ecosystem — backend (NestJS Fastify) + frontend (Next.js SSR, next start)
// Запуск: pnpm pm2:start  |  pnpm pm2:status  |  pnpm pm2:logs

module.exports = {
  apps: [
    {
      name: "backend",
      cwd: "apps/backend",
      script: "dist/main.js",
      instances: 1,
      exec_mode: "fork",
      autorestart: true,
      max_memory_restart: "500M",
      env: {
        NODE_ENV: "production",
        PORT: 4000,
        HOST: "0.0.0.0",
      },
    },
    {
      // Next.js SSR (standalone-сервер через next start, порт 3000)
      name: "frontend",
      cwd: "apps/frontend",
      script: "node_modules/next/dist/bin/next",
      args: ["start", "-p", "3000", "-H", "0.0.0.0"],
      instances: 1,
      exec_mode: "fork",
      autorestart: true,
      max_memory_restart: "500M",
      env: {
        NODE_ENV: "production",
        PORT: 3000,
        HOSTNAME: "0.0.0.0",
      },
    },
  ],
};

