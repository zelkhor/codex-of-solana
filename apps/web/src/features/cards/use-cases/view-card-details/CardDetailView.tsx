import { CardDetail } from './CardDetail.tsx';
import { useCardDetailViewViewModel } from './card-detail-view.view-model.ts';

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
