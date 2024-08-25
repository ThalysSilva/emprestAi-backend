import { Injectable } from '@nestjs/common';
import { PersonRepository } from 'src/repositories/contracts/personRepository';

@Injectable()
export class GetAllPersonUseCase {
  constructor(private readonly PersonRepository: PersonRepository) {}
  async execute() {
    const persons = await this.PersonRepository.getAllPersons();
    return persons;
  }
}
