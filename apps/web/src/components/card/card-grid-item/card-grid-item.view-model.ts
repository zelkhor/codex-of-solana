import type { PrintingDto } from '@codex/shared';
import { IMAGE_BASE } from '@codex/shared';
import type { TiltEffect } from '@/components/card/TiltCard';
import { foilingToEffect } from '@/components/card/card.helpers';

export interface CardGridItemViewModel {
  displayPrinting: PrintingDto;
  imageUrl: string;
  tiltEffect: TiltEffect;
}

export const buildCardGridItemViewModel = (printing: PrintingDto): CardGridItemViewModel => ({
  displayPrinting: printing,
  imageUrl: `${IMAGE_BASE}${printing.image}.webp`,
  tiltEffect: foilingToEffect(printing.foiling),
});
