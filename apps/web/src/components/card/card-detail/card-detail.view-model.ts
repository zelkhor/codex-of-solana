import { useState } from 'react';
import { useSelector } from 'react-redux';
import type { CardDto, PrintingDto } from '@codex/shared';
import { IMAGE_BASE } from '@codex/shared';
import { selectImageIndex } from '@/store/card-catalog/card-catalog.selectors';
import type { TiltEffect } from '@/components/card/TiltCard';
import { foilingToEffect } from '@/components/card/card.helpers';

export interface CardDetailViewModel {
  activePrinting: PrintingDto;
  setActivePrinting: (printing: PrintingDto) => void;
  backPrinting: PrintingDto | undefined;
  isFlipped: boolean;
  flip: () => void;
  tiltEffect: TiltEffect;
  imageUrl: string;
}

export const useCardDetailViewModel = (
  card: CardDto,
  initialPrinting: PrintingDto,
): CardDetailViewModel => {
  const imageIndex = useSelector(selectImageIndex);
  const [activePrinting, setActivePrinting] = useState<PrintingDto>(initialPrinting);

  const backPrinting = activePrinting.oppositeImage
    ? imageIndex.get(activePrinting.oppositeImage)
    : card.printings.find(
        (p) =>
          p.identifier === activePrinting.identifier &&
          p.print.includes('-Back') &&
          p.foiling === activePrinting.foiling,
      );

  const isFlipped = backPrinting !== undefined && activePrinting.print === backPrinting.print;

  return {
    activePrinting,
    setActivePrinting,
    backPrinting,
    isFlipped,
    flip: () => setActivePrinting(isFlipped ? initialPrinting : backPrinting!),
    tiltEffect: foilingToEffect(activePrinting.foiling),
    imageUrl: `${IMAGE_BASE}${activePrinting.image}.webp`,
  };
};
