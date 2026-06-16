import { cards as fabCards } from '@flesh-and-blood/cards';

import { FOILINGS } from '../../shared/game/foiling';
import { SET_ORDER } from '../../shared/game/set';
import { AppError } from '../../shared/helpers/errors';
import { type Result, err, ok } from '../../shared/helpers/result';
import type { ICardCatalogRepository } from '../application/card-catalog.repository';
import type { Card, Printing } from '../domain/card';
import { CARD_PRINTING_OVERRIDES } from './card-catalog.overrides';

type SourceCard = (typeof fabCards)[number];
type SourcePrinting = SourceCard['printings'][number];

export class CardCatalogLoadError extends AppError {
  constructor(cause?: string) {
    super(
      'CARD_CATALOG_LOAD_ERROR',
      cause ? `Failed to load card catalog: ${cause}` : 'Failed to load card catalog',
    );
  }
}

export class CardCatalogFabRepository implements ICardCatalogRepository {
  async getAll(): Promise<Result<Card[]>> {
    try {
      return ok(this.toDtos(fabCards));
    } catch (e) {
      return err(new CardCatalogLoadError(e instanceof Error ? e.message : undefined));
    }
  }

  private toDtos(cards: typeof fabCards): Card[] {
    const printingImageIndex = this.printingImageIndex(cards);

    return cards.map((card) => {
      const dto = mapToCardDto(card, printingImageIndex);
      const overrides = CARD_PRINTING_OVERRIDES[card.cardIdentifier] ?? [];
      const printings = this.deduplicatePrintings([...overrides, ...dto.printings]);
      printings.sort((a, b) => {
        const ai = SET_ORDER.indexOf(a.set);
        const bi = SET_ORDER.indexOf(b.set);
        return (ai === -1 ? Infinity : ai) - (bi === -1 ? Infinity : bi);
      });
      return { ...dto, printings };
    });
  }

  private deduplicatePrintings(printings: Printing[]): Printing[] {
    const seen = new Set<string>();
    return printings.filter((p) => !seen.has(p.print) && seen.add(p.print) !== undefined);
  }

  private printingImageIndex(cards: typeof fabCards): Map<string, SourcePrinting> {
    const index = new Map<string, SourcePrinting>();
    for (const card of cards) {
      for (const p of card.printings) {
        if (p.image) index.set(p.image, p);
      }
    }
    return index;
  }
}

const mapToCardDto = (card: SourceCard, printingImageIndex: Map<string, SourcePrinting>): Card => ({
  cardIdentifier: card.cardIdentifier,
  name: card.name,
  pitch: (card.pitch ?? null) as Card['pitch'],
  classes: card.classes.filter((c) => c !== 'NotClassed') as Card['classes'],
  talents: (card.talents ?? []) as Card['talents'],
  types: card.types as Card['types'],
  subtypes: card.subtypes,
  keywords: (card.keywords ?? []) as Card['keywords'],
  rarity: card.rarity as Card['rarity'],
  rarities: card.rarities as Card['rarities'],
  sets: card.sets as Card['sets'],
  typeText: card.typeText ?? null,
  cost: card.cost ?? null,
  attack: card.power ?? null,
  defense: card.defense ?? null,
  intellect: card.intellect ?? null,
  life: card.life ?? null,
  functionalText: card.functionalText ?? null,
  legalHeroes: (card.legalHeroes ?? []) as Card['legalHeroes'],
  legalFormats: (card.legalFormats ?? []) as Card['legalFormats'],
  printings: card.printings.map((p) => mapToPrintingDto(p, printingImageIndex)),
  defaultImage: card.defaultImage ?? '',
});

export const IMAGE_BASE = 'https://content.fabrary.net/cards/';

const mapToPrintingDto = (
  p: SourcePrinting,
  printingImageIndex: Map<string, SourcePrinting>,
): Printing => {
  const backPrinting = p.oppositeImage ? printingImageIndex.get(p.oppositeImage) : undefined;
  return {
    identifier: p.identifier,
    print: p.print,
    set: p.set as Printing['set'],
    rarity: p.rarity as Printing['rarity'],
    edition: (p.edition ?? null) as Printing['edition'],
    foiling: (p.foiling ?? FOILINGS.Regular) as Printing['foiling'],
    treatments: (p.treatments ?? []) as Printing['treatments'],
    image: p.image ? `${IMAGE_BASE}${p.image}.webp` : '',
    artists: p.artists,
    backPrinting: backPrinting
      ? {
          identifier: backPrinting.identifier,
          print: backPrinting.print,
          set: backPrinting.set as Printing['set'],
          rarity: backPrinting.rarity as Printing['rarity'],
          edition: (backPrinting.edition ?? null) as Printing['edition'],
          foiling: (backPrinting.foiling ?? FOILINGS.Regular) as Printing['foiling'],
          treatments: (backPrinting.treatments ?? []) as Printing['treatments'],
          image: backPrinting.image ? `${IMAGE_BASE}${backPrinting.image}.webp` : '',
          artists: backPrinting.artists,
          backPrinting: null,
        }
      : null,
  };
};
