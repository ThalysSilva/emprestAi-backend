import { Controller, Get, Post, Body, UsePipes } from '@nestjs/common';
import { RegisterPersonUseCase } from 'src/useCases/person/registerPerson';
import { GetAllPersonUseCase } from 'src/useCases/person/getAllPerson';
import {
  RegisterPersonDto,
  registerPersonSchema,
} from 'src/schemas/person/registerPersonSchema';
import { ZodValidationPipe } from 'src/libs/pipes/zod.pipe';

@Controller('person')
export class PersonController {
  constructor(
    private readonly registerPersonUseCase: RegisterPersonUseCase,
    private readonly getAllPersonUseCase: GetAllPersonUseCase,
  ) {}

  @Post()
  @UsePipes(new ZodValidationPipe(registerPersonSchema))
  register(@Body() registerPersonDto: RegisterPersonDto) {
    return this.registerPersonUseCase.execute(registerPersonDto);
  }
  @Get()
  getAll() {
    return this.getAllPersonUseCase.execute();
  }
}
