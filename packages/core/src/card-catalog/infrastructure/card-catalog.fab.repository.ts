import { cards as fabCards } from '@flesh-and-blood/cards';
import type { ICardCatalogRepository } from '../application/card-catalog.repository';
import { CardCatalogLoadError } from '../domain/card-catalog.errors';
import { CARD_PRINTING_OVERRIDES } from './card-catalog.overrides';
import { err, ok, type Result } from '../../shared/result';
import { CARD_FOILINGS, type Printing, type Card } from '../domain/card';

type SourceCard = (typeof fabCards)[number];
type SourcePrinting = SourceCard['printings'][number];

export class CardCatalogFabRepository implements ICardCatalogRepository {
  private readonly cached: Card[];

  constructor() {
    this.cached = this.toDtos(fabCards);
  }

  async getAll(): Promise<Result<Card[], CardCatalogLoadError>> {
    try {
      return ok(this.cached);
    } catch (e) {
      return err(new CardCatalogLoadError(e instanceof Error ? e.message : undefined));
    }
  }

  private toDtos(cards: typeof fabCards): Card[] {
    const printingImageIndex = this.printingImageIndex(cards);

    return cards.map((card) => {
      const dto = mapToCardDto(card, printingImageIndex);
      const overrides = CARD_PRINTING_OVERRIDES[card.cardIdentifier] ?? [];
      return {
        ...dto,
        printings: this.deduplicatePrintings([...dto.printings, ...overrides]),
      };
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
  classes: card.classes as Card['classes'],
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
    foiling: (p.foiling ?? CARD_FOILINGS.Regular) as Printing['foiling'],
    image: p.image ? `${IMAGE_BASE}${p.image}.webp` : '',
    artists: p.artists,
    backPrinting: backPrinting
      ? {
          identifier: backPrinting.identifier,
          print: backPrinting.print,
          set: backPrinting.set as Printing['set'],
          rarity: backPrinting.rarity as Printing['rarity'],
          edition: (backPrinting.edition ?? null) as Printing['edition'],
          foiling: (backPrinting.foiling ?? CARD_FOILINGS.Regular) as Printing['foiling'],
          image: backPrinting.image ? `${IMAGE_BASE}${backPrinting.image}.webp` : '',
          artists: backPrinting.artists,
          backPrinting: null,
        }
      : null,
  };
};
