import { Installment } from 'src/@types/entities/loan';
import { OmitDefaultData } from 'src/utils/types';

export interface IInstallmentRepository {
  createInstallment(data: OmitDefaultData<Installment>): Promise<Installment>;
  createInstallments(
    data: OmitDefaultData<Installment>[],
  ): Promise<Prisma.BatchPayload>;
  getInstallmentById(id: string): Promise<Installment>;
  getInstallmentsByLoanId(loanId: string): Promise<Installment[]>;
  updateInstallment(
    id: string,
    data: Partial<OmitDefaultData<Installment>>,
  ): Promise<Installment>;
  deleteInstallment(id: string): Promise<void>;
  getAllInstallments(): Promise<Installment[]>;
}
