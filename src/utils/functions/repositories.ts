import { Repository } from 'src/repositories/repository';

type Props = {
  repositories: Repository[];
  context: unknown;
};

export function defineTransactionContexts({ repositories, context }: Props) {
  repositories.forEach((repositorio) => {
    repositorio.defineTransactionContext(context);
  });
}

export function removeTransactionContexts({
  repositories,
}: Pick<Props, 'repositories'>) {
  repositories.forEach((repositorio) => {
    repositorio.removeTransactionContext();
  });
}
