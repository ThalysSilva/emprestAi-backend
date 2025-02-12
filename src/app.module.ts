import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER } from '@nestjs/core';
import { ExceptionFilterTreatment } from './common/filters/exceptionFilter';
import { LogModule } from './modules/global/logs/log.module';
import { HttpModule } from '@nestjs/axios';
import { PrismaModule } from './modules/global/db/prisma/prisma.module';
import { MongoModule } from './modules/global/db/mongodb/mongo.module';
import { PersonModule } from './modules/person/person.module';
import { LoanModule } from './modules/loan/loan.module';

@Module({
  imports: [
    LogModule,
    MongoModule,
    PrismaModule,
    PersonModule,
    LoanModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    HttpModule.register({
      global: true,
    }),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_FILTER,
      useClass: ExceptionFilterTreatment,
    },
  ],
})
export class AppModule {}
