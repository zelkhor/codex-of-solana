import { useEffect, type RefObject } from 'react';
import { X } from 'lucide-react';
import type { CardDto, PrintingDto } from '@codex/shared';
import { CardDetail } from '@/components/card/card-detail/CardDetail';

interface CardDetailModalProps {
  card: CardDto;
  printing: PrintingDto;
  onClose: () => void;
  cardImageContainerRef?: RefObject<HTMLDivElement | null>;
  cardImageVisible?: boolean;
}

export const CardDetailModal = ({
  card,
  printing,
  onClose,
  cardImageContainerRef,
  cardImageVisible,
}: CardDetailModalProps) => {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [onClose]);

  return (
    <>
      <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="fixed inset-4 z-[101] sm:inset-auto sm:top-1/2 sm:left-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 sm:w-full sm:max-w-4xl bg-card rounded-2xl shadow-2xl overflow-y-auto sm:overflow-visible">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
          aria-label="Close"
        >
          <X size={20} />
        </button>
        <CardDetail
          card={card}
          initialPrinting={printing}
          cardImageContainerRef={cardImageContainerRef}
          cardImageVisible={cardImageVisible}
        />
      </div>
    </>
  );
};
