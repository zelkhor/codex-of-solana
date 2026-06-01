# Plan 2: Card Catalog Browsing — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the full card browsing experience — a `GET /cards` API endpoint backed by the `@flesh-and-blood/cards` npm package, a Redux card catalog store with client-side filtering/search/ordering, a virtualized grid with binder layout, filter panel, and card detail view — all working without authentication.

**Architecture:** The backend wraps the FaB npm package in a `CardCatalogFabRepository` that maps package data to `CardDto`. Domain errors extend `AppError` and are caught by a NestJS exception filter, keeping controllers clean. The frontend fetches the full catalog once on startup via `ICardGateway`, stores it in Redux, and does all filtering/searching/ordering client-side. Fuse.js (injected as `ISearchGateway`) powers fuzzy search. TanStack Virtual renders only visible rows. React Router v7 handles navigation.

**Tech Stack:** NestJS 11, `@flesh-and-blood/cards` 3.9, Zod, Redux Toolkit 2, Fuse.js 7, TanStack Virtual 3, React Router 7, shadcn/ui, Tailwind 4

---

## FaB Package Shape (reference)

```ts
import { cards } from '@flesh-and-blood/cards';

interface FabCard {
  cardIdentifier: string;
  name: string;
  pitch?: 1 | 2 | 3;
  classes: string[];
  talents: string[];
  types: string[];
  subtypes: string[];
  keywords: string[];
  rarity: string;
  rarities: string[];
  sets: string[];
  setIdentifiers: string[];
  typeText?: string;
  cost?: number;
  defense?: number;
  functionalText?: string;
  printings: FabPrinting[];
  defaultImage: string;
}

interface FabPrinting {
  identifier: string;
  print: string;
  set: string;
  rarity: string;
  edition?: string;
  foiling?: string;
  image: string;
  artists: string[];
}
```

Image URL: `https://content.fabrary.net/cards/{printing.image}.webp`

---

## Grid Layout Algorithm

**Categories** (applied after filtering):

1. **Complete-pitch** — all 3 pitch variants (R+Y+B) in filtered set. Group by `baseIdentifier` (strip `-red`/`-yellow`/`-blue`).
2. **Incomplete-pitch + colorless** — some pitches missing OR no pitch (non-legendary, non-equipment).
3. **Legendary** — `keywords` includes `"Legendary"` AND `types` does NOT include `"Equipment"`.
4. **Equipment** — `types` includes `"Equipment"`.

**Slot rules:** Complete groups batched 3 at a time → 3 rows (R, Y, B). Incomplete/colorless 3 per row with trailing `empty`. Each legendary → `[empty, legendary, empty]`. Equipment 3 per row. Binder: page-break every 9 slots.

---

## File Map

### packages/shared/src/

| File                      | Purpose                                                                                                                                                                                                                                                                                                                         |
| ------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `errors.ts`               | `AppError` base class                                                                                                                                                                                                                                                                                                           |
| `result.ts`               | `Result<T,E>`, `ok()`, `err()`                                                                                                                                                                                                                                                                                                  |
| `card.constants.ts`       | `CARD_RARITIES`/`CardRarityT`, `CARD_PITCHES`/`CardPitchT`, `CARD_FOILINGS`/`CardFoilingT`, `CARD_EDITIONS`/`CardEditionT`, `CARD_SETS`/`CardSetT`, `CARD_CLASSES`/`CardClassT`, `CARD_TALENTS`/`CardTalentT`, `CARD_TYPES`/`CardTypeT`, `CARD_KEYWORDS`/`CardKeywordT`; `RARITY_ORDER`, `SET_ORDER`, `IMAGE_BASE`, `MAIN_SETS` |
| `card.dto.ts`             | `CardDto`, `PrintingDto` — fully typed with enums                                                                                                                                                                                                                                                                               |
| `testing/card.builder.ts` | `cardBuilder()`, `printingBuilder()` — immutable recursive builders                                                                                                                                                                                                                                                             |
| `index.ts`                | Re-export all                                                                                                                                                                                                                                                                                                                   |

### packages/core/src/card-catalog/

| File                                                 | Purpose                                         |
| ---------------------------------------------------- | ----------------------------------------------- |
| `domain/card-catalog.errors.ts`                      | `CardCatalogLoadError extends AppError`         |
| `application/card-catalog.repository.ts`             | `ICardCatalogRepository` (async + typed Result) |
| `application/get-all-cards.usecase.ts`               | `GetAllCardsUseCase`                            |
| `application/__tests__/card-catalog.fixture.ts`      | `createCardCatalogFixture()`                    |
| `application/__tests__/get-all-cards.spec.ts`        | Feature/Rule format tests                       |
| `infrastructure/card-catalog.inmemory.repository.ts` | In-memory repo                                  |
| `infrastructure/card-catalog.fab.repository.ts`      | FaB npm adapter                                 |

### apps/api/src/

| File                            | Purpose                                        |
| ------------------------------- | ---------------------------------------------- |
| `common/domain-error.filter.ts` | NestJS exception filter for `AppError`         |
| `cards/cards.schemas.ts`        | Zod schemas                                    |
| `cards/cards.controller.ts`     | `GET /cards` — throws domain error on failure  |
| `cards/cards.module.ts`         | NestJS module                                  |
| `app.module.ts`                 | Registers filter globally, imports CardsModule |

### apps/web/src/services/

| File                         | Purpose                    |
| ---------------------------- | -------------------------- |
| `card.gateway.ts`            | `ICardGateway` interface   |
| `card.api.gateway.ts`        | `CardApiGateway`           |
| `card.inmemory.gateway.ts`   | `CardInMemoryGateway`      |
| `search.gateway.ts`          | `ISearchGateway` interface |
| `search.fuse.gateway.ts`     | `FuseSearchGateway`        |
| `search.inmemory.gateway.ts` | `InMemorySearchGateway`    |

### apps/web/src/store/

| File       | Purpose                                                                                                    |
| ---------- | ---------------------------------------------------------------------------------------------------------- |
| `types.ts` | `ThunkDependencies`                                                                                        |
| `index.ts` | `rootReducer`, `createStore`, `RootState`, `AppStore`, `AppDispatch`, `AppThunk<R>`, `createAppAsyncThunk` |

### apps/web/src/store/filters/

| File                   | Purpose                                   |
| ---------------------- | ----------------------------------------- |
| `filters.slice.ts`     | Filter state incl. `binderView`           |
| `filters.selectors.ts` | `selectFilters`, `selectBinderView`, etc. |

### apps/web/src/store/card-catalog/

| File                             | Purpose                                                         |
| -------------------------------- | --------------------------------------------------------------- |
| `card-catalog.slice.ts`          | State + `extraReducers` for `fetchAllCards`                     |
| `card-catalog.thunks.ts`         | `fetchAllCards` (createAppAsyncThunk), `searchCards` (AppThunk) |
| `card-catalog.selectors.ts`      | `selectFilteredCards`, `selectGroupedGridSlots`                 |
| `__tests__/create-test-store.ts` | Enhanced `createTestStore` with action logger                   |
| `__tests__/card-catalog.spec.ts` | Feature/Rule tests                                              |

### apps/web/src/hooks/

| File              | Purpose               |
| ----------------- | --------------------- |
| `useDebounced.ts` | Generic debounce hook |

### apps/web/src/components/card/

| File                           | Purpose                                          |
| ------------------------------ | ------------------------------------------------ |
| `CardBack.tsx`                 | Empty slot placeholder                           |
| `card-grid-item.view-model.ts` | `buildCardGridItemViewModel()`                   |
| `CardGridItem.tsx`             | Card image + hover overlay                       |
| `card-grid.view-model.ts`      | `buildCardGridRows()` — replaces inline `toRows` |
| `CardGrid.tsx`                 | TanStack Virtual grid                            |
| `CardDetail.tsx`               | Card detail + printing switcher                  |

### apps/web/src/components/filters/

| File                   | Purpose                            |
| ---------------------- | ---------------------------------- |
| `SearchInput.tsx`      | Uses `useDebounced`                |
| `RarityFilter.tsx`     | Imports `RARITY_ORDER` from shared |
| `OrderingControls.tsx` | Sort controls                      |
| `FilterPanel.tsx`      | All filters; constants from shared |

### apps/web/src/views/

| File                  | Purpose                |
| --------------------- | ---------------------- |
| `CardListingView.tsx` | FilterPanel + CardGrid |
| `CardDetailView.tsx`  | CardDetail + back nav  |

---

## Tasks

### Task 1: Shared — Errors + Result + Constants + DTOs + Builders

**Files:**

- Create: `packages/shared/src/errors.ts`
- Create: `packages/shared/src/result.ts`
- Create: `packages/shared/src/card.constants.ts`
- Create: `packages/shared/src/card.dto.ts`
- Create: `packages/shared/src/testing/card.builder.ts`
- Modify: `packages/shared/src/index.ts`

- [ ] **Create `packages/shared/src/errors.ts`:**

```ts
export class AppError extends Error {
  constructor(
    public readonly code: string,
    message: string,
  ) {
    super(message);
    this.name = this.constructor.name;
  }
}
```

- [ ] **Create `packages/shared/src/result.ts`:**

```ts
import type { AppError } from './errors';

export type Result<T, E extends AppError = AppError> =
  | { ok: true; value: T }
  | { ok: false; error: E };

export const ok = <T>(value: T): { ok: true; value: T } => ({ ok: true, value });
export const err = <E extends AppError>(error: E): { ok: false; error: E } => ({
  ok: false,
  error,
});
```

- [ ] **Create `packages/shared/src/card.constants.ts`:**

