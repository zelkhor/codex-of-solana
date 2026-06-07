import { NumericFilterInput } from '@/shared/ui/NumericFilterInput.tsx';

import { useAttackFilterViewModel } from './attack-filter.view-model.ts';

export const AttackFilter = () => {
  const vm = useAttackFilterViewModel();

  return <NumericFilterInput value={vm.attack} onChange={vm.setAttackFilter} />;
};
