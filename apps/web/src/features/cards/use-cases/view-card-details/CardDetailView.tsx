import { CardDetail } from '@/features/cards/use-cases/view-card-details/CardDetail.tsx';
import { useCardDetailViewViewModel } from '@/features/cards/use-cases/view-card-details/card-detail-view.view-model.ts';

export const CardDetailView = () => {
  const vm = useCardDetailViewViewModel();

  if (!vm.card || !vm.printing) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p className="text-muted-foreground">Card not found.</p>
      </div>
    );
  }

  return <CardDetail card={vm.card} initialPrinting={vm.printing} onBack={vm.goBack} />;
};
