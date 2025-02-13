import { Test, TestingModule } from '@nestjs/testing';
import { mock } from 'jest-mock-extended';
import { LoanService } from './loan.service';
import { LoanController } from './loan.controller';
import { CreateLoanSchemaData } from './schemas/createLoan';
import { Installment, Loan } from 'src/@entities/loan';

const loanServiceMock = mock<LoanService>();

describe('UserController', () => {
  let controller: LoanController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LoanController],
      providers: [{ provide: LoanService, useValue: loanServiceMock }],
    }).compile();

    controller = module.get<LoanController>(LoanController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create a new Loan', async () => {
    const loanInput: CreateLoanSchemaData = {
      personId: '1',
      amount: 1000,
      installmentsQty: 5,
    };

    const createdUser: Loan = {
      ...loanInput,
      id: '1',
      createdAt: new Date(),
      updatedAt: new Date(),
      person: expect.any(Object),
      status: 'pending',
      installments: expect.any(Array),
      paymentDate: undefined,
    };

    loanServiceMock.createLoan.mockResolvedValueOnce(createdUser);

    const result = await controller.createLoan(loanInput);

    expect(result).toEqual(createdUser);
    expect(loanServiceMock.createLoan).toHaveBeenCalledTimes(1);
    expect(loanServiceMock.createLoan).toHaveBeenCalledWith(loanInput);
  });

  it('should return a list of Loans', async () => {
    const loans: Loan[] = [
      {
        id: '1',
        personId: '1',
        amount: 1000,
        status: 'pending',
        createdAt: new Date(),
        updatedAt: new Date(),
        person: expect.any(Object),
        installments: expect.any(Array),
        paymentDate: undefined,
      },
    ];

    loanServiceMock.getLoans.mockResolvedValueOnce(loans);

    const result = await controller.getLoans();

    expect(result).toEqual(loans);
    expect(loanServiceMock.getLoans).toHaveBeenCalledTimes(1);
  });

  it('should pay an installment', async () => {
    const loanId = '1';

    const installment: Installment = {
      id: '1',
      amount: 200,
      status: 'pending',
      dueDate: new Date(),
      loanId,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    loanServiceMock.payInstallment.mockResolvedValueOnce(installment);

    const result = await controller.payInstallment(loanId);

    expect(result).toEqual(installment);
    expect(loanServiceMock.payInstallment).toHaveBeenCalledTimes(1);
    expect(loanServiceMock.payInstallment).toHaveBeenCalledWith({ loanId });
  });
});
