import { type RefObject } from 'react';

import { ChevronLeft, ChevronRight, X } from 'lucide-react';

import type { Card, Printing } from '@codex/core';

import { useKeydown } from '@/shared/hooks/useKeydown.ts';

import { CardDetail } from './CardDetail.tsx';

interface CardDetailModalProps {
  card: Card;
  printing: Printing;
  onClose: () => void;
  onPrev?: () => void;
  onNext?: () => void;
  hasNavigation?: boolean;
  cardImageContainerRef?: RefObject<HTMLDivElement | null>;
  cardImageVisible?: boolean;
}

export const CardDetailModal = ({
  card,
  printing,
  onClose,
  onPrev,
  onNext,
  hasNavigation,
  cardImageContainerRef,
  cardImageVisible,
}: CardDetailModalProps) => {
  useKeydown('Escape', onClose, true, true);
  useKeydown('ArrowLeft', onPrev ?? (() => {}), !!onPrev);
  useKeydown('ArrowRight', onNext ?? (() => {}), !!onNext);

  return (
    <>
      <div className="fixed inset-0 z-100 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      {onPrev && (
        <button
          onClick={onPrev}
          className="fixed left-3 sm:left-6 top-1/2 -translate-y-1/2 z-102 p-2 rounded-full bg-black/40 text-white hover:bg-black/60 transition-colors cursor-pointer"
          aria-label="Previous card"
        >
          <ChevronLeft size={24} />
        </button>
      )}

      {onNext && (
        <button
          onClick={onNext}
          className="fixed right-3 sm:right-6 top-1/2 -translate-y-1/2 z-102 p-2 rounded-full bg-black/40 text-white hover:bg-black/60 transition-colors cursor-pointer"
          aria-label="Next card"
        >
          <ChevronRight size={24} />
        </button>
      )}

      {hasNavigation && (
        <div className="fixed bottom-5 left-1/2 -translate-x-1/2 z-102 hidden sm:flex items-center gap-1.5 text-xs text-white/70 bg-black/30 backdrop-blur-sm px-3 py-1.5 rounded-full pointer-events-none select-none">
          <span>←</span>
          <span>→</span>
          <span>navigate cards</span>
        </div>
      )}

      <div className="fixed inset-4 z-101 sm:inset-auto sm:top-1/2 sm:left-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 sm:w-full sm:max-w-4xl bg-card rounded-2xl shadow-2xl overflow-y-auto sm:overflow-visible">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent transition-colors cursor-pointer"
          aria-label="Close"
        >
          <X size={20} />
        </button>
        <CardDetail
          card={card}
          initialPrinting={printing}
          cardImageContainerRef={cardImageContainerRef}
          cardImageVisible={cardImageVisible}
        />
      </div>
    </>
  );
};
