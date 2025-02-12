export abstract class Repository {
  abstract defineTransactionContext(contexto: unknown): void;
  abstract removeTransactionContext(): void;
}
