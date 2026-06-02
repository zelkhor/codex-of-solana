import type { CardDto, Result } from '@codex/shared';
import type { AppError } from '@codex/shared';
import type { ICardGateway } from '@/gateways/card.gateway';
import type { HttpClient } from '@/gateways/http-client';

export class CardApiGateway implements ICardGateway {
  constructor(private readonly http: HttpClient) {}

  getAll(): Promise<Result<CardDto[], AppError>> {
    return this.http.get<CardDto[]>('/api/cards');
  }
}
