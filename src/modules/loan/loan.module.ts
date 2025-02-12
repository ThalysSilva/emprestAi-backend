import { Module } from '@nestjs/common';
import { LoanController } from './loan.controller';
import { LoanService } from './loan.service';

@Module({
  controllers: [LoanController],
  providers: [LoanService],
  exports: [LoanService],
})
export class LoanModule {}
