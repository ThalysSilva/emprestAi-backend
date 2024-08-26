import { PrismaService } from 'src/libs/database/prisma.service';
import { Loan } from 'src/@types/entities/loan';
import { Injectable } from '@nestjs/common';
import { OmitDefaultData } from 'src/utils/types';
import { LoanRepository } from '../contracts/loanRepository';

@Injectable()
export class PrismaLoanRepository implements LoanRepository {
  constructor(private readonly prisma: PrismaService) {}
  async createLoan(
    data: Omit<OmitDefaultData<Loan>, 'installments' | 'person'>,
  ): Promise<Loan> {
    const loan = await this.prisma.loan.create({ data });

    return loan as Loan;
  }

  async getLoanById(id: string): Promise<Loan> {
    const loan = await this.prisma.loan.findUnique({
      where: { id },
      include: { installments: true, person: true },
    });

    return loan as Loan;
  }

  async getLoanByPersonId(personId: string): Promise<Loan> {
    const loan = await this.prisma.loan.findFirst({
      where: { personId },
      include: { installments: true, person: true },
    });

    return loan as Loan;
  }

  async updateLoan(
    id: string,
    data: Omit<OmitDefaultData<Loan>, 'installments' | 'person'>,
  ): Promise<Loan> {
    const updatedLoan = await this.prisma.loan.update({
      where: { id },
      data,
    });

    return updatedLoan as Loan;
  }

  async deleteLoan(id: string): Promise<void> {
    await this.prisma.loan.delete({ where: { id } });
  }

  async getAllLoans(): Promise<Loan[]> {
    const loans = await this.prisma.loan.findMany({
      include: { installments: true, person: true },
    });

    return loans as Loan[];
  }
}
