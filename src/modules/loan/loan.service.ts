import { Injectable } from '@nestjs/common';

import { OmitDefaultData } from 'src/utils/types';
import { LoanRepository } from 'src/repositories/loanRepository';
import { InstallmentRepository } from 'src/repositories/instalmentRepository';
import { Installment, Loan } from 'src/@entities/loan';
import { getInstallmentDate } from 'src/utils/functions/installment';
import { InternalServerError } from 'src/common/applicationError';
import { CreateLoanSchemaData } from './schemas/createLoan';

@Injectable()
export class LoanService {
  constructor(
    private readonly loanRepository: LoanRepository,
    private readonly installmentRepository: InstallmentRepository,
  ) {}

  async createLoan(payload: CreateLoanSchemaData): Promise<Loan> {
    const loanPayload = {
      personId: payload.personId,
      amount: payload.amount,
      status: 'pending',
    } as OmitDefaultData<Loan>;

    const createdLoan = await this.loanRepository.createLoan(loanPayload);

    const batchInstallments = Array.from(
      { length: payload.installmentsQty },
      (_, index) => {
        const installmentOrder = index + 1;
        const dueDate = getInstallmentDate(
          createdLoan.createdAt,
          installmentOrder,
        );
        const installmentPayload = {
          loanId: createdLoan.id,
          amount: payload.amount / payload.installmentsQty,
          status: 'pending',
          dueDate,
        } as OmitDefaultData<Installment>;

        return installmentPayload;
      },
    );

    const qtyCreated =
      await this.installmentRepository.createInstallments(batchInstallments);

    if (qtyCreated.count !== payload.installmentsQty) {
      throw new InternalServerError({
        message: 'Error ao criar parcelas',
        action: 'loanService.createLoan',
        details: {
          payload,
        },
      });
    }

    const loanWithInstallments = await this.loanRepository.getLoanById(
      createdLoan.id,
    );

    return loanWithInstallments;
  }

  async getLoans(): Promise<Loan[]> {
    const loans = await this.loanRepository.getAllLoans();

    return loans;
  }

  async payInstallment(payload: { loanId: string }): Promise<Installment> {
    const loan = await this.loanRepository.getLoanById(payload.loanId);
    const installments = loan.installments ?? [];

    if (installments.length === 0) {
      throw new InternalServerError({
        message: 'Esse empréstimo não possui parcelas',
        action: 'loanService.execute',
        details: {
          payload,
        },
      });
    }

    const installmentsToPay = installments.filter(
      (installment) => installment.status === 'pending',
    );

    const installmentToPay = installmentsToPay[0];

    if (!installmentToPay) {
      throw new InternalServerError({
        message: 'Não há parcelas pendentes para esse empréstimo',
        action: 'loanService.execute',
        details: {
          payload,
        },
      });
    }

    const isLastInstallment = installmentsToPay.length === 1;

    const updatedInstallment =
      await this.installmentRepository.updateInstallment(installmentToPay.id, {
        status: 'paid',
        paymentDate: new Date(),
      });

    if (isLastInstallment) {
      await this.loanRepository.updateLoan(payload.loanId, {
        status: 'paid',
      });
    }

    return updatedInstallment;
  }
}
