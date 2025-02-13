import { Test, TestingModule } from '@nestjs/testing';

import { InternalServerError } from 'src/common/applicationError';
import { mock } from 'jest-mock-extended';
import { LoanService } from './loan.service';
import { LoanRepository } from 'src/repositories/loanRepository';
import { InstallmentRepository } from 'src/repositories/instalmentRepository';
import { Installment, Loan } from 'src/@entities/loan';
import { CreateLoanSchemaData } from './schemas/createLoan';
import { getInstallmentDate } from 'src/utils/functions/installment';
import { OmitDefaultData } from 'src/utils/types';

jest.mock('src/utils/functions/installment', () => ({
  getInstallmentDate: jest.fn().mockReturnValue(new Date('2023-01-01')),
}));

const mockInstallmentUpdated = {
  id: '1',
  status: 'paid',
  paymentDate: new Date(),
} as Installment;

const dateNow = new Date();

const mockInstallments = [
  {
    id: '1',
    status: 'pending',
    amount: 333.33,
    dueDate: dateNow,
    createdAt: dateNow,
    updatedAt: dateNow,
    loanId: '1',
    paymentDate: dateNow,
  },
  {
    id: '2',
    status: 'pending',
    amount: 333.33,
    dueDate: dateNow,
    createdAt: dateNow,
    updatedAt: dateNow,
    loanId: '1',
    paymentDate: dateNow,
  },
  {
    id: '3',
    status: 'pending',
    amount: 333.33,
    dueDate: dateNow,
    createdAt: dateNow,
    updatedAt: dateNow,
    loanId: '1',
    paymentDate: dateNow,
  },
] as Installment[];

const mockLoan = {
  id: '1',
  personId: 'user1',
  amount: 1000,
  status: 'pending',
  createdAt: new Date('2023-01-01'),
  person: expect.any(Object),
  updatedAt: new Date('2023-01-01'),
  paymentDate: new Date(),
  installments: mockInstallments,
} as Loan;

const mockCreatedLoan = {
  amount: 1000,
  id: '1',
  personId: 'user1',
  status: 'pending',
  createdAt: new Date('2023-01-01'),
  updatedAt: new Date('2023-01-01'),
  paymentDate: expect.any(Date),
  person: expect.any(Object),
  installments: mockInstallments,
} as Loan;

const installmentRepositoryMock = mock<InstallmentRepository>({
  createInstallments: jest.fn().mockResolvedValue({
    count: 3,
  }),
  updateInstallment: jest.fn().mockResolvedValue(mockInstallmentUpdated),
});

const loanRepositoryMock = mock<LoanRepository>({
  createLoan: jest.fn().mockResolvedValue(mockCreatedLoan),
  getLoanById: jest.fn().mockResolvedValue(mockLoan),
});

describe('LoanService', () => {
  let service: LoanService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LoanService,
        {
          provide: LoanRepository,
          useValue: loanRepositoryMock,
        },
        {
          provide: InstallmentRepository,
          useValue: installmentRepositoryMock,
        },
      ],
    }).compile();

    service = module.get<LoanService>(LoanService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should call createLoan and createInstallments on the repositories with correct parameters', async () => {
    const payload = {
      personId: mockCreatedLoan.personId,
      amount: mockCreatedLoan.amount,
    } as Omit<CreateLoanSchemaData, 'installmentsQty'>;
    const installmentsQty = mockCreatedLoan.installments?.length ?? 1;

    const batchInstallments = Array.from(
      { length: installmentsQty },
      (_, index) => {
        const installmentOrder = index + 1;
        const dueDate = getInstallmentDate(
          mockCreatedLoan.createdAt,
          installmentOrder,
        );
        const installmentPayload = {
          loanId: mockCreatedLoan.id,
          amount: payload.amount / installmentsQty,
          status: 'pending',
          dueDate,
        } as OmitDefaultData<Installment>;

        return installmentPayload;
      },
    );

    const result = await service.createLoan({
      ...payload,
      installmentsQty,
    });
    expect(loanRepositoryMock.createLoan).toHaveBeenCalledWith({
      ...payload,
      status: 'pending',
    });
    expect(installmentRepositoryMock.createInstallments).toHaveBeenCalledWith(
      batchInstallments,
    );
    expect(result).toEqual(mockCreatedLoan);
  });

  it('should throw an InternalServerErrorException if createInstallments returns incorrect count', async () => {
    const payload = {
      personId: 'user1',
      amount: 1000,
      installmentsQty: 5,
    };

    const createdLoan = {
      id: '1',
      createdAt: new Date('2023-01-01'),
      amount: payload.amount,
      status: 'pending',
      personId: payload.personId,
      updatedAt: new Date('2023-01-01'),
    } as Loan;

    loanRepositoryMock.createLoan.mockResolvedValue(createdLoan);

    await expect(service.createLoan(payload)).rejects.toThrow(
      new InternalServerError({
        message: 'Error ao criar parcelas',
        action: 'loanService.createLoan',
        details: {
          payload,
        },
      }),
    );
  });

  it('should throw an InternalServerErrorException if there are no installments', async () => {
    loanRepositoryMock.getLoanById.mockResolvedValueOnce({
      ...mockLoan,
      installments: [],
    });

    await expect(service.payInstallment({ loanId: '1' })).rejects.toThrow(
      new InternalServerError({
        message: 'Esse empréstimo não possui parcelas',
        action: 'loanService.execute',
        details: expect.any(Object),
      }),
    );
  });

  it('should throw an InternalServerErrorException if there are no pending installments', async () => {
    loanRepositoryMock.getLoanById.mockResolvedValueOnce({
      ...mockLoan,
      installments: mockInstallments.map((installment) => ({
        ...installment,
        status: 'paid',
      })),
    });
    await expect(service.payInstallment({ loanId: '1' })).rejects.toThrow(
      new InternalServerError({
        message: 'Não há parcelas pendentes para esse empréstimo',
        action: 'loanService.execute',
        details: expect.any(Object),
      }),
    );
  });

  it('should call updateInstallment and return the updated installment', async () => {
    const mockInstallmentUpdated = {
      id: '1',
      status: 'paid',
      paymentDate: expect.any(Date),
    } as Installment;

    const result = await service.payInstallment({ loanId: '1' });

    expect(installmentRepositoryMock.updateInstallment).toHaveBeenCalledWith(
      '1',
      {
        status: 'paid',
        paymentDate: expect.any(Date),
      },
    );
    expect(result).toEqual(mockInstallmentUpdated);
  });
});
