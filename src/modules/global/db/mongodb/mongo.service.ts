import { Injectable, OnModuleDestroy, Logger, Inject } from '@nestjs/common';
import { MongoClient, Db, ClientSession } from 'mongodb';
import { Repository } from 'src/repositories/repository';
import {
  defineTransactionContexts,
  removeTransactionContexts,
} from 'src/utils/functions/repositories';

@Injectable()
export class MongoService implements OnModuleDestroy {
  private client: MongoClient;
  private db: Db;
  private readonly logger = new Logger(MongoService.name);

  constructor(
    @Inject('MONGO_CONNECTION') connection: { client: MongoClient; db: Db },
  ) {
    this.client = connection.client;
    this.db = connection.db;
    this.logger = new Logger(MongoService.name);
  }

  getDb(): Db {
    return this.db;
  }

  async onModuleDestroy() {
    await this.client.close();
    this.logger.log('Desconectado do MongoDB');
  }
  async makeTransaction<T>(
    operation: (session: ClientSession) => Promise<T>,
    repositories: Repository[],
  ): Promise<T> {
    const session = this.client.startSession();
    session.startTransaction();
    defineTransactionContexts({ repositories: repositories, context: session });

    try {
      const dadosRetornados = await operation(session);
      await session.commitTransaction();
      return dadosRetornados;
    } catch (error) {
      await session.abortTransaction();
      this.logger.error('Transação abortada pelo seguinte erro:', error);
      throw error;
    } finally {
      removeTransactionContexts({ repositories: repositories });
      session.endSession();
    }
  }
}
