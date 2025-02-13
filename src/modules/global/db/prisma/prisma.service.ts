import {
  Injectable,
  OnModuleInit,
  OnModuleDestroy,
  Logger,
} from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { maskConnectionString } from 'src/utils/formatters/mask';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  private readonly logger = new Logger(PrismaService.name);

  async onModuleInit() {
    await this.$connect();
    const POSTGRES_DATABASE_URL = process.env.POSTGRES_DATABASE_URL;
    this.logger.log(
      `Conectado ao Prisma!! (${maskConnectionString(POSTGRES_DATABASE_URL)})`,
    );
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
