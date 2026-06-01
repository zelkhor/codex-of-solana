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
