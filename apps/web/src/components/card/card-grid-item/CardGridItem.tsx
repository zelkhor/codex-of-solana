import { useState } from 'react';
import type { Card, Printing } from '@codex/core';
import { FlipHorizontal2 } from 'lucide-react';
import { CardBack } from '@/components/card/CardBack';
import { buildCardGridItemViewModel } from './card-grid-item.view-model';
import { TiltCard } from '@/components/card/TiltCard';

interface CardGridItemProps {
  card: Card;
  printing: Printing;
  backPrinting?: Printing;
  onClick: (rect: DOMRect) => void;
}

export const CardGridItem = ({ card, printing, backPrinting, onClick }: CardGridItemProps) => {
  const [imgLoaded, setImgLoaded] = useState(false);
  const [imgError, setImgError] = useState(false);
  const [flipped, setFlipped] = useState(false);

  const activePrinting = flipped && backPrinting ? backPrinting : printing;
  const vm = buildCardGridItemViewModel(activePrinting);

  const handleFlip = (e: { stopPropagation: () => void }) => {
    e.stopPropagation();
    setFlipped((f) => !f);
    setImgLoaded(false);
    setImgError(false);
  };

  return (
    <div className="relative w-full max-w-72 sm:w-44 sm:max-w-none lg:w-48 2xl:w-60 shrink-0">
      <TiltCard
        className="w-full aspect-5/7 cursor-pointer"
        effect={vm.tiltEffect}
        onClick={onClick}
      >
        {!imgLoaded && !imgError && <div className="absolute inset-0 rounded-lg animate-pulse" />}
        {imgError ? (
          <CardBack className="w-full h-full" />
        ) : (
          <img
            src={vm.imageUrl}
            alt={card.name}
            loading="lazy"
            onLoad={() => setImgLoaded(true)}
            onError={() => setImgError(true)}
            className={`w-full h-full rounded-lg object-cover transition-opacity duration-300 ${imgLoaded ? 'opacity-100' : 'opacity-0'}`}
          />
        )}
      </TiltCard>
      {backPrinting && (
        <button
          onClick={handleFlip}
          className="absolute bottom-2 right-2 z-10 p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
          title={flipped ? 'Show front' : 'Show back'}
        >
          <FlipHorizontal2 size={18} />
        </button>
      )}
    </div>
  );
};
