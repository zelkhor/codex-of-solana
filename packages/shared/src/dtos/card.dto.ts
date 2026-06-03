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
  CardSubtypeT,
} from '../constants/card.constants';

export interface PrintingDto {
  identifier: string;
  print: string;
  set: CardSetT;
  rarity: CardRarityT;
  edition: CardEditionT | null;
  foiling: CardFoilingT | null;
  image: string;
  backPrinting: PrintingDto | null;
  artists: string[];
}

export interface CardDto {
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
  printings: PrintingDto[];
  defaultImage: string;
}
