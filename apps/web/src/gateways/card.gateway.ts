import type { CardDto, Result } from '@codex/shared';
import type { AppError } from '@codex/shared';

export interface ICardGateway {
  getAll(): Promise<Result<CardDto[], AppError>>;
}
