import type { AppError, Card, Result } from '@codex/core';

import type { HttpClient } from '@/shared/gateways/http-client.ts';

import type { ICardCatalogGateway } from '@/domain/card-catalog/infrastructure/card-catalog.gateway.ts';

export class CardCatalogApiGateway implements ICardCatalogGateway {
  constructor(private readonly http: HttpClient) {}

  getCards(): Promise<Result<Card[], AppError>> {
    return this.http.get<Card[]>('/api/cards');
  }
}
