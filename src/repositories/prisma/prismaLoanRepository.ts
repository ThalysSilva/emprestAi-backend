import { PrismaService } from 'src/libs/database/prisma.service';
import { ILoanRepository } from '../interfaces/loanRepository';
import { Loan } from 'src/@types/entities/loan';
import { Injectable } from '@nestjs/common';
import { OmitDefaultData } from 'src/utils/types';

@Injectable()
export class PrismaLoanRepository implements ILoanRepository {
  constructor(private readonly prisma: PrismaService) {}
  async createLoan(
    data: Omit<OmitDefaultData<Loan>, 'installments'>,
  ): Promise<Loan> {
    const loan = await this.prisma.loan.create({ data });

    return loan as Loan;
  }

  async getLoanById(id: string): Promise<Loan> {
    const loan = await this.prisma.loan.findUnique({
      where: { id },
      include: { installments: true },
    });

    return loan as Loan;
  }

  async getLoanByPersonId(personId: string): Promise<Loan> {
    const loan = await this.prisma.loan.findFirst({
      where: { personId },
      include: { installments: true },
    });

    return loan as Loan;
  }

  async updateLoan(
    id: string,
    data: Omit<OmitDefaultData<Loan>, 'installments'>,
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
      include: { installments: true },
    });

    return loans as Loan[];
  }
}
