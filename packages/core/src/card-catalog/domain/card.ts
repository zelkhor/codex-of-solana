import {
  Class,
  Foiling,
  Keyword,
  Rarity,
  Release,
  ReleaseEdition,
  Subtype,
  Talent,
  Type,
} from '@flesh-and-blood/types';

export const CARD_SETS = Release;
export type CardSetT = `${Release}`;

export const CARD_RARITIES = Rarity;
export type CardRarityT = `${Rarity}`;

export const CARD_FOILINGS = {
  Regular: 'Regular',
  ...Foiling,
} as const;
export type CardFoilingT = (typeof CARD_FOILINGS)[keyof typeof CARD_FOILINGS];

export const FOILING_ORDER: CardFoilingT[] = [
  CARD_FOILINGS.Regular,
  CARD_FOILINGS.Rainbow,
  CARD_FOILINGS.Cold,
  CARD_FOILINGS.Gold,
];

export const CARD_EDITIONS = ReleaseEdition;
export type CardEditionT = `${ReleaseEdition}`;

export const CARD_CLASSES = Class;
export type CardClassT = `${Class}`;

export const CARD_TALENTS = Talent;
export type CardTalentT = `${Talent}`;

export const CARD_TYPES = Type;
export type CardTypeT = `${Type}`;

export const CARD_KEYWORDS = Keyword;
export type CardKeywordT = `${Keyword}`;

export const CARD_SUBTYPES = Subtype;
export type CardSubtypeT = `${Subtype}`;

export const CARD_PITCHES = { Red: 1, Yellow: 2, Blue: 3 } as const;
export type CardPitchT = (typeof CARD_PITCHES)[keyof typeof CARD_PITCHES];

export const RARITY_ORDER: CardRarityT[] = [
  'Basic',
  'Token',
  'Common',
  'Rare',
  'Super Rare',
  'Majestic',
  'Legendary',
  'Fabled',
  'Marvel',
  'Promo',
];

export interface Printing {
  identifier: string;
  print: string;
  set: CardSetT;
  rarity: CardRarityT;
  edition: CardEditionT | null;
  foiling: CardFoilingT;
  image: string;
  backPrinting: Printing | null;
  artists: string[];
}

export interface Card {
  cardIdentifier: string;
  name: string;
  pitch: CardPitchT | null;
  classes: CardClassT[];
  talents: CardTalentT[];
  types: CardTypeT[];
  subtypes: CardSubtypeT[];
  keywords: CardKeywordT[];
  rarity: CardRarityT;
  rarities: CardRarityT[];
  sets: CardSetT[];
  typeText: string | null;
  cost: number | null;
  attack: number | null;
  defense: number | null;
  intellect: number | null;
  life: number | null;
  functionalText: string | null;
  printings: Printing[];
  defaultImage: string;
}
