import type { Card, Result } from '@codex/core';
import type { AppError } from '@codex/core';
import type { ICardGateway } from '@/gateways/card.gateway';
import type { HttpClient } from '@/gateways/http-client';

export class CardApiGateway implements ICardGateway {
  constructor(private readonly http: HttpClient) {}

  getAll(): Promise<Result<Card[], AppError>> {
    return this.http.get<Card[]>('/api/cards');
  }
}
