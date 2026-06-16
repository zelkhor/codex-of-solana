import { FlipHorizontal2 } from 'lucide-react';

import type { Card, Printing } from '@codex/core';

import { CardFace } from '@/features/cards/ui/CardFace.tsx';
import { FlipContainer } from '@/features/cards/ui/FlipContainer.tsx';
import { FoilingBadge } from '@/features/cards/ui/FoilingBadge.tsx';

import { useCardGridItemViewModel } from './card-grid-item.view-model.ts';

interface CardGridItemProps {
  card: Card;
  printing: Printing;
  backPrinting?: Printing;
  onClick: (rect: DOMRect) => void;
}

export const CardGridItem = ({ card, printing, backPrinting, onClick }: CardGridItemProps) => {
  const vm = useCardGridItemViewModel(printing, backPrinting);

  return (
    <div className="relative w-full max-w-72 sm:w-44 sm:max-w-none lg:w-48 2xl:w-60 shrink-0">
      {backPrinting ? (
        <FlipContainer
          isFlipped={vm.flipped}
          className="w-full aspect-5/7"
          front={
            <CardFace
              className="w-full h-full cursor-pointer"
              src={printing.image}
              alt={card.name}
              effect={vm.frontTiltEffect}
              onClick={onClick}
              lazy
            />
          }
          back={
            <CardFace
              className="w-full h-full cursor-pointer"
              src={backPrinting.image}
              alt={`${card.name} (back)`}
              effect={vm.backTiltEffect}
              onClick={onClick}
            />
          }
        />
      ) : (
        <CardFace
          className="w-full aspect-5/7 cursor-pointer"
          src={printing.image}
          alt={card.name}
          effect={vm.frontTiltEffect}
          onClick={onClick}
          lazy
        />
      )}
      <div className="absolute top-0 right-0 translate-x-1/2 -translate-y-1/2 z-10 pointer-events-none">
        <FoilingBadge foiling={vm.activePrinting.foiling} />
      </div>
      {backPrinting && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            vm.flip();
          }}
          className="absolute bottom-2 right-2 z-10 p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors cursor-pointer"
          title={vm.flipped ? 'Show front' : 'Show back'}
        >
          <FlipHorizontal2 size={18} />
        </button>
      )}
    </div>
  );
};
