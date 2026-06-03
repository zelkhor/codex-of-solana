import type { Printing } from '@codex/core';
import type { TiltEffect } from '@/components/card/TiltCard';
import { foilingToEffect } from '@/components/card/card.helpers';

export interface CardGridItemViewModel {
  displayPrinting: Printing;
  imageUrl: string;
  tiltEffect: TiltEffect;
}

export const buildCardGridItemViewModel = (printing: Printing): CardGridItemViewModel => ({
  displayPrinting: printing,
  imageUrl: printing.image,
  tiltEffect: foilingToEffect(printing.foiling),
});
