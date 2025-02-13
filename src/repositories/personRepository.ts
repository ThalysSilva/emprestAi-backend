import { Person } from 'src/@entities/person';

export abstract class PersonRepository {
  abstract createPerson(data: Person): Promise<Person>;
  abstract getPersonById(identification: string): Promise<Person | null>;
  abstract updatePerson(
    identification: string,
    data: Partial<Omit<Person, 'identification'>>,
  ): Promise<Person>;
  abstract deletePerson(identification: string): Promise<void>;
  abstract getAllPersons(): Promise<Person[]>;
}
