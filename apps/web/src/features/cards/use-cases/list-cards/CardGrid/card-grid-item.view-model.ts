import { useState } from 'react';

import type { Printing } from '@codex/core';

import { type TiltEffect, foilingToEffect } from '@/features/cards/ui/card.helpers.ts';

export interface CardGridItemViewModel {
  activePrinting: Printing;
  imageUrl: string;
  tiltEffect: TiltEffect;
  flipped: boolean;
  flip: () => void;
}

export const useCardGridItemViewModel = (
  printing: Printing,
  backPrinting?: Printing,
): CardGridItemViewModel => {
  const [flipped, setFlipped] = useState(false);

  const activePrinting = flipped && backPrinting ? backPrinting : printing;

  return {
    activePrinting,
    imageUrl: activePrinting.image,
    tiltEffect: foilingToEffect(activePrinting.foiling),
    flipped,
    flip: () => setFlipped((f) => !f),
  };
};