```ts
export const CARD_RARITIES = {
  Basic: 'Basic',
  Token: 'Token',
  Common: 'Common',
  Rare: 'Rare',
  SuperRare: 'Super Rare',
  Majestic: 'Majestic',
  Legendary: 'Legendary',
  Fabled: 'Fabled',
  Marvel: 'Marvel',
} as const;
export type CardRarityT = (typeof CARD_RARITIES)[keyof typeof CARD_RARITIES];

export const CARD_PITCHES = { Red: 1, Yellow: 2, Blue: 3 } as const;
export type CardPitchT = (typeof CARD_PITCHES)[keyof typeof CARD_PITCHES];

export const CARD_FOILINGS = { Rainbow: 'Rainbow', Cold: 'Cold', Gold: 'Gold' } as const;
export type CardFoilingT = (typeof CARD_FOILINGS)[keyof typeof CARD_FOILINGS];

export const CARD_EDITIONS = { First: 'First', Unlimited: 'Unlimited' } as const;
export type CardEditionT = (typeof CARD_EDITIONS)[keyof typeof CARD_EDITIONS];

export const CARD_SETS = {
  WelcomeToRathe: 'Welcome to Rathe',
  ArcaneRising: 'Arcane Rising',
  CrucibleOfWar: 'Crucible of War',
  Monarch: 'Monarch',
  TalesOfAria: 'Tales of Aria',
  Everfest: 'Everfest',
  HistoryPack1: 'History Pack 1',
  RhinarBlitzDeck: 'Rhinar Blitz Deck',
  ClassicBattles: 'Classic Battles: Rhinar vs Dorinthea',
  Uprising: 'Uprising',
  Dynasty: 'Dynasty',
  Outsiders: 'Outsiders',
  DuskTillDawn: 'Dusk till Dawn',
  RoundTheTable: 'Round the Table',
  BrightLights: 'Bright Lights',
  HeavyHitters: 'Heavy Hitters',
  ArmoryKayo: 'Armory Deck: Kayo',
  PartTheMistveil: 'Part the Mistveil',
  ArmoryBoltyn: 'Armory Deck: Boltyn',
  FirstStrikeAurora: 'First Strike: Aurora',
  FirstStrikeTerra: 'First Strike: Terra',
  ArmoryAzalea: 'Armory Deck: Azalea',
  Rosetta: 'Rosetta',
  ArmoryDash: 'Armory Deck: Dash',
  ArmoryOriginsJarl: 'Armory Deck: Origins - Jarl',
  TheHunted: 'The Hunted',
  ArmoryAurora: 'Armory Deck: Aurora',
  ArmoryMaxx: 'Armory Deck: Maxx',
  ArmoryGravyBones: 'Armory Deck: Gravy Bones',
  HighSeas: 'High Seas',
  ArmoryIra: 'Armory Deck: Ira',
  ArmoryLegendsPrism: 'Armory Deck Legends: Prism',
  ArmoryLegendsViserai: 'Armory Deck Legends: Viserai',
  MasteryGuardian: 'Mastery Pack: Guardian',
  ArmoryPleiades: 'Armory Deck: Pleiades',
  SuperSlam: 'Super Slam',
  SmashPalace: 'Smash Palace',
  ArmoryRhinar: 'Armory Deck: Rhinar',
  ArmoryArakni: 'Armory Deck: Arakni',
  CompendiumOfRathe: 'Compendium of Rathe',
  ArmoryOriginsHala: 'Armory Deck: Origins - Hala',
  ArmoryZyggy: 'Armory Deck: Zyggy',
  OmensOfTheThirdAge: 'Omens of the Third Age',
  GEM: 'GEM',
  TournamentPack: 'Tournament Pack',
} as const;
export type CardSetT = (typeof CARD_SETS)[keyof typeof CARD_SETS];

export const CARD_CLASSES = {
  Adjudicator: 'Adjudicator',
  Assassin: 'Assassin',
  Bard: 'Bard',
  Brute: 'Brute',
  Generic: 'Generic',
  Guardian: 'Guardian',
  Illusionist: 'Illusionist',
  Mechanologist: 'Mechanologist',
  Merchant: 'Merchant',
  Necromancer: 'Necromancer',
  Ninja: 'Ninja',
  Pirate: 'Pirate',
  Ranger: 'Ranger',
  Runeblade: 'Runeblade',
  Shapeshifter: 'Shapeshifter',
  Thief: 'Thief',
  Warrior: 'Warrior',
  Wizard: 'Wizard',
} as const;
export type CardClassT = (typeof CARD_CLASSES)[keyof typeof CARD_CLASSES];

export const CARD_TALENTS = {
  Chaos: 'Chaos',
  Draconic: 'Draconic',
  Earth: 'Earth',
  Elemental: 'Elemental',
  Ice: 'Ice',
  Light: 'Light',
  Lightning: 'Lightning',
  Mystic: 'Mystic',
  Revered: 'Revered',
  Reviled: 'Reviled',
  Royal: 'Royal',
  Shadow: 'Shadow',
} as const;
export type CardTalentT = (typeof CARD_TALENTS)[keyof typeof CARD_TALENTS];

export const CARD_TYPES = {
  Action: 'Action',
  AttackReaction: 'Attack Reaction',
  DefenseReaction: 'Defense Reaction',
  Equipment: 'Equipment',
  Instant: 'Instant',
  Mentor: 'Mentor',
  Resource: 'Resource',
  Token: 'Token',
  Weapon: 'Weapon',
} as const;
export type CardTypeT = (typeof CARD_TYPES)[keyof typeof CARD_TYPES];

export const CARD_KEYWORDS = {
  GoAgain: 'Go again',
  Legendary: 'Legendary',
  Boost: 'Boost',
  BladeBreak: 'Blade Break',
  Dominate: 'Dominate',
  Ephemeral: 'Ephemeral',
  Freeze: 'Freeze',
  Intimidate: 'Intimidate',
  Overpowering: 'Overpowering',
  Phantasm: 'Phantasm',
  Quell: 'Quell',
  Spectra: 'Spectra',
  Temper: 'Temper',
  Ward: 'Ward',
} as const;
export type CardKeywordT = (typeof CARD_KEYWORDS)[keyof typeof CARD_KEYWORDS];

export const RARITY_ORDER: CardRarityT[] = [
  'Basic',
  'Token',
  'Common',
  'Rare',
  'Super Rare',
  'Majestic',
  'Legendary',
  'Fabled',
  'Marvel',
];

export const SET_ORDER: CardSetT[] = [
  CARD_SETS.WelcomeToRathe,
  CARD_SETS.ArcaneRising,
  CARD_SETS.CrucibleOfWar,
  CARD_SETS.Monarch,
  CARD_SETS.TalesOfAria,
  CARD_SETS.Everfest,
  CARD_SETS.HistoryPack1,
  CARD_SETS.RhinarBlitzDeck,
  CARD_SETS.ClassicBattles,
  CARD_SETS.Uprising,
  CARD_SETS.Dynasty,
  CARD_SETS.Outsiders,
  CARD_SETS.DuskTillDawn,
  CARD_SETS.RoundTheTable,
  CARD_SETS.BrightLights,
  CARD_SETS.HeavyHitters,
  CARD_SETS.ArmoryKayo,
  CARD_SETS.PartTheMistveil,
  CARD_SETS.ArmoryBoltyn,
  CARD_SETS.FirstStrikeAurora,
  CARD_SETS.FirstStrikeTerra,
  CARD_SETS.ArmoryAzalea,
  CARD_SETS.Rosetta,
  CARD_SETS.ArmoryDash,
  CARD_SETS.ArmoryOriginsJarl,
  CARD_SETS.TheHunted,
  CARD_SETS.ArmoryAurora,
  CARD_SETS.ArmoryMaxx,
  CARD_SETS.ArmoryGravyBones,
  CARD_SETS.HighSeas,
  CARD_SETS.ArmoryIra,
  CARD_SETS.ArmoryLegendsPrism,
  CARD_SETS.ArmoryLegendsViserai,
  CARD_SETS.MasteryGuardian,
  CARD_SETS.ArmoryPleiades,
  CARD_SETS.SuperSlam,
  CARD_SETS.SmashPalace,
  CARD_SETS.ArmoryRhinar,
  CARD_SETS.ArmoryArakni,
  CARD_SETS.CompendiumOfRathe,
  CARD_SETS.ArmoryOriginsHala,
  CARD_SETS.ArmoryZyggy,
  CARD_SETS.OmensOfTheThirdAge,
  CARD_SETS.GEM,
  CARD_SETS.TournamentPack,
];

export const IMAGE_BASE = 'https://content.fabrary.net/cards/';

export const MAIN_SETS: CardSetT[] = [
  CARD_SETS.WelcomeToRathe,
  CARD_SETS.ArcaneRising,
  CARD_SETS.CrucibleOfWar,
  CARD_SETS.Monarch,
  CARD_SETS.TalesOfAria,
  CARD_SETS.Everfest,
  CARD_SETS.Uprising,
  CARD_SETS.Dynasty,
  CARD_SETS.Outsiders,
  CARD_SETS.DuskTillDawn,
  CARD_SETS.BrightLights,
  CARD_SETS.HeavyHitters,
  CARD_SETS.PartTheMistveil,
  CARD_SETS.Rosetta,
  CARD_SETS.TheHunted,
  CARD_SETS.HighSeas,
  CARD_SETS.OmensOfTheThirdAge,
  CARD_SETS.GEM,
  CARD_SETS.SuperSlam,
  CARD_SETS.SmashPalace,
];
```

- [ ] **Create `packages/shared/src/card.dto.ts`:**

```ts
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
} from './card.constants';

export interface PrintingDto {
  identifier: string;
  print: string;
  set: CardSetT;
  rarity: CardRarityT;
  edition: CardEditionT | undefined;
  foiling: CardFoilingT | undefined;
  image: string;
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
  defense: number | undefined;
  functionalText: string | undefined;
  printings: PrintingDto[];
  defaultImage: string;
}
```

- [ ] **Create `packages/shared/src/testing/card.builder.ts`:**

```ts
import type { CardDto, PrintingDto } from '../card.dto';

export const printingBuilder = ({
  identifier = 'WTR001',
  print = 'WTR001-First',
  set = 'Welcome to Rathe' as PrintingDto['set'],
  rarity = 'Common' as PrintingDto['rarity'],
  edition = 'First' as PrintingDto['edition'],
  foiling = undefined as PrintingDto['foiling'],
  image = 'WTR001',
  artists = ['Test Artist'],
}: Partial<PrintingDto> = {}) => {
  const props = { identifier, print, set, rarity, edition, foiling, image, artists };

  return {
    withIdentifier: (_identifier: string) => printingBuilder({ ...props, identifier: _identifier }),
    withPrint: (_print: string) => printingBuilder({ ...props, print: _print }),
    withSet: (_set: PrintingDto['set']) => printingBuilder({ ...props, set: _set }),
    withRarity: (_rarity: PrintingDto['rarity']) => printingBuilder({ ...props, rarity: _rarity }),
    withFoiling: (_foiling: PrintingDto['foiling']) =>
      printingBuilder({ ...props, foiling: _foiling }),
    withEdition: (_edition: PrintingDto['edition']) =>
      printingBuilder({ ...props, edition: _edition }),
    build: (): PrintingDto => ({ ...props }),
  };
};

const defaultPrinting = printingBuilder().build();

export const cardBuilder = ({
  cardIdentifier = 'test-card-red',
  name = 'Test Card',
  pitch = 1 as CardDto['pitch'],
  classes = ['Generic' as CardDto['classes'][number]],
  talents = [] as CardDto['talents'],
  types = ['Action' as CardDto['types'][number]],
  subtypes = [] as string[],
  keywords = [] as CardDto['keywords'],
  rarity = 'Common' as CardDto['rarity'],
  rarities = ['Common' as CardDto['rarities'][number]],
  sets = ['Welcome to Rathe' as CardDto['sets'][number]],
  typeText = 'Action' as CardDto['typeText'],
  cost = 0 as CardDto['cost'],
  defense = 3 as CardDto['defense'],
  functionalText = undefined as CardDto['functionalText'],
  printings = [defaultPrinting],
  defaultImage = 'WTR001',
}: Partial<CardDto> = {}) => {
  const props = {
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
    defense,
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
    withKeywords: (_keywords: CardDto['keywords']) =>
      cardBuilder({ ...props, keywords: _keywords }),
    withRarity: (_rarity: CardDto['rarity']) => cardBuilder({ ...props, rarity: _rarity }),
    withSets: (_sets: CardDto['sets']) => cardBuilder({ ...props, sets: _sets }),
    withPrintings: (_printings: PrintingDto[]) => cardBuilder({ ...props, printings: _printings }),
    build: (): CardDto => ({ ...props }),
  };
};
```

