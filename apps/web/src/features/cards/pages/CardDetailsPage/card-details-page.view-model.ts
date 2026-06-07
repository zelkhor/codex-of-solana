import { useSelector } from 'react-redux';
import { useLocation, useNavigate, useParams } from 'react-router';

import type { Card, Printing } from '@codex/core';

import { selectCardById } from '@/domain/card-catalog/domain/select-card-by-id.selector.ts';
import { selectPrintingByCardAndCode } from '@/domain/card-catalog/domain/select-printing-by-card-and-code.selector.ts';

export interface CardDetailsPageViewModel {
  card: Card | undefined;
  printing: Printing | undefined;
  goBack: () => void;
}

export const useCardDetailsPageViewModel = (): CardDetailsPageViewModel => {
  const { cardIdentifier } = useParams<{ cardIdentifier: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const printingCode = (location.state as { printing?: string } | null)?.printing;

  const card = useSelector(selectCardById(cardIdentifier ?? ''));
  const printing = useSelector(
    selectPrintingByCardAndCode(cardIdentifier ?? '', printingCode ?? ''),
  );

  return {
    card,
    printing,
    goBack: () => void navigate(-1),
  };
};
