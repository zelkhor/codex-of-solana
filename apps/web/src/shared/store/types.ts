import type { ICardCatalogGateway } from '@/domain/card-catalog/infrastructure/card-catalog.gateway.ts';
import type { ISearchGateway } from '@/domain/card-catalog/infrastructure/search.gateway.ts';

export type { ICardCatalogGateway, ISearchGateway };

export interface ThunkDependencies {
  cardCatalogGateway: ICardCatalogGateway;
  searchGateway: ISearchGateway;
  collectionGateway: unknown;
  authGateway: unknown;
}
