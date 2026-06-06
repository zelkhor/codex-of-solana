import type { Card } from '@codex/core';

export interface ISearchGateway {
  index(cards: Card[]): void;
  search(query: string): Card[];
}
