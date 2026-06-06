import type { Card, Result } from '@codex/core';
import type { AppError } from '@codex/core';

export interface ICardCatalogGateway {
  getCards(): Promise<Result<Card[], AppError>>;
}
