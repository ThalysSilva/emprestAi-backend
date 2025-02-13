import { Injectable } from '@nestjs/common';
import { AdapterDb } from './adapterDb';
import { Prisma } from '@prisma/client';
import { Repository } from 'src/repositories/repository';
import {
  defineTransactionContexts,
  removeTransactionContexts,
} from 'src/utils/functions/repositories';
import { PrismaService } from 'src/modules/global/db/prisma/prisma.service';

@Injectable()
export class PrismaAdapterDb implements AdapterDb {
  constructor(private prismaService: PrismaService) {}

  async makeTransaction<T>(
    operation: (session: Prisma.TransactionClient) => Promise<T>,
    repositories: Repository[],
    config?: {
      maxWait?: number;
      timeout?: number;
      isolationLevel?: Prisma.TransactionIsolationLevel;
    },
  ): Promise<T> {
    return await this.prismaService.$transaction(
      async (session) => {
        try {
          defineTransactionContexts({ repositories, context: session });
          const result = await operation(session);
          return result;
        } catch (error) {
          throw error;
        } finally {
          removeTransactionContexts({ repositories });
        }
      },
      {
        timeout: 30000,
        maxWait: 5000,
        isolationLevel: Prisma.TransactionIsolationLevel.Serializable,
        ...config,
      },
    );
  }
}
