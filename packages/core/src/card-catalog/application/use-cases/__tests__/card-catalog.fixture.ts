import type { Result } from '../../../../shared/helpers/result';
import type { Card } from '../../../domain/card';
import type { CardCatalogLoadError } from '../../../domain/card-catalog.errors';
import { InMemoryCardCatalogRepository } from '../../../infrastructure/card-catalog.inmemory.repository';
import { GetAllCardsUseCase } from '../get-all-cards.usecase';

export const createCardCatalogFixture = () => {
  const repository = new InMemoryCardCatalogRepository();
  const useCase = new GetAllCardsUseCase(repository);
  let result: Result<Card[], CardCatalogLoadError> | null = null;

  return {
    givenExistingCards(cards: Card[]) {
      repository.withCards(cards);
    },
    async whenGettingAllCards() {
      result = await useCase.execute();
    },
    thenCardsShouldBe(expected: Card[]) {
      if (!result?.ok)
        throw new Error('thenCardsShouldBe: Expected successful result but got an error');
      expect(result.value).toEqual(expected);
    },
  };
};