- [ ] **Update `packages/shared/src/index.ts`:**

```ts
export { AppError } from './errors';
export type { Result } from './result';
export { ok, err } from './result';
export type { CardDto, PrintingDto } from './card.dto';
export {
  CARD_RARITIES,
  CARD_PITCHES,
  CARD_FOILINGS,
  CARD_EDITIONS,
  CARD_SETS,
  CARD_CLASSES,
  CARD_TALENTS,
  CARD_TYPES,
  CARD_KEYWORDS,
  RARITY_ORDER,
  SET_ORDER,
  IMAGE_BASE,
  MAIN_SETS,
} from './card.constants';
export type {
  CardRarityT,
  CardPitchT,
  CardFoilingT,
  CardEditionT,
  CardSetT,
  CardClassT,
  CardTalentT,
  CardTypeT,
  CardKeywordT,
} from './card.constants';
export { cardBuilder, printingBuilder } from './testing/card.builder';
```

- [ ] **Verify:**

```bash
pnpm --filter @codex/shared build
```

Expected: no errors.

---

### Task 2: Core — Domain Errors + Repository + Use Case

**Files:**

- Create: `packages/core/src/card-catalog/domain/card-catalog.errors.ts`
- Create: `packages/core/src/card-catalog/application/card-catalog.repository.ts`
- Create: `packages/core/src/card-catalog/application/get-all-cards.usecase.ts`

- [ ] **Create `packages/core/src/card-catalog/domain/card-catalog.errors.ts`:**

```ts
import { AppError } from '@codex/shared';

export class CardCatalogLoadError extends AppError {
  constructor(cause?: string) {
    super(
      'CARD_CATALOG_LOAD_ERROR',
      cause ? `Failed to load card catalog: ${cause}` : 'Failed to load card catalog',
    );
  }
}
```

- [ ] **Create `packages/core/src/card-catalog/application/card-catalog.repository.ts`:**

```ts
import type { CardDto, Result } from '@codex/shared';
import type { CardCatalogLoadError } from '../domain/card-catalog.errors';

export interface ICardCatalogRepository {
  getAll(): Promise<Result<CardDto[], CardCatalogLoadError>>;
}
```

- [ ] **Create `packages/core/src/card-catalog/application/get-all-cards.usecase.ts`:**

```ts
import type { CardDto, Result } from '@codex/shared';
import type { ICardCatalogRepository } from './card-catalog.repository';
import type { CardCatalogLoadError } from '../domain/card-catalog.errors';

export class GetAllCardsUseCase {
  constructor(private readonly repository: ICardCatalogRepository) {}

  execute(): Promise<Result<CardDto[], CardCatalogLoadError>> {
    return this.repository.getAll();
  }
}
```

---

### Task 3: Core — In-Memory Repository + Fixture + Tests

**Files:**

- Create: `packages/core/src/card-catalog/infrastructure/card-catalog.inmemory.repository.ts`
- Create: `packages/core/src/card-catalog/application/__tests__/card-catalog.fixture.ts`
- Create: `packages/core/src/card-catalog/application/__tests__/get-all-cards.spec.ts`

- [ ] **Create `packages/core/src/card-catalog/infrastructure/card-catalog.inmemory.repository.ts`:**

```ts
import type { CardDto, Result } from '@codex/shared';
import { ok } from '@codex/shared';
import type { ICardCatalogRepository } from '../application/card-catalog.repository';
import type { CardCatalogLoadError } from '../domain/card-catalog.errors';

export class CardCatalogInMemoryRepository implements ICardCatalogRepository {
  private cards: CardDto[] = [];

  withCards(cards: CardDto[]): this {
    this.cards = cards;
    return this;
  }

  async getAll(): Promise<Result<CardDto[], CardCatalogLoadError>> {
    return ok(this.cards);
  }
}
```

- [ ] **Create `packages/core/src/card-catalog/application/__tests__/card-catalog.fixture.ts`:**

```ts
import type { CardDto, Result } from '@codex/shared';
import { GetAllCardsUseCase } from '../get-all-cards.usecase';
import { CardCatalogInMemoryRepository } from '../../infrastructure/card-catalog.inmemory.repository';
import type { CardCatalogLoadError } from '../../domain/card-catalog.errors';

export const createCardCatalogFixture = () => {
  const repository = new CardCatalogInMemoryRepository();
  const useCase = new GetAllCardsUseCase(repository);
  let result: Result<CardDto[], CardCatalogLoadError> | null = null;

  return {
    givenExistingCards(cards: CardDto[]) {
      repository.withCards(cards);
    },
    async whenGettingAllCards() {
      result = await useCase.execute();
    },
    thenCardsShouldBe(expected: CardDto[]) {
      if (!result?.ok) throw new Error('Expected successful result but got an error');
      expect(result.value).toEqual(expected);
    },
  };
};
```

- [ ] **Create `packages/core/src/card-catalog/application/__tests__/get-all-cards.spec.ts`:**

```ts
import { describe, test } from 'vitest';
import { cardBuilder } from '@codex/shared';
import { createCardCatalogFixture } from './card-catalog.fixture';

describe('Feature: Listing all cards', () => {
  test('Rule: It should list all the printed cards', async () => {
    const fixture = createCardCatalogFixture();
    const cards = [
      cardBuilder().withCardIdentifier('card-a').build(),
      cardBuilder().withCardIdentifier('card-b').build(),
    ];

    fixture.givenExistingCards(cards);
    await fixture.whenGettingAllCards();
    fixture.thenCardsShouldBe(cards);
  });

  test('Rule: It should return an empty list when the catalog has no cards', async () => {
    const fixture = createCardCatalogFixture();

    fixture.givenExistingCards([]);
    await fixture.whenGettingAllCards();
    fixture.thenCardsShouldBe([]);
  });
});
```

- [ ] **Run tests:**

```bash
pnpm --filter @codex/core test
```

Expected: 2 tests pass.

---

### Task 4: Core — FaB Repository + core/index.ts

**Files:**

- Create: `packages/core/src/card-catalog/infrastructure/card-catalog.fab.repository.ts`
- Modify: `packages/core/src/index.ts`

- [ ] **Create `packages/core/src/card-catalog/infrastructure/card-catalog.fab.repository.ts`:**

```ts
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
  classes: (card.classes ?? []) as CardDto['classes'],
  talents: (card.talents ?? []) as CardDto['talents'],
  types: (card.types ?? []) as CardDto['types'],
  subtypes: card.subtypes ?? [],
  keywords: (card.keywords ?? []) as CardDto['keywords'],
  rarity: card.rarity as CardDto['rarity'],
  rarities: (card.rarities ?? []) as CardDto['rarities'],
  sets: (card.sets ?? []) as CardDto['sets'],
  typeText: card.typeText,
  cost: card.cost,
  defense: card.defense,
  functionalText: card.functionalText,
  printings: (card.printings ?? []).map(mapToPrintingDto),
  defaultImage: card.defaultImage,
});

const mapToPrintingDto = (p: (typeof fabCards)[number]['printings'][number]): PrintingDto => ({
  identifier: p.identifier,
  print: p.print,
  set: p.set as PrintingDto['set'],
  rarity: p.rarity as PrintingDto['rarity'],
  edition: p.edition as PrintingDto['edition'],
  foiling: p.foiling as PrintingDto['foiling'],
  image: p.image,
  artists: p.artists ?? [],
});
```

- [ ] **Update `packages/core/src/index.ts`:**

```ts
export type { ICardCatalogRepository } from './card-catalog/application/card-catalog.repository';
export { GetAllCardsUseCase } from './card-catalog/application/get-all-cards.usecase';
export { CardCatalogLoadError } from './card-catalog/domain/card-catalog.errors';
export { CardCatalogFabRepository } from './card-catalog/infrastructure/card-catalog.fab.repository';
export { CardCatalogInMemoryRepository } from './card-catalog/infrastructure/card-catalog.inmemory.repository';
```

- [ ] **Verify:**

```bash
pnpm --filter @codex/core build
```

Expected: no TypeScript errors.

---

### Task 5: NestJS Cards Module

**Files:**

- Create: `apps/api/src/common/domain-error.filter.ts`
- Create: `apps/api/src/cards/cards.schemas.ts`
- Create: `apps/api/src/cards/cards.controller.ts`
- Create: `apps/api/src/cards/cards.module.ts`
- Modify: `apps/api/src/app.module.ts`

- [ ] **Create `apps/api/src/common/domain-error.filter.ts`:**

```ts
import { type ArgumentsHost, Catch, type ExceptionFilter, HttpStatus } from '@nestjs/common';
import { AppError } from '@codex/shared';
import type { Response } from 'express';

@Catch(AppError)
export class DomainErrorFilter implements ExceptionFilter {
  catch(error: AppError, host: ArgumentsHost): void {
    const response = host.switchToHttp().getResponse<Response>();
    response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      code: error.code,
      message: error.message,
    });
  }
}
```

- [ ] **Create `apps/api/src/cards/cards.schemas.ts`:**

```ts
import { z } from 'zod';

export const PrintingSchema = z.object({
  identifier: z.string(),
  print: z.string(),
  set: z.string(),
  rarity: z.string(),
  edition: z.string().optional(),
  foiling: z.string().optional(),
  image: z.string(),
  artists: z.array(z.string()),
});

export const CardSchema = z.object({
  cardIdentifier: z.string(),
  name: z.string(),
  pitch: z.union([z.literal(1), z.literal(2), z.literal(3)]).optional(),
  classes: z.array(z.string()),
  talents: z.array(z.string()),
  types: z.array(z.string()),
  subtypes: z.array(z.string()),
  keywords: z.array(z.string()),
  rarity: z.string(),
  rarities: z.array(z.string()),
  sets: z.array(z.string()),
  typeText: z.string().optional(),
  cost: z.number().optional(),
  defense: z.number().optional(),
  functionalText: z.string().optional(),
  printings: z.array(PrintingSchema),
  defaultImage: z.string(),
});
```

- [ ] **Create `apps/api/src/cards/cards.controller.ts`:**

```ts
import { Controller, Get, Inject } from '@nestjs/common';
import { GetAllCardsUseCase } from '@codex/core';
import type { CardDto } from '@codex/shared';

@Controller('cards')
export class CardsController {
  constructor(
    @Inject(GetAllCardsUseCase)
    private readonly getAllCards: GetAllCardsUseCase,
  ) {}

  @Get()
  async getAll(): Promise<CardDto[]> {
    const result = await this.getAllCards.execute();
    if (!result.ok) throw result.error;
    return result.value;
  }
}
```

