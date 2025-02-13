import { Repository } from 'src/repositories/repository';

export abstract class AdapterDb {
  abstract makeTransaction<T>(
    operacao: (context: unknown) => Promise<T>,
    repositories: Repository[],
    config?: any,
  ): Promise<T>;
}
