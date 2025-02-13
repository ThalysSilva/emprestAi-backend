import { Test, TestingModule } from '@nestjs/testing';

import { mock } from 'jest-mock-extended';
import { PersonRepository } from 'src/repositories/personRepository';
import { Person } from 'src/@entities/person';
import { PersonService } from './person.service';
import { RegisterPersonSchemaData } from './schemas/registerPerson';
import { amountByPersonType } from 'src/consts/person';
import { getIdentificationType } from 'src/utils/functions/person';

const mockPerson: Person = {
  birthdate: new Date('2023-01-01'),
  identification: '12345678',
  identificationType: 'student',
  maximumTotalAmount: 1000,
  minimumMonthAmount: 100,
  name: 'John Doe',
};

const personRepositoryMock = mock<PersonRepository>({
  getAllPersons: jest.fn().mockResolvedValue([mockPerson]),
  createPerson: jest.fn().mockReturnValue(mockPerson),
  getPersonById: jest.fn().mockReturnValue({
    birthdate: new Date('2023-01-01'),
    identification: '12345678',
    identificationType: 'student',
    maximumTotalAmount: 1000,
    minimumMonthAmount: 100,
    name: 'John Doe',
  } as Person),
});

jest.mock('src/utils/functions/installment', () => ({
  getInstallmentDate: jest.fn().mockReturnValue(new Date('2023-01-01')),
}));

describe('PersonService', () => {
  let service: PersonService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PersonService,
        {
          provide: PersonRepository,
          useValue: personRepositoryMock,
        },
      ],
    }).compile();

    service = module.get<PersonService>(PersonService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create an person', async () => {
    const payload: RegisterPersonSchemaData = {
      birthdate: '2023-01-01',
      identification: '12345678',
      name: 'John Doe',
    };

    const createdPerson = {
      birthdate: new Date('2023-01-01'),
      identification: '12345678',
      identificationType: 'student',
      maximumTotalAmount: 1000,
      minimumMonthAmount: 100,
      name: 'John Doe',
    } as Person;

    personRepositoryMock.getPersonById.mockResolvedValueOnce(null);
    const birthdate = new Date(payload.birthdate);
    const identificationType = getIdentificationType(payload.identification);
    const amountLimits = amountByPersonType[identificationType];

    const result = await service.register(payload);
    expect(personRepositoryMock.createPerson).toHaveBeenCalledWith({
      ...payload,
      ...amountLimits,
      birthdate,
      identificationType,
    });
    personRepositoryMock.createPerson.mockResolvedValue(createdPerson);

    expect(result).toEqual(createdPerson);
  });

  it('should get all persons', async () => {
    const persons: Person[] = [
      {
        birthdate: new Date('2023-01-01'),
        identification: '123456789',
        identificationType: 'student',
        maximumTotalAmount: 1000,
        minimumMonthAmount: 100,
        name: 'John Doe',
      },
    ];

    personRepositoryMock.getAllPersons.mockResolvedValue(persons);

    const result = await service.getAll();
    expect(result).toEqual(persons);
  });
});
