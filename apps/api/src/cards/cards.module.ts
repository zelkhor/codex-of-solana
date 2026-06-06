import { Module } from '@nestjs/common';

import { CardCatalogFabRepository, GetAllCardsUseCase } from '@codex/core';

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