The `DomainErrorFilter` (registered globally in `app.module.ts`) catches `CardCatalogLoadError` (which extends `AppError`) and returns a structured 500 response.

- [ ] **Create `apps/api/src/cards/cards.module.ts`:**

```ts
import { Module } from '@nestjs/common';
import { GetAllCardsUseCase, CardCatalogFabRepository } from '@codex/core';
import { CardsController } from './cards.controller';

@Module({
  controllers: [CardsController],
  providers: [
    { provide: CardCatalogFabRepository, useClass: CardCatalogFabRepository },
    {
      provide: GetAllCardsUseCase,
      useFactory: (repo: CardCatalogFabRepository) => new GetAllCardsUseCase(repo),
      inject: [CardCatalogFabRepository],
    },
  ],
})
export class CardsModule {}
```

- [ ] **Update `apps/api/src/app.module.ts`:**

```ts
import { Module } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';
import { ConfigModule } from '@nestjs/config';
import { CardsModule } from './cards/cards.module';
import { DomainErrorFilter } from './common/domain-error.filter';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), CardsModule],
  providers: [{ provide: APP_FILTER, useClass: DomainErrorFilter }],
})
export class AppModule {}
```

- [ ] **Build and smoke-test:**

```bash
pnpm --filter @codex/api build
pnpm --filter @codex/api dev
# in another terminal:
curl http://localhost:3001/api/cards | head -c 500
```

Expected: JSON array starting with `[{"cardIdentifier":`.

---

### Task 6: Frontend Gateways

**Files:**

- Modify: `apps/web/package.json`
- Create: `apps/web/src/services/card.gateway.ts`
- Create: `apps/web/src/services/card.api.gateway.ts`
- Create: `apps/web/src/services/card.inmemory.gateway.ts`
- Create: `apps/web/src/services/search.gateway.ts`
- Create: `apps/web/src/services/search.fuse.gateway.ts`
- Create: `apps/web/src/services/search.inmemory.gateway.ts`

- [ ] **Add `react-router` to `apps/web/package.json`:**

```json
"react-router": "^7.16.0"
```

Run: `pnpm install --no-frozen-lockfile`

- [ ] **Create `apps/web/src/services/card.gateway.ts`:**

```ts
import type { CardDto, Result } from '@codex/shared';
import type { AppError } from '@codex/shared';

export interface ICardGateway {
  getAll(): Promise<Result<CardDto[], AppError>>;
}
```

- [ ] **Create `apps/web/src/services/card.api.gateway.ts`:**

```ts
import type { CardDto, Result } from '@codex/shared';
import { ok, err, AppError } from '@codex/shared';
import type { ICardGateway } from './card.gateway';

export class CardApiGateway implements ICardGateway {
  async getAll(): Promise<Result<CardDto[], AppError>> {
    try {
      const response = await fetch('/api/cards');
      if (!response.ok)
        return err(new AppError('CARD_API_ERROR', `Failed to fetch cards: ${response.status}`));
      return ok((await response.json()) as CardDto[]);
    } catch (e) {
      return err(
        new AppError('CARD_NETWORK_ERROR', e instanceof Error ? e.message : 'Network error'),
      );
    }
  }
}
```

- [ ] **Create `apps/web/src/services/card.inmemory.gateway.ts`:**

```ts
import type { CardDto, Result } from '@codex/shared';
import { ok, err, AppError } from '@codex/shared';
import type { ICardGateway } from './card.gateway';

export class CardInMemoryGateway implements ICardGateway {
  constructor(
    private readonly cards: CardDto[] = [],
    private readonly simulatedError?: string,
  ) {}

  async getAll(): Promise<Result<CardDto[], AppError>> {
    if (this.simulatedError) return err(new AppError('CARD_SIMULATED_ERROR', this.simulatedError));
    return ok(this.cards);
  }
}
```

- [ ] **Create `apps/web/src/services/search.gateway.ts`:**

```ts
export interface ISearchGateway {
  index(items: unknown[]): void;
  search(query: string): unknown[];
}
```

- [ ] **Create `apps/web/src/services/search.fuse.gateway.ts`:**

```ts
import Fuse from 'fuse.js';
import type { CardDto } from '@codex/shared';
import type { ISearchGateway } from './search.gateway';

export class FuseSearchGateway implements ISearchGateway {
  private fuse: Fuse<CardDto> | null = null;

  index(items: unknown[]): void {
    this.fuse = new Fuse(items as CardDto[], {
      keys: ['name', 'cardIdentifier', 'classes', 'talents', 'types', 'keywords', 'functionalText'],
      threshold: 0.35,
      includeScore: true,
    });
  }

  search(query: string): unknown[] {
    if (!this.fuse) return [];
    return this.fuse.search(query).map((r) => r.item);
  }
}
```

- [ ] **Create `apps/web/src/services/search.inmemory.gateway.ts`:**

```ts
import type { CardDto } from '@codex/shared';
import type { ISearchGateway } from './search.gateway';

export class InMemorySearchGateway implements ISearchGateway {
  private items: CardDto[] = [];

  index(items: unknown[]): void {
    this.items = items as CardDto[];
  }

  search(query: string): unknown[] {
    const q = query.toLowerCase();
    return this.items.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.cardIdentifier.toLowerCase().includes(q) ||
        c.classes.some((cls) => cls.toLowerCase().includes(q)) ||
        c.keywords.some((k) => k.toLowerCase().includes(q)),
    );
  }
}
```

---

### Task 7: Store Types + Wire Store

**Files:**

- Create: `apps/web/src/store/types.ts`
- Create: `apps/web/src/store/index.ts`

- [ ] **Create `apps/web/src/store/types.ts`:**

```ts
import type { ICardGateway } from '../services/card.gateway';
import type { ISearchGateway } from '../services/search.gateway';

export type { ICardGateway, ISearchGateway };

export interface ThunkDependencies {
  cardGateway: ICardGateway;
  searchGateway: ISearchGateway;
  collectionService: unknown;
  authService: unknown;
}
```

- [ ] **Create `apps/web/src/store/index.ts`:**

```ts
import { combineReducers, configureStore, createAsyncThunk } from '@reduxjs/toolkit';
import type { ThunkAction, UnknownAction } from '@reduxjs/toolkit';
import type { ThunkDependencies } from './types';
import { cardCatalogSlice } from './card-catalog/card-catalog.slice';
import { filtersSlice } from './filters/filters.slice';

export const rootReducer = combineReducers({
  cardCatalog: cardCatalogSlice.reducer,
  filters: filtersSlice.reducer,
});

export type RootState = ReturnType<typeof rootReducer>;

export const createStore = (dependencies: ThunkDependencies, preloadedState?: Partial<RootState>) =>
  configureStore({
    reducer: rootReducer,
    preloadedState,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        thunk: { extraArgument: dependencies },
        serializableCheck: false,
      }),
  });

export type AppStore = ReturnType<typeof createStore>;
export type AppDispatch = AppStore['dispatch'];
export type AppThunk<R = void> = ThunkAction<R, RootState, ThunkDependencies, UnknownAction>;

export const createAppAsyncThunk = createAsyncThunk.withTypes<{
  state: RootState;
  dispatch: AppDispatch;
  extra: ThunkDependencies;
  rejectValue: string;
}>();
```

---

### Task 8: Filters Slice + Selectors

**Files:**

- Create: `apps/web/src/store/filters/filters.slice.ts`
- Create: `apps/web/src/store/filters/filters.selectors.ts`

- [ ] **Create `apps/web/src/store/filters/filters.slice.ts`:**

```ts
import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export type FilterMode = 'include' | 'exclude';

export interface RarityFilter {
  mode: 'none' | 'exact' | 'above' | 'below';
  value: string;
  exclude: boolean;
}

export interface FiltersState {
  classes: string[];
  classesMode: FilterMode;
  talents: string[];
  talentsMode: FilterMode;
  types: string[];
  typesMode: FilterMode;
  keywords: string[];
  keywordsMode: FilterMode;
  rarity: RarityFilter;
  foiling: string;
  sets: string[];
  dualClassOnly: boolean;
  showPromo: boolean;
  binderView: boolean;
  searchQuery: string;
  ordering: { direction: 'asc' | 'desc'; incompleteRowsFirst: boolean };
}

const initialState: FiltersState = {
  classes: [],
  classesMode: 'include',
  talents: [],
  talentsMode: 'include',
  types: [],
  typesMode: 'include',
  keywords: [],
  keywordsMode: 'include',
  rarity: { mode: 'none', value: '', exclude: false },
  foiling: 'all',
  sets: [],
  dualClassOnly: false,
  showPromo: true,
  binderView: true,
  searchQuery: '',
  ordering: { direction: 'asc', incompleteRowsFirst: false },
};

export const filtersSlice = createSlice({
  name: 'filters',
  initialState,
  reducers: {
    setClasses(state, action: PayloadAction<{ values: string[]; mode: FilterMode }>) {
      state.classes = action.payload.values;
      state.classesMode = action.payload.mode;
    },
    setTalents(state, action: PayloadAction<{ values: string[]; mode: FilterMode }>) {
      state.talents = action.payload.values;
      state.talentsMode = action.payload.mode;
    },
    setTypes(state, action: PayloadAction<{ values: string[]; mode: FilterMode }>) {
      state.types = action.payload.values;
      state.typesMode = action.payload.mode;
    },
    setKeywords(state, action: PayloadAction<{ values: string[]; mode: FilterMode }>) {
      state.keywords = action.payload.values;
      state.keywordsMode = action.payload.mode;
    },
    setRarity(state, action: PayloadAction<RarityFilter>) {
      state.rarity = action.payload;
    },
    setFoiling(state, action: PayloadAction<string>) {
      state.foiling = action.payload;
    },
    setSets(state, action: PayloadAction<string[]>) {
      state.sets = action.payload;
    },
    setDualClassOnly(state, action: PayloadAction<boolean>) {
      state.dualClassOnly = action.payload;
    },
    setShowPromo(state, action: PayloadAction<boolean>) {
      state.showPromo = action.payload;
    },
    setBinderView(state, action: PayloadAction<boolean>) {
      state.binderView = action.payload;
    },
    setSearchQuery(state, action: PayloadAction<string>) {
      state.searchQuery = action.payload;
    },
    setOrdering(state, action: PayloadAction<FiltersState['ordering']>) {
      state.ordering = action.payload;
    },
    resetFilters() {
      return initialState;
    },
  },
});

export const {
  setClasses,
  setTalents,
  setTypes,
  setKeywords,
  setRarity,
  setFoiling,
  setSets,
  setDualClassOnly,
  setShowPromo,
  setBinderView,
  setSearchQuery,
  setOrdering,
  resetFilters,
} = filtersSlice.actions;
```

