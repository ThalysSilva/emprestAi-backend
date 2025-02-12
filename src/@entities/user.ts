import { ApiExtraModels, ApiProperty } from '@nestjs/swagger';

@ApiExtraModels()
export class User {
  @ApiProperty({ example: '1', description: 'Identificador único do usuário' })
  id: string;
  @ApiProperty({ example: 'João da Silva', description: 'Nome do usuário' })
  name: string;
  @ApiProperty({
    example: 'email@email.com',
    description: 'Email do usuário',
  })
  email: string;
  @ApiProperty({
    example: '2021-09-20T00:00:00.000Z',
    description: 'Data de criação do usuário',
  })
  createdAt: Date;
  @ApiProperty({
    example: '2021-09-20T00:00:00.000Z',
    description: 'Data de atualização do usuário',
  })
  updatedAt: Date;
  @ApiProperty({
    example: '2021-09-20T00:00:00.000Z',
    description: 'Data de exclusão do usuário',
  })
  refreshToken?: string | null;
}

export class UserWithPassword extends User {
  @ApiProperty({
    example: 'senha123',
    description: 'Senha do usuário',
  })
  password: string;
}
