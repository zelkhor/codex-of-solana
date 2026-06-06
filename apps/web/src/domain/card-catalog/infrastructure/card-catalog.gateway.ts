import type { AppError, Card, Result } from '@codex/core';

export interface ICardCatalogGateway {
  getCards(): Promise<Result<Card[], AppError>>;
}
