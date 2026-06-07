import { useState } from 'react';
import { useSelector } from 'react-redux';

import type { Card, Printing } from '@codex/core';

import type { RootState } from '@/shared/store';

import { selectAllCardsMap } from '@/domain/card-catalog/domain/select-cards-map.selector.ts';

import {
  type CardWithActivePrinting,
  selectCardWithActivePrinting,
} from '@/features/cards/use-cases/list-cards/list-card.selectors.ts';

interface ActiveCard {
  card: Card;
  printing: Printing;
  imageUrl: string;
  sourceRect: DOMRect;
  index: number;
}

export interface CardListingPageViewModel {
  status: RootState['cardCatalog']['status'];
  visibleCards: CardWithActivePrinting[];
  cardCount: number;
  activeCard: ActiveCard | null;
  hasNavigation: boolean;
  canNavigatePrev: boolean;
  canNavigateNext: boolean;
  openCard: (card: Card, printing: Printing, rect: DOMRect) => void;
  closeCard: () => void;
  navigatePrev: () => void;
  navigateNext: () => void;
}

export const useCardListingPageViewModel = (): CardListingPageViewModel => {
  const visibleCards = useSelector(selectCardWithActivePrinting);
  const allCardsMap = useSelector(selectAllCardsMap);
  const status = useSelector((s: RootState) => s.cardCatalog.status);
  const [activeCard, setActiveCard] = useState<ActiveCard | null>(null);

  const navigateToIndex = (index: number) => {
    const { card, printing } = visibleCards[index];
    const fullCard = allCardsMap.get(card.cardIdentifier) ?? card;
    setActiveCard((prev) => ({
      card: fullCard,
      printing,
      imageUrl: printing.image,
      sourceRect: prev!.sourceRect,
      index,
    }));
  };

  const openCard = (card: Card, printing: Printing, rect: DOMRect) => {
    const index = visibleCards.findIndex(
      (c) => c.card.cardIdentifier === card.cardIdentifier && c.printing.print === printing.print,
    );
    const fullCard = allCardsMap.get(card.cardIdentifier) ?? card;
    setActiveCard({ card: fullCard, printing, imageUrl: printing.image, sourceRect: rect, index });
  };

  const closeCard = () => setActiveCard(null);

  const navigatePrev = () => {
    if (activeCard && activeCard.index > 0) navigateToIndex(activeCard.index - 1);
  };

  const navigateNext = () => {
    if (activeCard && activeCard.index < visibleCards.length - 1)
      navigateToIndex(activeCard.index + 1);
  };

  return {
    status,
    visibleCards,
    cardCount: visibleCards.length,
    activeCard,
    hasNavigation: visibleCards.length > 1,
    canNavigatePrev: !!activeCard && activeCard.index > 0,
    canNavigateNext: !!activeCard && activeCard.index < visibleCards.length - 1,
    openCard,
    closeCard,
    navigatePrev,
    navigateNext,
  };
};
