import { AdapterDb } from 'src/adapters/db/adapterDb';
import { PrismaAdapterDb } from 'src/adapters/db/prismaAdapterDb';

export const prismaAdapters = [
  {
    provide: AdapterDb,
    useClass: PrismaAdapterDb,
  },
];
