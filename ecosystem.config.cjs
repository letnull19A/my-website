// pm2 ecosystem — backend (NestJS Fastify) + frontend (static-сервер для out/)
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
      // Статический export (apps/frontend/out) с clean-URL (/articles -> articles.html)
      name: "frontend",
      script: "node_modules/serve/build/main.js",
      args: ["apps/frontend/out", "-l", "tcp://0.0.0.0:3000", "--no-clipboard"],
      instances: 1,
      exec_mode: "fork",
      autorestart: true,
      max_memory_restart: "300M",
      env: {
        NODE_ENV: "production",
      },
    },
  ],
};