- [ ] **Create `apps/web/src/store/filters/filters.selectors.ts`:**

```ts
import { createSelector } from '@reduxjs/toolkit';
import type { RootState } from '../index';

export const selectFilters = (state: RootState) => state.filters;
export const selectSearchQuery = (state: RootState) => state.filters.searchQuery;
export const selectBinderView = (state: RootState) => state.filters.binderView;
export const selectShowPromo = (state: RootState) => state.filters.showPromo;
export const selectOrdering = (state: RootState) => state.filters.ordering;

export const selectHasActiveFilters = createSelector(
  selectFilters,
  (f) =>
    f.classes.length > 0 ||
    f.talents.length > 0 ||
    f.types.length > 0 ||
    f.keywords.length > 0 ||
    f.rarity.mode !== 'none' ||
    f.foiling !== 'all' ||
    f.sets.length > 0 ||
    f.dualClassOnly ||
    f.searchQuery.length > 0,
);
```

---

### Task 9: Card Catalog Slice + Thunks

**Files:**

- Create: `apps/web/src/store/card-catalog/card-catalog.slice.ts`
- Create: `apps/web/src/store/card-catalog/card-catalog.thunks.ts`

- [ ] **Create `apps/web/src/store/card-catalog/card-catalog.slice.ts`:**

```ts
import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { CardDto } from '@codex/shared';
import { fetchAllCards } from './card-catalog.thunks';

export interface CardCatalogState {
  allCards: CardDto[];
  searchResults: CardDto[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | undefined;
}

const initialState: CardCatalogState = {
  allCards: [],
  searchResults: [],
  status: 'idle',
  error: undefined,
};

export const cardCatalogSlice = createSlice({
  name: 'cardCatalog',
  initialState,
  reducers: {
    setSearchResults(state, action: PayloadAction<CardDto[]>) {
      state.searchResults = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllCards.pending, (state) => {
        state.status = 'loading';
        state.error = undefined;
      })
      .addCase(fetchAllCards.fulfilled, (state, action) => {
        state.allCards = action.payload;
        state.searchResults = action.payload;
        state.status = 'succeeded';
      })
      .addCase(fetchAllCards.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload ?? action.error.message ?? 'Failed to load cards';
      });
  },
});

export const { setSearchResults } = cardCatalogSlice.actions;
```

- [ ] **Create `apps/web/src/store/card-catalog/card-catalog.thunks.ts`:**

```ts
import type { CardDto } from '@codex/shared';
import type { AppThunk } from '../index';
import { createAppAsyncThunk } from '../index';
import { setSearchResults } from './card-catalog.slice';

export const fetchAllCards = createAppAsyncThunk<CardDto[], void>(
  'cardCatalog/fetchAllCards',
  async (_, { extra, rejectWithValue }) => {
    const result = await extra.cardGateway.getAll();
    if (!result.ok) return rejectWithValue(result.error.message);
    extra.searchGateway.index(result.value);
    return result.value;
  },
);

export const searchCards =
  (query: string): AppThunk =>
  (dispatch, getState, extra) => {
    const allCards = getState().cardCatalog.allCards;
    if (!query.trim()) {
      dispatch(setSearchResults(allCards));
      return;
    }
    dispatch(setSearchResults(extra.searchGateway.search(query) as CardDto[]));
  };
```

---

### Task 10: FE Test Store + Card Catalog Tests

**Files:**

- Create: `apps/web/src/store/card-catalog/__tests__/create-test-store.ts`
- Create: `apps/web/src/store/card-catalog/__tests__/card-catalog.spec.ts`

- [ ] **Create `apps/web/src/store/card-catalog/__tests__/create-test-store.ts`:**

```ts
import { configureStore, isAsyncThunkAction } from '@reduxjs/toolkit';
import type { Middleware, UnknownAction } from '@reduxjs/toolkit';
import { rootReducer } from '../../index';
import type { RootState, ThunkDependencies } from '../../index';
import { CardInMemoryGateway } from '../../../services/card.inmemory.gateway';
import { InMemorySearchGateway } from '../../../services/search.inmemory.gateway';

export const EMPTY_ARGS = 'EMPTY_ARGS' as const;

export const createTestStore = (
  {
    cardGateway = new CardInMemoryGateway(),
    searchGateway = new InMemorySearchGateway(),
    collectionService = {},
    authService = {},
  }: Partial<ThunkDependencies> = {},
  preloadedState?: Partial<RootState>,
) => {
  const actions: UnknownAction[] = [];

  const actionLogger: Middleware = () => (next) => (action) => {
    actions.push(action as UnknownAction);
    return next(action);
  };

  const store = configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        thunk: { extraArgument: { cardGateway, searchGateway, collectionService, authService } },
        serializableCheck: false,
      }).concat(actionLogger),
    preloadedState,
  });

  return {
    ...store,
    getActions: () => actions,
    getDispatchedUseCaseArgs(useCase: { pending: { toString(): string } }) {
      const action = actions.find(
        (a) => (a as { type?: string }).type === useCase.pending.toString(),
      );
      if (!action || !isAsyncThunkAction(action)) return undefined;
      return (action.meta as { arg?: unknown }).arg ?? EMPTY_ARGS;
    },
  };
};

export type AppTestStore = ReturnType<typeof createTestStore>;
```

- [ ] **Create `apps/web/src/store/card-catalog/__tests__/card-catalog.spec.ts`:**

```ts
import { describe, test, expect } from 'vitest';
import { cardBuilder } from '@codex/shared';
import { CardInMemoryGateway } from '../../../services/card.inmemory.gateway';
import { fetchAllCards, searchCards } from '../card-catalog.thunks';
import { createTestStore } from './create-test-store';

describe('Feature: Loading cards', () => {
  test('Rule: It should load all available cards', async () => {
    const card = cardBuilder().withCardIdentifier('card-a').build();
    const store = createTestStore({ cardGateway: new CardInMemoryGateway([card]) });

    await store.dispatch(fetchAllCards());

    expect(store.getState().cardCatalog.status).toBe('succeeded');
    expect(store.getState().cardCatalog.allCards).toHaveLength(1);
    expect(store.getState().cardCatalog.allCards[0].cardIdentifier).toBe('card-a');
  });

  test('Rule: It should report a failure when the cards could not be loaded', async () => {
    const store = createTestStore({
      cardGateway: new CardInMemoryGateway([], 'Network error'),
    });

    await store.dispatch(fetchAllCards());

    expect(store.getState().cardCatalog.status).toBe('failed');
    expect(store.getState().cardCatalog.error).toBe('Network error');
  });
});

describe('Feature: Searching cards', () => {
  test('Rule: It should show only cards matching the search query', async () => {
    const cards = [
      cardBuilder().withCardIdentifier('ninja-strike-red').withName('Ninja Strike').build(),
      cardBuilder().withCardIdentifier('brute-force-red').withName('Brute Force').build(),
    ];
    const store = createTestStore({ cardGateway: new CardInMemoryGateway(cards) });
    await store.dispatch(fetchAllCards());

    store.dispatch(searchCards('ninja'));

    expect(store.getState().cardCatalog.searchResults).toHaveLength(1);
    expect(store.getState().cardCatalog.searchResults[0].name).toBe('Ninja Strike');
  });

  test('Rule: It should restore the full catalog when the search is cleared', async () => {
    const cards = [
      cardBuilder().withCardIdentifier('card-a').withName('Alpha').build(),
      cardBuilder().withCardIdentifier('card-b').withName('Beta').build(),
    ];
    const store = createTestStore({ cardGateway: new CardInMemoryGateway(cards) });
    await store.dispatch(fetchAllCards());

    store.dispatch(searchCards('alpha'));
    expect(store.getState().cardCatalog.searchResults).toHaveLength(1);

    store.dispatch(searchCards(''));
    expect(store.getState().cardCatalog.searchResults).toHaveLength(2);
  });
});
```

- [ ] **Run tests:**

```bash
pnpm --filter @codex/web test
```

Expected: 4 tests pass.

---

### Task 11: Card Catalog Selectors

**Files:**

- Create: `apps/web/src/store/card-catalog/card-catalog.selectors.ts`

- [ ] **Create `apps/web/src/store/card-catalog/card-catalog.selectors.ts`:**

