import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { Installment, Loan } from 'src/@types/entities/loan';
import { IInstallmentRepository } from 'src/repositories/interfaces/instalmentRepository';
import { ILoanRepository } from 'src/repositories/interfaces/loanRepository';
import { getInstallmentDate } from 'src/utils/functions/installment';
import { OmitDefaultData } from 'src/utils/types';

type Payload = {
  userId: string;
  amount: number;
  installmentsQty: number;
};

@Injectable()
export class CreateLoanUseCase {
  constructor(
    private readonly loanRepository: ILoanRepository,
    private readonly instalmentRepository: IInstallmentRepository,
  ) {}

  async execute(payload: Payload): Promise<Loan> {
    const loanPayload = {
      personId: payload.userId,
      amount: payload.amount,
      installmentsQty: payload.installmentsQty,
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
          number: index + 1,
          status: 'pending',
          dueDate,
        } as OmitDefaultData<Installment>;

        return installmentPayload;
      },
    );

    const qtyCreated =
      await this.instalmentRepository.createInstallments(batchInstallments);

    if (qtyCreated.count !== payload.installmentsQty) {
      throw new InternalServerErrorException('Error on creating installments');
    }

    return createdLoan;
  }
}
