import { Global, Module } from '@nestjs/common';

import { PrismaService } from './prisma.service';
import { prismaAdapters } from './prismaAdapters';
import { prismaRepositories } from './prismaRepositories';

@Global()
@Module({
  providers: [PrismaService, ...prismaAdapters, ...prismaRepositories],
  exports: [PrismaService, ...prismaAdapters, ...prismaRepositories],
})
export class PrismaModule {}
