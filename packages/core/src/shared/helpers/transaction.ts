import type { Result } from './result';

export interface TransactionPerformer<Client> {
  perform<R>(fn: (tx: Client) => Promise<Result<R>>): Promise<Result<R>>;
}

export class NullTransactionPerformer implements TransactionPerformer<unknown> {
  async perform<R>(fn: (tx: unknown) => Promise<Result<R>>): Promise<Result<R>> {
    return fn(undefined);
  }
}
