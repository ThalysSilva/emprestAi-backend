import { Provider } from '@nestjs/common';
import { LoanRepository } from 'src/repositories/loanRepository';
import { PrismaLoanRepository } from './repositories/prismaLoanRepository';
import { InstallmentRepository } from 'src/repositories/instalmentRepository';
import { PrismaInstallmentRepository } from './repositories/prismaInstallmentRepository';
import { PersonRepository } from 'src/repositories/personRepository';
import { PrismaPersonRepository } from './repositories/prismaPersonRepository';

export const prismaRepositories = [
  {
    provide: LoanRepository,
    useClass: PrismaLoanRepository,
  },
  {
    provide: InstallmentRepository,
    useClass: PrismaInstallmentRepository,
  },
  {
    provide: PersonRepository,
    useClass: PrismaPersonRepository,
  },
] as Provider[];
