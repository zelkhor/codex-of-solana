import type { ICardGateway } from '@/gateways/card.gateway';
import type { ISearchGateway } from '@/gateways/search.gateway';

export type { ICardGateway, ISearchGateway };

export interface ThunkDependencies {
  cardGateway: ICardGateway;
  searchGateway: ISearchGateway;
  collectionGateway: unknown;
  authGateway: unknown;
}
