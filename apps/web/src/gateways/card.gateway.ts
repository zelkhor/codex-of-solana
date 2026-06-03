import type { Card, Result } from '@codex/core';
import type { AppError } from '@codex/core';

export interface ICardGateway {
  getAll(): Promise<Result<Card[], AppError>>;
}
