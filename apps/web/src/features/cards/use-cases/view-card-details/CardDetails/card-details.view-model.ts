import { useState } from 'react';

import type { Printing } from '@codex/core';

import { type TiltEffect, foilingToEffect } from '@/features/cards/ui/card.helpers.ts';

export interface CardDetailsViewModel {
  activePrinting: Printing;
  frontPrinting: Printing;
  setActivePrinting: (printing: Printing) => void;
  backPrinting: Printing | null;
  frontTiltEffect: TiltEffect;
  backTiltEffect?: TiltEffect;
  isFlipped: boolean;
  flip: () => void;
}

export const useCardDetailsViewModel = (initialPrinting: Printing): CardDetailsViewModel => {
  const [frontPrinting, setFrontPrinting] = useState<Printing>(initialPrinting);
  const [isFlipped, setIsFlipped] = useState(false);

  const backPrinting = frontPrinting.backPrinting;
  const activePrinting = isFlipped && backPrinting ? backPrinting : frontPrinting;

  return {
    activePrinting,
    frontPrinting,
    setActivePrinting: (p: Printing) => {
      setFrontPrinting(p);
      setIsFlipped(false);
    },
    backPrinting,
    frontTiltEffect: foilingToEffect(frontPrinting.foiling),
    backTiltEffect: backPrinting ? foilingToEffect(backPrinting.foiling) : undefined,
    isFlipped,
    flip: () => setIsFlipped((f) => !f),
  };
};
