import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { Person } from 'src/@types/entities/person';
import { amountByPersonType } from 'src/consts/person';
import { PersonRepository } from 'src/repositories/contracts/personRepository';
import { getIdentificationType } from 'src/utils/functions/person';

type Payload = Pick<Person, 'identification' | 'name'> & { birthdate: string };

@Injectable()
export class RegisterPersonUseCase {
  constructor(private readonly personRepository: PersonRepository) {}

  async execute({
    birthdate: birthdateString,
    identification,
    name,
  }: Payload): Promise<Person> {
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
      throw new InternalServerErrorException('Error on creating person');
    }
    return createdPerson;
  }
}
