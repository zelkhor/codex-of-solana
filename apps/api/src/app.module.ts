import { Module } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';
import { ConfigModule } from '@nestjs/config';
import { CardsModule } from './cards/cards.module';
import { HttpError } from './common/http.error';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), CardsModule],
  providers: [{ provide: APP_FILTER, useClass: HttpError }],
})
export class AppModule {}
