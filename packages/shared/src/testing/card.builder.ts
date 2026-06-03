import type { CardDto, PrintingDto } from '../dtos/card.dto';
import {
  CARD_SETS,
  CARD_RARITIES,
  CARD_EDITIONS,
  CARD_PITCHES,
  CARD_CLASSES,
  CARD_TYPES,
} from '../constants/card.constants';

export const printingBuilder = ({
  identifier = 'WTR001',
  print = 'WTR001-First',
  set = CARD_SETS.WelcomeToRathe,
  rarity = CARD_RARITIES.Common,
  edition = CARD_EDITIONS.First,
  foiling = null,
  image = 'WTR001',
  backPrinting = null,
  artists = ['Test Artist'],
}: Partial<PrintingDto> = {}) => {
  const props: PrintingDto = {
    identifier,
    print,
    set,
    rarity,
    edition,
    foiling,
    image,
    backPrinting,
    artists,
  };

  return {
    withIdentifier: (_identifier: string) => printingBuilder({ ...props, identifier: _identifier }),
    withPrint: (_print: string) => printingBuilder({ ...props, print: _print }),
    withSet: (_set: PrintingDto['set']) => printingBuilder({ ...props, set: _set }),
    withRarity: (_rarity: PrintingDto['rarity']) => printingBuilder({ ...props, rarity: _rarity }),
    withFoiling: (_foiling: PrintingDto['foiling']) =>
      printingBuilder({ ...props, foiling: _foiling }),
    withEdition: (_edition: PrintingDto['edition']) =>
      printingBuilder({ ...props, edition: _edition }),
    withImage: (_image: string) => printingBuilder({ ...props, image: _image }),
    withArtists: (_artists: string[]) => printingBuilder({ ...props, artists: _artists }),
    withBackPrinting: (_backPrinting: PrintingDto['backPrinting']) =>
      printingBuilder({ ...props, backPrinting: _backPrinting }),
    build: (): PrintingDto => ({ ...props }),
  };
};

const defaultPrinting = printingBuilder().build();

export const cardBuilder = ({
  cardIdentifier = 'test-card-red',
  name = 'Test Card',
  pitch = CARD_PITCHES.Red,
  classes = [CARD_CLASSES.Generic],
  talents = [],
  types = [CARD_TYPES.Action],
  subtypes = [],
  keywords = [],
  rarity = CARD_RARITIES.Common,
  rarities = [CARD_RARITIES.Common],
  sets = [CARD_SETS.WelcomeToRathe],
  typeText = 'Action',
  cost = 0,
  attack = 7,
  defense = 3,
  intellect = null,
  life = null,
  functionalText = null,
  printings = [defaultPrinting],
  defaultImage = 'WTR001',
}: Partial<CardDto> = {}) => {
  const props: CardDto = {
    cardIdentifier,
    name,
    pitch,
    classes,
    talents,
    types,
    subtypes,
    keywords,
    rarity,
    rarities,
    sets,
    typeText,
    cost,
    attack,
    defense,
    intellect,
    life,
    functionalText,
    printings,
    defaultImage,
  };

  return {
    withCardIdentifier: (_id: string) => cardBuilder({ ...props, cardIdentifier: _id }),
    withName: (_name: string) => cardBuilder({ ...props, name: _name }),
    withPitch: (_pitch: CardDto['pitch']) => cardBuilder({ ...props, pitch: _pitch }),
    withClasses: (_classes: CardDto['classes']) => cardBuilder({ ...props, classes: _classes }),
    withTalents: (_talents: CardDto['talents']) => cardBuilder({ ...props, talents: _talents }),
    withTypes: (_types: CardDto['types']) => cardBuilder({ ...props, types: _types }),
    withSubtypes: (_subtypes: CardDto['subtypes']) =>
      cardBuilder({ ...props, subtypes: _subtypes }),
    withKeywords: (_keywords: CardDto['keywords']) =>
      cardBuilder({ ...props, keywords: _keywords }),
    withRarity: (_rarity: CardDto['rarity']) => cardBuilder({ ...props, rarity: _rarity }),
    withRarities: (_rarities: CardDto['rarities']) =>
      cardBuilder({ ...props, rarities: _rarities }),
    withSets: (_sets: CardDto['sets']) => cardBuilder({ ...props, sets: _sets }),
    withTypeText: (_typeText: CardDto['typeText']) =>
      cardBuilder({ ...props, typeText: _typeText }),
    withCost: (_cost: CardDto['cost']) => cardBuilder({ ...props, cost: _cost }),
    withAttack: (_attack: CardDto['attack']) => cardBuilder({ ...props, attack: _attack }),
    withDefense: (_defense: CardDto['defense']) => cardBuilder({ ...props, defense: _defense }),
    withIntellect: (_intellect: CardDto['intellect']) =>
      cardBuilder({ ...props, intellect: _intellect }),
    withLife: (_life: CardDto['life']) => cardBuilder({ ...props, life: _life }),
    withFunctionalText: (_functionalText: CardDto['functionalText']) =>
      cardBuilder({ ...props, functionalText: _functionalText }),
    withDefaultImage: (_defaultImage: string) =>
      cardBuilder({ ...props, defaultImage: _defaultImage }),
    withPrintings: (_printings: PrintingDto[]) => cardBuilder({ ...props, printings: _printings }),
    build: (): CardDto => ({ ...props }),
  };
};
