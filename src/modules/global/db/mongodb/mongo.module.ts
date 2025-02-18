import { Global, Logger, Module } from '@nestjs/common';
import { MongoClient, Db } from 'mongodb';
import { MongoService } from './mongo.service';
import { mongoAdapters } from './mongoAdapters';
import { mongoRepositories } from './mongoRepositorios';
import { maskConnectionString } from 'src/utils/formatters/mask';

@Global()
@Module({
  providers: [
    {
      provide: 'MONGO_CONNECTION',
      useFactory: async (): Promise<{ client: MongoClient; db: Db }> => {
        const DATABASE_URL = process.env.MONGO_DATABASE_URL ?? '';
        const MONGO_DATABASE_NAME = process.env.MONGO_DATABASE_NAME ?? '';
        const logger = new Logger('MongoService');
        const client = new MongoClient(DATABASE_URL);
        await client.connect();
        logger.log(
          `Conectado ao MongoDB (${maskConnectionString(DATABASE_URL)}). Banco: ${MONGO_DATABASE_NAME}`,
        );
        const db = client.db(MONGO_DATABASE_NAME);
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
