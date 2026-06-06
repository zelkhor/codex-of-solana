import type { FoilingT } from '@codex/core';
import { FOILINGS } from '@codex/core';

export type TiltEffect = 'standard' | 'rainbow-foil' | 'cold-foil' | 'gold-foil';

export const foilingToEffect = (foiling: FoilingT | null): TiltEffect => {
  if (foiling === FOILINGS.Rainbow) return 'rainbow-foil';
  if (foiling === FOILINGS.Cold) return 'cold-foil';
  if (foiling === FOILINGS.Gold) return 'gold-foil';
  return 'standard';
};
