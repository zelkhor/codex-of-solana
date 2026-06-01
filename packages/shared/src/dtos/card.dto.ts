import type {
  CardRarityT,
  CardPitchT,
  CardFoilingT,
  CardEditionT,
  CardSetT,
  CardClassT,
  CardTalentT,
  CardTypeT,
  CardKeywordT,
} from '../constants/card.constants';

export interface PrintingDto {
  identifier: string;
  print: string;
  set: CardSetT;
  rarity: CardRarityT;
  edition: CardEditionT | undefined;
  foiling: CardFoilingT | undefined;
  image: string;
  oppositeImage: string | undefined;
  artists: string[];
}

export interface CardDto {
  cardIdentifier: string;
  name: string;
  pitch: CardPitchT | undefined;
  classes: CardClassT[];
  talents: CardTalentT[];
  types: CardTypeT[];
  subtypes: string[];
  keywords: CardKeywordT[];
  rarity: CardRarityT;
  rarities: CardRarityT[];
  sets: CardSetT[];
  typeText: string | undefined;
  cost: number | undefined;
  attack: number | undefined;
  defense: number | undefined;
  intellect: number | undefined;
  life: number | undefined;
  functionalText: string | undefined;
  printings: PrintingDto[];
  defaultImage: string;
}
