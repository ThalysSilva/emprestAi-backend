import { AdapterDb } from '@/adapters/db/adapterDb';
import { PrismaAdapterDb } from '@/adapters/db/prismaAdapterDb';

export const prismaAdapters = [
  {
    provide: AdapterDb,
    useClass: PrismaAdapterDb,
  },
];
