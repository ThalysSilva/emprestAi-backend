import { Test, TestingModule } from '@nestjs/testing';
import { InternalServerErrorException } from '@nestjs/common';
import { PayInstallmentUseCase } from './index';
import { IInstallmentRepository } from 'src/repositories/interfaces/instalmentRepository';
import { ILoanRepository } from 'src/repositories/interfaces/loanRepository';
import { Installment, Loan } from 'src/@types/entities/loan';

describe('PayLoanUseCase', () => {
  let payLoanUseCase: PayInstallmentUseCase;
  let loanRepository: jest.Mocked<ILoanRepository>;
  let installmentRepository: jest.Mocked<IInstallmentRepository>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PayInstallmentUseCase,
        {
          provide: 'ILoanRepository',
          useValue: {
            getLoanById: jest.fn(),
          },
        },
        {
          provide: 'IInstallmentRepository',
          useValue: {
            updateInstallment: jest.fn(),
          },
        },
      ],
    }).compile();

    payLoanUseCase = module.get<PayInstallmentUseCase>(PayInstallmentUseCase);
    loanRepository =
      module.get<jest.Mocked<ILoanRepository>>('ILoanRepository');
    installmentRepository = module.get<jest.Mocked<IInstallmentRepository>>(
      'IInstallmentRepository',
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
