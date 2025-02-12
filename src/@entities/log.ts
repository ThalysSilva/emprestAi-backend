import { ApiExtraModels, ApiProperty } from '@nestjs/swagger';

@ApiExtraModels()
export class Log {
  @ApiProperty({ example: '1', description: 'Identificador único do log' })
  id: string;
  @ApiProperty({ example: 'Mensagem de erro', description: 'Mensagem do log' })
  message: string;
  @ApiProperty({
    example: { details: 'detalhes do erro' },
    description: 'Detalhes do log',
  })
  details: any;
  @ApiProperty({
    example: 'UserService.create',
    description: 'Ação que gerou o log',
  })
  action: string;
  @ApiProperty({
    example: 'ERROR | INFO | WARN',
    description: 'Tipo do log',
  })
  type: LogType;
  @ApiProperty({
    example: '2021-09-20T00:00:00.000Z',
    description: 'Data de criação do log',
  })
  createdAt: string;
}

export type LogType = 'INFO' | 'ERROR' | 'WARN';
