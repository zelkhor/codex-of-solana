import { cards as fabCards } from '@flesh-and-blood/cards';
import type { CardDto, PrintingDto, Result } from '@codex/shared';
import { ok, err } from '@codex/shared';
import type { ICardCatalogRepository } from '../application/card-catalog.repository';
import { CardCatalogLoadError } from '../domain/card-catalog.errors';

export class CardCatalogFabRepository implements ICardCatalogRepository {
  private readonly cached: CardDto[];

  constructor() {
    this.cached = fabCards.map(mapToCardDto);
  }

  async getAll(): Promise<Result<CardDto[], CardCatalogLoadError>> {
    try {
      return ok(this.cached);
    } catch (e) {
      return err(new CardCatalogLoadError(e instanceof Error ? e.message : undefined));
    }
  }
}

const mapToCardDto = (card: (typeof fabCards)[number]): CardDto => ({
  cardIdentifier: card.cardIdentifier,
  name: card.name,
  pitch: card.pitch as CardDto['pitch'],
  classes: card.classes as CardDto['classes'],
  talents: (card.talents ?? []) as CardDto['talents'],
  types: card.types as CardDto['types'],
  subtypes: card.subtypes,
  keywords: (card.keywords ?? []) as CardDto['keywords'],
  rarity: card.rarity as CardDto['rarity'],
  rarities: card.rarities as CardDto['rarities'],
  sets: card.sets as CardDto['sets'],
  typeText: card.typeText,
  cost: card.cost,
  attack: card.power,
  defense: card.defense,
  intellect: card.intellect,
  life: card.life,
  functionalText: card.functionalText,
  printings: card.printings.map(mapToPrintingDto),
  defaultImage: card.defaultImage ?? '',
});

const mapToPrintingDto = (p: (typeof fabCards)[number]['printings'][number]): PrintingDto => ({
  identifier: p.identifier,
  print: p.print,
  set: p.set as PrintingDto['set'],
  rarity: p.rarity as PrintingDto['rarity'],
  edition: p.edition as PrintingDto['edition'],
  foiling: p.foiling as PrintingDto['foiling'],
  image: p.image ?? '',
  oppositeImage: p.oppositeImage ?? undefined,
  artists: p.artists,
});
