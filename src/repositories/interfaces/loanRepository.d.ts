import { Loan } from 'src/@types/entities/loan';
import { OmitDefaultData } from 'src/utils/types';

export interface ILoanRepository {
  createLoan(data: OmitDefaultData<Loan>): Promise<Omit<Loan, 'installments'>>;
  getLoanById(id: string): Promise<Loan>;
  getLoanByPersonId(personId: string): Promise<Loan>;
  updateLoan(
    id: string,
    data: Partial<OmitDefaultData<Loan>>,
  ): Promise<Omit<Loan, 'installments'>>;
  deleteLoan(id: string): Promise<void>;
  getAllLoans(): Promise<Loan[]>;
}
