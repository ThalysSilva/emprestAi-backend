import { Person } from 'src/@types/entities/person';

export interface IPersonRepository {
  createPerson(data: Person): Promise<Person>;
  getPersonById(identification: string): Promise<Person>;
  updatePerson(
    identification: string,
    data: Partial<Omit<Person, 'identification'>>,
  ): Promise<Person>;
  deletePerson(identification: string): Promise<void>;
  getAllPersons(): Promise<Person[]>;
}