```ts
import { createSelector } from '@reduxjs/toolkit';
import type { CardDto, PrintingDto } from '@codex/shared';
import { RARITY_ORDER, SET_ORDER } from '@codex/shared';
import type { RootState } from '../index';
import type { FiltersState, RarityFilter, FilterMode } from '../filters/filters.slice';
import {
  selectFilters,
  selectBinderView,
  selectShowPromo,
  selectOrdering,
} from '../filters/filters.selectors';

export type GridSlot =
  | { type: 'card'; card: CardDto; printing: PrintingDto }
  | { type: 'empty' }
  | { type: 'page-break' };

const selectSearchResults = (state: RootState) => state.cardCatalog.searchResults;

export const selectFilteredCards = createSelector(
  selectSearchResults,
  selectFilters,
  (cards, filters) => applyFilters(cards, filters),
);

export const selectGroupedGridSlots = createSelector(
  selectFilteredCards,
  selectBinderView,
  selectShowPromo,
  selectOrdering,
  (cards, binderView, showPromo, ordering) =>
    buildGridSlots(cards, binderView, showPromo, ordering),
);

// ── Filter helpers ───────────────────────────────────────────────────────────

const matchesMultiFilter = (values: string[], filter: string[], mode: FilterMode): boolean => {
  if (filter.length === 0) return true;
  const match = filter.some((f) => values.includes(f));
  return mode === 'include' ? match : !match;
};

const matchesRarity = (card: CardDto, filter: RarityFilter): boolean => {
  if (filter.mode === 'none' || !filter.value) return true;
  const cardIdx = RARITY_ORDER.indexOf(card.rarity);
  const filterIdx = RARITY_ORDER.indexOf(filter.value as (typeof RARITY_ORDER)[number]);
  if (filter.mode === 'exact') return (card.rarity === filter.value) !== filter.exclude;
  if (filter.mode === 'above') return cardIdx > filterIdx !== filter.exclude;
  return cardIdx < filterIdx !== filter.exclude;
};

const ABOVE_REGULAR = new Set(['Rainbow', 'Cold', 'Gold']);

const matchesFoiling = (card: CardDto, foiling: string): boolean => {
  if (foiling === 'all') return true;
  if (foiling === 'above-regular')
    return card.printings.some((p) => p.foiling && ABOVE_REGULAR.has(p.foiling));
  return card.printings.some((p) => p.foiling === foiling);
};

const applyFilters = (cards: CardDto[], f: FiltersState): CardDto[] =>
  cards.filter((card) => {
    if (!matchesMultiFilter(card.classes, f.classes, f.classesMode)) return false;
    if (!matchesMultiFilter(card.talents, f.talents, f.talentsMode)) return false;
    if (!matchesMultiFilter(card.types, f.types, f.typesMode)) return false;
    if (!matchesMultiFilter(card.keywords, f.keywords, f.keywordsMode)) return false;
    if (!matchesRarity(card, f.rarity)) return false;
    if (!matchesFoiling(card, f.foiling)) return false;
    if (f.sets.length > 0 && !f.sets.some((s) => card.sets.includes(s))) return false;
    if (
      f.dualClassOnly &&
      card.classes.filter((c) => c !== 'Generic' && c !== 'NotClassed').length < 2
    )
      return false;
    return true;
  });

// ── Grid layout ──────────────────────────────────────────────────────────────

interface CategorizedCards {
  complete: Array<{ red: CardDto; yellow: CardDto; blue: CardDto }>;
  incomplete: CardDto[];
  colorless: CardDto[];
  legendary: CardDto[];
  equipment: CardDto[];
}

const isEquipment = (c: CardDto) => c.types.includes('Equipment');
const isLegendary = (c: CardDto) => c.keywords.includes('Legendary') && !isEquipment(c);
const isPitched = (c: CardDto) => c.pitch !== undefined && !isLegendary(c) && !isEquipment(c);
const isColorless = (c: CardDto) => c.pitch === undefined && !isLegendary(c) && !isEquipment(c);

const categorizeCards = (cards: CardDto[]): CategorizedCards => {
  const groups = new Map<string, { red?: CardDto; yellow?: CardDto; blue?: CardDto }>();

  for (const card of cards.filter(isPitched)) {
    const base = card.cardIdentifier.replace(/-(?:red|yellow|blue)$/, '');
    const group = groups.get(base) ?? {};
    if (card.pitch === 1) group.red = card;
    else if (card.pitch === 2) group.yellow = card;
    else if (card.pitch === 3) group.blue = card;
    groups.set(base, group);
  }

  const complete: CategorizedCards['complete'] = [];
  const incomplete: CardDto[] = [];

  for (const group of groups.values()) {
    if (group.red && group.yellow && group.blue) {
      complete.push({ red: group.red, yellow: group.yellow, blue: group.blue });
    } else {
      if (group.red) incomplete.push(group.red);
      if (group.yellow) incomplete.push(group.yellow);
      if (group.blue) incomplete.push(group.blue);
    }
  }

  return {
    complete,
    incomplete,
    colorless: cards.filter(isColorless),
    legendary: cards.filter(isLegendary),
    equipment: cards.filter(isEquipment),
  };
};

const choosePrinting = (card: CardDto, showPromo: boolean): PrintingDto => {
  if (showPromo) {
    const promo = card.printings.find((p) => p.set === 'Promos');
    if (promo) return promo;
  }
  return (
    card.printings[0] ?? {
      identifier: card.defaultImage,
      print: card.defaultImage,
      set: card.sets[0] ?? ('Welcome to Rathe' as PrintingDto['set']),
      rarity: card.rarity,
      edition: undefined,
      foiling: undefined,
      image: card.defaultImage,
      artists: [],
    }
  );
};

const cardSlot = (card: CardDto, showPromo: boolean): GridSlot => ({
  type: 'card',
  card,
  printing: choosePrinting(card, showPromo),
});

const buildCardsInRows = (cards: CardDto[], showPromo: boolean): GridSlot[] => {
  const slots: GridSlot[] = [];
  for (let i = 0; i < cards.length; i += 3) {
    for (let col = 0; col < 3; col++) {
      const card = cards[i + col];
      slots.push(card ? cardSlot(card, showPromo) : { type: 'empty' });
    }
  }
  return slots;
};

const buildCompleteGroupSlots = (
  groups: CategorizedCards['complete'],
  showPromo: boolean,
): GridSlot[] => {
  const slots: GridSlot[] = [];
  for (let i = 0; i < groups.length; i += 3) {
    const batch = groups.slice(i, i + 3);
    for (const pitchKey of ['red', 'yellow', 'blue'] as const) {
      for (let col = 0; col < 3; col++) {
        const group = batch[col];
        slots.push(group ? cardSlot(group[pitchKey], showPromo) : { type: 'empty' });
      }
    }
  }
  return slots;
};

const insertLegendarySlots = (
  slots: GridSlot[],
  legendary: CardDto[],
  showPromo: boolean,
): GridSlot[] => {
  const result = [...slots];
  let rowStart = result.length - (result.length % 3);

  for (const card of legendary) {
    if (rowStart % 3 !== 0) rowStart += 3 - (rowStart % 3);
    result.splice(rowStart, 0, { type: 'empty' }, cardSlot(card, showPromo), { type: 'empty' });
    rowStart += 3;
  }

  return result;
};

const insertPageBreaks = (slots: GridSlot[]): GridSlot[] => {
  const result: GridSlot[] = [];
  let count = 0;
  for (const slot of slots) {
    if (count > 0 && count % 9 === 0) result.push({ type: 'page-break' });
    result.push(slot);
    count++;
  }
  return result;
};

const sortCards = (cards: CardDto[], ordering: { direction: 'asc' | 'desc' }): CardDto[] =>
  [...cards].sort((a, b) => {
    const setA = SET_ORDER.indexOf((a.sets[0] as (typeof SET_ORDER)[number]) ?? 'Welcome to Rathe');
    const setB = SET_ORDER.indexOf((b.sets[0] as (typeof SET_ORDER)[number]) ?? 'Welcome to Rathe');
    const setDiff = setA - setB;
    if (setDiff !== 0) return ordering.direction === 'asc' ? setDiff : -setDiff;
    const idDiff = a.cardIdentifier.localeCompare(b.cardIdentifier);
    return ordering.direction === 'asc' ? idDiff : -idDiff;
  });

const buildGridSlots = (
  cards: CardDto[],
  binderView: boolean,
  showPromo: boolean,
  ordering: { direction: 'asc' | 'desc'; incompleteRowsFirst: boolean },
): GridSlot[] => {
  const sorted = sortCards(cards, ordering);
  const { complete, incomplete, colorless, legendary, equipment } = categorizeCards(sorted);

  const pitchedSlots = buildCompleteGroupSlots(complete, showPromo);
  const extraSlots = buildCardsInRows([...incomplete, ...colorless], showPromo);
  const withLegendary = insertLegendarySlots(
    [...pitchedSlots, ...extraSlots],
    legendary,
    showPromo,
  );
  const equipmentSlots = buildCardsInRows(equipment, showPromo);

  const allSlots = [...withLegendary, ...equipmentSlots];
  return binderView ? insertPageBreaks(allSlots) : allSlots;
};
```

---

### Task 12: Wire Store + main.tsx

**Files:**

- Modify: `apps/web/src/main.tsx`

- [ ] **Update `apps/web/src/main.tsx`:**

```tsx
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { App } from './App';
import { createStore } from './store';
import { CardApiGateway } from './services/card.api.gateway';
import { FuseSearchGateway } from './services/search.fuse.gateway';
import './index.css';

const store = createStore({
  cardGateway: new CardApiGateway(),
  searchGateway: new FuseSearchGateway(),
  collectionService: {},
  authService: {},
});

const root = document.getElementById('root');
if (!root) throw new Error('Root element #root not found');

createRoot(root).render(
  <StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </StrictMode>,
);
```

- [ ] **Run full test suite:**

```bash
pnpm --filter @codex/web test
```

Expected: all tests pass.

---

### Task 13: useDebounced Hook

**Files:**

- Create: `apps/web/src/hooks/useDebounced.ts`

- [ ] **Create `apps/web/src/hooks/useDebounced.ts`:**

```ts
import { useEffect, useRef } from 'react';

export const useDebounced = (callback: () => void, delay: number, deps: unknown[]) => {
  const callbackRef = useRef(callback);
  callbackRef.current = callback;

  useEffect(() => {
    const timer = setTimeout(() => callbackRef.current(), delay);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...deps, delay]);
};
```

---

### Task 14: Card Components

**Files:**

- Create: `apps/web/src/components/card/CardBack.tsx`
- Create: `apps/web/src/components/card/card-grid-item.view-model.ts`
- Create: `apps/web/src/components/card/CardGridItem.tsx`
- Create: `apps/web/src/components/card/card-grid.view-model.ts`
- Create: `apps/web/src/components/card/CardGrid.tsx`

- [ ] **Create `apps/web/src/components/card/CardBack.tsx`:**

```tsx
export const CardBack = ({ className }: { className?: string }) => (
  <div
    className={`aspect-[5/7] rounded-lg bg-slate-800 border border-slate-600 flex items-center justify-center ${className ?? ''}`}
  >
    <div className="w-3/4 h-3/4 rounded-md bg-slate-700 opacity-60" />
  </div>
);
```

- [ ] **Create `apps/web/src/components/card/card-grid-item.view-model.ts`:**

```ts
import type { CardDto, PrintingDto } from '@codex/shared';
import { IMAGE_BASE } from '@codex/shared';

export interface CardGridItemViewModel {
  hasPromo: boolean;
  displayPrinting: PrintingDto;
  imageUrl: string;
}

export const buildCardGridItemViewModel = (
  card: CardDto,
  defaultPrinting: PrintingDto,
  showPromoLocal: boolean,
): CardGridItemViewModel => {
  const hasPromo = card.printings.some((p) => p.set === 'Promos');
  const displayPrinting =
    hasPromo && showPromoLocal
      ? (card.printings.find((p) => p.set === 'Promos') ?? defaultPrinting)
      : defaultPrinting;

  return { hasPromo, displayPrinting, imageUrl: `${IMAGE_BASE}${displayPrinting.image}.webp` };
};
```

- [ ] **Create `apps/web/src/components/card/CardGridItem.tsx`:**

```tsx
import { useState } from 'react';
import type { CardDto, PrintingDto } from '@codex/shared';
import { CardBack } from './CardBack';
import { buildCardGridItemViewModel } from './card-grid-item.view-model';

interface CardGridItemProps {
  card: CardDto;
  printing: PrintingDto;
  quantity: number;
  isAuthenticated: boolean;
  onIncrement: () => void;
  onDecrement: () => void;
  onClick: () => void;
}

export const CardGridItem = ({
  card,
  printing,
  quantity,
  isAuthenticated,
  onIncrement,
  onDecrement,
  onClick,
}: CardGridItemProps) => {
  const [imgError, setImgError] = useState(false);
  const [showPromoLocal, setShowPromoLocal] = useState(false);
  const vm = buildCardGridItemViewModel(card, printing, showPromoLocal);

  return (
    <div
      className="relative group cursor-pointer aspect-[5/7]"
      title={vm.displayPrinting.identifier}
    >
      {imgError ? (
        <CardBack className="w-full h-full" />
      ) : (
        <img
          src={vm.imageUrl}
          alt={card.name}
          loading="lazy"
          onError={() => setImgError(true)}
          onClick={onClick}
          className="w-full h-full rounded-lg object-cover"
        />
      )}

      <div className="absolute inset-0 rounded-lg bg-black/0 group-hover:bg-black/40 transition-colors flex flex-col items-center justify-end p-2 opacity-0 group-hover:opacity-100">
        <span className="text-white text-xs font-mono bg-black/60 rounded px-1 mb-1">
          {vm.displayPrinting.identifier}
        </span>
        {vm.hasPromo && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowPromoLocal((v) => !v);
            }}
            className="text-white text-xs bg-purple-600 rounded px-1 mb-1"
          >
            {showPromoLocal ? 'Regular' : 'Promo'}
          </button>
        )}
        <div className="flex items-center gap-2 bg-black/60 rounded px-2 py-1">
          <button
            disabled={quantity === 0}
            onClick={(e) => {
              e.stopPropagation();
              onDecrement();
            }}
            className="text-white disabled:opacity-40 w-5 h-5 flex items-center justify-center"
          >
            −
          </button>
          <span className="text-white text-sm w-4 text-center">{quantity}</span>
          <button
            onClick={(e) => {
              e.stopPropagation();
              if (isAuthenticated) onIncrement();
            }}
            className="text-white w-5 h-5 flex items-center justify-center"
          >
            +
          </button>
        </div>
      </div>
    </div>
  );
};
```

