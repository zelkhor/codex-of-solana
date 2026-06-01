import type { CardFoilingT } from '@codex/shared';
import { CARD_FOILINGS } from '@codex/shared';
import type { TiltEffect } from '@/components/card/TiltCard';

export const foilingToEffect = (foiling: CardFoilingT | undefined): TiltEffect => {
  if (foiling === CARD_FOILINGS.Rainbow) return 'rainbow-foil';
  if (foiling === CARD_FOILINGS.Cold) return 'cold-foil';
  return 'standard';
};
