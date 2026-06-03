import { useState } from 'react';
import type { PrintingDto } from '@codex/shared';
import type { TiltEffect } from '@/components/card/TiltCard';
import { foilingToEffect } from '@/components/card/card.helpers';

export interface CardDetailViewModel {
  activePrinting: PrintingDto;
  setActivePrinting: (printing: PrintingDto) => void;
  backPrinting: PrintingDto | null;
  isFlipped: boolean;
  flip: () => void;
  tiltEffect: TiltEffect;
}

export const useCardDetailViewModel = (initialPrinting: PrintingDto): CardDetailViewModel => {
  const [activePrinting, setActivePrinting] = useState<PrintingDto>(initialPrinting);

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
