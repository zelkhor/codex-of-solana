import type { CardFoilingT } from '@codex/core';
import { CARD_FOILINGS } from '@codex/core';
import type { TiltEffect } from '@/components/card/TiltCard';

export const foilingToEffect = (foiling: CardFoilingT | null): TiltEffect => {
  if (foiling === CARD_FOILINGS.Rainbow) return 'rainbow-foil';
  if (foiling === CARD_FOILINGS.Cold) return 'cold-foil';
  if (foiling === CARD_FOILINGS.Gold) return 'gold-foil';
  return 'standard';
};
