import { Module } from '@nestjs/common';
import { PersonRepository } from './repositories/contracts/personRepository';
import { PrismaPersonRepository } from './repositories/prisma/prismaPersonRepository';
import { LoanRepository } from './repositories/contracts/loanRepository';
import { PrismaLoanRepository } from './repositories/prisma/prismaLoanRepository';
import { InstallmentRepository } from './repositories/contracts/instalmentRepository';
import { PrismaInstallmentRepository } from './repositories/prisma/prismaInstallmentRepository';
import { PrismaService } from './libs/database/prisma.service';
import { CreateLoanUseCase } from './useCases/loan/createLoan';
import { GetLoansUseCase } from './useCases/loan/getLoans';
import { PayInstallmentUseCase } from './useCases/loan/payInstallment';
import { RegisterPersonUseCase } from './useCases/person/registerPerson';
import { GetAllPersonUseCase } from './useCases/person/getAllPerson';
import { LoanController } from './controllers/loan.controller';
import { PersonController } from './controllers/person.controller';

@Module({
  imports: [],
  controllers: [LoanController, PersonController],
  providers: [
    PrismaService,
    CreateLoanUseCase,
    GetLoansUseCase,
    PayInstallmentUseCase,
    GetAllPersonUseCase,
    RegisterPersonUseCase,
    {
      provide: PersonRepository,
      useClass: PrismaPersonRepository,
    },
    {
      provide: LoanRepository,
      useClass: PrismaLoanRepository,
    },
    {
      provide: InstallmentRepository,
      useClass: PrismaInstallmentRepository,
    },
  ],
})
export class AppModule {}
