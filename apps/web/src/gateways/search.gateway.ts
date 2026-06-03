import type { Card } from '@codex/core';

export interface ISearchGateway {
  index(items: Card[]): void;
  search(query: string): Card[];
}