- [ ] **Create `apps/web/src/components/card/card-grid.view-model.ts`:**

```ts
import type { GridSlot } from '../../store/card-catalog/card-catalog.selectors';

export type GridRow = { type: 'card-row'; slots: GridSlot[] } | { type: 'page-break' };

export const buildCardGridRows = (slots: GridSlot[]): GridRow[] => {
  const rows: GridRow[] = [];
  let current: GridSlot[] = [];

  for (const slot of slots) {
    if (slot.type === 'page-break') {
      if (current.length > 0) {
        rows.push({ type: 'card-row', slots: current });
        current = [];
      }
      rows.push({ type: 'page-break' });
      continue;
    }
    current.push(slot);
    if (current.length < 3) continue;
    rows.push({ type: 'card-row', slots: current });
    current = [];
  }

  if (current.length > 0) rows.push({ type: 'card-row', slots: current });
  return rows;
};
```

- [ ] **Create `apps/web/src/components/card/CardGrid.tsx`:**

```tsx
import { useRef } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';
import type { CardDto, PrintingDto } from '@codex/shared';
import type { GridSlot } from '../../store/card-catalog/card-catalog.selectors';
import { buildCardGridRows } from './card-grid.view-model';
import { CardGridItem } from './CardGridItem';
import { CardBack } from './CardBack';

interface CardGridProps {
  slots: GridSlot[];
  isAuthenticated: boolean;
  onCardClick: (card: CardDto, printing: PrintingDto) => void;
  onIncrement: (card: CardDto, printing: PrintingDto) => void;
  onDecrement: (card: CardDto, printing: PrintingDto) => void;
  getQuantity: (card: CardDto, printing: PrintingDto) => number;
}

const CARD_ROW_HEIGHT = 220;
const PAGE_BREAK_HEIGHT = 40;

export const CardGrid = ({
  slots,
  isAuthenticated,
  onCardClick,
  onIncrement,
  onDecrement,
  getQuantity,
}: CardGridProps) => {
  const parentRef = useRef<HTMLDivElement>(null);
  const rows = buildCardGridRows(slots);

  const rowVirtualizer = useVirtualizer({
    count: rows.length,
    getScrollElement: () => parentRef.current,
    estimateSize: (i) => (rows[i].type === 'page-break' ? PAGE_BREAK_HEIGHT : CARD_ROW_HEIGHT),
    overscan: 5,
  });

  return (
    <div ref={parentRef} className="h-full overflow-auto">
      <div style={{ height: rowVirtualizer.getTotalSize(), position: 'relative' }}>
        {rowVirtualizer.getVirtualItems().map((virtualRow) => {
          const row = rows[virtualRow.index];
          return (
            <div
              key={virtualRow.index}
              style={{ position: 'absolute', top: virtualRow.start, left: 0, right: 0 }}
            >
              {row.type === 'page-break' ? (
                <div style={{ height: PAGE_BREAK_HEIGHT }} />
              ) : (
                <div className="grid grid-cols-3 gap-2 px-2">
                  {row.slots.map((slot, i) =>
                    slot.type === 'card' ? (
                      <CardGridItem
                        key={slot.card.cardIdentifier + slot.printing.print}
                        card={slot.card}
                        printing={slot.printing}
                        quantity={getQuantity(slot.card, slot.printing)}
                        isAuthenticated={isAuthenticated}
                        onClick={() => onCardClick(slot.card, slot.printing)}
                        onIncrement={() => onIncrement(slot.card, slot.printing)}
                        onDecrement={() => onDecrement(slot.card, slot.printing)}
                      />
                    ) : (
                      <CardBack key={i} />
                    ),
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
```

---

### Task 15: Filter Components

**Files:**

- Create: `apps/web/src/components/filters/SearchInput.tsx`
- Create: `apps/web/src/components/filters/RarityFilter.tsx`
- Create: `apps/web/src/components/filters/OrderingControls.tsx`
- Create: `apps/web/src/components/filters/FilterPanel.tsx`

- [ ] **Create `apps/web/src/components/filters/SearchInput.tsx`:**

```tsx
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch } from '../../store';
import { setSearchQuery } from '../../store/filters/filters.slice';
import { searchCards } from '../../store/card-catalog/card-catalog.thunks';
import { selectSearchQuery } from '../../store/filters/filters.selectors';
import { useDebounced } from '../../hooks/useDebounced';

export const SearchInput = () => {
  const dispatch = useDispatch<AppDispatch>();
  const storeQuery = useSelector(selectSearchQuery);
  const [value, setValue] = useState(storeQuery);

  useDebounced(
    () => {
      dispatch(setSearchQuery(value));
      dispatch(searchCards(value));
    },
    300,
    [value],
  );

  return (
    <input
      type="search"
      value={value}
      onChange={(e) => setValue(e.target.value)}
      placeholder="Search cards…"
      className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
    />
  );
};
```

- [ ] **Create `apps/web/src/components/filters/RarityFilter.tsx`:**

```tsx
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch } from '../../store';
import { setRarity } from '../../store/filters/filters.slice';
import { selectFilters } from '../../store/filters/filters.selectors';
import { RARITY_ORDER } from '@codex/shared';

export const RarityFilter = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { rarity } = useSelector(selectFilters);

  return (
    <div className="space-y-1">
      <label className="text-xs font-medium text-muted-foreground">Rarity</label>
      <div className="flex gap-1">
        {(['none', 'exact', 'above', 'below'] as const).map((mode) => (
          <button
            key={mode}
            onClick={() => dispatch(setRarity({ ...rarity, mode }))}
            className={`text-xs px-2 py-1 rounded border ${rarity.mode === mode ? 'bg-primary text-primary-foreground' : 'bg-background'}`}
          >
            {mode === 'none' ? 'Any' : mode.charAt(0).toUpperCase() + mode.slice(1)}
          </button>
        ))}
      </div>
      {rarity.mode !== 'none' && (
        <select
          value={rarity.value}
          onChange={(e) => dispatch(setRarity({ ...rarity, value: e.target.value }))}
          className="w-full rounded border bg-background px-2 py-1 text-sm"
        >
          <option value="">Select rarity…</option>
          {RARITY_ORDER.map((r) => (
            <option key={r} value={r}>
              {r}
            </option>
          ))}
        </select>
      )}
    </div>
  );
};
```

- [ ] **Create `apps/web/src/components/filters/OrderingControls.tsx`:**

```tsx
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch } from '../../store';
import { setOrdering } from '../../store/filters/filters.slice';
import { selectOrdering } from '../../store/filters/filters.selectors';

export const OrderingControls = () => {
  const dispatch = useDispatch<AppDispatch>();
  const ordering = useSelector(selectOrdering);

  return (
    <div className="flex items-center gap-2">
      <label className="text-xs font-medium text-muted-foreground">Order</label>
      <button
        onClick={() =>
          dispatch(
            setOrdering({ ...ordering, direction: ordering.direction === 'asc' ? 'desc' : 'asc' }),
          )
        }
        className="text-xs px-2 py-1 rounded border bg-background"
      >
        {ordering.direction === 'asc' ? 'Oldest first' : 'Newest first'}
      </button>
      <button
        onClick={() =>
          dispatch(setOrdering({ ...ordering, incompleteRowsFirst: !ordering.incompleteRowsFirst }))
        }
        className={`text-xs px-2 py-1 rounded border ${ordering.incompleteRowsFirst ? 'bg-primary text-primary-foreground' : 'bg-background'}`}
      >
        Incomplete first
      </button>
    </div>
  );
};
```

- [ ] **Create `apps/web/src/components/filters/FilterPanel.tsx`:**

