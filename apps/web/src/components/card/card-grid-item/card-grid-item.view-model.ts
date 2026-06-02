import type { PrintingDto } from '@codex/shared';
import type { TiltEffect } from '@/components/card/TiltCard';
import { foilingToEffect } from '@/components/card/card.helpers';

export interface CardGridItemViewModel {
  displayPrinting: PrintingDto;
  imageUrl: string;
  tiltEffect: TiltEffect;
}

export const buildCardGridItemViewModel = (printing: PrintingDto): CardGridItemViewModel => ({
  displayPrinting: printing,
  imageUrl: printing.image,
  tiltEffect: foilingToEffect(printing.foiling),
});
