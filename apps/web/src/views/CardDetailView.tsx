import { useNavigate, useParams, useLocation } from 'react-router';
import { useSelector } from 'react-redux';
import type { RootState } from '@/store';
import type { CardDto, PrintingDto } from '@codex/shared';
import { CardDetail } from '@/components/card/card-detail/CardDetail';

export const CardDetailView = () => {
  const { cardIdentifier } = useParams<{ cardIdentifier: string }>();
  const location = useLocation();
  const navigate = useNavigate();

  const card = useSelector((state: RootState) =>
    state.cardCatalog.allCards.find((c: CardDto) => c.cardIdentifier === cardIdentifier),
  );

  if (!card) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p className="text-muted-foreground">Card not found.</p>
      </div>
    );
  }

  const printingCode = (location.state as { printing?: string } | null)?.printing;
  const printing: PrintingDto =
    card.printings.find((p) => p.print === printingCode) ?? card.printings[0];

  return <CardDetail card={card} initialPrinting={printing} onBack={() => void navigate(-1)} />;
};
