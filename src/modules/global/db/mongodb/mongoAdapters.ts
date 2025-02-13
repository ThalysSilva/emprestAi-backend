import { AdapterDb } from 'src/adapters/db/adapterDb';
import { MongoAdapterDb } from 'src/adapters/db/mongoAdapterDb';

export const mongoAdapters = [
  {
    provide: AdapterDb,
    useClass: MongoAdapterDb,
  },
];
