import {
  CARD_CLASSES,
  CARD_PITCHES,
  CARD_RARITIES,
  CARD_SETS,
  CARD_SUBTYPES,
  CARD_TYPES,
  type Card,
  type Printing,
} from '../../card-catalog/domain/card';
import { printingBuilder } from './printing.builder';

type CardBuilderT = {
  withCardIdentifier: (id: string) => CardBuilderT;
  withName: (name: string) => CardBuilderT;
  withPitch: (pitch: Card['pitch']) => CardBuilderT;
  withClasses: (classes: Card['classes']) => CardBuilderT;
  withTalents: (talents: Card['talents']) => CardBuilderT;
  withTypes: (types: Card['types']) => CardBuilderT;
  withSubtypes: (subtypes: Card['subtypes']) => CardBuilderT;
  withKeywords: (keywords: Card['keywords']) => CardBuilderT;
  withRarity: (rarity: Card['rarity']) => CardBuilderT;
  withRarities: (rarities: Card['rarities']) => CardBuilderT;
  withSets: (sets: Card['sets']) => CardBuilderT;
  withTypeText: (typeText: Card['typeText']) => CardBuilderT;
  withCost: (cost: Card['cost']) => CardBuilderT;
  withAttack: (attack: Card['attack']) => CardBuilderT;
  withDefense: (defense: Card['defense']) => CardBuilderT;
  withIntellect: (intellect: Card['intellect']) => CardBuilderT;
  withLife: (life: Card['life']) => CardBuilderT;
  withFunctionalText: (functionalText: Card['functionalText']) => CardBuilderT;
  withDefaultImage: (defaultImage: string) => CardBuilderT;
  withPrintings: (printings: Printing[]) => CardBuilderT;
  build: () => Card;
};

const defaultPrinting = printingBuilder().build();

export const cardBuilder = ({
  cardIdentifier = 'test-card-red',
  name = 'Test Card',
  pitch = CARD_PITCHES.Red,
  classes = [CARD_CLASSES.Generic],
  talents = [],
  types = [CARD_TYPES.Action],
  subtypes = [CARD_SUBTYPES.Arrow],
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
}: Partial<Card> = {}): CardBuilderT => {
  const props: Card = {
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
    withPitch: (_pitch: Card['pitch']) => cardBuilder({ ...props, pitch: _pitch }),
    withClasses: (_classes: Card['classes']) => cardBuilder({ ...props, classes: _classes }),
    withTalents: (_talents: Card['talents']) => cardBuilder({ ...props, talents: _talents }),
    withTypes: (_types: Card['types']) => cardBuilder({ ...props, types: _types }),
    withSubtypes: (_subtypes: Card['subtypes']) => cardBuilder({ ...props, subtypes: _subtypes }),
    withKeywords: (_keywords: Card['keywords']) => cardBuilder({ ...props, keywords: _keywords }),
    withRarity: (_rarity: Card['rarity']) => cardBuilder({ ...props, rarity: _rarity }),
    withRarities: (_rarities: Card['rarities']) => cardBuilder({ ...props, rarities: _rarities }),
    withSets: (_sets: Card['sets']) => cardBuilder({ ...props, sets: _sets }),
    withTypeText: (_typeText: Card['typeText']) => cardBuilder({ ...props, typeText: _typeText }),
    withCost: (_cost: Card['cost']) => cardBuilder({ ...props, cost: _cost }),
    withAttack: (_attack: Card['attack']) => cardBuilder({ ...props, attack: _attack }),
    withDefense: (_defense: Card['defense']) => cardBuilder({ ...props, defense: _defense }),
    withIntellect: (_intellect: Card['intellect']) =>
      cardBuilder({ ...props, intellect: _intellect }),
    withLife: (_life: Card['life']) => cardBuilder({ ...props, life: _life }),
    withFunctionalText: (_functionalText: Card['functionalText']) =>
      cardBuilder({ ...props, functionalText: _functionalText }),
    withDefaultImage: (_defaultImage: string) =>
      cardBuilder({ ...props, defaultImage: _defaultImage }),
    withPrintings: (_printings: Printing[]) => cardBuilder({ ...props, printings: _printings }),
    build: (): Card => ({ ...props }),
  };
};
