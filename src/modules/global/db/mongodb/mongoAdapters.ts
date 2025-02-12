import { AdapterDb } from '@/adapters/db/adapterDb';
import { MongoAdapterDb } from '@/adapters/db/mongoAdapterDb';

export const mongoAdapters = [
  {
    provide: AdapterDb,
    useClass: MongoAdapterDb,
  },
];
