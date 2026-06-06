import { Rarity } from '@flesh-and-blood/types';

export const RARITIES = Rarity;
export type RarityT = `${Rarity}`;

export const RARITY_ORDER: RarityT[] = [
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
