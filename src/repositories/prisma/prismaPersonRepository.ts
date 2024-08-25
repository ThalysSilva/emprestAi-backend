import { PrismaService } from 'src/libs/database/prisma.service';
import { IPersonRepository } from '../interfaces/personRepository';
import { Person } from 'src/@types/entities/person';
import { Injectable } from '@nestjs/common';

@Injectable()
export class PrismaPersonRepository implements IPersonRepository {
  constructor(private prisma: PrismaService) {}
  async createPerson(data: Person): Promise<Person> {
    const person = await this.prisma.person.create({ data });

    return person as Person;
  }
  async getPersonById(identification: string): Promise<Person> {
    const person = await this.prisma.person.findUnique({
      where: { identification },
    });

    return person as Person;
  }
  async updatePerson(
    identification: string,
    data: Partial<Omit<Person, 'identification'>>,
  ): Promise<Person> {
    const updatedPerson = await this.prisma.person.update({
      where: { identification },
      data,
    });

    return updatedPerson as Person;
  }
  async deletePerson(identification: string): Promise<void> {
    await this.prisma.person.delete({ where: { identification } });
  }
  async getAllPersons(): Promise<Person[]> {
    const persons = await this.prisma.person.findMany();

    return persons as Person[];
  }
}
