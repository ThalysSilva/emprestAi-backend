import { ApiExtraModels, ApiProperty } from '@nestjs/swagger';
import { Person } from './person';

@ApiExtraModels()
export class Installment {
  @ApiProperty({ example: '1', description: 'Identificador único da parcela' })
  id: string;
  @ApiProperty({ example: 100, description: 'Valor da parcela' })
  amount: number;
  @ApiProperty({
    example: '2021-09-20T00:00:00.000Z',
    description: 'Data de vencimento da parcela',
  })
  dueDate: Date;
  @ApiProperty({
    example: 'paid',
    description: 'Status da parcela',
  })
  status: 'paid' | 'pending';
  @ApiProperty({
    example: '1',
    description: 'Identificador único do empréstimo',
  })
  loanId: string;
  @ApiProperty({
    example: '2021-09-20T00:00:00.000Z',
    description: 'Data de criação da parcela',
  })
  createdAt: Date;
  @ApiProperty({
    example: '2021-09-20T00:00:00.000Z',
    description: 'Data de atualização da parcela',
  })
  updatedAt: Date;
  @ApiProperty({
    example: '2021-09-20T00:00:00.000Z',
    description: 'Data de pagamento da parcela',
  })
  paymentDate?: Date;
}

@ApiExtraModels()
export class Loan {
  @ApiProperty({
    example: '1',
    description: 'Identificador único do empréstimo',
  })
  id: string;
  @ApiProperty({
    example: '1',
    description: 'Identificador único da pessoa',
  })
  personId: string;
  @ApiProperty({ example: 100, description: 'Valor do empréstimo' })
  amount: number;
  status: 'paid' | 'pending';
  createdAt: Date;
  updatedAt: Date;
  paymentDate?: Date;
  installments?: Installment[];
  person: Person;
}
