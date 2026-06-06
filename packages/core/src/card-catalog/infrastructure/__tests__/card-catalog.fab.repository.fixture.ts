import { expectOk } from '../../../__tests__/helpers/result.helpers';
import type { Card } from '../../domain/card';
import { CardCatalogFabRepository } from '../card-catalog.fab.repository';
import { CARD_PRINTING_OVERRIDES } from '../card-catalog.overrides';

export const createFabRepositoryFixture = () => {
  const repository = new CardCatalogFabRepository();
  let cards: Card[] = [];

  return {
    async whenGettingAllCards() {
      const result = await repository.getAll();
      expectOk(result);
      cards = result.value;
    },

    thenCatalogShouldNotBeEmpty() {
      expect(cards.length).toBeGreaterThan(0);
    },

    thenCardShouldMatch(identifier: string, expected: object) {
      const card = cards.find((c) => c.cardIdentifier === identifier);
      expect(card).toMatchObject(expected);
    },

    thenPrintingOverridesShouldBePresent() {
      for (const [identifier, extraPrintings] of Object.entries(CARD_PRINTING_OVERRIDES)) {
        const card = cards.find((c) => c.cardIdentifier === identifier);
        expect(card).toBeDefined();
        for (const override of extraPrintings) {
          expect(card!.printings).toContainEqual(override);
        }
      }
    },

    thenSomeCardsHaveEmptyClasses() {
      expect(cards.some((c) => c.classes.length === 0)).toBe(true);
    },

    thenAllPrintingsShouldBeUnique() {
      for (const card of cards) {
        const prints = card.printings.map((p) => p.print);
        expect(new Set(prints).size).toBe(prints.length);
      }
    },

    thenBackPrintingShouldMatch(cardIdentifier: string, printIdentifier: string, expected: object) {
      const card = cards.find((c) => c.cardIdentifier === cardIdentifier);
      const printing = card?.printings.find((p) => p.print === printIdentifier);
      expect(printing?.backPrinting).toMatchObject(expected);
    },
  };
};

export type FabRepositoryFixture = ReturnType<typeof createFabRepositoryFixture>;
