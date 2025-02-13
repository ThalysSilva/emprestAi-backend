import { Log } from 'src/@entities/log';
import { Repository } from './repository';

export abstract class LogsRepository extends Repository {
  abstract createLog(log: Omit<Log, 'id'>): Promise<void>;
  abstract findAll(): Promise<Log[] | null>;
  abstract findById(id: string): Promise<Log | null>;
  abstract findByDate(date: Date): Promise<Log[] | null>;
  abstract findByPeriod(startDate: Date, endDate: Date): Promise<Log[] | null>;
}
