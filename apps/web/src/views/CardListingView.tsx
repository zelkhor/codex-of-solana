import { useEffect, useRef, useState } from 'react';
import { useKeydown } from '@/hooks/useKeydown';
import { useDispatch, useSelector } from 'react-redux';
import { SlidersHorizontal, X } from 'lucide-react';
import type { AppDispatch, RootState } from '@/store';
import { fetchAllCards } from '@/store/card-catalog/card-catalog.thunks';
import { selectVisibleCards } from '@/store/card-catalog/card-catalog.selectors';
import { ASYNC_STATUS } from '@/store/async-status';
import { CardGrid } from '@/components/card/card-grid/CardGrid';
import { CardGridSkeleton } from '@/components/card/CardGridSkeleton';
import { NoFilterResults } from '@/components/card/NoFilterResults';
import { CardFlipAnimation } from '@/components/card/CardFlipAnimation';
import { AppHeader } from '@/components/layout/AppHeader';
import { FilterDrawer } from '@/components/layout/FilterDrawer';
import { CardDetailModal } from '@/components/card/card-detail/CardDetailModal.tsx';
import type { Card, Printing } from '@codex/core';

interface ActiveCard {
  card: Card;
  printing: Printing;
  imageUrl: string;
  sourceRect: DOMRect;
}

export const CardListingView = () => {
  const dispatch = useDispatch<AppDispatch>();
  const visibleCards = useSelector(selectVisibleCards);
  const status = useSelector((s: RootState) => s.cardCatalog.status);
  const [filterOpen, setFilterOpen] = useState(() => window.innerWidth >= 640);
  const [activeCard, setActiveCard] = useState<ActiveCard | null>(null);
  const [animating, setAnimating] = useState(false);
  const cardImageContainerRef = useRef<HTMLDivElement>(null);
  const filterButtonRef = useRef<HTMLButtonElement>(null);
  const cardCount = visibleCards.length;

  useEffect(() => {
    if (status === ASYNC_STATUS.Idle) void dispatch(fetchAllCards());
  }, [dispatch, status]);

  useKeydown('k', (e) => {
    if (e.metaKey || e.ctrlKey) {
      e.preventDefault();
      setFilterOpen((v) => !v);
    }
  });

  const handleCardClick = (card: Card, printing: Printing, rect: DOMRect) => {
    setActiveCard({
      card,
      printing,
      imageUrl: printing.image,
      sourceRect: rect,
    });
    setAnimating(true);
  };

  const handleClose = () => {
    setActiveCard(null);
    setAnimating(false);
  };

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <AppHeader />
      <div className="flex-1 overflow-hidden ">
        <main className="relative h-full bg-[#f3f1f3] dark:bg-[#1d161e] overflow-hidden">
          {status === ASYNC_STATUS.Loading && <CardGridSkeleton />}
          {status === ASYNC_STATUS.Failed && (
            <div className="flex h-full items-center justify-center">
              <p className="text-destructive">Failed to load cards. Please try again</p>
            </div>
          )}
          {status === ASYNC_STATUS.Succeeded && visibleCards.length === 0 && <NoFilterResults />}
          {status === ASYNC_STATUS.Succeeded && visibleCards.length > 0 && (
            <CardGrid cards={visibleCards} onCardClick={handleCardClick} />
          )}

          {/* Floating filter button */}
          <div className="absolute bottom-10 right-1/2 translate-x-1/2 md:right-20 z-10 flex flex-col items-center gap-2">
            {status === ASYNC_STATUS.Succeeded && (
              <span className="text-xs text-muted-foreground bg-background/80 backdrop-blur-sm px-2.5 py-1 rounded-full shadow-sm">
                {cardCount.toLocaleString()} cards
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
      </div>

      <FilterDrawer
        isOpen={filterOpen}
        onClose={() => setFilterOpen(false)}
        triggerRef={filterButtonRef}
      />

      {activeCard && (
        <CardDetailModal
          card={activeCard.card}
          printing={activeCard.printing}
          onClose={handleClose}
          cardImageContainerRef={cardImageContainerRef}
          cardImageVisible={!animating}
        />
      )}

      {activeCard && animating && (
        <CardFlipAnimation
          imageUrl={activeCard.imageUrl}
          sourceRect={activeCard.sourceRect}
          targetRef={cardImageContainerRef}
          onComplete={() => setAnimating(false)}
        />
      )}
    </div>
  );
};
