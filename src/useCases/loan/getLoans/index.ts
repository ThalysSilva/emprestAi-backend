import { Injectable } from '@nestjs/common';
import { Loan } from 'src/@types/entities/loan';
import { ILoanRepository } from 'src/repositories/interfaces/loanRepository';

@Injectable()
export class GetLoansUseCase {
  constructor(private loanRepository: ILoanRepository) {}

  async execute(): Promise<Loan[]> {
    const loans = await this.loanRepository.getAllLoans();

    return loans;
  }
}
