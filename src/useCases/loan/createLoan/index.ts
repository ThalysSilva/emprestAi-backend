import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { Installment, Loan } from 'src/@types/entities/loan';
import { InstallmentRepository } from 'src/repositories/contracts/instalmentRepository';
import { LoanRepository } from 'src/repositories/contracts/loanRepository';
import { getInstallmentDate } from 'src/utils/functions/installment';
import { OmitDefaultData } from 'src/utils/types';

type Payload = {
  personId: string;
  amount: number;
  installmentsQty: number;
};

@Injectable()
export class CreateLoanUseCase {
  constructor(
    private readonly loanRepository: LoanRepository,
    private readonly instalmentRepository: InstallmentRepository,
  ) {}

  async execute(payload: Payload): Promise<Loan> {
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
      await this.instalmentRepository.createInstallments(batchInstallments);

    if (qtyCreated.count !== payload.installmentsQty) {
      throw new InternalServerErrorException('Error ao criar parcelas');
    }

    const loanWithInstallments = await this.loanRepository.getLoanById(
      createdLoan.id,
    );

    return loanWithInstallments;
  }
}
