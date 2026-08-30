import { Controller, Get } from '@nestjs/common';

@Controller('api/v1')
export class HealthController {
  @Get('health')
  health() {
    return { status: 'ok', uptime: process.uptime() };
  }
}

@Controller()
export class HealthAliasController {
  @Get('health')
  health() {
    return { status: 'ok', uptime: process.uptime() };
  }

  @Get('api/health')
  apiHealth() {
    return { status: 'ok', uptime: process.uptime() };
  }
}
