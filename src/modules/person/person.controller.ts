import { Controller, Post, Body, Get } from '@nestjs/common';

import { ValidateRequest } from 'src/utils/zod/decorators';
import { PersonService } from './person.service';
import {
  RegisterPersonDto,
  registerPersonSchema,
  RegisterPersonSchemaData,
} from './schemas/registerPerson';
import { ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Person } from 'src/@entities/person';

@Controller('person')
export class PersonController {
  constructor(private readonly personService: PersonService) {}

  @ApiOperation({ summary: 'Criar uma pessoa', operationId: 'registerPerson' })
  @ApiResponse({
    status: 201,
    description: 'Pessoa criada com sucesso',
    type: Person,
  })
  @ApiBody({
    description: 'Dados para criação da pessoa',
    type: RegisterPersonDto,
  })
  @Post()
  @ValidateRequest(registerPersonSchema)
  register(@Body() payload: RegisterPersonSchemaData) {
    return this.personService.register(payload);
  }

  @ApiOperation({
    summary: 'Listar todas as pessoas',
    operationId: 'getAllPersons',
  })
  @ApiResponse({
    status: 200,
    description: 'Pessoas listadas com sucesso',
    type: [Person],
  })
  @Get()
  getAllPersons() {
    return this.personService.getAll();
  }
}
