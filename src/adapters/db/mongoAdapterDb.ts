import { Injectable } from '@nestjs/common';
import { AdapterDb } from './adapterDb';
import { ClientSession } from 'mongodb';
import { MongoService } from 'src/modules/global/db/mongodb/mongo.service';
import { Repository } from 'src/repositories/repository';

@Injectable()
export class MongoAdapterDb implements AdapterDb {
  constructor(private mongo: MongoService) {}

  async makeTransaction<T>(
    operation: (sessao: ClientSession) => Promise<T>,
    repositorio: Repository[],
  ): Promise<T> {
    return await this.mongo.makeTransaction(operation, repositorio);
  }
}
