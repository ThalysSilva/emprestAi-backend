import { Injectable } from '@nestjs/common';
import { Loan } from 'src/@types/entities/loan';
import { LoanRepository } from 'src/repositories/contracts/loanRepository';

@Injectable()
export class GetLoansUseCase {
  constructor(private loanRepository: LoanRepository) {}

  async execute(): Promise<Loan[]> {
    const loans = await this.loanRepository.getAllLoans();

    return loans;
  }
}
