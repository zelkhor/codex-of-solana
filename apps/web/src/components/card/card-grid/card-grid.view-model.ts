import type { Card, Printing } from '@codex/core';

export type CardSlot = { card: Card; printing: Printing; backPrinting?: Printing };
export type CardRow = { slots: CardSlot[] };

export const buildCardGridRows = (cards: Card[]): CardRow[] => {
  const slots: CardSlot[] = cards.flatMap((card) =>
    card.printings.map((printing) => ({
      card,
      printing,
      backPrinting: printing.backPrinting ?? undefined,
    })),
  );
  const rows: CardRow[] = [];
  for (let i = 0; i < slots.length; i += 3) {
    rows.push({ slots: slots.slice(i, i + 3) });
  }
  return rows;
};
