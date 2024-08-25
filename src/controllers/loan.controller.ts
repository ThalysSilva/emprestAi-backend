import { Controller, Post, Body, UsePipes, Param, Get } from '@nestjs/common';

import { ZodValidationPipe } from 'src/libs/pipes/zod.pipe';
import { CreateLoanUseCase } from 'src/useCases/loan/createLoan';
import { PayInstallmentUseCase } from 'src/useCases/loan/payInstallment';
import {
  CreateLoanDto,
  createLoanSchema,
} from 'src/schemas/loan/createLoanSchema';
import { GetLoansUseCase } from 'src/useCases/loan/getLoans';

@Controller('loan')
export class LoanController {
  constructor(
    private readonly createLoanUseCase: CreateLoanUseCase,
    private readonly payInstallmentUseCase: PayInstallmentUseCase,
    private readonly getLoansUseCase: GetLoansUseCase,
  ) {}

  @Post()
  @UsePipes(new ZodValidationPipe(createLoanSchema))
  createLoan(@Body() payload: CreateLoanDto) {
    return this.createLoanUseCase.execute(payload);
  }
  @Post('/pay-installment/:loanId')
  payInstallment(@Param('loanId') loanId: string) {
    return this.payInstallmentUseCase.execute({ loanId });
  }

  @Get()
  getLoans() {
    return this.getLoansUseCase.execute();
  }
}
