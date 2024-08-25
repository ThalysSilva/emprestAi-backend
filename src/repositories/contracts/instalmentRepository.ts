import { Prisma } from '@prisma/client';
import { Installment } from 'src/@types/entities/loan';
import { OmitDefaultData } from 'src/utils/types';

export abstract class InstallmentRepository {
  abstract createInstallment(
    data: OmitDefaultData<Installment>,
  ): Promise<Installment>;
  abstract createInstallments(
    data: OmitDefaultData<Installment>[],
  ): Promise<Prisma.BatchPayload>;
  abstract getInstallmentById(id: string): Promise<Installment>;
  abstract getInstallmentsByLoanId(loanId: string): Promise<Installment[]>;
  abstract updateInstallment(
    id: string,
    data: Partial<OmitDefaultData<Installment>>,
  ): Promise<Installment>;
  abstract deleteInstallment(id: string): Promise<void>;
  abstract getAllInstallments(): Promise<Installment[]>;
}
