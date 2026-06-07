import { useState } from 'react';

import type { Printing } from '@codex/core';

import { type TiltEffect, foilingToEffect } from '@/features/cards/ui/card.helpers.ts';

export interface CardDetailsViewModel {
  activePrinting: Printing;
  setActivePrinting: (printing: Printing) => void;
  backPrinting: Printing | null;
  isFlipped: boolean;
  flip: () => void;
  tiltEffect: TiltEffect;
}

export const useCardDetailsViewModel = (initialPrinting: Printing): CardDetailsViewModel => {
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
