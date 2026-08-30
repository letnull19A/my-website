import { NestFactory } from '@nestjs/core';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { fastifyTRPCPlugin } from '@trpc/server/adapters/fastify';
import { AppModule } from './app.module';
import { TrpcService } from './trpc/trpc.service';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter({ logger: false }),
  );

  // CORS — @fastify/cors is installed; enable for all origins
  await app.register(import('@fastify/cors'), {
    origin: true,
    credentials: true,
  });

  const trpcService = app.get(TrpcService);

  // Mount tRPC on both prefixes
  const fastify = app.getHttpAdapter().getInstance();
  await fastify.register(fastifyTRPCPlugin, {
    prefix: '/api/v1/trpc',
    trpcOptions: {
      router: trpcService.router,
      createContext: trpcService.createContext,
      onError: ({ error, path }) => {
        console.error(`[tRPC] ${path} — ${error.code}: ${error.message}`);
      },
    },
  } as any);

  await fastify.register(fastifyTRPCPlugin, {
    prefix: '/trpc',
    trpcOptions: {
      router: trpcService.router,
      createContext: trpcService.createContext,
    },
  } as any);

  const port = Number(process.env.PORT ?? 4000);
  const host = process.env.HOST ?? '0.0.0.0';
  await app.listen(port, host);
  console.log(`[backend] NestJS (Fastify) listening on http://${host}:${port}`);
  console.log(`[backend] tRPC: http://${host}:${port}/api/v1/trpc and /trpc`);
  console.log(`[backend] health: http://${host}:${port}/health and /api/v1/health`);
}

bootstrap();
