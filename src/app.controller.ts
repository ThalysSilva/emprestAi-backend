import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

import { ApiOperation, ApiTags } from '@nestjs/swagger';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @ApiTags('health')
  @ApiOperation({ summary: 'Rota de health da aplicação' })
  @Get()
  getHealth(): string {
    return this.appService.getService();
  }
}
