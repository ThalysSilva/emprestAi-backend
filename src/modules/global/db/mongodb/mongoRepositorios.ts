import { LogsRepository } from 'src/repositories/logRepository';

import { MongoLogsRepository } from 'src/modules/global/db/mongodb/repositories/mongoLogsRepository';
import { Provider } from '@nestjs/common';

export const mongoRepositories = [
  {
    provide: LogsRepository,
    useClass: MongoLogsRepository,
  },
] as Provider[];
