import Fuse from 'fuse.js';

import type { Card } from '@codex/core';

import type { ISearchGateway } from '@/domain/card-catalog/infrastructure/search.gateway.ts';

export class FuseSearchGateway implements ISearchGateway {
  private fuse: Fuse<Card> | null = null;

  index(cards: Card[]): void {
    this.fuse = new Fuse(cards, {
      keys: [
        { name: 'name', weight: 0.7 },
        { name: 'cardIdentifier', weight: 0.15 },
        { name: 'classes', weight: 0.05 },
        { name: 'talents', weight: 0.05 },
        { name: 'types', weight: 0.025 },
        { name: 'subtypes', weight: 0.025 },
        { name: 'keywords', weight: 0.025 },
      ],
      threshold: 0.2,
      distance: 60,
      minMatchCharLength: 2,
      includeScore: true,
    });
  }

  search(query: string): Card[] {
    if (!this.fuse) return [];
    return this.fuse.search(query).map((r) => r.item);
  }
}
