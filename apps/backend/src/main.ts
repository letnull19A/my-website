import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({ origin: true, credentials: true });
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: false,
      transform: true,
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('My Website API')
    .setDescription(
      'Mock API for portfolio site — articles & cases. Source: `docs/api-data-spec.md`. Prefix `/api/v1`. Swagger at `/api/docs` and `/docs`.',
    )
    .setVersion('1.0.0')
    .addServer('http://localhost:4000', 'Local dev (with /api/v1 prefix)')
    .addTag('articles', 'Articles — markdown content, cover, share links')
    .addTag('cases', 'Cases — portfolio works')
    .addTag('meta', 'Service meta')
    .build();

  const document = SwaggerModule.createDocument(app, config);

  // Serve swagger at both /api/docs and /docs (and /api/v1/docs for compat)
  SwaggerModule.setup('api/docs', app, document, {
    customSiteTitle: 'My Website API — Swagger',
    swaggerOptions: { persistAuthorization: true },
  });
  SwaggerModule.setup('docs', app, document, {
    customSiteTitle: 'My Website API — Swagger',
    swaggerOptions: { persistAuthorization: true },
  });
  SwaggerModule.setup('api/v1/docs', app, document, {
    customSiteTitle: 'My Website API — Swagger',
    swaggerOptions: { persistAuthorization: true },
  });

  // Expose OpenAPI JSON/YAML
  // Nest swagger serves JSON at /api/docs-json, we also expose at /api/openapi.json
  const httpAdapter = app.getHttpAdapter();
  httpAdapter.get('/api/openapi.json', (req, res) => res.json(document));
  httpAdapter.get('/openapi.json', (req, res) => res.json(document));
  // For YAML, we keep static file fallback if needed, but JSON is enough
  httpAdapter.get('/api/openapi.yaml', (req, res) =>
    res.redirect('/api/docs-yaml'),
  );

  const port = Number(process.env.PORT ?? 4000);
  const host = process.env.HOST ?? '0.0.0.0';
  await app.listen(port, host);
  console.log(`[backend] NestJS listening on http://${host}:${port}`);
  console.log(`[backend] Swagger UI: http://${host}:${port}/api/docs and /docs`);
  console.log(`[backend] OpenAPI JSON: http://${host}:${port}/api/openapi.json`);
  console.log(`[backend] Articles: http://${host}:${port}/api/v1/articles`);
}
bootstrap();
