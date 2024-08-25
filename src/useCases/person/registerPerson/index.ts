import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { Person } from 'src/@types/entities/person';
import { amountByPersonType } from 'src/consts/person';
import { IPersonRepository } from 'src/repositories/interfaces/personRepository';
import { getIdentificationType } from 'src/utils/functions/person';

type Payload = Pick<Person, 'birthdate' | 'identification' | 'name'>;

@Injectable()
export class RegisterPersonUseCase {
  constructor(private readonly personRepository: IPersonRepository) {}

  async execute({ birthdate, identification, name }: Payload): Promise<Person> {
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
