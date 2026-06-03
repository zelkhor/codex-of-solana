import { CARD_FOILINGS, CARD_RARITIES, CARD_SETS, type Printing } from '../domain/card';

// Images from external sources that are not on the Fabrary CDN use full URLs directly from the fab database.
export const CARD_PRINTING_OVERRIDES: Record<string, Printing[]> = {
  'trot-along-blue': [
    {
      identifier: 'ZH_FAB401',
      print: 'FAB401',
      set: CARD_SETS.Promos,
      rarity: CARD_RARITIES.Promo,
      edition: null,
      foiling: CARD_FOILINGS.Regular,
      image:
        'https://legendstory-production-s3-public.s3.amazonaws.com/media/cards/large/ZH_FAB401.webp',
      backPrinting: null,
      artists: ['Carlos Cruchaga'],
    },
  ],
  'scar-for-a-scar-red': [
    {
      identifier: 'JA_FAB443-RF',
      print: 'FAB443',
      set: CARD_SETS.Promos,
      rarity: CARD_RARITIES.Promo,
      edition: null,
      foiling: CARD_FOILINGS.Rainbow,
      image:
        'https://legendstory-production-s3-public.s3.amazonaws.com/media/cards/large/JA_FAB443-RF.webp',
      backPrinting: null,
      artists: ['Kanadekana'],
    },
  ],
};
