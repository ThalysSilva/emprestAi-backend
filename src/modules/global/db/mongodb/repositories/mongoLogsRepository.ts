import { ClientSession, Collection, Db, ObjectId } from 'mongodb';
import { Injectable } from '@nestjs/common';
import { LogsRepository } from '../../../../../repositories/logRepository';
import { Log } from 'src/@entities/log';
import { LogsModel } from 'src/modules/global/db/mongodb/models';
import { MongoService } from 'src/modules/global/db/mongodb/mongo.service';

@Injectable()
export class MongoLogsRepository implements LogsRepository {
  private db: Db;
  private collection: Collection<LogsModel>;
  private session: ClientSession | undefined;

  constructor(private mongoService: MongoService) {
    this.db = this.mongoService.getDb();
    this.collection = this.db.collection<LogsModel>('logs');
  }

  defineTransactionContext(contexto: ClientSession): void {
    this.session = contexto;
  }

  removeTransactionContext(): void {
    this.session = undefined;
  }

  async createLog(log: Omit<Log, 'id'>): Promise<void> {
    await this.collection.insertOne(log, { session: this.session });
  }

  async findAll(): Promise<Log[]> {
    const logsEncontrados = await this.collection.find().toArray();

    const logs: Log[] = logsEncontrados.map(({ _id, ...log }) => ({
      ...log,
      id: _id?.toString() ?? '',
    }));

    return logs;
  }

  async findById(id: string): Promise<Log | null> {
    const logEncontrado = await this.collection.findOne({
      _id: new ObjectId(id),
    });

    if (!logEncontrado) {
      return null;
    }

    const { _id, ...log } = logEncontrado;

    return {
      ...log,
      id: _id?.toString() ?? '',
    };
  }

  async findByDate(date: Date): Promise<Log[]> {
    const logsEncontrados = await this.collection
      .find({ criadoEm: date })
      .toArray();

    const logs: Log[] = logsEncontrados.map(({ _id, ...log }) => ({
      ...log,
      id: _id?.toString() ?? '',
    }));

    return logs;
  }

  async findByPeriod(startDate: Date, endDate: Date): Promise<Log[]> {
    const foundLogs = await this.collection
      .find({
        criadoEm: {
          $gte: startDate,
          $lte: endDate,
        },
      })
      .toArray();

    const logs: Log[] = foundLogs.map(({ _id, ...log }) => ({
      ...log,
      id: _id?.toString() ?? '',
    }));

    return logs;
  }
}
