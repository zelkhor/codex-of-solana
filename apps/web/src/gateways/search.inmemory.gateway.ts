import type { CardDto } from '@codex/shared';
import type { ISearchGateway } from '@/gateways/search.gateway';

export class InMemorySearchGateway implements ISearchGateway {
  private items: CardDto[] = [];

  index(items: unknown[]): void {
    this.items = items as CardDto[];
  }

  search(query: string): unknown[] {
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
