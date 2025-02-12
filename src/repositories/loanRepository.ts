import { Loan } from '@/@entities/loan';
import { OmitDefaultData } from '@/utils/types';

export abstract class LoanRepository {
  abstract createLoan(
    data: OmitDefaultData<Loan>,
  ): Promise<Omit<Loan, 'installments'>>;
  abstract getLoanById(id: string): Promise<Loan>;
  abstract getLoanByPersonId(personId: string): Promise<Loan>;
  abstract updateLoan(
    id: string,
    data: Partial<OmitDefaultData<Loan>>,
  ): Promise<Omit<Loan, 'installments'>>;
  abstract deleteLoan(id: string): Promise<void>;
  abstract getAllLoans(): Promise<Loan[]>;
}
