import { useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';

import { SlidersHorizontal, X } from 'lucide-react';

import type { Card, Printing } from '@codex/core';

import { useKeydown } from '@/shared/hooks/useKeydown.ts';
import { AppHeader } from '@/shared/layout/AppHeader.tsx';
import type { AppDispatch } from '@/shared/store';
import { ASYNC_STATUS } from '@/shared/types/async-status.ts';

import { getCards } from '@/domain/card-catalog/application/get-cards.thunk.ts';

import { useCardListingViewModel } from '@/features/cards/pages/card-listing.view-model.ts';
import { CardFlipAnimation } from '@/features/cards/ui/CardFlipAnimation.tsx';
import { FilterDrawer } from '@/features/cards/use-cases/filter-cards/FilterDrawer.tsx';
import { CardGrid } from '@/features/cards/use-cases/list-cards/CardGrid.tsx';
import { CardGridSkeleton } from '@/features/cards/use-cases/list-cards/CardGridSkeleton.tsx';
import { NoFilterResults } from '@/features/cards/use-cases/list-cards/NoFilterResults.tsx';
import { CardDetailModal } from '@/features/cards/use-cases/view-card-details/CardDetailModal.tsx';

export const CardListingView = () => {
  const dispatch = useDispatch<AppDispatch>();
  const vm = useCardListingViewModel();
  const [filterOpen, setFilterOpen] = useState(() => window.innerWidth >= 640);
  const [animating, setAnimating] = useState(false);
  const cardImageContainerRef = useRef<HTMLDivElement>(null);
  const filterButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (vm.status === ASYNC_STATUS.IDLE) void dispatch(getCards());
  }, [dispatch, vm.status]);

  useKeydown('k', (e) => {
    if (e.metaKey || e.ctrlKey) {
      e.preventDefault();
      setFilterOpen((v) => !v);
    }
  });

  const handleCardClick = (card: Card, printing: Printing, rect: DOMRect) => {
    vm.openCard(card, printing, rect);
    setAnimating(true);
  };

  const handleClose = () => {
    vm.closeCard();
    setAnimating(false);
  };

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <AppHeader />
      <div className="flex-1 overflow-hidden relative">
        <main className="relative h-full bg-[#f3f1f3] dark:bg-[#1d161e] overflow-hidden">
          {vm.status === ASYNC_STATUS.LOADING && <CardGridSkeleton />}
          {vm.status === ASYNC_STATUS.FAILED && (
            <div className="flex h-full items-center justify-center">
              <p className="text-destructive">Failed to load cards. Please try again</p>
            </div>
          )}
          {vm.status === ASYNC_STATUS.SUCCEEDED && vm.visibleCards.length === 0 && (
            <NoFilterResults />
          )}
          {vm.status === ASYNC_STATUS.SUCCEEDED && vm.visibleCards.length > 0 && (
            <CardGrid cardPrintings={vm.visibleCards} onCardClick={handleCardClick} />
          )}

          {/* Floating filter button */}
          <div className="absolute bottom-10 right-1/2 translate-x-1/2 md:right-20 z-10 flex flex-col items-center gap-2">
            {vm.status === ASYNC_STATUS.SUCCEEDED && (
              <span className="text-xs text-muted-foreground bg-background/80 backdrop-blur-sm px-2.5 py-1 rounded-full shadow-sm">
                {vm.cardCount.toLocaleString()} cards
              </span>
            )}
            <button
              ref={filterButtonRef}
              onClick={() => setFilterOpen((v) => !v)}
              title="Filters (⌘K)"
              className="relative flex items-center justify-center w-12 h-12 rounded-full bg-white dark:bg-zinc-800 shadow-lg border border-black/8 dark:border-white/10 hover:bg-neutral-50 dark:hover:bg-zinc-700 transition-colors cursor-pointer"
            >
              <span
                className={`absolute transition-all duration-200 ${filterOpen ? 'opacity-0 rotate-90 scale-50' : 'opacity-100 rotate-0 scale-100'}`}
              >
                <SlidersHorizontal size={18} />
              </span>
              <span
                className={`absolute transition-all duration-200 ${filterOpen ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 -rotate-90 scale-50'}`}
              >
                <X size={18} />
              </span>
            </button>
          </div>
        </main>

        <FilterDrawer
          isOpen={filterOpen}
          onClose={() => setFilterOpen(false)}
          triggerRef={filterButtonRef}
        />
      </div>

      {vm.activeCard && (
        <CardDetailModal
          key={`${vm.activeCard.card.cardIdentifier}-${vm.activeCard.printing.print}`}
          card={vm.activeCard.card}
          printing={vm.activeCard.printing}
          onClose={handleClose}
          cardImageContainerRef={cardImageContainerRef}
          cardImageVisible={!animating}
          onPrev={vm.canNavigatePrev ? vm.navigatePrev : undefined}
          onNext={vm.canNavigateNext ? vm.navigateNext : undefined}
          hasNavigation={vm.hasNavigation}
        />
      )}

      {vm.activeCard && animating && (
        <CardFlipAnimation
          imageUrl={vm.activeCard.imageUrl}
          sourceRect={vm.activeCard.sourceRect}
          targetRef={cardImageContainerRef}
          onComplete={() => setAnimating(false)}
        />
      )}
    </div>
  );
};
