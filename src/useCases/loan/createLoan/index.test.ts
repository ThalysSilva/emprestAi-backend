import { Test, TestingModule } from '@nestjs/testing';
import { CreateLoanUseCase } from './index';
import { ILoanRepository } from 'src/repositories/interfaces/loanRepository';
import { InternalServerErrorException } from '@nestjs/common';
import { getInstallmentDate } from 'src/utils/functions/installment';
import { IInstallmentRepository } from 'src/repositories/interfaces/instalmentRepository';
import { Loan } from 'src/@types/entities/loan';

jest.mock('src/utils/functions/installment');

describe('CreateLoanUseCase', () => {
  let createLoanUseCase: CreateLoanUseCase;
  let loanRepository: jest.Mocked<ILoanRepository>;
  let installmentRepository: jest.Mocked<IInstallmentRepository>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateLoanUseCase,
        {
          provide: 'ILoanRepository',
          useValue: {
            createLoan: jest.fn(),
          },
        },
        {
          provide: 'IInstallmentRepository',
          useValue: {
            createInstallments: jest.fn(),
          },
        },
      ],
    }).compile();

    createLoanUseCase = module.get<CreateLoanUseCase>(CreateLoanUseCase);
    loanRepository =
      module.get<jest.Mocked<ILoanRepository>>('ILoanRepository');
    installmentRepository = module.get<jest.Mocked<IInstallmentRepository>>(
      'IInstallmentRepository',
    );
  });

  it('should call createLoan and createInstallments on the repositories with correct parameters', async () => {
    const payload = {
      userId: 'user1',
      amount: 1000,
      installmentsQty: 5,
    };

    const createdLoan = {
      id: '1',
      createdAt: new Date('2023-01-01'),
      amount: payload.amount,
      installmentsQty: payload.installmentsQty,
      status: 'pending',
      personId: payload.userId,
      updatedAt: new Date('2023-01-01'),
    } as Loan;

    const expectedLoanPayload = {
      personId: payload.userId,
      amount: payload.amount,
      installmentsQty: payload.installmentsQty,
      status: 'pending',
    };

    const expectedInstallments = Array.from(
      { length: payload.installmentsQty },
      (_, index) => {
        const installmentOrder = index + 1;
        const dueDate = new Date('2023-01-01'); // Mocked due date
        return {
          loanId: createdLoan.id,
          amount: payload.amount / payload.installmentsQty,
          number: installmentOrder,
          status: 'pending',
          dueDate,
        };
      },
    );

    (getInstallmentDate as jest.Mock).mockReturnValue(new Date('2023-01-01'));
    loanRepository.createLoan.mockResolvedValue(createdLoan);
    installmentRepository.createInstallments.mockResolvedValue({
      count: payload.installmentsQty,
    });

    const result = await createLoanUseCase.execute(payload);

    expect(loanRepository.createLoan).toHaveBeenCalledWith(expectedLoanPayload);
    expect(installmentRepository.createInstallments).toHaveBeenCalledWith(
      expectedInstallments,
    );
    expect(result).toEqual(createdLoan);
  });

  it('should throw an InternalServerErrorException if createInstallments returns incorrect count', async () => {
    const payload = {
      userId: 'user1',
      amount: 1000,
      installmentsQty: 5,
    };

    const createdLoan = {
      id: '1',
      createdAt: new Date('2023-01-01'),
      amount: payload.amount,
      installmentsQty: payload.installmentsQty,
      status: 'pending',
      personId: payload.userId,
      updatedAt: new Date('2023-01-01'),
    } as Loan;

    (getInstallmentDate as jest.Mock).mockReturnValue(new Date('2023-01-01'));
    loanRepository.createLoan.mockResolvedValue(createdLoan);
    installmentRepository.createInstallments.mockResolvedValue({ count: 3 });

    await expect(createLoanUseCase.execute(payload)).rejects.toThrow(
      new InternalServerErrorException('Error on creating installments'),
    );
  });
});
