import { useRef } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';
import type { Card, Printing } from '@codex/core';
import type { CardWithActivePrinting } from '@/features/cards/use-cases/list-cards/list-card.selectors.ts';
import { CardGridItem } from '@/features/cards/use-cases/list-cards/CardGridItem.tsx';

interface CardGridProps {
  cardPrintings: CardWithActivePrinting[];
  onCardClick: (card: Card, printing: Printing, rect: DOMRect) => void;
}

const CARD_ROW_HEIGHT = 280;
const CARDS_PER_ROW = 3;

export const CardGrid = ({ cardPrintings, onCardClick }: CardGridProps) => {
  const parentRef = useRef<HTMLDivElement>(null);

  // Virtualizer operates at row level, so group cards into chunks of CARDS_PER_ROW
  const rows: CardWithActivePrinting[][] = [];
  for (let i = 0; i < cardPrintings.length; i += CARDS_PER_ROW) {
    rows.push(cardPrintings.slice(i, i + CARDS_PER_ROW));
  }

  const rowVirtualizer = useVirtualizer({
    count: rows.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => CARD_ROW_HEIGHT,
    measureElement: (el) => el.getBoundingClientRect().height,
    overscan: 15,
  });

  return (
    <div ref={parentRef} className="h-full overflow-auto pt-4 pb-4">
      <div style={{ height: rowVirtualizer.getTotalSize(), position: 'relative' }}>
        {rowVirtualizer.getVirtualItems().map((virtualRow) => {
          const row = rows[virtualRow.index];
          return (
            <div
              key={virtualRow.index}
              ref={rowVirtualizer.measureElement}
              data-index={virtualRow.index}
              style={{ position: 'absolute', top: virtualRow.start, left: 0, right: 0 }}
            >
              <div className="flex flex-col items-center sm:flex-row sm:justify-start gap-6 px-4 sm:px-2 py-3 w-full sm:w-140 lg:w-152 2xl:w-188 mx-auto">
                {row.map((cp) => (
                  <CardGridItem
                    key={cp.card.cardIdentifier + cp.printing.print}
                    card={cp.card}
                    printing={cp.printing}
                    backPrinting={cp.backPrinting}
                    onClick={(rect) => onCardClick(cp.card, cp.printing, rect)}
                  />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
