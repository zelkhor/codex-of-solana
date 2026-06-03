import { cards as fabCards } from '@flesh-and-blood/cards';
import type { CardDto, PrintingDto, Result } from '@codex/shared';
import { ok, err, IMAGE_BASE } from '@codex/shared';
import type { ICardCatalogRepository } from '../application/card-catalog.repository';
import { CardCatalogLoadError } from '../domain/card-catalog.errors';
import { CARD_PRINTING_OVERRIDES } from './card-catalog.overrides';

type SourceCard = (typeof fabCards)[number];
type SourcePrinting = SourceCard['printings'][number];

export class CardCatalogFabRepository implements ICardCatalogRepository {
  private readonly cached: CardDto[];

  constructor() {
    this.cached = this.toDtos(fabCards);
  }

  async getAll(): Promise<Result<CardDto[], CardCatalogLoadError>> {
    try {
      return ok(this.cached);
    } catch (e) {
      return err(new CardCatalogLoadError(e instanceof Error ? e.message : undefined));
    }
  }

  private toDtos(cards: typeof fabCards): CardDto[] {
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

  private deduplicatePrintings(printings: PrintingDto[]): PrintingDto[] {
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

const mapToCardDto = (
  card: SourceCard,
  printingImageIndex: Map<string, SourcePrinting>,
): CardDto => ({
  cardIdentifier: card.cardIdentifier,
  name: card.name,
  pitch: (card.pitch ?? null) as CardDto['pitch'],
  classes: card.classes as CardDto['classes'],
  talents: (card.talents ?? []) as CardDto['talents'],
  types: card.types as CardDto['types'],
  subtypes: card.subtypes,
  keywords: (card.keywords ?? []) as CardDto['keywords'],
  rarity: card.rarity as CardDto['rarity'],
  rarities: card.rarities as CardDto['rarities'],
  sets: card.sets as CardDto['sets'],
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

const mapToPrintingDto = (
  p: SourcePrinting,
  printingImageIndex: Map<string, SourcePrinting>,
): PrintingDto => {
  const backPrinting = p.oppositeImage ? printingImageIndex.get(p.oppositeImage) : undefined;
  return {
    identifier: p.identifier,
    print: p.print,
    set: p.set as PrintingDto['set'],
    rarity: p.rarity as PrintingDto['rarity'],
    edition: (p.edition ?? null) as PrintingDto['edition'],
    foiling: (p.foiling ?? null) as PrintingDto['foiling'],
    image: p.image ? `${IMAGE_BASE}${p.image}.webp` : '',
    artists: p.artists,
    backPrinting: backPrinting
      ? {
          identifier: backPrinting.identifier,
          print: backPrinting.print,
          set: backPrinting.set as PrintingDto['set'],
          rarity: backPrinting.rarity as PrintingDto['rarity'],
          edition: (backPrinting.edition ?? null) as PrintingDto['edition'],
          foiling: (backPrinting.foiling ?? null) as PrintingDto['foiling'],
          image: backPrinting.image ? `${IMAGE_BASE}${backPrinting.image}.webp` : '',
          artists: backPrinting.artists,
          backPrinting: null,
        }
      : null,
  };
};
