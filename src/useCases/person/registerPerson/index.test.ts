import { Test, TestingModule } from '@nestjs/testing';
import { RegisterPersonUseCase } from './index';
import { IPersonRepository } from 'src/repositories/interfaces/personRepository';
import { Person } from 'src/@types/entities/person';
import { InternalServerErrorException } from '@nestjs/common';
import { getIdentificationType } from 'src/utils/functions/person';
import { amountByPersonType } from 'src/consts/person';

jest.mock('src/utils/functions/person');
jest.mock('src/consts/person');

describe('RegisterPersonUseCase', () => {
  let registerPersonUseCase: RegisterPersonUseCase;
  let personRepository: jest.Mocked<IPersonRepository>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RegisterPersonUseCase,
        {
          provide: 'IPersonRepository',
          useValue: {
            createPerson: jest.fn(),
          },
        },
      ],
    }).compile();

    registerPersonUseCase = module.get<RegisterPersonUseCase>(
      RegisterPersonUseCase,
    );
    personRepository =
      module.get<jest.Mocked<IPersonRepository>>('IPersonRepository');
  });

  it('should call createPerson on the repository and return the created person', async () => {
    const payload = {
      birthdate: new Date('1990-01-01'),
      identification: '15574841711',
      name: 'John Doe',
    };

    const identificationType = 'naturalPerson';
    const amountLimits = amountByPersonType[identificationType];

    const createdPerson: Person = {
      ...payload,
      identificationType,
      ...amountLimits,
    };

    (getIdentificationType as jest.Mock).mockReturnValue(identificationType);

    personRepository.createPerson.mockResolvedValue(createdPerson);

    const result = await registerPersonUseCase.execute(payload);

    expect(getIdentificationType).toHaveBeenCalledWith(payload.identification);
    expect(personRepository.createPerson).toHaveBeenCalledWith(createdPerson);
    expect(result).toEqual(createdPerson);
  });

  it('should throw an InternalServerErrorException if createPerson returns null', async () => {
    const payload = {
      birthdate: new Date('1990-01-01'),
      identification: '15574841711',
      name: 'John Doe',
    };

    const identificationType = 'naturalPerson';

    (getIdentificationType as jest.Mock).mockReturnValue(identificationType);

    personRepository.createPerson.mockResolvedValue(null);

    await expect(registerPersonUseCase.execute(payload)).rejects.toThrow(
      new InternalServerErrorException('Error on creating person'),
    );
  });
});
