import { Provider } from '@nestjs/common';
import { LoanRepository } from '@/repositories/loanRepository';
import { PrismaLoanRepository } from './repositories/prismaLoanRepository';
import { InstallmentRepository } from '@/repositories/instalmentRepository';
import { PrismaInstallmentRepository } from './repositories/prismaInstallmentRepository';
import { PersonRepository } from '@/repositories/personRepository';
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
