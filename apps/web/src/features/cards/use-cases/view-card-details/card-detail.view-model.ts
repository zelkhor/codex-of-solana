import { useState } from 'react';
import { type TiltEffect, foilingToEffect } from '@/features/cards/ui/card.helpers.ts';
import type { Printing } from '@codex/core';

export interface CardDetailViewModel {
  activePrinting: Printing;
  setActivePrinting: (printing: Printing) => void;
  backPrinting: Printing | null;
  isFlipped: boolean;
  flip: () => void;
  tiltEffect: TiltEffect;
}

export const useCardDetailViewModel = (initialPrinting: Printing): CardDetailViewModel => {
  const [activePrinting, setActivePrinting] = useState<Printing>(initialPrinting);

  const { backPrinting } = activePrinting;

  const isFlipped = !!backPrinting && activePrinting.print === backPrinting.print;

  return {
    activePrinting,
    setActivePrinting,
    backPrinting,
    isFlipped,
    flip: () => setActivePrinting(isFlipped ? initialPrinting : backPrinting!),
    tiltEffect: foilingToEffect(activePrinting.foiling),
  };
};
