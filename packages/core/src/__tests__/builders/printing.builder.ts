import {
  CARD_EDITIONS,
  CARD_FOILINGS,
  CARD_RARITIES,
  CARD_SETS,
  type Printing,
} from '../../card-catalog/domain/card';

type PrintingBuilderT = {
  withIdentifier: (identifier: string) => PrintingBuilderT;
  withPrint: (print: string) => PrintingBuilderT;
  withSet: (set: Printing['set']) => PrintingBuilderT;
  withRarity: (rarity: Printing['rarity']) => PrintingBuilderT;
  withFoiling: (foiling: Printing['foiling']) => PrintingBuilderT;
  withEdition: (edition: Printing['edition']) => PrintingBuilderT;
  withImage: (image: string) => PrintingBuilderT;
  withArtists: (artists: string[]) => PrintingBuilderT;
  withBackPrinting: (backPrinting: Printing['backPrinting']) => PrintingBuilderT;
  build: () => Printing;
};

export const printingBuilder = ({
  identifier = 'WTR001',
  print = 'WTR001-First',
  set = CARD_SETS.WelcomeToRathe,
  rarity = CARD_RARITIES.Common,
  edition = CARD_EDITIONS.First,
  foiling = CARD_FOILINGS.Regular,
  image = 'WTR001',
  backPrinting = null,
  artists = ['Test Artist'],
}: Partial<Printing> = {}): PrintingBuilderT => {
  const props: Printing = {
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
    withSet: (_set: Printing['set']) => printingBuilder({ ...props, set: _set }),
    withRarity: (_rarity: Printing['rarity']) => printingBuilder({ ...props, rarity: _rarity }),
    withFoiling: (_foiling: Printing['foiling']) =>
      printingBuilder({ ...props, foiling: _foiling }),
    withEdition: (_edition: Printing['edition']) =>
      printingBuilder({ ...props, edition: _edition }),
    withImage: (_image: string) => printingBuilder({ ...props, image: _image }),
    withArtists: (_artists: string[]) => printingBuilder({ ...props, artists: _artists }),
    withBackPrinting: (_backPrinting: Printing['backPrinting']) =>
      printingBuilder({ ...props, backPrinting: _backPrinting }),
    build: (): Printing => ({ ...props }),
  };
};
