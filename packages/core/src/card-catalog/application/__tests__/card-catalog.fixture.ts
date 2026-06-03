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
      if (!result?.ok)
        throw new Error('thenCardsShouldBe: Expected successful result but got an error');
      expect(result.value).toEqual(expected);
    },
  };
};
