import { Controller, Get, Inject } from '@nestjs/common';
import { type Card, GetAllCardsUseCase } from '@codex/core';

@Controller('cards')
export class CardsController {
  constructor(
    @Inject(GetAllCardsUseCase)
    private readonly getAllCards: GetAllCardsUseCase,
  ) {}

  @Get()
  async getAll(): Promise<Card[]> {
    const result = await this.getAllCards.execute();
    if (!result.ok) throw result.error;
    return result.value;
  }
}
