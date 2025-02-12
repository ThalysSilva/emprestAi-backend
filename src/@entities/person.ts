import { ApiExtraModels, ApiProperty } from '@nestjs/swagger';

export type PersonIdentificationType =
  | 'naturalPerson'
  | 'legalPerson'
  | 'student'
  | 'retiree';

@ApiExtraModels()
export class AmountLimits {
  @ApiProperty({ example: 100, description: 'Valor mínimo por mês' })
  minimumMonthAmount: number;
  @ApiProperty({ example: 1000, description: 'Valor máximo total' })
  maximumTotalAmount: number;
}

export class Person extends AmountLimits {
  @ApiProperty({ example: 'João da Silva', description: 'Nome da pessoa' })
  name: string;
  @ApiProperty({
    example: '12345678900',
    description: 'Identificação da pessoa',
  })
  identification: string;
  @ApiProperty({
    example: '1990-01-01T00:00:00.000Z',
    description: 'Data de nascimento da pessoa',
  })
  birthdate: Date;
  @ApiProperty({
    example: 'naturalPerson',
    description: 'Tipo de identificação da pessoa',
  })
  identificationType: PersonIdentificationType;
}
