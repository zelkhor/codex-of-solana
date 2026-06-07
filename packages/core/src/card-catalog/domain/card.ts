import type { ClassT } from '../../shared/game/class';
import type { EditionT } from '../../shared/game/edition';
import type { FoilingT } from '../../shared/game/foiling';
import type { HeroT } from '../../shared/game/hero';
import type { KeywordT } from '../../shared/game/keyword';
import type { PitchT } from '../../shared/game/pitch';
import type { RarityT } from '../../shared/game/rarity';
import type { SetT } from '../../shared/game/set';
import type { SubtypeT } from '../../shared/game/subtype';
import type { TalentT } from '../../shared/game/talent';
import type { TypeT } from '../../shared/game/type';

export interface Printing {
  identifier: string;
  print: string;
  set: SetT;
  rarity: RarityT;
  edition: EditionT | null;
  foiling: FoilingT;
  image: string;
  backPrinting: Printing | null;
  artists: string[];
}

export interface Card {
  cardIdentifier: string;
  name: string;
  pitch: PitchT | null;
  classes: ClassT[];
  talents: TalentT[];
  types: TypeT[];
  subtypes: SubtypeT[];
  keywords: KeywordT[];
  rarity: RarityT;
  rarities: RarityT[];
  sets: SetT[];
  typeText: string | null;
  cost: number | null;
  attack: number | null;
  defense: number | null;
  intellect: number | null;
  life: number | null;
  functionalText: string | null;
  legalHeroes: HeroT[];
  printings: Printing[];
  defaultImage: string;
}
