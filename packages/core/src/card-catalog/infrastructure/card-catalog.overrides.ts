import type { PrintingDto } from '@codex/shared';
import { CARD_SETS, CARD_FOILINGS, CARD_RARITIES } from '@codex/shared';

// Images from external sources that are not on the fabrary CDN use full URLs directly from fab database.

export const CARD_PRINTING_OVERRIDES: Record<string, PrintingDto[]> = {
  'scar-for-a-scar-red': [
    {
      identifier: 'JA_FAB443-RF',
      print: 'FAB443',
      set: CARD_SETS.Promos,
      rarity: CARD_RARITIES.Promo,
      edition: undefined,
      foiling: CARD_FOILINGS.Rainbow,
      image:
        'https://legendstory-production-s3-public.s3.amazonaws.com/media/cards/large/JA_FAB443-RF.webp',
      oppositeImage: undefined,
      artists: ['Kanadekana'],
    },
  ],
};
