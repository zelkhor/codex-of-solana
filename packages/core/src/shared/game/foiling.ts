import { Foiling } from '@flesh-and-blood/types';

export const FOILINGS = {
  Regular: 'Regular',
  ...Foiling,
} as const;
export type FoilingT = (typeof FOILINGS)[keyof typeof FOILINGS];

export const FOILING_ORDER: FoilingT[] = [
  FOILINGS.Regular,
  FOILINGS.Rainbow,
  FOILINGS.Cold,
  FOILINGS.Gold,
];
