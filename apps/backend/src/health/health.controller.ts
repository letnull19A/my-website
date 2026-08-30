import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('meta')
@Controller('api/v1')
export class HealthController {
  @Get('health')
  @ApiOperation({ summary: 'Health check (prefixed)', operationId: 'healthPrefixed' })
  health() {
    return { status: 'ok', uptime: process.uptime() };
  }
}

@ApiTags('meta')
@Controller()
export class HealthAliasController {
  @Get('health')
  @ApiOperation({ summary: 'Health check (alias)' })
  health() {
    return { status: 'ok', uptime: process.uptime() };
  }

  @Get('api/health')
  @ApiOperation({ summary: 'Health check (api alias)' })
  apiHealth() {
    return { status: 'ok', uptime: process.uptime() };
  }
}
