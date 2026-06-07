import { NumericFilterInput } from '@/shared/ui/NumericFilterInput.tsx';

import { useCostFilterViewModel } from './cost-filter.view-model.ts';

export const CostFilter = () => {
  const vm = useCostFilterViewModel();

  return <NumericFilterInput value={vm.cost} onChange={vm.setCostFilter} />;
};
