import { Injectable } from '@nestjs/common';
import { IPersonRepository } from 'src/repositories/interfaces/personRepository';

@Injectable()
export class GetAllPersonUseCase {
  constructor(private readonly PersonRepository: IPersonRepository) {}
  async execute() {
    const persons = await this.PersonRepository.getAllPersons();
    return persons;
  }
}
