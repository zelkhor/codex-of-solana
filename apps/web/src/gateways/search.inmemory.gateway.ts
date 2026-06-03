import type { Card } from '@codex/core';
import type { ISearchGateway } from '@/gateways/search.gateway';

export class InMemorySearchGateway implements ISearchGateway {
  private items: Card[] = [];

  index(items: Card[]): void {
    this.items = items as Card[];
  }

  search(query: string): Card[] {
    const q = query.toLowerCase();
    return this.items.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.cardIdentifier.toLowerCase().includes(q) ||
        c.classes.some((cls) => cls.toLowerCase().includes(q)) ||
        c.keywords.some((k) => k.toLowerCase().includes(q)),
    );
  }
}
