import { useCardDetailsPageViewModel } from '@/features/cards/pages/CardDetailsPage/card-details-page.view-model.ts';
import { CardDetails } from '@/features/cards/use-cases/view-card-details/CardDetails/CardDetails.tsx';

export const CardDetailsPage = () => {
  const vm = useCardDetailsPageViewModel();

  if (!vm.card || !vm.printing) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p className="text-muted-foreground">Card not found.</p>
      </div>
    );
  }

  return <CardDetails card={vm.card} initialPrinting={vm.printing} onBack={vm.goBack} />;
};
