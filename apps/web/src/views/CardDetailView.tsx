import { useNavigate, useParams, useLocation } from 'react-router';
import { useSelector } from 'react-redux';
import { CardDetail } from '@/components/card/card-detail/CardDetail';
import {
  selectCardById,
  selectPrintingByCardAndCode,
} from '@/store/card-catalog/card-catalog.selectors';

export const CardDetailView = () => {
  const { cardIdentifier } = useParams<{ cardIdentifier: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const printingCode = (location.state as { printing?: string } | null)?.printing;

  const card = useSelector(selectCardById(cardIdentifier ?? ''));
  const printing = useSelector(
    selectPrintingByCardAndCode(cardIdentifier ?? '', printingCode ?? ''),
  );

  if (!card || !printing) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p className="text-muted-foreground">Card not found.</p>
      </div>
    );
  }

  return <CardDetail card={card} initialPrinting={printing} onBack={() => void navigate(-1)} />;
};
