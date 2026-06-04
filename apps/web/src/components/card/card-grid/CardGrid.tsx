import { useRef } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';
import type { Card, Printing } from '@codex/core';
import { buildCardGridRows } from './card-grid.view-model';
import { CardGridItem } from '@/components/card/card-grid-item/CardGridItem';

interface CardGridProps {
  cards: Card[];
  onCardClick: (card: Card, printing: Printing, rect: DOMRect) => void;
}

const CARD_ROW_HEIGHT = 280;

export const CardGrid = ({ cards, onCardClick }: CardGridProps) => {
  const parentRef = useRef<HTMLDivElement>(null);
  const rows = buildCardGridRows(cards);

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
                {row.slots.map((slot) => (
                  <CardGridItem
                    key={slot.card.cardIdentifier + slot.printing.print}
                    card={slot.card}
                    printing={slot.printing}
                    backPrinting={slot.backPrinting}
                    onClick={(rect) => onCardClick(slot.card, slot.printing, rect)}
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
