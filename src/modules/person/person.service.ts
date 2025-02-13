import { Injectable } from '@nestjs/common';
import {
  BadRequestError,
  InternalServerError,
} from 'src/common/applicationError';
import { Person } from 'src/@entities/person';
import { PersonRepository } from 'src/repositories/personRepository';
import { getIdentificationType } from 'src/utils/functions/person';
import { amountByPersonType } from 'src/consts/person';

@Injectable()
export class PersonService {
  constructor(private readonly personRepository: PersonRepository) {}

  async register({
    birthdate: birthdateString,
    identification,
    name,
  }: any): Promise<Person> {
    const personExists =
      await this.personRepository.getPersonById(identification);
    if (personExists) {
      throw new BadRequestError({
        message: 'Pessoa já cadastrada',
        action: 'registerPersonUseCase.execute',
        saveLog: true,
        details: {
          identification,
        },
      });
    }

    const birthdate = new Date(birthdateString);
    const identificationType = getIdentificationType(identification);
    const amountLimits = amountByPersonType[identificationType];

    const createdPerson = await this.personRepository.createPerson({
      birthdate,
      identification,
      identificationType,
      name,
      ...amountLimits,
    });

    if (!createdPerson) {
      throw new InternalServerError({
        message: 'Erro ao criar pessoa',
        action: 'registerPersonUseCase.execute',
        saveLog: true,
        details: {
          identification,
          name,
          birthdate,
        },
      });
    }
    return createdPerson;
  }

  async getAll() {
    const persons = await this.personRepository.getAllPersons();
    return persons;
  }
}
