import { Global, Logger, Module } from '@nestjs/common';
import { LogService } from './log.service';
import { MongoModule } from '../db/mongodb/mongo.module';
@Global()
@Module({
  imports: [MongoModule],
  providers: [
    LogService,
    {
      provide: Logger,
      useValue: new Logger('LogService'),
    },
  ],
  exports: [LogService],
})
export class LogModule {}
