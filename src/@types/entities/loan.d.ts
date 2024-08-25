export type Loan = {
  id: string;
  personId: string;
  amount: number;
  installmentsQty: number;
  status: 'paid' | 'pending';
  createdAt: Date;
  updatedAt: Date;
  paymentDate?: Date;
  installments?: Installment[];
};

export type Installment = {
  id: string;
  amount: number;
  dueDate: Date;
  status: 'paid' | 'pending';
  loanId: string;
  createdAt: Date;
  updatedAt: Date;
  paymentDate?: Date;
};
