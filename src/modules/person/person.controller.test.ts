import { Test, TestingModule } from '@nestjs/testing';
import { mock } from 'jest-mock-extended';
import { PersonService } from './person.service';
import { PersonController } from './person.controller';
import { RegisterPersonSchemaData } from './schemas/registerPerson';
import { Person } from '@/@entities/person';

const personServiceMock = mock<PersonService>();

describe('PersonController', () => {
  let controller: PersonController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PersonController],
      providers: [{ provide: PersonService, useValue: personServiceMock }],
    }).compile();

    controller = module.get<PersonController>(PersonController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should register a new person', async () => {
    const personInput: RegisterPersonSchemaData = {
      birthdate: '2023-01-01',
      identification: '123456789',
      name: 'John Doe',
    };

    const createdPerson: Person = {
      ...personInput,
      birthdate: new Date(personInput.birthdate),
      identificationType: 'student',
      maximumTotalAmount: 1000,
      minimumMonthAmount: 100,
    };

    personServiceMock.register.mockResolvedValueOnce(createdPerson);

    const result = await controller.register(personInput);

    expect(result).toEqual(createdPerson);
    expect(personServiceMock.register).toHaveBeenCalledTimes(1);
    expect(personServiceMock.register).toHaveBeenCalledWith(personInput);
  });

  it('should list all persons', async () => {
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

    personServiceMock.getAll.mockResolvedValueOnce(persons);

    const result = await controller.getAllPersons();

    expect(result).toEqual(persons);
    expect(personServiceMock.getAll).toHaveBeenCalledTimes(1);
  });
});
