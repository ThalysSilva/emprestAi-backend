import { Test, TestingModule } from '@nestjs/testing';
import { InternalServerErrorException } from '@nestjs/common';
import { PayInstallmentUseCase } from './index';
import { InstallmentRepository } from 'src/repositories/contracts/instalmentRepository';
import { LoanRepository } from 'src/repositories/contracts/loanRepository';
import { Installment, Loan } from 'src/@types/entities/loan';

describe('PayLoanUseCase', () => {
  let payLoanUseCase: PayInstallmentUseCase;
  let loanRepository: jest.Mocked<LoanRepository>;
  let installmentRepository: jest.Mocked<InstallmentRepository>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PayInstallmentUseCase,
        {
          provide: 'LoanRepository',
          useValue: {
            getLoanById: jest.fn(),
          },
        },
        {
          provide: 'InstallmentRepository',
          useValue: {
            updateInstallment: jest.fn(),
          },
        },
      ],
    }).compile();

    payLoanUseCase = module.get<PayInstallmentUseCase>(PayInstallmentUseCase);
    loanRepository = module.get<jest.Mocked<LoanRepository>>('LoanRepository');
    installmentRepository = module.get<jest.Mocked<InstallmentRepository>>(
      'InstallmentRepository',
    );
  });

  it('should throw an InternalServerErrorException if there are no installments', async () => {
    loanRepository.getLoanById.mockResolvedValue({ installments: [] } as Loan);

    await expect(payLoanUseCase.execute({ loanId: '1' })).rejects.toThrow(
      new InternalServerErrorException('This loan has no installments'),
    );
  });

  it('should throw an InternalServerErrorException if there are no pending installments', async () => {
    loanRepository.getLoanById.mockResolvedValue({
      installments: [
        { id: '1', status: 'paid' },
        { id: '2', status: 'paid' },
      ],
    } as Loan);

    await expect(payLoanUseCase.execute({ loanId: '1' })).rejects.toThrow(
      new InternalServerErrorException('There are no pending installments'),
    );
  });

  it('should call updateInstallment and return the updated installment', async () => {
    const installments = [
      { id: '1', status: 'paid' },
      { id: '2', status: 'pending' },
    ];

    const updatedInstallment = {
      id: '2',
      status: 'paid',
      paymentDate: new Date(),
    } as Installment;

    loanRepository.getLoanById.mockResolvedValue({ installments } as Loan);
    installmentRepository.updateInstallment.mockResolvedValue(
      updatedInstallment,
    );

    const result = await payLoanUseCase.execute({ loanId: '1' });

    expect(installmentRepository.updateInstallment).toHaveBeenCalledWith('2', {
      status: 'paid',
      paymentDate: expect.any(Date),
    });
    expect(result).toEqual(updatedInstallment);
  });
});
