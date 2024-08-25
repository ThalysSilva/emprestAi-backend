import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { Installment } from 'src/@types/entities/loan';
import { IInstallmentRepository } from 'src/repositories/interfaces/instalmentRepository';
import { ILoanRepository } from 'src/repositories/interfaces/loanRepository';

type Payload = {
  loanId: string;
};

@Injectable()
export class PayInstallmentUseCase {
  constructor(
    private readonly loanRepository: ILoanRepository,
    private readonly installmentRepository: IInstallmentRepository,
  ) {}

  async execute(payload: Payload): Promise<Installment> {
    const loan = await this.loanRepository.getLoanById(payload.loanId);
    const installments = loan.installments ?? [];

    if (installments.length === 0) {
      throw new InternalServerErrorException('This loan has no installments');
    }

    const installmentsToPay = installments.filter(
      (installment) => installment.status === 'pending',
    );

    const installmentToPay = installmentsToPay[0];

    if (!installmentToPay) {
      throw new InternalServerErrorException(
        'There are no pending installments',
      );
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