```tsx
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch } from '../../store';
import {
  setClasses,
  setTalents,
  setTypes,
  setKeywords,
  setFoiling,
  setSets,
  setDualClassOnly,
  setShowPromo,
  setBinderView,
  resetFilters,
} from '../../store/filters/filters.slice';
import { selectFilters } from '../../store/filters/filters.selectors';
import { CARD_CLASSES, CARD_TALENTS, CARD_TYPES, CARD_KEYWORDS, MAIN_SETS } from '@codex/shared';
import type { FilterMode } from '../../store/filters/filters.slice';
import { SearchInput } from './SearchInput';
import { RarityFilter } from './RarityFilter';
import { OrderingControls } from './OrderingControls';

const MultiSelect = ({
  label,
  options,
  selected,
  mode,
  onChange,
}: {
  label: string;
  options: readonly string[];
  selected: string[];
  mode: FilterMode;
  onChange: (values: string[], mode: FilterMode) => void;
}) => (
  <div className="space-y-1">
    <div className="flex items-center justify-between">
      <label className="text-xs font-medium text-muted-foreground">{label}</label>
      <button
        onClick={() => onChange(selected, mode === 'include' ? 'exclude' : 'include')}
        className={`text-xs px-1 rounded ${mode === 'exclude' ? 'text-red-500' : 'text-green-600'}`}
      >
        {mode === 'include' ? 'Include' : 'Exclude'}
      </button>
    </div>
    <div className="flex flex-wrap gap-1">
      {options.map((opt) => (
        <button
          key={opt}
          onClick={() => {
            const next = selected.includes(opt)
              ? selected.filter((v) => v !== opt)
              : [...selected, opt];
            onChange(next, mode);
          }}
          className={`text-xs px-2 py-0.5 rounded border ${selected.includes(opt) ? 'bg-primary text-primary-foreground' : 'bg-background'}`}
        >
          {opt}
        </button>
      ))}
    </div>
  </div>
);

export const FilterPanel = () => {
  const dispatch = useDispatch<AppDispatch>();
  const f = useSelector(selectFilters);

  return (
    <div className="p-4 space-y-4 overflow-y-auto">
      <div className="flex items-center justify-between">
        <h2 className="font-semibold text-sm">Filters</h2>
        <button
          onClick={() => dispatch(resetFilters())}
          className="text-xs text-muted-foreground underline"
        >
          Reset all
        </button>
      </div>

      <SearchInput />

      <MultiSelect
        label="Class"
        options={Object.values(CARD_CLASSES)}
        selected={f.classes}
        mode={f.classesMode}
        onChange={(values, mode) => dispatch(setClasses({ values, mode }))}
      />
      <MultiSelect
        label="Talent"
        options={Object.values(CARD_TALENTS)}
        selected={f.talents}
        mode={f.talentsMode}
        onChange={(values, mode) => dispatch(setTalents({ values, mode }))}
      />
      <MultiSelect
        label="Type"
        options={Object.values(CARD_TYPES)}
        selected={f.types}
        mode={f.typesMode}
        onChange={(values, mode) => dispatch(setTypes({ values, mode }))}
      />
      <MultiSelect
        label="Keywords"
        options={Object.values(CARD_KEYWORDS)}
        selected={f.keywords}
        mode={f.keywordsMode}
        onChange={(values, mode) => dispatch(setKeywords({ values, mode }))}
      />

      <div className="space-y-1">
        <label className="text-xs font-medium text-muted-foreground">Set</label>
        <div className="flex flex-wrap gap-1 max-h-32 overflow-y-auto">
          {MAIN_SETS.map((set) => (
            <button
              key={set}
              onClick={() => {
                const next = f.sets.includes(set)
                  ? f.sets.filter((s) => s !== set)
                  : [...f.sets, set];
                dispatch(setSets(next));
              }}
              className={`text-xs px-2 py-0.5 rounded border ${f.sets.includes(set) ? 'bg-primary text-primary-foreground' : 'bg-background'}`}
            >
              {set}
            </button>
          ))}
        </div>
      </div>

      <RarityFilter />

      <div className="space-y-1">
        <label className="text-xs font-medium text-muted-foreground">Foiling</label>
        <select
          value={f.foiling}
          onChange={(e) => dispatch(setFoiling(e.target.value))}
          className="w-full rounded border bg-background px-2 py-1 text-sm"
        >
          <option value="all">All</option>
          <option value="above-regular">Above Regular (Rainbow/Cold/Gold)</option>
          <option value="Rainbow">Rainbow Foil</option>
          <option value="Cold">Cold Foil</option>
          <option value="Gold">Gold Foil</option>
        </select>
      </div>

      <div className="space-y-1">
        <label className="text-xs font-medium text-muted-foreground">Options</label>
        <div className="space-y-1">
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={f.dualClassOnly}
              onChange={(e) => dispatch(setDualClassOnly(e.target.checked))}
            />
            Dual class only
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={f.showPromo}
              onChange={(e) => dispatch(setShowPromo(e.target.checked))}
            />
            Show promo art
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={f.binderView}
              onChange={(e) => dispatch(setBinderView(e.target.checked))}
            />
            Binder view
          </label>
        </div>
      </div>

      <OrderingControls />
    </div>
  );
};
```

---

### Task 16: Card Detail

**Files:**

- Create: `apps/web/src/components/card/CardDetail.tsx`

- [ ] **Create `apps/web/src/components/card/CardDetail.tsx`:**

```tsx
import { useState } from 'react';
import type { CardDto, PrintingDto } from '@codex/shared';
import { IMAGE_BASE } from '@codex/shared';

interface CardDetailProps {
  card: CardDto;
  initialPrinting: PrintingDto;
  onBack: () => void;
}

export const CardDetail = ({ card, initialPrinting, onBack }: CardDetailProps) => {
  const [activePrinting, setActivePrinting] = useState<PrintingDto>(initialPrinting);

  return (
    <div className="max-w-4xl mx-auto p-6">
      <button onClick={onBack} className="mb-4 text-sm text-muted-foreground hover:text-foreground">
        ← Back to listing
      </button>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <img
            src={`${IMAGE_BASE}${activePrinting.image}.webp`}
            alt={card.name}
            className="w-full rounded-xl shadow-lg"
          />
          <div className="mt-4 space-y-2">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              Printings
            </p>
            <div className="flex flex-wrap gap-2">
              {card.printings.map((p) => (
                <button
                  key={p.print}
                  onClick={() => setActivePrinting(p)}
                  className={`text-xs px-2 py-1 rounded border ${p.print === activePrinting.print ? 'bg-primary text-primary-foreground' : 'bg-background'}`}
                >
                  {p.set}
                  {p.edition ? ` (${p.edition})` : ''}
                  {p.foiling ? ` — ${p.foiling}` : ''}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <h1 className="text-2xl font-bold">{card.name}</h1>
            <p className="text-sm text-muted-foreground">{card.typeText}</p>
          </div>
          <dl className="space-y-2 text-sm">
            {card.classes.length > 0 && (
              <div>
                <dt className="font-medium">Class</dt>
                <dd>{card.classes.join(', ')}</dd>
              </div>
            )}
            {card.talents.length > 0 && (
              <div>
                <dt className="font-medium">Talent</dt>
                <dd>{card.talents.join(', ')}</dd>
              </div>
            )}
            {card.types.length > 0 && (
              <div>
                <dt className="font-medium">Type</dt>
                <dd>{card.types.join(', ')}</dd>
              </div>
            )}
            <div>
              <dt className="font-medium">Rarity</dt>
              <dd>{card.rarity}</dd>
            </div>
            {card.pitch !== undefined && (
              <div>
                <dt className="font-medium">Pitch</dt>
                <dd>
                  {card.pitch === 1 ? 'Red (1)' : card.pitch === 2 ? 'Yellow (2)' : 'Blue (3)'}
                </dd>
              </div>
            )}
            {card.cost !== undefined && (
              <div>
                <dt className="font-medium">Cost</dt>
                <dd>{card.cost}</dd>
              </div>
            )}
            {card.defense !== undefined && (
              <div>
                <dt className="font-medium">Defense</dt>
                <dd>{card.defense}</dd>
              </div>
            )}
            {card.keywords.length > 0 && (
              <div>
                <dt className="font-medium">Keywords</dt>
                <dd>{card.keywords.join(', ')}</dd>
              </div>
            )}
            {card.functionalText && (
              <div>
                <dt className="font-medium">Text</dt>
                <dd className="whitespace-pre-line text-muted-foreground">{card.functionalText}</dd>
              </div>
            )}
            <div>
              <dt className="font-medium">Identifier</dt>
              <dd className="font-mono text-xs">{activePrinting.identifier}</dd>
            </div>
            <div>
              <dt className="font-medium">Set</dt>
              <dd>{activePrinting.set}</dd>
            </div>
          </dl>
        </div>
      </div>
    </div>
  );
};
```

---

### Task 17: Views + Routing

**Files:**

- Create: `apps/web/src/views/CardListingView.tsx`
- Create: `apps/web/src/views/CardDetailView.tsx`
- Create/Modify: `apps/web/src/App.tsx`

- [ ] **Create `apps/web/src/views/CardListingView.tsx`:**

```tsx
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router';
import type { AppDispatch, RootState } from '../store';
import type { CardDto, PrintingDto } from '@codex/shared';
import { fetchAllCards } from '../store/card-catalog/card-catalog.thunks';
import { selectGroupedGridSlots } from '../store/card-catalog/card-catalog.selectors';
import { FilterPanel } from '../components/filters/FilterPanel';
import { CardGrid } from '../components/card/CardGrid';

export const CardListingView = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const slots = useSelector(selectGroupedGridSlots);
  const status = useSelector((s: RootState) => s.cardCatalog.status);

  useEffect(() => {
    if (status === 'idle') void dispatch(fetchAllCards());
  }, [dispatch, status]);

  const handleCardClick = (card: CardDto, printing: PrintingDto) => {
    void navigate(`/cards/${card.cardIdentifier}`, { state: { printing: printing.print } });
  };

  return (
    <div className="flex h-screen overflow-hidden">
      <aside className="w-72 shrink-0 border-r overflow-y-auto">
        <FilterPanel />
      </aside>
      <main className="flex-1 overflow-hidden">
        {status === 'loading' && (
          <div className="flex h-full items-center justify-center">
            <p className="text-muted-foreground">Loading cards…</p>
          </div>
        )}
        {status === 'failed' && (
          <div className="flex h-full items-center justify-center">
            <p className="text-destructive">Failed to load cards. Is the API running?</p>
          </div>
        )}
        {status === 'succeeded' && (
          <CardGrid
            slots={slots}
            isAuthenticated={false}
            onCardClick={handleCardClick}
            onIncrement={() => {
              /* Plan 3 */
            }}
            onDecrement={() => {
              /* Plan 3 */
            }}
            getQuantity={() => 0}
          />
        )}
      </main>
    </div>
  );
};
```

- [ ] **Create `apps/web/src/views/CardDetailView.tsx`:**

```tsx
import { useNavigate, useParams, useLocation } from 'react-router';
import { useSelector } from 'react-redux';
import type { RootState } from '../store';
import type { CardDto, PrintingDto } from '@codex/shared';
import { CardDetail } from '../components/card/CardDetail';

export const CardDetailView = () => {
  const { cardIdentifier } = useParams<{ cardIdentifier: string }>();
  const location = useLocation();
  const navigate = useNavigate();

  const card = useSelector((state: RootState) =>
    state.cardCatalog.allCards.find((c: CardDto) => c.cardIdentifier === cardIdentifier),
  );

  if (!card) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p className="text-muted-foreground">Card not found.</p>
      </div>
    );
  }

  const printingCode = (location.state as { printing?: string } | null)?.printing;
  const printing: PrintingDto =
    card.printings.find((p) => p.print === printingCode) ?? card.printings[0];

  return <CardDetail card={card} initialPrinting={printing} onBack={() => void navigate(-1)} />;
};
```

- [ ] **Update `apps/web/src/App.tsx`:**

```tsx
import { BrowserRouter, Routes, Route } from 'react-router';
import { CardListingView } from './views/CardListingView';
import { CardDetailView } from './views/CardDetailView';

export const App = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<CardListingView />} />
      <Route path="/cards/:cardIdentifier" element={<CardDetailView />} />
    </Routes>
  </BrowserRouter>
);
```

- [ ] **Full build:**

```bash
pnpm build
```

Expected: all packages build without TypeScript errors.

- [ ] **Start both servers and verify in browser:**

```bash
pnpm --filter @codex/api dev   # terminal 1
pnpm --filter @codex/web dev   # terminal 2
```

Open `http://localhost:3000` and verify:

- Cards load in the 3-column binder grid
- Filter panel: search debounces, class/talent/type toggles filter the grid, "Reset all" clears every filter
- Binder view checkbox toggles page-break separators
- Clicking a card navigates to `/cards/{identifier}` with full card detail
- Printing switcher in detail view works; back button returns to the listing
