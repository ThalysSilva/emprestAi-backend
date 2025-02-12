import { Global, Logger, Module } from '@nestjs/common';
import { MongoClient, Db } from 'mongodb';
import { MongoService } from './mongo.service';
import { mongoAdapters } from './mongoAdapters';
import { mongoRepositories } from './mongoRepositorios';

@Global()
@Module({
  providers: [
    {
      provide: 'MONGO_CONNECTION',
      useFactory: async (): Promise<{ client: MongoClient; db: Db }> => {
        const DATABASE_URL = process.env.MONGO_DATABASE_URL ?? '';
        const DATABASE_NAME = process.env.DATABASE_NAME ?? '';
        const logger = new Logger('MongoService');
        const client = new MongoClient(DATABASE_URL);
        await client.connect();
        logger.log(
          `Conectado ao MongoDB (${DATABASE_URL}). Banco: ${DATABASE_NAME}`,
        );
        const db = client.db(DATABASE_NAME);
        return { client, db };
      },
    },
    MongoService,
    ...mongoAdapters,
    ...mongoRepositories,
  ],

  exports: [MongoService, ...mongoAdapters, ...mongoRepositories],
})
export class MongoModule {}
