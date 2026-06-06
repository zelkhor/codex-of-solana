import type { Card } from '@codex/core';
import type { ISearchGateway } from '@/domain/card-catalog/infrastructure/search.gateway.ts';

export class InMemorySearchGateway implements ISearchGateway {
  private cards = new Map<string, Card>();

  index(cards: Card[]): void {
    cards.forEach((card) => {
      this.cards.set(card.cardIdentifier, card);
    });
  }

  search(query: string): Card[] {
    const q = query.toLowerCase();
    return [...this.cards.values()].filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.cardIdentifier.toLowerCase().includes(q) ||
        c.classes.some((cls) => cls.toLowerCase().includes(q)) ||
        c.keywords.some((k) => k.toLowerCase().includes(q)),
    );
  }
}
