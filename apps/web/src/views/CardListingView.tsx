import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { SlidersHorizontal } from 'lucide-react';
import type { AppDispatch, RootState } from '@/store';
import { fetchAllCards } from '@/store/card-catalog/card-catalog.thunks';
import { selectVisiblePrintings } from '@/store/card-catalog/card-catalog.selectors';
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
  const visiblePrintings = useSelector(selectVisiblePrintings);
  const status = useSelector((s: RootState) => s.cardCatalog.status);
  const [filterOpen, setFilterOpen] = useState(() => window.innerWidth >= 640);
  const [activeCard, setActiveCard] = useState<ActiveCard | null>(null);
  const [animating, setAnimating] = useState(false);
  const cardImageContainerRef = useRef<HTMLDivElement>(null);
  const printingCount = visiblePrintings.length;

  useEffect(() => {
    if (status === ASYNC_STATUS.Idle) void dispatch(fetchAllCards());
  }, [dispatch, status]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setFilterOpen((v) => !v);
      }
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, []);

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
          {status === ASYNC_STATUS.Succeeded && visiblePrintings.length === 0 && <NoFilterResults />}
          {status === ASYNC_STATUS.Succeeded && visiblePrintings.length > 0 && (
            <CardGrid slots={visiblePrintings} onCardClick={handleCardClick} />
          )}

          {/* Floating filter button */}
          <div className="absolute bottom-5 right-5 z-10 flex flex-col items-center gap-2">
            {status === ASYNC_STATUS.Succeeded && (
              <span className="text-xs text-muted-foreground bg-background/80 backdrop-blur-sm px-2.5 py-1 rounded-full shadow-sm">
                {printingCount.toLocaleString()} cards
              </span>
            )}
            <button
              onClick={() => setFilterOpen((v) => !v)}
              title="Filters (⌘K)"
              className="flex items-center justify-center w-12 h-12 rounded-full bg-white dark:bg-zinc-800 shadow-lg border border-black/8 dark:border-white/10 hover:bg-neutral-50 dark:hover:bg-zinc-700 transition-colors"
            >
              <SlidersHorizontal size={18} />
            </button>
          </div>
        </main>
      </div>

      <FilterDrawer isOpen={filterOpen} onClose={() => setFilterOpen(false)} />

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
