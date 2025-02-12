import { Controller, Post, Body, Get, Param } from '@nestjs/common';

import { ValidateRequest } from '@/utils/zod/decorators';
import { LoanService } from './loan.service';
import {
  CreateLoanDto,
  createLoanSchema,
  CreateLoanSchemaData,
} from './schemas/createLoan';
import { ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Installment, Loan } from '@/@entities/loan';

@Controller('loan')
export class LoanController {
  constructor(private readonly loanService: LoanService) {}

  @ApiOperation({ summary: 'Criar empréstimo', operationId: 'createLoan' })
  @ApiBody({
    description: 'Dados para criação do empréstimo',
    type: CreateLoanDto,
  })
  @ApiResponse({
    status: 201,
    description: 'Empréstimo criado com sucesso',
    type: Loan,
  })
  @ApiResponse({
    status: 400,
    description: 'Erro de validação nos campos enviados',
  })
  @Post()
  @ValidateRequest(createLoanSchema)
  createLoan(@Body() payload: CreateLoanSchemaData) {
    return this.loanService.createLoan(payload);
  }

  @ApiOperation({ summary: 'Pagar parcela', operationId: 'payInstallment' })
  @ApiResponse({
    status: 200,
    description: 'Parcela paga com sucesso',
    type: Installment,
  })
  @ApiResponse({
    status: 400,
    description: 'Erro de validação nos campos enviados',
  })
  @Post('/pay-installment/:loanId')
  payInstallment(@Param('loanId') loanId: string) {
    return this.loanService.payInstallment({ loanId });
  }

  @ApiOperation({ summary: 'Listar empréstimos', operationId: 'getLoans' })
  @ApiResponse({
    status: 200,
    description: 'Empréstimos listados com sucesso',
    type: [Loan],
  })
  @ApiResponse({
    status: 400,
    description: 'Erro de validação nos campos enviados',
  })
  @Get()
  getLoans() {
    return this.loanService.getLoans();
  }
}
